"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import {
  GraduationCap,
  MapPin,
  Droplets,
  Calendar,
  BookOpen,
  Award,
  Heart,
  Code,
  Users,
} from "lucide-react";

// ── Full About Section ─────────────────────────────────
interface AboutFullProps {
  locale?: string;
}

export function AboutFull({ locale = "bn" }: AboutFullProps) {
  const isBn = locale === "bn";

  const personalInfo = [
    { icon: Calendar, label: isBn ? "জন্ম তারিখ" : "Birth Date", value: "২১ জুন, ২০০৬" },
    { icon: MapPin, label: isBn ? "অবস্থান" : "Location", value: isBn ? "সুনামগঞ্জ, বাংলাদেশ" : "Sunamganj, Bangladesh" },
    { icon: Droplets, label: isBn ? "রক্তের গ্রুপ" : "Blood Group", value: "A+ Positive" },
    { icon: GraduationCap, label: isBn ? "শিক্ষা" : "Education", value: isBn ? "HSC ২য় বর্ষ (বিজ্ঞান)" : "HSC 2nd Year (Science)" },
    { icon: BookOpen, label: isBn ? "প্রতিষ্ঠান" : "Institution", value: isBn ? "সুনামগঞ্জ সরকারি কলেজ" : "Sunamganj Govt. College" },
    { icon: Award, label: isBn ? "BNCC ক্যাডেট নং" : "BNCC Cadet No", value: "25071152" },
  ];

  const interests = [
    { icon: Code, label: isBn ? "ওয়েব ডেভেলপমেন্ট" : "Web Development" },
    { icon: Users, label: isBn ? "সমাজসেবা" : "Social Service" },
    { icon: BookOpen, label: isBn ? "শিক্ষা" : "Education" },
    { icon: Heart, label: isBn ? "রক্তদান" : "Blood Donation" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "👤 আমার গল্প" : "👤 My Story"}
          title="About Me"
          titleBn="আমার সম্পর্কে"
          subtitle={
            isBn
              ? "গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প"
              : "From village to city, dream to reality — a continuous journey"
          }
          locale={locale}
        />

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Story */}
          <div className="lg:col-span-3">
            <FadeInLeft>
              <GlassCard className="h-full">
                <div className="space-y-4">
                  <p className="text-muted-foreground bn leading-relaxed">
                    আমি রাহাত আহমেদ। ২০০৬ সালের ২১ জুন সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে আমার জন্ম। প্রকৃতির কোলে বেড়ে ওঠা এই গ্রামই আমাকে শিখিয়েছে স্বপ্ন দেখতে এবং লড়াই করতে।
                  </p>
                  <p className="text-muted-foreground bn leading-relaxed">
                    বর্তমানে আমি সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞান বিভাগের শিক্ষার্থী। পড়াশোনার পাশাপাশি আমি একজন শিক্ষক, শান্তিচক্র ব্লাড সোসাইটির সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক, এবং BNCC-এর একজন সক্রিয় ক্যাডেট।
                  </p>
                  <p className="text-muted-foreground bn leading-relaxed">
                    ওয়েব ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স, কনটেন্ট ক্রিয়েশন এবং সামাজিক সেবা — এই বিষয়গুলো নিয়ে কাজ করতে ভালোবাসি। আমার লক্ষ্য শিক্ষা ও প্রযুক্তির মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনা।
                  </p>

                  {/* Interests */}
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                      {isBn ? "আমার আগ্রহ" : "My Interests"}
                    </h4>
                    <StaggerContainer>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <StaggerItem key={interest.label}>
                            <Badge variant="glow" className="bn">
                              <interest.icon className="mr-1 h-3 w-3" />
                              {interest.label}
                            </Badge>
                          </StaggerItem>
                        ))}
                      </div>
                    </StaggerContainer>
                  </div>
                </div>
              </GlassCard>
            </FadeInLeft>
          </div>

          {/* Right: Info Cards */}
          <div className="lg:col-span-2">
            <FadeInRight>
              <StaggerContainer className="space-y-3">
                {personalInfo.map((info) => (
                  <StaggerItem key={info.label}>
                    <GlassCard className="flex items-center gap-4 !p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        <p className="truncate font-semibold bn">{info.value}</p>
                      </div>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeInRight>
          </div>
        </div>

        {/* Quote */}
        <FadeInUp delay={0.3}>
          <div className="mt-12 text-center">
            <GlassCard className="border-l-4 border-l-primary mx-auto max-w-2xl">
              <p className="text-lg italic text-muted-foreground bn">
                &ldquo;মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।&rdquo;
              </p>
              <Badge variant="glow" className="mt-4">
                — রাহাত আহমেদ
              </Badge>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
