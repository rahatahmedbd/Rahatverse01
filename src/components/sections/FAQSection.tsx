"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { ChevronDown, Loader2 } from "lucide-react";
import { DEFAULT_CONTENT_CONFIG, validateContentConfig } from "@/lib/content/config";
import type { ContentConfig } from "@/types/content";

// ── FAQ Section (DB-driven) ────────────────────────────
interface FAQSectionProps {
  locale?: string;
}

export function FAQSection({ locale = "bn" }: FAQSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ContentConfig>(DEFAULT_CONTENT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateContentConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "FAQ লোড হচ্ছে..." : "Loading FAQ..."}
      </div>
    );
  }

  const visibleCategories = config.faqCategories.filter((category) => category.visible);
  const filteredItems = config.faqItems.filter(
    (item) => item.visible && (activeCategory === "all" || item.category === activeCategory)
  );

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle
          badge={isBn ? "❓ প্রশ্নোত্তর" : "❓ FAQ"}
          title={isBn ? config.faqSectionTitleBn : config.faqSectionTitleEn}
          titleBn={isBn ? config.faqSectionTitleBn : config.faqSectionTitleEn}
          subtitle={isBn ? config.faqSectionSubtitleBn : config.faqSectionSubtitleEn}
          locale={locale}
        />

        {visibleCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "border border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {isBn ? "সব" : "All"}
            </button>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => { setActiveCategory(category.value); setOpenId(null); }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.value
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {isBn ? category.labelBn : category.labelEn}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <FadeInUp key={item.id} delay={index * 0.05}>
              <GlassCard className="cursor-pointer transition-all hover:border-primary/30">
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="pr-4 font-semibold bn">
                    {isBn ? item.questionBn : item.questionEn}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                      openId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openId === item.id && (
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <p className="text-sm text-muted-foreground bn">
                      {isBn ? item.answerBn : item.answerEn}
                    </p>
                  </div>
                )}
              </GlassCard>
            </FadeInUp>
          ))}
          {filteredItems.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {isBn ? "এই ক্যাটাগরিতে কোনো প্রশ্ন নেই" : "No questions in this category"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
