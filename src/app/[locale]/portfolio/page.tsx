import { FadeInUp } from "@/components/animations/FadeIn";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";
import { JsonLd, getPortfolioSchema } from "@/components/seo/JsonLd";

interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn ? "পোর্টফোলিও ও কেস স্টাডি" : "Portfolio & Case Studies",
    description: isBn
      ? "রাহাত আহমেদ কর্তৃক নির্মিত বাস্তব ওয়েব প্রজেক্ট, কেস স্টাডি এবং আধুনিক সমাধানের সংগ্রহ।"
      : "Featured web projects, case studies, and real-world solutions engineered by Rahat Ahmed.",
    alternates: localeAlternates(locale, "/portfolio"),
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <JsonLd type="CollectionPage" data={getPortfolioSchema(locale)} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12">
            <h1 className="text-gradient text-display-sm sm:text-display-lg font-bold tracking-tight">
              {isBn ? "আমার প্রজেক্ট ও কেস স্টাডি" : "Projects & Case Studies"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              {isBn
                ? "বাস্তব প্রজেক্ট, পরিষ্কার কোড এবং আধুনিক ডিজাইন — প্রতিটি কাজের পেছনে গল্প আছে।"
                : "Real projects, clean code, and scalable architecture — every build tells a story."}
            </p>
          </div>
        </FadeInUp>

        <PortfolioSection />
      </div>
    </div>
  );
}
