"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { Calendar, ExternalLink, Loader2 } from "lucide-react";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { ExperienceIcon } from "@/lib/experience/icons";
import type { ExperienceConfig, ExperienceStatus } from "@/types/experience";

// ── Experience Section (DB-driven) ─────────────────────
interface ExperienceSectionProps {
  locale?: string;
}

const STATUS_LABELS: Record<ExperienceStatus, { bn: string; en: string; variant: "success" | "warning" | "default" }> = {
  active: { bn: "সক্রিয়", en: "Active", variant: "success" },
  paused: { bn: "সাময়িক বন্ধ", en: "Paused", variant: "warning" },
  completed: { bn: "সম্পন্ন", en: "Completed", variant: "default" },
};

export function ExperienceSection({ locale = "bn" }: ExperienceSectionProps) {
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
        {isBn ? "অভিজ্ঞতা লোড হচ্ছে..." : "Loading experience..."}
      </div>
    );
  }

  const { section, items } = config.experience;
  const experiences = items;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {experiences.map((exp, index) => (
            <FadeInUp key={exp.id} delay={index * 0.1}>
              <GlassCard className="group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ExperienceIcon name={exp.icon} className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold bn">{isBn ? exp.titleBn : exp.titleEn}</h3>
                      <p className="text-sm text-primary font-medium bn">{isBn ? exp.roleBn : exp.roleEn}</p>
                    </div>
                  </div>
                  <Badge variant={STATUS_LABELS[exp.status]?.variant ?? "outline"} className="text-[10px]">
                    {isBn
                      ? STATUS_LABELS[exp.status]?.bn ?? exp.status
                      : STATUS_LABELS[exp.status]?.en ?? exp.status}
                  </Badge>
                </div>

                {/* Period */}
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="bn">{isBn ? exp.periodBn : exp.periodEn}</span>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-muted-foreground bn leading-relaxed">
                  {isBn ? exp.descriptionBn : exp.descriptionEn}
                </p>

                {/* Details */}
                {exp.details && exp.details.length > 0 && (
                  <div className="space-y-2 border-t border-border/50 pt-4">
                    {exp.details.map((detail) => (
                      <div key={detail.id} className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-muted-foreground bn">
                          {isBn ? detail.labelBn : detail.labelEn}:
                        </span>
                        <span className="bn">{isBn ? detail.valueBn : detail.valueEn}</span>
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
