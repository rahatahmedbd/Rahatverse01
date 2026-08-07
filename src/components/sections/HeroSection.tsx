"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "./ProfileImage";
import {
  ParallaxOrb,
  OrbitingRings,
  Parallax3DContainer,
} from "@/components/interactive";
import { FadeInUp, FadeInDown } from "@/components/animations/FadeIn";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ScrollIndicator } from "@/components/animations/ScrollProgress";
import { Sparkles, Zap, Eye, MessageCircle, Star, Award, Heart, Code, Users, ShoppingCart, Briefcase, GraduationCap, Droplets, Trophy, Mail, ArrowRight } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import Link from "next/link";
import type { HeroConfig, HeroCTA } from "@/types/hero";
import type { AboutConfig } from "@/types/about";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";

// ── Icon map ───────────────────────────────────────
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

function getDisplayLabel(cta: HeroCTA, isBn: boolean): string {
  if (cta.id === "cta-contact") return isBn ? "চলুন কথা বলি" : "Let's Talk";
  if (cta.id === "cta-order") {
    const isDefaultEn = cta.labelEn.trim().toLowerCase() === "order a website";
    const isDefaultBn = cta.labelBn.trim() === "ওয়েবসাইট অর্ডার করুন";
    if (isBn && isDefaultBn) return "প্রজেক্ট শুরু করুন";
    if (!isBn && isDefaultEn) return "Start a Project";
  }
  return isBn ? cta.labelBn : cta.labelEn;
}

interface HeroSectionProps {
  locale?: string;
  aboutConfig?: AboutConfig;
}

export function HeroSection({ locale = "bn", aboutConfig }: HeroSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  const { primaryCta, secondaryCtas } = useMemo(() => {
    const primary =
      config.ctas.find((c) => c.variant === "gradient") ?? config.ctas[0];
    const secondaries = config.ctas.filter((c) => c.id !== primary?.id);
    return { primaryCta: primary, secondaryCtas: secondaries };
  }, [config.ctas]);

  if (!config.visible) return null;

  const welcomeText = isBn ? config.intro.welcomeTextBn : config.intro.welcomeTextEn;

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden py-8 sm:py-12 lg:min-h-[86vh] lg:py-16 xl:py-20">
      {/* Particle Background — reduced on mobile for performance */}
      <div className="absolute inset-0">
        <ParticleBackground
          particleCount={isMobile ? 18 : 32}
          speed={isMobile ? 0.12 : 0.18}
          mouseInteraction={!isMobile}
        />
      </div>

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <ParallaxOrb size="xl" color="primary" />
        <OrbitingRings size="lg" className="opacity-60 lg:opacity-70" />
        <div className="absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-3xl lg:h-[500px] lg:w-[500px]" />
        <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-blue-500/[0.04] blur-3xl lg:h-64 lg:w-64" />
        <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-purple-500/[0.04] blur-3xl lg:h-64 lg:w-64" />
      </div>

      {/* Content container — 320..1536+ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Two-column composition: mobile vertical (profile top), desktop balanced */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* LEFT — Intro, Name, Description, CTAs (order 2 on mobile, 1 on desktop) */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            {/* Badge */}
            <FadeInDown delay={0.4}>
              <Badge variant="gradient" className="mb-4 text-xs font-medium sm:mb-6 sm:text-sm">
                <Sparkles className="mr-1 h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{welcomeText}</span>
              </Badge>
            </FadeInDown>

            {/* Name */}
            <FadeInUp delay={0.5}>
              <h1 className="bn text-display-xl font-bold tracking-[-0.02em]">
                <span className="text-gradient">রাহাত আহমেদ</span>
              </h1>
              <p className="mt-1 text-[15px] font-medium tracking-[-0.01em] text-muted-foreground sm:text-lg lg:text-xl">
                Rahat Ahmed
              </p>
            </FadeInUp>

            {/* Role Badges */}
            {config.badges.length > 0 && (
              <FadeInUp delay={0.65}>
                <div className="mt-3.5 flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:justify-start">
                  {config.badges.map((b) => (
                    <Badge key={b.id} variant="glow" className="bn rounded-full px-3 py-1 text-xs font-medium leading-none">
                      {isBn ? b.labelBn : b.labelEn}
                    </Badge>
                  ))}
                </div>
              </FadeInUp>
            )}

            {/* Description */}
            <FadeInUp delay={0.8}>
              <p className="mx-auto mt-4 max-w-[30ch] text-pretty text-[14.5px] leading-[1.75] text-muted-foreground bn sm:max-w-xl lg:mx-0 lg:max-w-[42ch] xl:max-w-[48ch] sm:text-[15.5px] lg:text-lead">
                {isBn
                  ? "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য। সুনামগঞ্জ থেকে স্বপ্ন দেখি একটি উন্নত ও সমৃদ্ধ ডিজিটাল বিশ্ব গড়ে তোলার।"
                  : "My goal is to stand by people through education, social service, and technology. From Sunamganj, I dream of building a better digital world."}
              </p>
            </FadeInUp>

            {/* CTA Hierarchy */}
            <FadeInUp delay={0.95}>
              <div className="mx-auto mt-6 flex w-full max-w-[340px] flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:items-center lg:mx-0 lg:items-start sm:gap-4">
                {primaryCta && (() => {
                  const label = getDisplayLabel(primaryCta, isBn);
                  const href = primaryCta.href.startsWith("/") ? `/${locale}${primaryCta.href}` : primaryCta.href;
                  return (
                    <div className="relative w-full sm:w-auto">
                      <div
                        className="pointer-events-none absolute inset-x-3 -bottom-3 h-10 rounded-full bg-gradient-to-r from-amber-500/14 via-orange-500/10 to-violet-500/10 blur-2xl sm:inset-x-6"
                        aria-hidden="true"
                      />
                      <Button
                        variant="gradient"
                        size="lg"
                        asChild
                        className="group relative w-full justify-between gap-3 rounded-xl px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] sm:w-auto sm:min-w-[300px] sm:justify-center sm:px-7"
                        aria-label={label}
                      >
                        <Link href={href}>
                          <span className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/10 backdrop-blur">
                              <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                            </span>
                            <span className="text-white">{label}</span>
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-active:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    </div>
                  );
                })()}

                {secondaryCtas.length > 0 && (
                  <div className="flex w-full items-stretch gap-3 sm:w-auto sm:gap-4">
                    {secondaryCtas.map((cta) => {
                      const isViewProjects = cta.id === "cta-portfolio" || cta.href.includes("portfolio");
                      const variant = isViewProjects ? "glass" as const : "outline" as const;
                      const Icon = getIcon(cta.icon);
                      const label = getDisplayLabel(cta, isBn);
                      const href = cta.href.startsWith("/") ? `/${locale}${cta.href}` : cta.href;
                      const VisualIcon = isViewProjects ? Eye : MessageCircle;
                      const UseIcon = ICON_MAP[cta.icon] ? Icon : VisualIcon;
                      return (
                        <Button
                          key={cta.id}
                          variant={variant}
                          size="lg"
                          asChild
                          className="group flex-1 justify-center gap-2 rounded-xl px-4 text-[13.5px] font-semibold tracking-[-0.01em] sm:flex-initial sm:min-w-[148px] sm:px-6 sm:text-[14px]"
                          aria-label={label}
                        >
                          <Link href={href}>
                            <UseIcon
                              className="h-4 w-4 shrink-0 opacity-90 transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
                              aria-hidden="true"
                            />
                            <span className="truncate">{label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </FadeInUp>
          </div>

          {/* RIGHT — Profile Image (order 1 on mobile, 2 on desktop) */}
          <motion.div
            className="order-1 flex justify-center lg:order-2 lg:justify-end xl:justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <Parallax3DContainer intensity={10} className="inline-block">
              <ProfileImage
                size="lg"
                src={aboutConfig?.profileImage.url || undefined}
                publicId={aboutConfig?.profileImage.publicId}
                alt={isBn ? aboutConfig?.profileImage.altBn : aboutConfig?.profileImage.altEn}
                frame={aboutConfig?.profileImage.frame}
                showStatus={aboutConfig?.profileImage.showStatus}
                statusLabel={isBn ? aboutConfig?.profileImage.statusLabelBn : aboutConfig?.profileImage.statusLabelEn}
                animatedCaption={isBn ? config.typewriter.bn : config.typewriter.en}
              />
            </Parallax3DContainer>
          </motion.div>
        </div>

        {/* Stats — full width below, 2 cols mobile / 4 cols tablet+ */}
        <FadeInUp delay={1.15}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-4 lg:mt-14">
            {config.counters.map((stat) => (
              <div
                key={stat.id}
                className="glass group relative overflow-hidden rounded-2xl border border-white/[0.06] px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.14)] transition-colors duration-300 hover:border-white/[0.09] sm:px-4 sm:py-5"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" aria-hidden="true" />
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="text-[22px] font-bold tracking-[-0.02em] text-primary sm:text-3xl"
                />
                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-tight text-muted-foreground bn sm:text-sm">
                  {isBn ? stat.labelBn : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>

      {/* Scroll Indicator — hidden on small mobile to avoid nav overlap, visible on tablet/desktop */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:flex">
        <ScrollIndicator />
      </div>
      <div className="pointer-events-none absolute bottom-[7.5rem] left-1/2 hidden -translate-x-1/2 sm:flex lg:hidden">
        <ScrollIndicator />
      </div>
      <div className="absolute bottom-[7.25rem] left-1/2 -translate-x-1/2 sm:hidden">
        <motion.div
          className="flex flex-col items-center gap-1.5 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          aria-hidden="true"
        >
          <span className="h-6 w-px rounded-full bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
