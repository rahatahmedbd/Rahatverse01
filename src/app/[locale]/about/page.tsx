import { AboutFull } from "@/components/sections/AboutFull";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { PerformanceReport } from "@/components/sections/PerformanceReport";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";
import { JsonLd, getProfilePageSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── About Page ─────────────────────────────────────────
interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/about"));
  const title = isBn
    ? "রাহাত আহমেদ সম্পর্কে — শিক্ষার্থী, শিক্ষক ও ওয়েব ডেভেলপার"
    : "About Rahat Ahmed — Student, Teacher & Web Developer";
  const description = isBn
    ? "রাহাত আহমেদের পরিচয় — সুনামগঞ্জের একজন শিক্ষার্থী, শিক্ষক, বিএনসিসি ক্যাডেট ও ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে কাজ করছেন।"
    : "Meet Rahat Ahmed — an HSC student, teacher, BNCC cadet and web developer from Sunamganj, Bangladesh, working to make a difference through education, social service and technology.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/about"),
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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const aboutConfig = await getAboutConfig();

  return (
    <>
      <JsonLd type="ProfilePage" data={getProfilePageSchema(locale)} />
      <JsonLd
        type="BreadcrumbList"
        data={getBreadcrumbListSchema([
          { name: isBn ? "হোম" : "Home", url: absoluteUrl(localePath(locale)) },
          {
            name: isBn ? "আমার সম্পর্কে" : "About",
            url: absoluteUrl(localePath(locale, "/about")),
          },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4">
        <AboutFull locale={locale} config={aboutConfig} />
        <AuroraDivider />
        <EducationTimeline locale={locale} config={aboutConfig} />
        <AuroraDivider />
        <PerformanceReport locale={locale} />
      </div>
    </>
  );
}
