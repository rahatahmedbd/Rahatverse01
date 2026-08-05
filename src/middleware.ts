// ── Middleware ──────────────────────────────────────────
// Handles locale routing
// Supabase session refresh will be added in Phase 08

import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static files and API routes ─────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // ── Locale Redirect ──────────────────────────────────
  // Check if path already has a supported locale
  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    // Detect preferred locale from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLocale = acceptLanguage.includes("en")
      ? "en"
      : DEFAULT_LOCALE;

    // Redirect root or prepend locale
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(`/${preferredLocale}`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/${preferredLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
