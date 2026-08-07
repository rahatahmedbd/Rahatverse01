"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { ABOUT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";

interface AboutPreviewProps {
  locale?: string;
  config?: AboutConfig;
}

export function AboutPreview({ locale = "bn", config }: AboutPreviewProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={isBn ? about.section.badgeBn : about.section.badgeEn}
          title={about.section.titleEn}
          titleBn={about.section.titleBn}
          subtitle={isBn ? about.section.subtitleBn : about.section.subtitleEn}
          locale={locale}
        />

        {/* Personal info cards — 2 cols on 320, 3 on 768, 6 on 1280, compact */}
        <StaggerGrid columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" gap="gap-3 sm:gap-4">
          {about.personalInfo.map((card) => {
            const Icon = ABOUT_ICON_MAP[card.icon];
            return (
              <StaggerItem key={card.id}>
                <GlassCard className="h-full min-h-[104px] p-4 text-center sm:min-h-[120px]">
                  <Icon className="mx-auto mb-2.5 h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  <p className="text-[11px] font-medium leading-tight text-muted-foreground sm:text-xs">
                    {isBn ? card.labelBn : card.labelEn}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-tight bn sm:text-sm">
                    {isBn ? card.valueBn : card.valueEn}
                  </p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Quote — compact */}
        <div className="mt-8 sm:mt-12">
          <GlassCard className="border-l-4 border-l-primary p-6 text-center sm:p-8">
            <p className="text-base italic leading-relaxed text-muted-foreground bn sm:text-lg">
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
