"use client";

import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Gauge, Zap, Clock, Monitor } from "lucide-react";

// ── Performance Report ─────────────────────────────────
interface PerformanceReportProps {
  locale?: string;
}

export function PerformanceReport({ locale = "bn" }: PerformanceReportProps) {
  const isBn = locale === "bn";

  const metrics = [
    {
      icon: Gauge,
      label: isBn ? "পারফরম্যান্স স্কোর" : "Performance Score",
      value: "95+",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Zap,
      label: isBn ? "লোডিং টাইম" : "Loading Time",
      value: "<2s",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Clock,
      label: isBn ? "ফার্স্ট কন্টেন্টফুল পেইন্ট" : "First Contentful Paint",
      value: "<1s",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Monitor,
      label: isBn ? "কোর ওয়েব ভাইটালস" : "Core Web Vitals",
      value: isBn ? "পাস" : "Pass",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "⚡ পারফরম্যান্স" : "⚡ Performance"}
          title="Site Performance"
          titleBn="সাইট পারফরম্যান্স"
          subtitle={
            isBn
              ? "ওয়েবসাইটের স্পিড ও অপটিমাইজেশন রিপোর্ট"
              : "Website speed and optimization report"
          }
          locale={locale}
        />

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <StaggerItem key={metric.label}>
              <GlassCard>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="mt-4">
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground bn">{metric.label}</p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.2}>
          <GlassCard className="mt-6">
            <h3 className="text-lg font-bold bn mb-4">{isBn ? "অপটিমাইজেশন" : "Optimizations"}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: isBn ? "ইমেজ অপটিমাইজেশন" : "Image Optimization", status: "✅" },
                { label: isBn ? "কোড স্প্লিটিং" : "Code Splitting", status: "✅" },
                { label: isBn ? "লেজি লোডিং" : "Lazy Loading", status: "✅" },
                { label: isBn ? "ক্যাশিং" : "Caching", status: "✅" },
                { label: isBn ? "মিনিফিকেশন" : "Minification", status: "✅" },
                { label: isBn ? "CDN ডেলিভারি" : "CDN Delivery", status: "✅" },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center gap-2 text-sm">
                  <span>{opt.status}</span>
                  <span className="bn">{opt.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeInUp>
      </div>
    </section>
  );
}
