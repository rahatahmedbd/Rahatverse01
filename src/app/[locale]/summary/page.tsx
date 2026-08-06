import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { CheckCircle2, Sparkles, Trophy, Rocket } from "lucide-react";

// ── Project Summary Page ───────────────────────────────
interface SummaryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  const stats = [
    { icon: Trophy, label: isBn ? "ফেজ সম্পন্ন" : "Phases Completed", value: "18" },
    { icon: Sparkles, label: isBn ? "কম্পোনেন্ট" : "Components", value: "50+" },
    { icon: Rocket, label: isBn ? "API Routes" : "API Routes", value: "8" },
    { icon: CheckCircle2, label: isBn ? "পেজ" : "Pages", value: "20+" },
  ];

  const phases = [
    { num: "01", name: isBn ? "জেনেসিস" : "Genesis", desc: isBn ? "ভিত্তি স্থাপন" : "Foundation Setup" },
    { num: "02", name: isBn ? "প্রিজম" : "Prism", desc: isBn ? "ডিজাইন সিস্টেম" : "Design System" },
    { num: "03", name: isBn ? "মোশন ক্যানভাস" : "Motion Canvas", desc: isBn ? "অ্যানিমেশন ইঞ্জিন" : "Animation Engine" },
    { num: "04", name: isBn ? "দ্য বিগিনিং" : "The Beginning", desc: isBn ? "হিরো সেকশন" : "Hero Section" },
    { num: "05", name: isBn ? "গল্পের পাতা" : "Story Pages", desc: isBn ? "সম্পর্কে ও শিক্ষা" : "About & Education" },
    { num: "06", name: isBn ? "কর্মভূমি" : "The Arena", desc: isBn ? "অভিজ্ঞতা ও সার্ভিস" : "Experience & Services" },
    { num: "07", name: isBn ? "স্মৃতির আলবাম" : "Memory Album", desc: isBn ? "গ্যালারি ও ভিডিও" : "Gallery & Video" },
    { num: "08", name: isBn ? "নিউরো নেটওয়ার্ক" : "Neural Network", desc: isBn ? "ব্যাকএন্ড সেটআপ" : "Backend Setup" },
    { num: "09", name: isBn ? "বাবেল টাওয়ার" : "Tower of Babel", desc: isBn ? "মাল্টি-ল্যাংগুয়েজ" : "Multi-Language" },
    { num: "10", name: isBn ? "ড্রিম ফ্যাক্টরি" : "Dream Factory", desc: isBn ? "অর্ডারিং সিস্টেম" : "Ordering System" },
    { num: "11", name: isBn ? "সংযোগ সেতু" : "Connection Bridge", desc: isBn ? "যোগাযোগ ফর্ম" : "Contact Forms" },
    { num: "12", name: isBn ? "কলমের আঁচড়" : "Writer's Ink", desc: isBn ? "ব্লগ ও রিসোর্স" : "Blog & Resources" },
    { num: "13", name: isBn ? "কমান্ড সেন্টার" : "Command Center", desc: isBn ? "অ্যাডমিন ড্যাশবোর্ড" : "Admin Dashboard" },
    { num: "14", name: isBn ? "অ্যাপভার্স" : "AppVerse", desc: isBn ? "PWA সেটআপ" : "PWA Setup" },
    { num: "15", name: isBn ? "সার্চলাইট" : "Searchlight", desc: isBn ? "সার্চ ও লিগ্যাল" : "Search & Legal" },
    { num: "16", name: isBn ? "মিশন কন্ট্রোল" : "Mission Control", desc: isBn ? "SEO ও অ্যানালিটিক্স" : "SEO & Analytics" },
    { num: "17", name: isBn ? "ম্যাজিক টাচ" : "Magic Touch", desc: isBn ? "ইন্টারঅ্যাকটিভ ইফেক্ট" : "Interactive Effects" },
    { num: "18", name: isBn ? "ক্রাউন জুয়েল" : "Crown Jewel", desc: isBn ? "ফাইনাল পলিশ" : "Final Polish" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <SectionTitle
        badge={isBn ? "👑 প্রজেক্ট সম্পন্ন" : "👑 Project Complete"}
        title="Project Summary"
        titleBn="প্রজেক্ট সামারি"
        subtitle={isBn ? "১৮টি ফেজে তৈরি সম্পূর্ণ ওয়েবসাইট" : "Complete website built in 18 phases"}
        locale={locale}
      />

      {/* Stats */}
      <StaggerContainer className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <GlassCard className="text-center">
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground bn">{stat.label}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Phases */}
      <FadeInUp>
        <GlassCard>
          <h3 className="mb-6 text-xl font-bold bn">{isBn ? "সব ফেজ" : "All Phases"}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {phases.map((phase) => (
              <div key={phase.num} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {phase.num}
                </span>
                <div>
                  <p className="font-semibold bn">{phase.name}</p>
                  <p className="text-xs text-muted-foreground bn">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeInUp>
    </div>
  );
}
