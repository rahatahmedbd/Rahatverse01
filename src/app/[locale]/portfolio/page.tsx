import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { JsonLd, getPortfolioSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import { getPortfolioConfig } from "@/lib/portfolio/server";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Portfolio Page (Original Portfolio + Experience + About merged) ─────────────
interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/portfolio"));
  const title = isBn
    ? "পোর্টফোলিও — ওয়েবসাইট ও ডিজিটাল প্রজেক্ট"
    : "Portfolio — Websites & Digital Projects";
  const description = isBn
    ? "রাহাত আহমেদের তৈরি ওয়েব প্রজেক্ট, কেস স্টাডি ও ডিজিটাল সমাধান — পোর্টফোলিও, ই-কমার্স, শিক্ষা ও রক্তদান প্ল্যাটফর্ম।"
    : "Web projects, websites and real-world solutions engineered by Rahat Ahmed — portfolio, e-commerce, education and blood-donation platforms.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/portfolio"),
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

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  // Server-load the validated CMS payload so the initial HTML contains the
  // real, crawlable project content (Phase 4A). The client island reuses this
  // data and skips its refetch.
  const portfolioConfig = await getPortfolioConfig();
  // Derive the ItemList from the collection schema so adding a project never
  // leaves `numberOfItems` out of sync with the listed entries.
  const portfolioItemList =
    ((getPortfolioSchema(locale).mainEntity as { itemListElement?: unknown[] })
      ?.itemListElement as unknown[]) ?? [];

  return (
    <>
      <JsonLd type="CollectionPage" data={getPortfolioSchema(locale)} />
      <JsonLd
        type="ItemList"
        data={{
          itemListElement: portfolioItemList,
          numberOfItems: portfolioItemList.length,
        }}
      />
      <JsonLd
        type="BreadcrumbList"
        data={getBreadcrumbListSchema([
          { name: isBn ? "হোম" : "Home", url: absoluteUrl(localePath(locale)) },
          {
            name: isBn ? "পোর্টফোলিও" : "Portfolio",
            url: absoluteUrl(localePath(locale, "/portfolio")),
          },
        ])}
      />
      <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          as="h1"
          badge={isBn ? "💼 প্রজেক্ট" : "💼 Projects"}
          title="Portfolio & Case Studies"
          titleBn="পোর্টফোলিও ও কেস স্টাডি"
          subtitle={
            isBn
              ? "রাহাত আহমেদের তৈরি ওয়েব প্রজেক্ট ও বাস্তব সমাধান"
              : "Web projects, websites and real-world solutions built by Rahat Ahmed"
          }
          locale={locale}
        />

        {/* The portfolio page focuses exclusively on projects, case studies and
            proof. About, Experience, Shantichakra and Memorial content remain
            canonical on their own pages and are cross-linked from the cards. */}
        <PortfolioSection initialConfig={portfolioConfig} />
      </div>
    </div>
    </>
  );
}
