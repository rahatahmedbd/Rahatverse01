"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";

// ── Order CTA Band ─────────────────────────────────────
// Phase K: The website-ordering system sits right above the
// featured image boxes on the home page (not above the profile image).

interface OrderCtaBandProps {
  locale?: string;
}

export function OrderCtaBand({ locale = "bn" }: OrderCtaBandProps) {
  const isBn = locale === "bn";

  return (
    <section className="container mx-auto px-4 py-8" aria-label={isBn ? "ওয়েবসাইট অর্ডার" : "Order a website"}>
      <div className="glass-interactive relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-purple-500/10 px-6 py-12 text-center sm:px-12">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-72 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 text-white shadow-lg shadow-amber-500/25">
            <Rocket className="h-7 w-7" aria-hidden="true" />
          </div>

          <h2 className="bn text-heading-lg font-bold text-foreground">
            {isBn
              ? "আপনার স্বপ্নের ওয়েবসাইট তৈরি করুন"
              : "Build the website you've been dreaming of"}
          </h2>

          <p className="bn mx-auto mt-3 max-w-xl text-lead text-muted-foreground">
            {isBn
              ? "মডার্ন ডিজাইন, দ্রুত ডেলিভারি ও সাশ্রয়ী মূল্য — আজই আপনার ওয়েবসাইট অর্ডার করুন।"
              : "Modern design, fast delivery and affordable pricing — order your website today."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="gradient" size="xl" asChild>
              <Link href={`/${locale}/order`}>
                <ShoppingCart className="h-4 w-4" />
                {isBn ? "ওয়েবসাইট অর্ডার করুন" : "Order a Website"}
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href={`/${locale}/contact`}>
                <MessageCircle className="h-4 w-4" />
                {isBn ? "যোগাযোগ করুন" : "Contact Me"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
