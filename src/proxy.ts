import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// ── Middleware ──────────────────────────────────────────
// Handles locale routing via next-intl + maintenance 503

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale redirect for PWA and static routes
  const publicRoutes = ["/manifest.json", "/offline", "/icons/", "/sitemap.xml", "/robots.txt", "/auth/"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  // Do not interfere with API routes — they are excluded by matcher, but double-check
  if (pathname.startsWith("/api/")) {
    return;
  }

  // ── Maintenance mode → 503 Service Unavailable with Retry-After ──
  // Uses internal API to decide blocking, preserving admin bypass when allowAdmins is true.
  // Fails open (allows request) if the check errors or times out.
  try {
    const maintenanceUrl = new URL("/api/maintenance-check", request.url);
    const cookieHeader = request.headers.get("cookie");
    const headers: HeadersInit = {};
    if (cookieHeader) headers["cookie"] = cookieHeader;

    // Short timeout via AbortSignal if available (Next edge supports it)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(maintenanceUrl, {
      headers,
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (res.ok) {
      const data = (await res.json()) as {
        blocked?: boolean;
        messageBn?: string;
        messageEn?: string;
      };
      if (data?.blocked) {
        const isBn = !pathname.startsWith("/en");
        const locale = isBn ? "bn" : "en";
        const message = isBn
          ? data.messageBn || "আমরা শীঘ্রই ফিরে আসছি!"
          : data.messageEn || "We'll be back soon!";
        const title = isBn ? "মেইনটেন্যান্স চলছে" : "Maintenance in progress";
        const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:system-ui,Inter,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:2rem;color:#334155;background:#f8fafc}h1{font-size:1.5rem;font-weight:700;margin:1rem 0 .5rem}p{color:#64748b;max-width:28rem}</style></head><body><div style="width:64px;height:64px;border-radius:16px;background:#f59e0b1a;display:flex;align-items:center;justify-content:center;font-size:28px">🔧</div><h1>${title}</h1><p>${message}</p><p style="margin-top:1.5rem;font-size:12px">${isBn ? "শীঘ্রই ফিরে আসছি। ধন্যবাদ!" : "We'll be right back. Thank you!"}</p></body></html>`;
        return new NextResponse(html, {
          status: 503,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Retry-After": "3600",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        });
      }
    }
  } catch {
    // Fail open — let request proceed to normal routing
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
