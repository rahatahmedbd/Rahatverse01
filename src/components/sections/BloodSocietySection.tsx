"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { Counter } from "@/components/animations/Counter";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { motion } from "framer-motion";
import {
  Droplets,
  Users,
  Heart,
  Siren,
  MessageCircle,
  Database,
  ExternalLink,
} from "lucide-react";

// ── Blood Society Section ──────────────────────────────
interface BloodSocietySectionProps {
  locale?: string;
}

export function BloodSocietySection({ locale = "bn" }: BloodSocietySectionProps) {
  const isBn = locale === "bn";

  const activities = [
    {
      icon: Users,
      title: isBn ? "রক্তদাতা ব্যবস্থাপনা" : "Donor Management",
      description: isBn ? "জরুরি মুহূর্তে দ্রুত রক্তদাতা খুঁজে পাওয়া নিশ্চিত করা" : "Ensuring quick access to blood donors in emergencies",
    },
    {
      icon: MessageCircle,
      title: isBn ? "স্বেচ্ছাসেবক সমন্বয়" : "Volunteer Coordination",
      description: isBn ? "সংগঠনের স্বেচ্ছাসেবকদের কার্যক্রম পরিচালনা ও প্রশিক্ষণ" : "Managing and training organization volunteers",
    },
    {
      icon: Heart,
      title: isBn ? "সচেতনতা প্রচারাভিযান" : "Awareness Campaigns",
      description: isBn ? "রক্তদানের গুরুত্ব সম্পর্কে জনসাধারণকে সচেতন করা" : "Raising public awareness about blood donation",
    },
    {
      icon: Siren,
      title: isBn ? "জরুরি সহায়তা" : "Emergency Support",
      description: isBn ? "২৪/৭ জরুরি রক্তের প্রয়োজনে সহায়তা প্রদান" : "24/7 emergency blood assistance",
    },
    {
      icon: Droplets,
      title: isBn ? "ব্লাড ক্যাম্প" : "Blood Camps",
      description: isBn ? "নিয়মিত রক্তদান ক্যাম্প আয়োজন ও পরিচালনা" : "Regular blood donation camps organization",
    },
    {
      icon: Database,
      title: isBn ? "ডোনার ডেটাবেস" : "Donor Database",
      description: isBn ? "নিয়মিত দাতাদের তথ্য সংগ্রহ ও ব্যবস্থাপনা" : "Regular donor information collection and management",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🩸 রক্তই জীবন" : "🩸 Blood is Life"}
          title="Shantichakra Blood Society"
          titleBn="শান্তিচক্র ব্লাড সোসাইটি"
          subtitle={
            isBn
              ? "সুনামগঞ্জ ভিত্তিক একটি স্বেচ্ছাসেবী রক্তদান সংগঠন — যেখানে প্রতিটি ফোঁটা রক্ত একটি জীবন বাঁচায়"
              : "A voluntary blood donation organization based in Sunamganj"
          }
          locale={locale}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Role & Description */}
          <div className="lg:col-span-2">
            <FadeInLeft>
              <GlassCard className="h-full border-l-4 border-l-red-500/50">
                <div className="mb-4">
                  <Badge variant="warning" className="mb-3">
                    {isBn ? "আমার ভূমিকা" : "My Role"}
                  </Badge>
                  <h3 className="text-xl font-bold bn">
                    {isBn ? "সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক" : "Co-Founder & General Secretary"}
                  </h3>
                </div>

                <p className="text-muted-foreground bn leading-relaxed">
                  {isBn
                    ? "২০২৫ সালে শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ প্রতিষ্ঠায় সক্রিয় ভূমিকা রাখি এবং বর্তমানে সাধারণ সম্পাদক হিসেবে রক্তদাতা ব্যবস্থাপনা, স্বেচ্ছাসেবক সমন্বয় ও সচেতনতামূলক কার্যক্রম পরিচালনার দায়িত্ব পালন করছি।"
                    : "Played an active role in establishing Shantichakra Blood Society Sunamganj in 2025, currently serving as General Secretary managing donor coordination, volunteer management, and awareness campaigns."}
                </p>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { value: 4, suffix: "", label: isBn ? "বার রক্তদান" : "Donations" },
                    { value: 0, suffix: "", label: "A+", labelExtra: isBn ? "আমার গ্রুপ" : "My Group" },
                    { value: 2025, suffix: "", label: isBn ? "প্রতিষ্ঠার সাল" : "Founded" },
                    { value: 100, suffix: "+", label: isBn ? "জীবন বাঁচানোর অঙ্গীকার" : "Lives Committed" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <Counter
                        to={stat.value}
                        suffix={stat.suffix}
                        className="text-2xl font-bold text-red-400"
                      />
                      <p className="mt-1 text-xs text-muted-foreground bn">
                        {stat.labelExtra || stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeInLeft>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col gap-4">
            <FadeInRight>
              <GlassCard className="text-center border-red-500/20">
                <motion.div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Droplets className="h-8 w-8 text-red-400" />
                </motion.div>
                <h4 className="text-lg font-bold bn">{isBn ? "রক্তদানে আগ্রহী?" : "Interested in Donating?"}</h4>
                <p className="mt-2 text-sm text-muted-foreground bn">
                  {isBn
                    ? "আপনার একটু সাহায্য কারো পরিবারের হাসি ফিরিয়ে আনতে পারে।"
                    : "Your help can bring a smile back to someone's family."}
                </p>
                <Button variant="gradient" size="lg" className="mt-4 w-full" asChild>
                  <a href="https://www.facebook.com/share/g/192g4S4brD/" target="_blank" rel="noopener noreferrer">
                    {isBn ? "ফেসবুক গ্রুপে জয়েন করুন" : "Join Facebook Group"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </GlassCard>
            </FadeInRight>

            <FadeInRight delay={0.2}>
              <GlassCard className="text-center">
                <p className="text-sm italic text-muted-foreground bn">
                  {isBn
                    ? "নিশ্চয়ই আমরা আল্লাহর জন্য এবং নিশ্চয়ই আমরা তাঁর দিকেই ফিরে যাব"
                    : "Indeed we belong to Allah, and indeed to Him we will return"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ۞ ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন ۞
                </p>
              </GlassCard>
            </FadeInRight>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mt-12">
          <FadeInUp>
            <h3 className="mb-6 text-center text-xl font-bold bn">
              {isBn ? "আমাদের কার্যক্রম" : "Our Activities"}
            </h3>
          </FadeInUp>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <StaggerItem key={activity.title}>
                <GlassCard className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <activity.icon className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold bn">{activity.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground bn">{activity.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
