import { NextResponse } from "next/server";

// ── Site preview proxy ─────────────────────────────────
// Renders a same-origin, script-free snapshot of one of Rahat's own live
// projects so the portfolio card can embed a REAL website preview in an
// iframe. Serving the snapshot from our own origin sidesteps any
// X-Frame-Options / frame-ancestors headers on the target site, and removing
// scripts keeps the embed lightweight, read-only and safe.
//
// GET /api/site-preview?url=https://porasathi.rahatahmed.site/
//   - Allowlist: hosts ending in `.rahatahmed.site` only (no open proxy)
//   - 8s timeout, ~2.5MB response cap
//   - Injects <base href> so the target's CSS/images resolve absolutely
//   - Strips <script> blocks (visual preview only; links stay inert inside
//     the frame because the card overlays a click-to-open link)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOST_SUFFIX = ".rahatahmed.site";
const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 2_500_000;

function isAllowedTarget(rawUrl: string): URL | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!host.endsWith(ALLOWED_HOST_SUFFIX) || host.length <= ALLOWED_HOST_SUFFIX.length) {
      return null;
    }
    // Ensure the base href has a trailing path so relative assets resolve.
    if (url.pathname === "") url.pathname = "/";
    return url;
  } catch {
    return null;
  }
}

/** Removes <script>…</script> blocks (inline and external). */
export function stripScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
}

/** Injects a <base> tag right after <head> (or at the start of the document). */
export function injectBase(html: string, baseHref: string): string {
  const tag = `<base href="${baseHref}" target="_blank">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${tag}`);
  }
  return `${tag}${html}`;
}

const FALLBACK_HTML = (domain: string, url: string) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body data-preview-fallback="1" style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#0b1120;color:#94a3b8;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:16px">
  <div>
    <p style="font-size:13px;margin:0 0 6px">${domain}</p>
    <p style="font-size:12px;margin:0 0 10px;opacity:.7">Live preview is loading…</p>
    <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#fbbf24;font-size:12px">open the site ↗</a>
  </div>
  <script>
    // Tell the embedding card that the server could not fetch the target, so
    // it can retry with a direct embed from the visitor's own browser.
    try { parent.postMessage({ type: "rv-preview-fallback", url: ${JSON.stringify(url)} }, "*"); } catch (e) {}
  </script>
</body></html>`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url") ?? "";

  const allowed = isAllowedTarget(target);
  if (!allowed) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(allowed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "RahatVerse-SitePreview/1.0 (+https://rahatahmed.site)" },
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`upstream ${res.status}`);

    let html = await res.text();
    if (html.length > MAX_BYTES) html = html.slice(0, MAX_BYTES);

    const snapshot = injectBase(stripScripts(html), allowed.toString());
    return new NextResponse(snapshot, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        // Short shared cache: previews stay fresh without hammering the target.
        "cache-control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch {
    // Network/timeout failure — return an honest, styled fallback page instead
    // of a broken frame (e.g. restricted local networks).
    return new NextResponse(FALLBACK_HTML(allowed.hostname, allowed.toString()), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
