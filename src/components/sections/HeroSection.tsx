"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroProjectPreview } from "./HeroProjectPreview";
import { HoverCard3D, Parallax3DContainer } from "@/components/interactive";
import { FadeInUp, FadeInDown } from "@/components/animations/FadeIn";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ScrollIndicator } from "@/components/animations/ScrollProgress";
import { Sparkles, Zap, Eye, MessageCircle, Star, Award, Heart, Code, Users, ShoppingCart, Briefcase, GraduationCap, Droplets, Trophy, Mail, ArrowRight, Rocket } from "lucide-react";
import { Counter } from "@/components/animations/Counter";
import Link from "next/link";
import type { HeroConfig, HeroCTA } from "@/types/hero";
import type { AboutConfig } from "@/types/about";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";
import { trackEvent } from "@/lib/analytics/tracker";

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
  Rocket,
};

function getIcon(name: string) {
  return ICON_MAP[name] ?? Sparkles;
}

// Phase 6: hero shows exact localized labels from the CMS — primary
// "Order a Website" / "ওয়েবসাইট অর্ডার করুন" and secondary
// "View Work & Proof" / "কাজ ও প্রমাণ দেখুন". No shortening.
function getDisplayLabel(cta: HeroCTA, isBn: boolean): string {
  return isBn ? cta.labelBn : cta.labelEn;
}

interface HeroSectionProps {
  locale?: string;
  aboutConfig?: AboutConfig;
  heroConfig?: HeroConfig;
}

export function HeroSection({ locale = "bn", aboutConfig, heroConfig }: HeroSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<HeroConfig>(heroConfig ?? DEFAULT_HERO_CONFIG);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (heroConfig) return;
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
  }, [heroConfig]);

  // Phase 6: only two hero CTAs — primary (order) + one secondary (proof).
  const { primaryCta, secondaryCtas } = useMemo(() => {
    const primary = config.ctas.find((c) => c.variant === "gradient") ?? config.ctas[0];
    const secondaries = config.ctas.filter((c) => c.id !== primary?.id).slice(0, 1);
    return { primaryCta: primary, secondaryCtas: secondaries };
  }, [config.ctas]);

  if (!config.visible) return null;

  const welcomeText = isBn ? config.intro.welcomeTextBn : config.intro.welcomeTextEn;

  return (
    <section
      className="relative overflow-x-clip py-5 sm:py-6 lg:py-8"
      aria-label={isBn ? "হিরো সেকশন" : "Hero section"}
    >
      {/* Particle Background — adaptive quality, reduced motion handled inside component */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParticleBackground
          particleCount={isMobile ? 12 : 28}
          speed={isMobile ? 0.08 : 0.14}
          mouseInteraction={!isMobile && !prefersReducedMotion}
          quality={isMobile ? "low" : "medium"}
        />
      </div>

      {/* Restrained studio lighting and architectural guide lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center" aria-hidden="true">
        <div className="absolute top-[42%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.07] blur-3xl lg:h-[560px] lg:w-[560px]" />
        <div className="absolute right-[8%] top-[14%] h-64 w-64 rounded-full bg-blue-500/[0.045] blur-3xl lg:h-80 lg:w-80" />
        <div className="absolute inset-y-[8%] left-[8%] w-px bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
        <div className="absolute inset-y-[8%] right-[8%] w-px bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
        <div className="absolute inset-x-[5%] bottom-[7%] h-px bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />
      </div>

      {/* Content container — 320..1536+ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — Intro, Name, Description, CTAs */}
          <div className="order-1 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <FadeInDown delay={prefersReducedMotion ? 0 : 0.4}>
              <Badge variant="gradient" className="mb-3 text-xs font-medium sm:mb-4 sm:text-sm">
                <Sparkles className="mr-1 h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{welcomeText}</span>
              </Badge>
            </FadeInDown>

            <FadeInUp delay={prefersReducedMotion ? 0 : 0.5}>
              <h1 className="bn text-display-xl font-bold tracking-[-0.02em]">
                <span className="text-gradient-name hero-name-shine" data-fx>{isBn ? "রাহাত আহমেদ" : "Rahat Ahmed"}</span>
              </h1>
              {/* Clear client-facing headline — what a visitor can hire me for */}
              <p className="mt-1.5 text-lg font-bold tracking-[-0.01em] text-foreground sm:text-xl lg:text-2xl">
                <span className="text-gradient bn">
                  {isBn
                    ? "আধুনিক ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি করি"
                    : "I build modern websites & web applications"}
                </span>
              </p>
              <p className="mt-1 text-[15px] font-medium tracking-[-0.01em] text-muted-foreground sm:text-lg lg:text-xl">
                {isBn ? "ওয়েব ডেভেলপার — RahatVerse-এর স্রষ্টা" : "Web Developer — creator of RahatVerse"}
              </p>
            </FadeInUp>

            {config.badges.length > 0 && (
              <FadeInUp delay={prefersReducedMotion ? 0 : 0.65}>
                <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:justify-start" role="list" aria-label={isBn ? "দক্ষতা" : "Skills"}>
                  {config.badges.map((b) => (
                    <Badge key={b.id} variant="glow" className="bn rounded-full px-3 py-1 text-xs font-medium leading-none" role="listitem">
                      {isBn ? b.labelBn : b.labelEn}
                    </Badge>
                  ))}
                </div>
              </FadeInUp>
            )}

            <FadeInUp delay={prefersReducedMotion ? 0 : 0.8}>
              <p className="mx-auto mt-3 max-w-[30ch] text-pretty text-[14.5px] leading-relaxed text-muted-foreground bn sm:max-w-xl lg:mx-0 lg:max-w-[42ch] xl:max-w-[48ch] sm:text-[15.5px] lg:text-lead">
                {isBn
                  ? "ব্যবসা, স্টার্টআপ ও ব্যক্তিগত ব্র্যান্ডের জন্য দ্রুত, রেসপনসিভ ও SEO-রেডি ওয়েবসাইট — Next.js, React ও TypeScript দিয়ে তৈরি। আইডিয়া থেকে লঞ্চ পর্যন্ত পুরো যাত্রায় আমি পাশে থাকি।"
                  : "Fast, responsive and SEO-ready websites for businesses, startups and personal brands — built with Next.js, React and TypeScript. From idea to launch, I handle the whole journey."}
              </p>
            </FadeInUp>

            {/* CTA Hierarchy — exactly 2 CTAs per Phase 6, preserved */}
            <FadeInUp delay={prefersReducedMotion ? 0 : 0.95}>
              <div className="hero-cta-group mx-auto mt-4 flex w-full max-w-[340px] flex-col items-stretch gap-2.5 sm:mt-5 sm:max-w-none sm:items-center lg:mx-0 lg:items-start sm:gap-3" data-testid="hero-cta">
                {primaryCta &&
                  (() => {
                    const label = getDisplayLabel(primaryCta, isBn);
                    const href = primaryCta.href.startsWith("/") ? `/${locale}${primaryCta.href}` : primaryCta.href;
                    return (
                      <div className="relative w-full sm:w-auto">
                        {/* Rotating aurora halo — AnimationGovernor pauses it off-screen */}
                        {!prefersReducedMotion && (
                          <span className="cta-halo pointer-events-none" data-fx aria-hidden="true" />
                        )}
                        <Button
                          variant="gradient"
                          size="lg"
                          asChild
                          className="group relative w-full justify-between gap-3 rounded-xl px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] sm:w-auto sm:min-w-[300px] sm:justify-center sm:px-7 min-h-[46px]"
                          aria-label={label}
                        >
                          <Link
                            href={href}
                            onClick={() =>
                              trackEvent("cta_click", {
                                category: "conversion",
                                label: primaryCta.id,
                                metadata: { cta_id: primaryCta.id, location: "hero", locale },
                              })
                            }
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/10 backdrop-blur" aria-hidden="true">
                                <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                              </span>
                              <span className="text-white">{label}</span>
                            </span>
                            <ArrowRight
                              className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-active:translate-x-0.5"
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
                      const variant = isViewProjects ? ("glass" as const) : ("outline" as const);
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
                          className="group flex-1 justify-center gap-2 rounded-xl px-4 text-[13.5px] font-semibold tracking-[-0.01em] sm:flex-initial sm:min-w-[148px] sm:px-6 sm:text-[14px] min-h-[44px]"
                          aria-label={label}
                        >
                          <Link
                            href={href}
                            onClick={() =>
                              trackEvent("cta_click", {
                                category: "conversion",
                                label: cta.id,
                                metadata: { cta_id: cta.id, location: "hero", locale },
                              })
                            }
                          >
                            <UseIcon
                              className="h-4 w-4 shrink-0 opacity-90 transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
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

          {/* RIGHT — Project preview (prominent) with the developer photo as a
              small secondary chip. Clients see the work first, the face second. */}
          <motion.div
            className="order-2 flex justify-center lg:order-2 lg:justify-end xl:justify-center"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.92 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <Parallax3DContainer intensity={prefersReducedMotion ? 0 : 10} className="inline-block w-full max-w-[520px]">
              <HeroProjectPreview locale={locale} aboutConfig={aboutConfig} />
            </Parallax3DContainer>
          </motion.div>
        </div>

        {/* Stats — horizontal scrollable row on mobile */}
        <FadeInUp delay={prefersReducedMotion ? 0 : 1.15}>
          <div
            className={`mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:mt-8 sm:grid sm:gap-3 sm:overflow-visible sm:pb-0 sm:snap-none ${
              config.counters.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
            }`}
            role="list"
            aria-label={isBn ? "পরিসংখ্যান" : "Statistics"}
          >
            {config.counters.map((stat) => (
              <div
                key={stat.id}
                role="listitem"
                className="glass group relative min-w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/[0.06] px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.14)] transition-colors duration-200 hover:border-white/[0.09] sm:min-w-0 sm:shrink sm:snap-none sm:px-4 sm:py-4"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" aria-hidden="true" />
                <Counter to={stat.value} suffix={stat.suffix} className="text-[22px] font-bold tracking-[-0.02em] text-primary sm:text-3xl" />
                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-tight text-muted-foreground bn sm:text-sm">
                  {isBn ? stat.labelBn : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>

      {/* In-flow scroll hint — no extra viewport height required */}
      <div className="mt-5 hidden justify-center lg:flex" aria-hidden="true">
        <ScrollIndicator />
      </div>
    </section>
  );
}
