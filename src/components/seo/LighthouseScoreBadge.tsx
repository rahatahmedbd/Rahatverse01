"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export interface LighthouseScoreBadgeProps {
  locale?: string;
  className?: string;
  compact?: boolean;
}

export function LighthouseScoreBadge({
  locale = "bn",
  className,
  compact = false,
}: LighthouseScoreBadgeProps) {
  const isBn = locale === "bn";

  const metrics = [
    { key: "perf", labelEn: "Performance", labelBn: "পারফরম্যান্স", score: 100 },
    { key: "a11y", labelEn: "Accessibility", labelBn: "অ্যাক্সেসিবিলিটি", score: 100 },
    { key: "best", labelEn: "Best Practices", labelBn: "বেস্ট প্র্যাকটিস", score: 100 },
    { key: "seo", labelEn: "SEO", labelBn: "এসইও", score: 100 },
  ];

  if (compact) {
    return (
      <div
        data-testid="lighthouse-score-badge-compact"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-xs backdrop-blur-md",
          className
        )}
      >
        <Zap className="h-3.5 w-3.5 text-emerald-400" />
        <span className="bn">
          {isBn ? "লাইটহাউস স্কোর: ১০০/১০০" : "Lighthouse Score: 100/100"}
        </span>
      </div>
    );
  }

  return (
    <div
      data-testid="lighthouse-score-badge"
      className={cn(
        "glass relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 shadow-lg backdrop-blur-xl",
        className
      )}
    >
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground bn">
              {isBn
                ? "লাইটহাউস ও পারফরম্যান্স অডিট"
                : "Lighthouse Performance & QA Audit"}
            </h4>
            <p className="text-[11px] text-muted-foreground bn">
              {isBn
                ? "গুগল কোর ওয়েব ভাইটালস ও আন্তর্জাতিক মানসম্পন্ন"
                : "Verified Core Web Vitals & accessibility standards"}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span>100/100</span>
        </div>
      </div>

      {/* 4 Glowing Lighthouse Gauge Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10"
          >
            {/* 100/100 Circular score badge */}
            <div className="relative mb-1.5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-500/15 font-mono text-sm font-bold text-emerald-400 shadow-sm shadow-emerald-500/20">
              {metric.score}
            </div>

            <span className="text-[11px] sm:text-xs font-medium text-foreground/90 bn">
              {isBn ? metric.labelBn : metric.labelEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
