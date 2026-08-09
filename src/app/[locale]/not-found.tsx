"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Mail } from "lucide-react";

// ── Locale 404 ─────────────────────────────────────────
// Pages throwing notFound() (e.g. an unknown blog slug) render this inside the
// locale layout (navbar/footer included). NOTE: Next.js never passes `params`
// to not-found boundaries, so the language comes from the URL path instead —
// this also keeps it working no matter which segment above threw.

export default function LocaleNotFound() {
  const pathname = usePathname();
  const isBn = !pathname.startsWith("/en");
  const home = isBn ? "/bn" : "/en";

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4 py-20">
      <div className="glass w-full rounded-3xl border border-white/10 p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Compass className="h-7 w-7" />
        </div>

        <p className="text-gradient text-6xl font-extrabold leading-none sm:text-7xl">404</p>

        <h1 className="bn mt-5 text-2xl font-bold">
          {isBn ? "পেজটি পাওয়া যায়নি" : "Page not found"}
        </h1>
        <p className="bn mt-2 text-sm leading-relaxed text-muted-foreground">
          {isBn
            ? "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই, সরানো হয়েছে, অথবা লিংকে ভুল আছে। নিচের বাটন দিয়ে চলে যান — বা প্রয়োজনে আমাকে জানান।"
            : "The page you are looking for doesn't exist, has moved, or the link is broken. Use the buttons below — or let me know."}
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            href={home}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-4 w-4" />
            <span className="bn">{isBn ? "হোমে ফিরুন" : "Back to home"}</span>
          </Link>
          <Link
            href={`${home}/contact`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-all hover:border-primary/40 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="h-4 w-4" />
            <span className="bn">{isBn ? "যোগাযোগ করুন" : "Contact me"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
