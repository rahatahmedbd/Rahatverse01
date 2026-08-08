import Gallery from "@/components/gallery/Gallery";
import { FadeInUp } from "@/components/animations/FadeIn";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/gallery"),
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
