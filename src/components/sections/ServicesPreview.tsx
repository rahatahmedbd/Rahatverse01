"use client";

import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import {
  Globe,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Newspaper,
  Palette,
  Zap,
  Shield,
  Search,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ── Services Preview Section ───────────────────────────
interface ServicesPreviewProps {
  locale?: string;
}

export function ServicesPreview({ locale = "bn" }: ServicesPreviewProps) {
  const isBn = locale === "bn";

  const websiteTypes = [
    { icon: Globe, label: isBn ? "পোর্টফোলিও" : "Portfolio" },
    { icon: Briefcase, label: isBn ? "ব্যবসায়িক" : "Business" },
    { icon: ShoppingBag, label: isBn ? "ই-কমার্স" : "E-Commerce" },
    { icon: GraduationCap, label: isBn ? "শিক্ষা প্রতিষ্ঠান" : "Education" },
    { icon: Newspaper, label: isBn ? "নিউজ পোর্টাল" : "News Portal" },
    { icon: Palette, label: isBn ? "ল্যান্ডিং পেজ" : "Landing Page" },
  ];

  const features = [
    { icon: Zap, label: isBn ? "দ্রুতগতির লোডিং" : "Lightning Fast" },
    { icon: Smartphone, label: isBn ? "সব ডিভাইসে রেসপনসিভ" : "Fully Responsive" },
    { icon: Search, label: isBn ? "SEO ফ্রেন্ডলি" : "SEO Friendly" },
    { icon: Shield, label: isBn ? "নিরাপদ ও সুরক্ষিত" : "Secure & Protected" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={isBn ? "আমার দক্ষতা" : "What I offer"}
          badge={isBn ? "💻 সার্ভিস" : "💻 Services"}
          title="Web Development Services"
          titleBn="ওয়েব ডেভেলপমেন্ট সার্ভিস"
          subtitle={
            isBn
              ? "আধুনিক, দ্রুতগতির ও Responsive ওয়েবসাইট তৈরি করি"
              : "Modern, fast, and responsive websites"
          }
          locale={locale}
        />

        {/* Website Types */}
        <StaggerGrid columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" gap="gap-4">
          {websiteTypes.map((type) => (
            <StaggerItem key={type.label}>
              <GlassCard className="h-full text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <type.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-medium bn">{type.label}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.label}>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/20 hover:bg-accent/10">
                <feature.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium bn">{feature.label}</span>
              </div>
            </StaggerItem>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="gradient" size="lg" asChild>
            <Link href={`/${locale}/order`}>
              {isBn ? "প্রজেক্টের জন্য যোগাযোগ করুন" : "Start Your Project"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
