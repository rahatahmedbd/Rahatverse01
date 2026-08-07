"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { ExperienceIcon } from "@/lib/experience/icons";
import type { ExperienceConfig } from "@/types/experience";

// ── Memorial Section (DB-driven) ───────────────────────
// Tribute to Late Md. Farid Ahmed (Father)
interface MemorialSectionProps {
  locale?: string;
}

export function MemorialSection({ locale = "bn" }: MemorialSectionProps) {
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

  const memorial = config.memorial;
  const { section } = memorial;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Title */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-lg text-amber-400/80">۞</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isBn ? memorial.epigraphBn : memorial.epigraphEn}
            </p>
          </motion.div>
        </div>

        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        {/* Main Tribute Card */}
        <FadeInUp>
          <GlassCard className="border-t-4 border-t-amber-500/50 text-center">
            <motion.div
              className="bg-brand-gradient-soft gradient-border mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-primary/30"
              whileHover={{ scale: 1.05 }}
            >
              {memorial.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={memorial.imageUrl}
                  alt={isBn ? memorial.nameBn : memorial.nameEn}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CloudinaryImage
                  publicId={memorial.imagePublicId}
                  alt={isBn ? memorial.nameBn : memorial.nameEn}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  priority
                />
              )}
            </motion.div>

            <h3 className="text-heading-md font-bold bn">
              {isBn ? memorial.nameBn : memorial.nameEn}
            </h3>
            <p className="mt-1 text-muted-foreground bn">
              {isBn ? memorial.relationBn : memorial.relationEn}
            </p>
            <Badge variant="glow" className="mt-3">
              {isBn ? memorial.deathBadgeBn : memorial.deathBadgeEn}
            </Badge>

            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground bn leading-relaxed">
              {isBn ? memorial.tributeBn : memorial.tributeEn}
            </p>
          </GlassCard>
        </FadeInUp>

        {/* Roles */}
        <FadeInUp delay={0.2}>
          <div className="mt-8">
            <h4 className="mb-4 text-center text-lg font-bold bn">
              {isBn ? memorial.rolesTitleBn : memorial.rolesTitleEn}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {memorial.roles.map((role) => (
                <GlassCard key={role.id} className="!p-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <ExperienceIcon name={role.icon} className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="font-semibold text-sm bn">{isBn ? role.titleBn : role.titleEn}</p>
                  <p className="mt-1 text-xs text-muted-foreground bn">
                    {isBn ? role.descriptionBn : role.descriptionEn}
                  </p>
                  {(isBn ? role.periodBn : role.periodEn) && (
                    <p className="mt-1 text-xs text-amber-400/60">
                      {isBn ? role.periodBn : role.periodEn}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Development Works */}
        <FadeInUp delay={0.3}>
          <div className="mt-8">
            <h4 className="mb-4 text-center text-lg font-bold bn">
              {isBn ? memorial.developmentsTitleBn : memorial.developmentsTitleEn}
            </h4>
            <GlassCard>
              <div className="grid gap-2 sm:grid-cols-2">
                {(isBn ? memorial.developmentsBn : memorial.developmentsEn).map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Star className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                    <span className="bn text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              {(isBn ? memorial.developmentsMoreBn : memorial.developmentsMoreEn) && (
                <p className="mt-4 text-center text-sm italic text-muted-foreground bn">
                  {isBn ? memorial.developmentsMoreBn : memorial.developmentsMoreEn}
                </p>
              )}
            </GlassCard>
          </div>
        </FadeInUp>

        {/* Doa */}
        <FadeInUp delay={0.4}>
          <div className="mt-8 text-center">
            <GlassCard className="mx-auto max-w-xl border-amber-500/20">
              <p className="text-lg bn">🤲</p>
              <p className="mt-3 text-muted-foreground bn italic">
                {isBn ? memorial.duaBn : memorial.duaEn}
              </p>
              <p className="mt-3 text-xs text-muted-foreground bn">
                {isBn ? memorial.signedByBn : memorial.signedByEn}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
