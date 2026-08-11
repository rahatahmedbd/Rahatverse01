import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { FadeInUp } from "@/components/animations/FadeIn";
import { ABOUT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";
import { UserRound, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AboutPreviewProps {
  locale?: string;
  config?: AboutConfig;
}

export function AboutPreview({ locale = "bn", config }: AboutPreviewProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  return (
    <section className="section-atmosphere py-12 sm:py-16 lg:py-20">
      <UserRound className="section-watermark -right-5 top-10 sm:right-[6%]" aria-hidden="true" />
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
                  <span className="icon-frame mx-auto mb-2.5 h-9 w-9 rounded-xl sm:h-10 sm:w-10">
                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
                  </span>
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

        {/* Entity-strong internal link — homepage preview → canonical About page.
            Signature "aurora button": a slowly spinning rainbow ring, gradient
            label, and a hover shine sweep. The ring renders paused and the
            AnimationGovernor resumes it only while visible; reduced-motion
            users get a calm static rainbow ring. */}
        <FadeInUp delay={0.15}>
          <div className="mt-8 text-center sm:mt-10">
            <Link
              href={`/${locale}/about`}
              data-fx
              className="btn-aurora group inline-flex transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(245,158,11,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="btn-aurora-core inline-flex min-h-[50px] items-center gap-2.5 overflow-hidden px-7 py-3 text-sm font-semibold sm:text-[15px]">
                {/* Shine sweep across the pill on hover (transform-only) */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />
                </span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  aria-hidden="true"
                >
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="bn text-gradient">
                  {isBn ? "রাহাত আহমেদ সম্পর্কে আরও জানুন" : "Learn more about Rahat Ahmed"}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
