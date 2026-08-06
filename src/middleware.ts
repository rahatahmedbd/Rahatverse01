import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// ── Middleware ──────────────────────────────────────────
// Handles locale routing via next-intl
// Supabase session refresh will be integrated in future phases

export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
