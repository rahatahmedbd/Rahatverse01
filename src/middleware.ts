import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";

// ── Middleware ──────────────────────────────────────────
// Handles locale routing via next-intl

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale redirect for PWA and static routes
  const publicRoutes = ["/manifest.json", "/offline", "/icons/"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
