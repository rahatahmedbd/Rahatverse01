import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";

// ── Middleware ──────────────────────────────────────────
// Handles locale routing via next-intl.
//
// Performance: this middleware previously performed an internal
// `fetch("/api/maintenance-check")` with `cache: "no-store"` on EVERY page
// navigation — a full extra HTTP round-trip (up to 1.5s timeout) plus a
// database query before the page could even start rendering. That made every
// tab switch feel slow. Maintenance mode is now enforced solely by the locale
// layout (it renders the MaintenanceScreen with admin bypass), so the
// navigation hot path does zero extra network work.

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
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

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
