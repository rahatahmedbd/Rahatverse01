import Gallery from "@/components/gallery/Gallery";
import { FadeInUp } from "@/components/animations/FadeIn";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/gallery"));
  const title = isBn ? "গ্যালারি — রাহাত আহমেদ" : "Gallery — Rahat Ahmed";
  const description = isBn
    ? "রাহাত আহমেদের যাত্রার মুহূর্তগুলো — শিক্ষা, বিজ্ঞান মেলা, বিএনসিসি, রক্তদান ড্রাইভ ও ওয়েব ডেভেলপমেন্ট।"
    : "Photos and moments from Rahat Ahmed's journey — education, science fairs, BNCC, blood donation drives and web development.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/gallery"),
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

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <FadeInUp>
          <div className="text-center mb-12">
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              {isBn ? "গ্যালারি" : "Gallery"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isBn 
                ? "আমার যাত্রার মুহূর্তগুলো দেখুন" 
                : "See moments from my journey"}
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <Gallery locale={locale} />
        </FadeInUp>
      </div>
    </div>
  );
}
