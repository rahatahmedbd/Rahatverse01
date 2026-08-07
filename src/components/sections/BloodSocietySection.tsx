"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { Counter } from "@/components/animations/Counter";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { motion } from "framer-motion";
import { Siren, MapPin, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { ExperienceIcon } from "@/lib/experience/icons";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { IMAGE_IDS } from "@/lib/cloudinary/utils";
import type { BloodStat, ExperienceConfig } from "@/types/experience";

// ── Blood Society Section (DB-driven) ──────────────────
interface BloodSocietySectionProps {
  locale?: string;
}

export function BloodSocietySection({ locale = "bn" }: BloodSocietySectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ExperienceConfig>(DEFAULT_EXPERIENCE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/experience-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateExperienceConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "লোড হচ্ছে..." : "Loading..."}
      </div>
    );
  }

  const blood = config.blood;
  const { section, stats, activities, cta, emergency, roleBadgeBn, roleBadgeEn, roleTitleBn, roleTitleEn, roleBodyBn, roleBodyEn } = blood;
  const activitiesSectionTitleBn = blood.activitiesSectionTitleBn;
  const activitiesSectionTitleEn = blood.activitiesSectionTitleEn;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Role & Description */}
          <div className="lg:col-span-2">
            <FadeInLeft>
              <GlassCard className="h-full border-l-4 border-l-red-500/50">
                <div className="mb-4">
                  <Badge variant="warning" className="mb-3">
                    {isBn ? roleBadgeBn : roleBadgeEn}
                  </Badge>
                  <h3 className="text-xl font-bold bn">
                    {isBn ? roleTitleBn : roleTitleEn}
                  </h3>
                </div>

                <div className="my-4 h-60 w-full overflow-hidden rounded-xl border border-red-500/20 shadow-md">
                  <CloudinaryImage
                    publicId={IMAGE_IDS.SHANTICHAKRA_ACTIVITIES}
                    alt={isBn ? "শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম" : "Shantichakra Blood Society Activities"}
                    width={800}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground bn leading-relaxed">
                  {isBn ? roleBodyBn : roleBodyEn}
                </p>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <StatCell key={stat.id} stat={stat} isBn={isBn} />
                  ))}
                </div>

                {/* Emergency hotline */}
                {emergency.hotlineNumber && (
                  <div className="mt-6 flex flex-col gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Siren className="h-5 w-5 shrink-0 text-red-400" />
                      <div>
                        <p className="text-sm font-semibold bn">{isBn ? emergency.hotlineBn : emergency.hotlineEn}</p>
                        <p className="text-sm font-mono text-red-400">{emergency.hotlineNumber}</p>
                      </div>
                    </div>
                    {emergency.whatsappLink && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={emergency.whatsappLink} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {isBn ? emergency.whatsappLabelBn : emergency.whatsappLabelEn}
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* Coverage areas */}
                {emergency.coverageAreas && emergency.coverageAreas.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground bn">
                      <MapPin className="h-3 w-3" />
                      {isBn ? emergency.coverageTitleBn : emergency.coverageTitleEn}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {emergency.coverageAreas.map((area) => (
                        <Badge key={area.id} variant="outline" className="text-[10px]">
                          {isBn ? area.nameBn : area.nameEn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </FadeInLeft>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col gap-4">
            <FadeInRight>
              <GlassCard className="text-center border-red-500/20">
                <motion.div
                  className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/30 bg-card p-1 shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CloudinaryImage
                    publicId={IMAGE_IDS.SHANTICHAKRA_LOGO}
                    alt={isBn ? "শান্তিচক্র ব্লাড সোসাইটি লোগো" : "Shantichakra Blood Society Logo"}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </motion.div>
                <h4 className="text-lg font-bold bn">{isBn ? cta.headingBn : cta.headingEn}</h4>
                <p className="mt-2 text-sm text-muted-foreground bn">
                  {isBn ? cta.bodyBn : cta.bodyEn}
                </p>
                <Button variant="gradient" size="lg" className="mt-4 w-full" asChild>
                  <a href={cta.buttonHref} target="_blank" rel="noopener noreferrer">
                    {isBn ? cta.buttonLabelBn : cta.buttonLabelEn}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </GlassCard>
            </FadeInRight>

            <FadeInRight delay={0.2}>
              <GlassCard className="text-center">
                <p className="text-sm italic text-muted-foreground bn">
                  {isBn ? cta.duaBn : cta.duaEn}
                </p>
                {cta.duaArabic && (
                  <p className="mt-2 text-xs text-muted-foreground">{cta.duaArabic}</p>
                )}
              </GlassCard>
            </FadeInRight>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mt-12">
          <FadeInUp>
            <h3 className="mb-6 text-center text-xl font-bold bn">
              {isBn ? activitiesSectionTitleBn : activitiesSectionTitleEn}
            </h3>
          </FadeInUp>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <StaggerItem key={activity.id}>
                <GlassCard className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                      <ExperienceIcon name={activity.icon} className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold bn">{isBn ? activity.titleBn : activity.titleEn}</h4>
                      <p className="mt-1 text-xs text-muted-foreground bn">
                        {isBn ? activity.descriptionBn : activity.descriptionEn}
                      </p>
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

function StatCell({ stat, isBn }: { stat: BloodStat; isBn: boolean }) {
  const display =
    stat.value !== null && stat.value !== undefined
      ? String(stat.value)
      : stat.text;
  return (
    <div className="text-center">
      {stat.value !== null && stat.value !== undefined ? (
        <Counter
          to={stat.value}
          suffix={stat.suffix ?? ""}
          className="text-2xl font-bold text-red-400"
        />
      ) : (
        <p className="text-2xl font-bold text-red-400">
          {stat.text}
          {stat.suffix ?? ""}
        </p>
      )}
      <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? stat.labelBn : stat.labelEn}</p>
      {/* fallback if Counter doesn't render value for odd cases */}
      {display === "" && (
        <p className="text-2xl font-bold text-red-400">0</p>
      )}
    </div>
  );
}
