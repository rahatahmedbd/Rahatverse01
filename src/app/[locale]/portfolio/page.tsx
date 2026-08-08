import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { BloodSocietySection } from "@/components/sections/BloodSocietySection";
import { MemorialSection } from "@/components/sections/MemorialSection";
import { AboutFull } from "@/components/sections/AboutFull";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

// ── Portfolio Page (Original Portfolio + Experience + About merged) ─────────────
interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn ? "পোর্টফোলিও ও অভিজ্ঞতা" : "Portfolio & Experience",
    description: isBn
      ? "রাহাত আহমেদের প্রজেক্ট, কেস স্টাডি, অভিজ্ঞতা এবং ব্যক্তিগত তথ্য।"
      : "Rahat Ahmed's projects, case studies, experience and personal information.",
    alternates: localeAlternates(locale, "/portfolio"),
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Original Portfolio Section */}
        <PortfolioSection />

        <AuroraDivider />

        {/* About Section — Personal Information */}
        <AboutFull locale={locale} />

        <AuroraDivider />

        {/* Experience Section + Related Sections */}
        <ExperienceSection locale={locale} />
        <AuroraDivider />
        <BloodSocietySection locale={locale} />
        <AuroraDivider />
        <MemorialSection locale={locale} />
      </div>
    </div>
  );
}
