"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "./ProfileImage";
import { TypingAnimation } from "@/components/interactive/TypingAnimation";
import { FadeInUp, FadeInDown } from "@/components/animations/FadeIn";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ScrollIndicator } from "@/components/animations/ScrollProgress";
import { Sparkles, Zap, Eye, MessageCircle } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import Link from "next/link";

// ── Hero Section ───────────────────────────────────────
// The main cinematic hero for the landing page

interface HeroSectionProps {
  locale?: string;
}

export function HeroSection({ locale = "bn" }: HeroSectionProps) {
  const isBn = locale === "bn";

  const taglines = isBn
    ? [
        "ওয়েব ডেভেলপার",
        "শিক্ষার্থী",
        "গৃহশিক্ষক",
        "রক্তদাতা",
        "BNCC ক্যাডেট",
      ]
    : [
        "Web Developer",
        "Student",
        "Teacher",
        "Blood Donor",
        "BNCC Cadet",
      ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0">
        <ParticleBackground
          particleCount={40}
          speed={0.2}
          mouseInteraction={true}
        />
      </div>

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <FadeInDown delay={0.5}>
          <Badge variant="gradient" className="mb-6 text-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            {isBn ? "স্বাগতম আমার ডিজিটাল জগতে" : "Welcome to my digital world"}
          </Badge>
        </FadeInDown>

        {/* Profile Image */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <ProfileImage size="lg" />
        </motion.div>

        {/* Name */}
        <FadeInUp delay={0.6}>
          <h1 className="bn text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient">রাহাত আহমেদ</span>
          </h1>
          <p className="mt-1 text-lg text-muted-foreground sm:text-xl">
            Rahat Ahmed
          </p>
        </FadeInUp>

        {/* Typing Animation */}
        <FadeInUp delay={0.9}>
          <div className="mt-4 h-10">
            <span className="text-lg text-muted-foreground sm:text-xl">
              {isBn ? "আমি একজন " : "I am a "}
            </span>
            <TypingAnimation
              texts={taglines}
              className="text-lg font-semibold text-primary sm:text-xl"
              typingSpeed={80}
              deletingSpeed={40}
            />
          </div>
        </FadeInUp>

        {/* Description */}
        <FadeInUp delay={1.2}>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground bn">
            শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।
            সুনামগঞ্জ থেকে স্বপ্ন দেখি একটিbetter digital world গড়ার।
          </p>
        </FadeInUp>

        {/* CTA Buttons */}
        <FadeInUp delay={1.5}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild>
              <Link href={`/${locale}/order`}>
                <Zap className="h-4 w-4" />
                {isBn ? "ওয়েবসাইট অর্ডার করুন" : "Order a Website"}
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link href={`/${locale}/#projects`}>
                <Eye className="h-4 w-4" />
                {isBn ? "প্রজেক্ট দেখুন" : "View Projects"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${locale}/contact`}>
                <MessageCircle className="h-4 w-4" />
                {isBn ? "যোগাযোগ" : "Contact"}
              </Link>
            </Button>
          </div>
        </FadeInUp>

        {/* Quick Stats */}
        <FadeInUp delay={1.8}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: 10, suffix: "+", label: isBn ? "অর্জন" : "Achievements" },
              { value: 5, suffix: "×", label: isBn ? "১ম স্থান" : "1st Places" },
              { value: 4, suffix: "", label: isBn ? "রক্তদান" : "Blood Donations" },
              { value: 3, suffix: "×", label: "GPA 5.00", labelBn: "GPA 5.00" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl px-4 py-3"
              >
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="text-2xl font-bold text-primary sm:text-3xl"
                />
                <p className="mt-1 text-xs text-muted-foreground bn sm:text-sm">
                  {isBn && stat.labelBn ? stat.labelBn : stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 lg:bottom-8">
        <ScrollIndicator />
      </div>
    </section>
  );
}
