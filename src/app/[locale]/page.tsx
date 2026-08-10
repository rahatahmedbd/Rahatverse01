import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { OrderCtaBand } from "@/components/sections/OrderCtaBand";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";
import { getHeroConfig } from "@/lib/hero/server";
import { getApprovedTestimonialsServer } from "@/lib/testimonials/server";
import { getNewsletterConfig } from "@/lib/newsletter/server";
import { JsonLd, getWebPageSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale));
  const title = isBn
    ? "রাহাত আহমেদ — ওয়েব ডেভেলপার, শিক্ষার্থী ও শিক্ষক"
    : "Rahat Ahmed — Web Developer, Student & Teacher";
  const description = isBn
    ? "রাহাত আহমেদ — শিক্ষার্থী, শিক্ষক, রক্তদাতা, BNCC ক্যাডেট ও ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোর লক্ষ্যে আধুনিক ডিজিটাল অভিজ্ঞতা তৈরি করি।"
    : "Rahat Ahmed is a student, teacher and web developer building modern digital experiences with AI and technology.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, ""),
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
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [aboutConfig, heroConfig, testimonials, newsletterConfig] = await Promise.all([
    getAboutConfig(),
    getHeroConfig(),
    getApprovedTestimonialsServer(6),
    getNewsletterConfig(),
  ]);

  return (
    <>
      <JsonLd type="WebPage" data={getWebPageSchema(locale)} />
      <CinematicIntro config={heroConfig} />
      <HeroSection locale={locale} aboutConfig={aboutConfig} heroConfig={heroConfig} />

      <AuroraDivider spacing="md" />

      <AboutPreview locale={locale} config={aboutConfig} />

      <AuroraDivider spacing="md" />

      <ServicesPreview locale={locale} />

      <AuroraDivider spacing="md" />

      {/* Testimonials — container handled inside component */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TestimonialsSection locale={locale} limit={6} initialTestimonials={testimonials} />
      </div>

      <AuroraDivider spacing="md" />

      <OrderCtaBand locale={locale} />

      <AuroraDivider spacing="md" />

      {/* Newsletter — compact, not giant */}
      <section id="newsletter" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <NewsletterSignup locale={locale} source="homepage" initialConfig={newsletterConfig} />
      </section>
    </>
  );
}
