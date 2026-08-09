import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { BloodSocietySection } from "@/components/sections/BloodSocietySection";
import { MemorialSection } from "@/components/sections/MemorialSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Experience Page ────────────────────────────────────
interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/experience"));
  const title = isBn ? "অভিজ্ঞতা ও সমাজসেবা — রাহাত আহমেদ" : "Experience & Social Service — Rahat Ahmed";
  const description = isBn
    ? "রাহাত আহমেদের অভিজ্ঞতা ও সামাজিক অবদান — শিক্ষকতা, বিএনসিসি ক্যাডেটশিপ, শান্তিচক্র ব্লাড সোসাইটি ও সমাজসেবা।"
    : "Rahat Ahmed's experience and social contributions — teaching, BNCC cadetship, Shantichakra Blood Society and community service.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/experience"),
    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      alternateLocale: isBn ? "en_US" : "bn_BD",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: SITE_IMAGE,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE],
    },
  };
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <ExperienceSection locale={locale} />
      <AuroraDivider />
      <BloodSocietySection locale={locale} />
      <AuroraDivider />
      <MemorialSection locale={locale} />
    </div>
  );
}
