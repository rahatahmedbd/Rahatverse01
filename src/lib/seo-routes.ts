import { SUPPORTED_LOCALES } from "@/types";

/**
 * ── SEO route graph — single source of truth (Phase 10) ─────────────
 * Consolidates the site's indexable route graph so that the sitemap,
 * robots.txt and the automated SEO validation suite all read the same
 * deterministic data. This keeps entity/route signals consistent and
 * prevents private pages from leaking into indexable output.
 *
 * Private/internal paths (api, auth, admin, dashboard, login) are
 * intentionally NOT part of the public graph.
 */

export const SEO_LOCALES: string[] = SUPPORTED_LOCALES;

export type ChangeFrequency = "weekly" | "monthly" | "yearly";

export interface PublicRoute {
  /** Path relative to the locale prefix, e.g. "" (home) or "/about". */
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/** Every indexable, public page (no /api, /auth, /admin, /dashboard, /login). */
export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "yearly", priority: 0.9 },
  { path: "/services", changeFrequency: "yearly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.9 },
  { path: "/order", changeFrequency: "yearly", priority: 0.9 },
  { path: "/achievements", changeFrequency: "monthly", priority: 0.8 },
  { path: "/experience", changeFrequency: "yearly", priority: 0.8 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/links", changeFrequency: "yearly", priority: 0.7 },
  // Canonical legal routes only — the short duplicates (/privacy, /terms)
  // are noindexed and intentionally excluded so they cannot compete in search.
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.5 },
];

/** Private/internal path prefixes that must never be indexed or crawled. */
export const BLOCKED_PRIVATE_PATHS: string[] = [
  "/api/",
  "/auth/",
  "/dashboard/",
  "/admin/",
  "/login",
];

/**
 * robots.txt disallow list. robots paths are prefix-matched, so every
 * blocked prefix must be listed both bare and locale-prefixed so that no
 * /bn/... or /en/... private variant slips through.
 */
export function robotsDisallowPaths(): string[] {
  const paths: string[] = [];
  for (const base of BLOCKED_PRIVATE_PATHS) {
    paths.push(base);
    for (const locale of SEO_LOCALES) {
      paths.push(`/${locale}${base}`);
    }
  }
  return paths;
}
