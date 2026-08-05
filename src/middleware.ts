// ── Middleware ──────────────────────────────────────────
// Handles Supabase session refresh and locale routing

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/types";

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  // ── Supabase Auth Session Refresh ────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  // ── Locale Redirect ──────────────────────────────────
  const { pathname } = request.nextUrl;

  // Check if path already has a locale
  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale and not an API/static route, redirect to default locale
  if (
    !hasLocale &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    // Check if path is root
    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE}`, request.url)
      );
    }

    // Check for Accept-Language header to determine preferred locale
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLocale = acceptLanguage.includes("en") ? "en" : DEFAULT_LOCALE;

    return NextResponse.redirect(
      new URL(`/${preferredLocale}${pathname}`, request.url)
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
