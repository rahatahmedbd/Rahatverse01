// ── Referrer Classification ────────────────────────────
// Shared by the client tracker and the /api/analytics route so first-party
// analytics and the dashboard agree on traffic source names.

const REFERRER_SOURCES: Array<{ source: string; domains: string[] }> = [
  { source: "google", domains: ["google."] },
  { source: "facebook", domains: ["facebook.com", "fb.com", "fb.me"] },
  { source: "instagram", domains: ["instagram.com"] },
  { source: "youtube", domains: ["youtube.com", "youtu.be"] },
  { source: "twitter", domains: ["twitter.com", "t.co", "x.com"] },
  { source: "linkedin", domains: ["linkedin.com", "lnkd.in"] },
  { source: "whatsapp", domains: ["whatsapp.com", "wa.me"] },
  { source: "telegram", domains: ["t.me", "telegram.me"] },
  { source: "messenger", domains: ["messenger.com"] },
  { source: "tiktok", domains: ["tiktok.com"] },
  { source: "reddit", domains: ["reddit.com"] },
  { source: "github", domains: ["github.com"] },
  { source: "bing", domains: ["bing.com"] },
  { source: "duckduckgo", domains: ["duckduckgo.com"] },
  { source: "yahoo", domains: ["yahoo."] },
];

/**
 * Maps a raw document.referrer value to a stable traffic source name.
 * Returns "direct" for empty referrers, "internal" for same-site navigation,
 * a known source name for recognised domains, and the bare hostname otherwise.
 */
export function classifyReferrer(
  referrer: string | null | undefined,
  siteHost?: string | null
): string {
  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "direct";
  }

  if (!host) return "direct";

  if (siteHost) {
    const own = siteHost.toLowerCase().replace(/^www\./, "");
    if (host === own || host.endsWith(`.${own}`)) return "internal";
  }

  for (const entry of REFERRER_SOURCES) {
    if (entry.domains.some((domain) => host === domain || host.includes(domain))) {
      return entry.source;
    }
  }

  return host;
}
