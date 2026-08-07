"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { ABOUT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import { ProfileImage } from "./ProfileImage";
import type { AboutConfig } from "@/types/about";

// ── Full About Section ─────────────────────────────────
interface AboutFullProps {
  locale?: string;
  config?: AboutConfig;
}

export function AboutFull({ locale = "bn", config }: AboutFullProps) {
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

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Story and profile */}
          <div className="lg:col-span-3">
            <FadeInLeft>
              <GlassCard className="h-full">
                <div className="mb-6 flex justify-center sm:justify-start">
                  <ProfileImage
                    size="md"
                    src={about.profileImage.url || undefined}
                    publicId={about.profileImage.publicId}
                    alt={isBn ? about.profileImage.altBn : about.profileImage.altEn}
                    frame={about.profileImage.frame}
                    showStatus={about.profileImage.showStatus}
                    statusLabel={
                      isBn
                        ? about.profileImage.statusLabelBn
                        : about.profileImage.statusLabelEn
                    }
                  />
                </div>

                <div className="space-y-4">
                  {about.biography.paragraphs.map((paragraph, index) => (
                    <p key={`bio-${index}`} className="text-muted-foreground bn leading-relaxed">
                      {isBn ? paragraph.bn : paragraph.en}
                    </p>
                  ))}

                  {/* Interests */}
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                      {isBn
                        ? about.biography.interestsTitleBn
                        : about.biography.interestsTitleEn}
                    </h4>
                    <StaggerContainer>
                      <div className="flex flex-wrap gap-2">
                        {about.interests.map((interest) => {
                          const Icon = ABOUT_ICON_MAP[interest.icon];
                          return (
                            <StaggerItem key={interest.id}>
                              <Badge variant="glow" className="bn">
                                <Icon className="mr-1 h-3 w-3" />
                                {isBn ? interest.labelBn : interest.labelEn}
                              </Badge>
                            </StaggerItem>
                          );
                        })}
                      </div>
                    </StaggerContainer>
                  </div>
                </div>
              </GlassCard>
            </FadeInLeft>
          </div>

          {/* Right: Admin-controlled info cards */}
          <div className="lg:col-span-2">
            <FadeInRight>
              <StaggerContainer className="space-y-3">
                {about.personalInfo.map((info) => {
                  const Icon = ABOUT_ICON_MAP[info.icon];
                  return (
                    <StaggerItem key={info.id}>
                      <GlassCard className="flex items-center gap-4 !p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {isBn ? info.labelBn : info.labelEn}
                          </p>
                          <p className="truncate font-semibold bn">
                            {isBn ? info.valueBn : info.valueEn}
                          </p>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </FadeInRight>
          </div>
        </div>

        {/* Quote */}
        <FadeInUp delay={0.3}>
          <div className="mt-12 text-center">
            <GlassCard className="mx-auto max-w-2xl border-l-4 border-l-primary">
              <p className="text-lg italic text-muted-foreground bn">
                &ldquo;{isBn ? about.biography.quote.bn : about.biography.quote.en}&rdquo;
              </p>
              <Badge variant="glow" className="mt-4">
                {isBn ? about.biography.quoteBy.bn : about.biography.quoteBy.en}
              </Badge>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
