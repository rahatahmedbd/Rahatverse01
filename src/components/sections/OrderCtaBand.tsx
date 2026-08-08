"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";

interface OrderCtaBandProps {
  locale?: string;
}

export function OrderCtaBand({ locale = "bn" }: OrderCtaBandProps) {
  const isBn = locale === "bn";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12" aria-label={isBn ? "ওয়েবসাইট অর্ডার" : "Order a website"}>
      <div className="glass-interactive relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-purple-500/10 px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-3xl sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        {/* Decorative glows — restrained */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl sm:h-48 sm:w-96" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-60 rounded-full bg-blue-500/[0.06] blur-3xl sm:h-48 sm:w-72" aria-hidden="true" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 text-white shadow-lg shadow-amber-500/20 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
            <Rocket className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
          </div>

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

          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto">
              <Link href={`/${locale}/order#order-checkout`} className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {isBn ? "ওয়েবসাইট অর্ডার করুন" : "Order a Website"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2">
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
