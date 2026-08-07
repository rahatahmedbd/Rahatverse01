"use client";

import { SectionTitle } from "./SectionTitle";
import { ScrollStoryline, StorylineItem } from "@/components/interactive";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";

// ── Education Timeline ─────────────────────────────────
interface EducationTimelineProps {
  locale?: string;
  config?: AboutConfig;
}

export function EducationTimeline({ locale = "bn", config }: EducationTimelineProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  const storylineItems: StorylineItem[] = about.education.map((item) => ({
    id: item.id,
    year: isBn ? item.yearBn : item.yearEn,
    title: isBn ? item.titleBn : item.titleEn,
    titleBn: item.titleBn,
    subtitle: isBn ? item.institutionBn : item.institutionEn,
    subtitleBn: item.institutionBn,
    location: isBn ? item.locationBn : item.locationEn,
    locationBn: item.locationBn,
    description: isBn ? item.descriptionBn : item.descriptionEn,
    descriptionBn: item.descriptionBn,
    badge: isBn ? item.badgeBn || undefined : item.badgeEn || undefined,
    badgeType: item.badgeType,
    gpa: item.gpa || undefined,
  }));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SectionTitle
          badge={isBn ? about.educationSection.badgeBn : about.educationSection.badgeEn}
          title={about.educationSection.titleEn}
          titleBn={about.educationSection.titleBn}
          subtitle={
            isBn
              ? about.educationSection.subtitleBn
              : about.educationSection.subtitleEn
          }
          locale={locale}
        />

        <ScrollStoryline items={storylineItems} locale={locale} />
      </div>
    </section>
  );
}
