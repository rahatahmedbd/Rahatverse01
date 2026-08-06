"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import {
  GraduationCap,
  MapPin,
  Droplets,
  Calendar,
  BookOpen,
  Award,
} from "lucide-react";

// ── About Preview Section ──────────────────────────────
interface AboutPreviewProps {
  locale?: string;
}

export function AboutPreview({ locale = "bn" }: AboutPreviewProps) {
  const isBn = locale === "bn";

  const infoCards = [
    {
      icon: GraduationCap,
      label: isBn ? "শিক্ষা" : "Education",
      value: isBn ? "HSC ২য় বর্ষ (বিজ্ঞান)" : "HSC 2nd Year (Science)",
    },
    {
      icon: MapPin,
      label: isBn ? "অবস্থান" : "Location",
      value: isBn ? "সুনামগঞ্জ, বাংলাদেশ" : "Sunamganj, Bangladesh",
    },
    {
      icon: Droplets,
      label: isBn ? "রক্তের গ্রুপ" : "Blood Group",
      value: "A+ Positive",
    },
    {
      icon: Calendar,
      label: isBn ? "জন্ম তারিখ" : "Birth Date",
      value: "২১ জুন, ২০০৬",
    },
    {
      icon: BookOpen,
      label: isBn ? "প্রতিষ্ঠান" : "Institution",
      value: isBn ? "সুনামগঞ্জ সরকারি কলেজ" : "Sunamganj Govt. College",
    },
    {
      icon: Award,
      label: isBn ? "অর্জন" : "Achievements",
      value: isBn ? "৯ পুরস্কার" : "9 Awards",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "👤 পরিচয়" : "👤 Introduction"}
          title="About Me"
          titleBn="আমার সম্পর্কে"
          subtitle={
            isBn
              ? "গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প"
              : "From village to city, from dream to reality — a continuous journey"
          }
          locale={locale}
        />

        {/* Info Cards */}
        <StaggerGrid columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" gap="gap-4">
          {infoCards.map((card) => (
            <StaggerItem key={card.label}>
              <GlassCard className="h-full text-center">
                <card.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-sm font-semibold bn">{card.value}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Quote */}
        <div className="mt-12">
          <GlassCard className="border-l-4 border-l-primary text-center">
            <p className="text-lg italic text-muted-foreground bn">
              &ldquo;মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।&rdquo;
            </p>
            <Badge variant="glow" className="mt-4">
              {isBn ? "— রাহাত আহমেদ" : "— Rahat Ahmed"}
            </Badge>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
