import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Home, Languages, Mail } from "lucide-react";

// ── Root 404 — unmatched URLs land here before a locale layout is chosen ──
// The root app/layout.tsx intentionally renders no <html>/<body> (those live
// in [locale]/layout.tsx), so this page must supply its own document shell.
// The locale is unknown at this level, so the message is bilingual (bn first,
// en second) and the buttons use locale-neutral targets.

export const metadata: Metadata = {
  title: "404 — পেজটি পাওয়া যায়নি | RahatVerse",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <main className="site-gradient-canvas flex min-h-screen items-center justify-center px-4 py-16">
          <div className="glass w-full max-w-lg rounded-3xl border border-white/10 p-8 text-center shadow-2xl sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Compass className="h-7 w-7" />
            </div>

            <p className="text-gradient text-6xl font-extrabold leading-none sm:text-7xl">404</p>

            <h1 className="bn mt-5 text-2xl font-bold">পেজটি পাওয়া যায়নি</h1>
            <p className="bn mt-2 text-sm leading-relaxed text-muted-foreground">
              আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই, সরানো হয়েছে, অথবা লিংকে ভুল আছে।
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
              Page not found — the link may be broken or the page has moved.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Home className="h-4 w-4" />
                <span className="bn">হোমে ফিরুন</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-all hover:border-primary/40 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="h-4 w-4" />
                <span className="bn">যোগাযোগ করুন</span>
              </Link>
            </div>

            <Link
              href="/en"
              className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Languages className="h-3.5 w-3.5" />
              Continue in English
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
