"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/tracker";
import { RahatPortrait } from "./RahatPortrait";
import { HoverCard3D } from "@/components/interactive/HoverCard3D";

interface OrderCtaBandProps {
  locale?: string;
}

export function OrderCtaBand({ locale = "bn" }: OrderCtaBandProps) {
  const isBn = locale === "bn";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" aria-label={isBn ? "ওয়েবসাইট অর্ডার" : "Order a website"}>
      <HoverCard3D intensity={5} className="rounded-2xl sm:rounded-3xl">
      <div className="glass-interactive relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-purple-500/10 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-3xl sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        {/* Decorative glows — restrained */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl sm:h-48 sm:w-96" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-60 rounded-full bg-blue-500/[0.06] blur-3xl sm:h-48 sm:w-72" aria-hidden="true" />

        <div className="relative mx-auto max-w-2xl">
          <RahatPortrait
            locale={locale}
            className="mx-auto mb-3 h-16 w-16 ring-2 ring-primary/40 shadow-lg shadow-primary/20 sm:mb-4 sm:h-20 sm:w-20"
            sizes="80px"
          />

          <h2 className="bn text-heading-sm font-bold tracking-tight text-foreground sm:text-heading-lg">
            {isBn
              ? "আপনার স্বপ্নের ওয়েবসাইট তৈরি করুন"
              : "Build the website you've been dreaming of"}
          </h2>

          <p className="bn mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-lead">
            {isBn
              ? "মডার্ন ডিজাইন, দ্রুত ডেলিভারি ও সাশ্রয়ী মূল্য — আজই আপনার ওয়েবসাইট অর্ডার করুন।"
              : "Modern design, fast delivery and affordable pricing — order your website today."}
          </p>

          <div className="mt-4 flex flex-col items-stretch justify-center gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto">
              <Link
                href={`/${locale}/order#order-checkout`}
                onClick={() =>
                  trackEvent("cta_click", {
                    category: "conversion",
                    label: "order_cta_band_primary",
                    metadata: { cta_id: "order_cta_band_primary", location: "order_cta_band", locale },
                  })
                }
                className="inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isBn ? "ওয়েবসাইট অর্ডার করুন" : "Order a Website"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link
                href={`/${locale}/contact`}
                onClick={() =>
                  trackEvent("cta_click", {
                    category: "conversion",
                    label: "order_cta_band_secondary",
                    metadata: { cta_id: "order_cta_band_secondary", location: "order_cta_band", locale },
                  })
                }
                className="inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {isBn ? "যোগাযোগ করুন" : "Contact Me"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </HoverCard3D>
    </section>
  );
}
