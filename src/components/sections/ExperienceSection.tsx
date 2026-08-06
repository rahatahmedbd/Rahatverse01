"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import {
  GraduationCap,
  Users,
  Shield,
  Video,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";

// ── Experience Section ─────────────────────────────────
interface ExperienceSectionProps {
  locale?: string;
}

interface ExperienceItem {
  icon: React.ElementType;
  title: string;
  titleBn: string;
  role: string;
  roleBn: string;
  period: string;
  periodBn: string;
  status: "active" | "paused";
  description: string;
  descriptionBn: string;
  details?: { label: string; labelBn: string; value: string }[];
  link?: string;
}

export function ExperienceSection({ locale = "bn" }: ExperienceSectionProps) {
  const isBn = locale === "bn";

  const experiences: ExperienceItem[] = [
    {
      icon: Building2,
      title: "FS Coaching Center",
      titleBn: "FS কোচিং সেন্টার",
      role: "Founder & Director",
      roleBn: "প্রতিষ্ঠাতা ও পরিচালক",
      period: "Dec 2024 — Temporarily Paused",
      periodBn: "ডিসেম্বর ২০২৪ — সাময়িক বন্ধ",
      status: "paused",
      description:
        "Founded FS Coaching Center to provide quality education at affordable prices for underprivileged students in Jibdara Bazar.",
      descriptionBn:
        "গ্রামের গরিব, দরিদ্র ও অসহায় মেধাবী শিক্ষার্থীদের অত্যন্ত সুলভ মূল্যে মানসম্মত শিক্ষা প্রদানের লক্ষ্যে জীবদাড়া বাজারে FS কোচিং সেন্টার প্রতিষ্ঠা করি।",
      details: [
        { label: "Location", labelBn: "ঠিকানা", value: isBn ? "জীবদাড়া বাজার, শান্তিগঞ্জ, সুনামগঞ্জ" : "Jibdara Bazar, Shantiganj, Sunamganj" },
        { label: "Classes", labelBn: "শ্রেণি", value: isBn ? "৬ষ্ঠ — ১০ম শ্রেণি" : "Class 6 — 10" },
        { label: "Duration", labelBn: "সময়কাল", value: isBn ? "প্রায় ১ বছর সফল পরিচালনা" : "~1 year of successful operation" },
      ],
    },
    {
      icon: Users,
      title: "Helping Hand Organization",
      titleBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
      role: "Founder",
      roleBn: "প্রতিষ্ঠাতা",
      period: "2023 — Temporarily Paused",
      periodBn: "২০২৩ — সাময়িক বন্ধ",
      status: "paused",
      description:
        "Founded Helping Hand Organization in late 2023 to support poor and helpless people in the community.",
      descriptionBn:
        "গরিব, দুঃখী ও অসহায় মানুষের পাশে দাঁড়ানোর লক্ষ্যে ২০২৩ সালের শেষের দিকে হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠা করি।",
      details: [
        { label: "Purpose", labelBn: "উদ্দেশ্য", value: isBn ? "দরিদ্র ও অসহায় মানুষদের সহায়তা" : "Support for the poor and helpless" },
      ],
      link: "https://www.facebook.com/share/p/1JDAkxehvJ/",
    },
    {
      icon: GraduationCap,
      title: "Private Tutor",
      titleBn: "গৃহশিক্ষক",
      role: "Teacher",
      roleBn: "শিক্ষক",
      period: "2023 — Present",
      periodBn: "২০২৩ — বর্তমান",
      status: "active",
      description:
        "Teaching academic subjects to students of class 7, 8, and 9 since class 9 myself.",
      descriptionBn:
        "ক্লাস নাইন থেকে শুরু করে ৭ম, ৮ম এবং ৯ম শ্রেণির শিক্ষার্থীদের একাডেমিক পাঠদান করি।",
    },
    {
      icon: Shield,
      title: "BNCC Cadet",
      titleBn: "BNCC ক্যাডেট",
      role: "Active Cadet",
      roleBn: "সক্রিয় ক্যাডেট",
      period: "Present",
      periodBn: "বর্তমান",
      status: "active",
      description:
        "Active cadet of Bangladesh National Cadet Corps, practicing discipline, leadership, and patriotism.",
      descriptionBn:
        "বাংলাদেশ ন্যাশনাল ক্যাডেট কোরের একজন সক্রিয় ক্যাডেট হিসেবে শৃঙ্খলা, নেতৃত্ব ও দেশপ্রেমের চর্চা করছি।",
      details: [
        { label: "Cadet No", labelBn: "ক্যাডেট নং", value: "25071152" },
      ],
    },
    {
      icon: Video,
      title: "Content Creator",
      titleBn: "কনটেন্ট ক্রিয়েটর",
      role: "YouTube · TikTok",
      roleBn: "YouTube · TikTok",
      period: "Active",
      periodBn: "সক্রিয়",
      status: "active",
      description:
        "Creating content on education, technology, and social awareness across multiple platforms.",
      descriptionBn:
        "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে বিভিন্ন প্ল্যাটফর্মে কনটেন্ট তৈরি করি।",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "💼 কর্মজীবন ও উদ্যোগ" : "💼 Experience & Initiatives"}
          title="Experience & Organizations"
          titleBn="অভিজ্ঞতা ও প্রতিষ্ঠান"
          subtitle={
            isBn
              ? "শিক্ষা, সমাজসেবা এবং প্রযুক্তির ক্ষেত্রে আমার প্রতিষ্ঠিত সংগঠন ও ভূমিকাসমূহ"
              : "Organizations and roles in education, social service, and technology"
          }
          locale={locale}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {experiences.map((exp, index) => (
            <FadeInUp key={exp.title} delay={index * 0.1}>
              <GlassCard className="group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <exp.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold bn">{isBn ? exp.titleBn : exp.title}</h3>
                      <p className="text-sm text-primary font-medium bn">{isBn ? exp.roleBn : exp.role}</p>
                    </div>
                  </div>
                  <Badge variant={exp.status === "active" ? "success" : "warning"} className="text-[10px]">
                    {exp.status === "active" ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "সাময়িক বন্ধ" : "Paused")}
                  </Badge>
                </div>

                {/* Period */}
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="bn">{isBn ? exp.periodBn : exp.period}</span>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground bn leading-relaxed">
                  {isBn ? exp.descriptionBn : exp.description}
                </p>

                {/* Details */}
                {exp.details && exp.details.length > 0 && (
                  <div className="space-y-2 border-t border-border/50 pt-4">
                    {exp.details.map((detail) => (
                      <div key={detail.label} className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-muted-foreground bn">{isBn ? detail.labelBn : detail.label}:</span>
                        <span className="bn">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Link */}
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {isBn ? "ফেসবুকে দেখুন" : "View on Facebook"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </GlassCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
