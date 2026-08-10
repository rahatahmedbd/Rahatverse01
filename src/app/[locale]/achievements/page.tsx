import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { OrderCtaBand } from "@/components/sections/OrderCtaBand";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";
import { JsonLd, getEntityWebPageSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Achievements Page ──────────────────────────────────
interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AchievementsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/achievements"));
  const title = isBn ? "অর্জন ও মাইলফলক — রাহাত আহমেদ" : "Achievements & Milestones — Rahat Ahmed";
  const description = isBn
    ? "রাহাত আহমেদের অর্জন ও মাইলফলক — জাতীয় বিজ্ঞান মেলার পুরস্কার, একাডেমিক কৃতিত্ব ও সমাজসেবার সাফল্য।"
    : "Achievements and milestones of Rahat Ahmed — national science fair awards, academic distinctions and social-service milestones.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/achievements"),
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

export default async function AchievementsPage({ params }: AchievementsPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const aboutConfig = await getAboutConfig();

  return (
    <>
      <JsonLd
        type="WebPage"
        data={getEntityWebPageSchema({
          locale,
          path: "/achievements",
          name: "Achievements & Milestones — Rahat Ahmed",
          nameBn: "অর্জন ও মাইলফলক — রাহাত আহমেদ",
        })}
      />
      <JsonLd
        type="BreadcrumbList"
        data={getBreadcrumbListSchema([
          { name: isBn ? "হোম" : "Home", url: absoluteUrl(localePath(locale)) },
          {
            name: isBn ? "অর্জন ও মাইলফলক" : "Achievements & Milestones",
            url: absoluteUrl(localePath(locale, "/achievements")),
          },
        ])}
      />
    <div className="mx-auto max-w-7xl px-4">
      <AchievementsSection locale={locale} config={aboutConfig} />
      {/* Phase 6: trust → proof → conversion — natural conclusion after reading proof */}
      <AuroraDivider />
      <OrderCtaBand locale={locale} />
    </div>
    </>
  );
}
