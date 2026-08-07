"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "./ProfileImage";
import { TypingAnimation } from "@/components/interactive/TypingAnimation";
import {
  ParallaxOrb,
  OrbitingRings,
  Parallax3DContainer,
} from "@/components/interactive";
import { FadeInUp, FadeInDown } from "@/components/animations/FadeIn";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ScrollIndicator } from "@/components/animations/ScrollProgress";
import { Sparkles, Zap, Eye, MessageCircle, Star, Award, Heart, Code, Users, ShoppingCart, Briefcase, GraduationCap, Droplets, Trophy, Mail } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import Link from "next/link";
import type { HeroConfig } from "@/types/hero";
import type { AboutConfig } from "@/types/about";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";

// ── Icon map for dynamic CTAs ────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Eye,
  MessageCircle,
  Sparkles,
  Star,
  Award,
  Heart,
  Code,
  Users,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Droplets,
  Trophy,
  Mail,
};

function getIcon(name: string) {
  return ICON_MAP[name] ?? Sparkles;
}

// ── Hero Section ───────────────────────────────────────
// Phase 2: 100% admin-controllable via site_settings.hero_config (with fallback)

interface HeroSectionProps {
  locale?: string;
  aboutConfig?: AboutConfig;
}

export function HeroSection({ locale = "bn", aboutConfig }: HeroSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);

  useEffect(() => {
    let alive = true;
    fetch("/api/hero-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        const validated = validateHeroConfig(json.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!config.visible) return null;

  const taglines = isBn ? config.typewriter.bn : config.typewriter.en;
  const welcomeText = isBn ? config.intro.welcomeTextBn : config.intro.welcomeTextEn;

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

      {/* Ambient Glow & Phase I Parallax Orb */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <ParallaxOrb size="xl" color="primary" />
        <OrbitingRings size="lg" className="opacity-70" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Badge - admin editable welcome */}
        <FadeInDown delay={0.5}>
          <Badge variant="gradient" className="mb-6 text-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            {welcomeText}
          </Badge>
        </FadeInDown>

        {/* Profile Image with Phase I 3D Mouse Parallax */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <Parallax3DContainer intensity={14} className="inline-block">
            <ProfileImage
              size="lg"
              src={aboutConfig?.profileImage.url || undefined}
              publicId={aboutConfig?.profileImage.publicId}
              alt={isBn ? aboutConfig?.profileImage.altBn : aboutConfig?.profileImage.altEn}
              frame={aboutConfig?.profileImage.frame}
              showStatus={aboutConfig?.profileImage.showStatus}
              statusLabel={isBn ? aboutConfig?.profileImage.statusLabelBn : aboutConfig?.profileImage.statusLabelEn}
            />
          </Parallax3DContainer>
        </motion.div>

        {/* Name */}
        <FadeInUp delay={0.6}>
          <h1 className="bn text-display-xl font-bold">
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

        {/* Role Badges - admin reorderable */}
        {config.badges.length > 0 && (
          <FadeInUp delay={1.0}>
            <div className="mt-3 mb-2 flex flex-wrap justify-center gap-2">
              {config.badges.map((b) => (
                <Badge key={b.id} variant="glow" className="bn text-xs px-3 py-1 font-medium">
                  {isBn ? b.labelBn : b.labelEn}
                </Badge>
              ))}
            </div>
          </FadeInUp>
        )}

        {/* Description */}
        <FadeInUp delay={1.2}>
          <p className="text-lead mx-auto mt-6 max-w-xl text-muted-foreground bn">
            {isBn
              ? "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য। সুনামগঞ্জ থেকে স্বপ্ন দেখি একটি উন্নত ও সমৃদ্ধ ডিজিটাল বিশ্ব গড়ে তোলার।"
              : "My goal is to stand by people through education, social service, and technology. From Sunamganj, I dream of building a better digital world."}
          </p>
        </FadeInUp>

        {/* CTA Buttons - admin editable, pulse per button */}
        <FadeInUp delay={1.5}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {config.ctas.map((cta) => {
              const Icon = getIcon(cta.icon);
              const variant = cta.variant as "gradient" | "glass" | "outline";
              return (
                <Button
                  key={cta.id}
                  variant={variant}
                  size="lg"
                  asChild
                  className={cta.pulse ? "animate-pulse shadow-lg shadow-amber-500/20" : ""}
                >
                  <Link href={cta.href.startsWith("/") ? `/${locale}${cta.href}` : cta.href}>
                    <Icon className="h-4 w-4" />
                    {isBn ? cta.labelBn : cta.labelEn}
                  </Link>
                </Button>
              );
            })}
          </div>
        </FadeInUp>

        {/* Quick Stats - admin editable floating counters */}
        <FadeInUp delay={1.8}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {config.counters.map((stat) => (
              <div key={stat.id} className="glass rounded-xl px-4 py-3">
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="text-2xl font-bold text-primary sm:text-3xl"
                />
                <p className="mt-1 text-xs text-muted-foreground bn sm:text-sm">
                  {isBn ? stat.labelBn : stat.labelEn}
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
