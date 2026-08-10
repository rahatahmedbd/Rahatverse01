"use client";

import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Gauge, Zap, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LighthouseScoreBadge } from "@/components/seo/LighthouseScoreBadge";

// ── Performance Report ─────────────────────────────────
interface PerformanceReportProps {
  locale?: string;
}

export function PerformanceReport({ locale = "bn" }: PerformanceReportProps) {
  const isBn = locale === "bn";

  // Dated lab-audit results — point-in-time Lighthouse lab scores (August
  // 2026), not permanent guarantees.
  const metrics = [
    {
      icon: Gauge,
      label: isBn ? "পারফরম্যান্স স্কোর" : "Performance Score",
      value: "100/100",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      desc: isBn
        ? "লাইটহাউস ল্যাব অডিট — আগস্ট ২০২৬"
        : "Lighthouse lab audit — August 2026",
    },
    {
      icon: ShieldCheck,
      label: isBn ? "অ্যাক্সেসিবিলিটি ও এসইও" : "Accessibility & SEO",
      value: "100/100",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      desc: isBn
        ? "লাইটহাউস ল্যাব অডিট — আগস্ট ২০২৬"
        : "Lighthouse lab audit — August 2026",
    },
    {
      icon: Zap,
      label: isBn ? "লোডিং টাইম (LCP)" : "Loading Time (LCP)",
      value: "<1.2s",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      desc: isBn
        ? "ল্যাব পরিমাপে কোর ওয়েব ভাইটালস এলসিপি"
        : "Core Web Vitals LCP in lab measurement",
    },
    {
      icon: Clock,
      label: isBn ? "ফার্স্ট কন্টেন্টফুল পেইন্ট" : "First Contentful Paint",
      value: "<0.8s",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      desc: isBn
        ? "ল্যাব পরিমাপে দ্রুত প্রাথমিক রেন্ডার"
        : "Rapid initial render in lab measurement",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          badge={isBn ? "⚡ পারফরম্যান্স অডিট" : "⚡ Performance Audit"}
          title="Lighthouse & Web Vitals QA"
          titleBn="লাইটহাউস ও ওয়েব ভাইটালস"
          subtitle={
            isBn
              ? "আগস্ট ২০২৬-এ চালানো লাইটহাউস ল্যাব অডিটের ফলাফল — গতি, অ্যাক্সেসিবিলিটি, সেরা অনুশীলন ও এসইও"
              : "Results from a Lighthouse lab audit run in August 2026 — performance, accessibility, best practices and SEO"
          }
          locale={locale}
        />

        {/* Top Lighthouse Score Badge Showcase */}
        <FadeInUp>
          <div className="mb-10">
            <LighthouseScoreBadge locale={locale} />
          </div>
        </FadeInUp>

        {/* Core Web Vitals Metrics Grid */}
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <StaggerItem key={metric.label}>
              <GlassCard className="flex h-full flex-col justify-between p-6 transition-all hover:border-primary/40 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.bgColor} ${metric.color}`}
                  >
                    <metric.icon className="h-6 w-6" />
                  </div>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {isBn ? "পাস" : "Pass"}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="font-mono text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <h4 className="mt-1 text-sm font-semibold text-foreground bn">
                    {metric.label}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground bn">
                    {metric.desc}
                  </p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
