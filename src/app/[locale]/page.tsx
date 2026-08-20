import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { WhyWorkWithMe } from "@/components/sections/WhyWorkWithMe";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { OrderCtaBand } from "@/components/sections/OrderCtaBand";
import { FAQSection } from "@/components/sections/FAQSection";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";
import { getHeroConfig } from "@/lib/hero/server";
import { getPortfolioConfig } from "@/lib/portfolio/server";
import { getContentConfig } from "@/lib/content/server";
import { getApprovedTestimonialsServer } from "@/lib/testimonials/server";
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

// ── Homepage — client-focused hierarchy ────────────────
// Hero (web-developer focus) → Portfolio (the most important section — clients
// buy proof) → Services → Why Work With Me → How I Work → About (reduced
// personal info) → Testimonials → FAQ → final CTA → Blog (secondary, bottom).
// Newsletter moved off the homepage; it remains in the footer.
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale));
  const title = isBn
    ? "রাহাত আহমেদ — ওয়েব ডেভেলপার | আধুনিক ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন"
    : "Rahat Ahmed — Web Developer | Modern Websites & Web Applications";
  const description = isBn
    ? "রাহাত আহমেদ আধুনিক, দ্রুত ও রেসপনসিভ ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি করেন — Next.js, React ও TypeScript দিয়ে। পোর্টফোলিও, সার্ভিস ও কেস স্টাডি দেখুন।"
    : "Rahat Ahmed builds modern, fast, responsive websites and web applications with Next.js, React and TypeScript. Explore the portfolio, services and case studies.";
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const [aboutConfig, heroConfig, portfolioConfig, contentConfig, testimonials] = await Promise.all([
    getAboutConfig(),
    getHeroConfig(),
    getPortfolioConfig(),
    getContentConfig(),
    getApprovedTestimonialsServer(6),
  ]);

  return (
    <>
      <JsonLd type="WebPage" data={getWebPageSchema(locale)} />
      <CinematicIntro config={heroConfig} />
      <HeroSection locale={locale} aboutConfig={aboutConfig} heroConfig={heroConfig} />

      <AuroraDivider spacing="md" />

      {/* Portfolio — the homepage's most important section. Clients buy proof:
          screenshots, tech stack, live demos and honest case studies. */}
      <section
        id="portfolio"
        className="section-atmosphere scroll-mt-24 py-12 sm:py-16 lg:py-20"
        aria-labelledby="home-portfolio-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <span id="home-portfolio-heading" className="sr-only">
            {isBn ? "পোর্টফোলিও" : "Portfolio"}
          </span>
          <SectionTitle
            badge={isBn ? "💼 কাজ ও কেস স্টাডি" : "💼 Work & Case Studies"}
            title="Featured Work"
            titleBn="সেরা কাজসমূহ"
            subtitle={
              isBn
                ? "প্রতিটি প্রজেক্টে স্ক্রিনশট, টেক স্ট্যাক, লাইভ ডেমো ও সৎ কেস স্টাডি — কোনো কাল্পনিক দাবি নয়"
                : "Every project ships with a screenshot, tech stack, live demo and an honest case study"
            }
            locale={locale}
          />
          <PortfolioSection initialConfig={portfolioConfig} />
        </div>
      </section>

      <AuroraDivider spacing="md" />

      <ServicesPreview locale={locale} />

      <AuroraDivider spacing="md" />

      <WhyWorkWithMe locale={locale} />

      <AuroraDivider spacing="md" />

      <ProcessSection locale={locale} />

      <AuroraDivider spacing="md" />

      <AboutPreview locale={locale} config={aboutConfig} />

      <AuroraDivider spacing="md" />

      {/* Testimonials — container handled inside component */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TestimonialsSection locale={locale} limit={6} initialTestimonials={testimonials} />
      </div>

      <AuroraDivider spacing="md" />

      {/* FAQ — client questions answered before they ask */}
      <FAQSection locale={locale} initialConfig={contentConfig} />

      <AuroraDivider spacing="md" />

      <OrderCtaBand locale={locale} />

      {/* Blog — secondary content, kept at the bottom of the homepage */}
      <BlogPreview locale={locale} />
    </>
  );
}
