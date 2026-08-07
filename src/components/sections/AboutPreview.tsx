"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { ABOUT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";

// ── About Preview Section ──────────────────────────────
interface AboutPreviewProps {
  locale?: string;
  config?: AboutConfig;
}

export function AboutPreview({ locale = "bn", config }: AboutPreviewProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? about.section.badgeBn : about.section.badgeEn}
          title={about.section.titleEn}
          titleBn={about.section.titleBn}
          subtitle={isBn ? about.section.subtitleBn : about.section.subtitleEn}
          locale={locale}
        />

        {/* Admin-controlled personal information cards */}
        <StaggerGrid columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" gap="gap-4">
          {about.personalInfo.map((card) => {
            const Icon = ABOUT_ICON_MAP[card.icon];
            return (
              <StaggerItem key={card.id}>
                <GlassCard className="h-full text-center">
                  <Icon className="mx-auto mb-3 h-6 w-6 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    {isBn ? card.labelBn : card.labelEn}
                  </p>
                  <p className="mt-1 text-sm font-semibold bn">
                    {isBn ? card.valueBn : card.valueEn}
                  </p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Admin-controlled quote */}
        <div className="mt-12">
          <GlassCard className="border-l-4 border-l-primary text-center">
            <p className="text-lg italic text-muted-foreground bn">
              &ldquo;{isBn ? about.biography.quote.bn : about.biography.quote.en}&rdquo;
            </p>
            <Badge variant="glow" className="mt-4">
              {isBn ? about.biography.quoteBy.bn : about.biography.quoteBy.en}
            </Badge>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
