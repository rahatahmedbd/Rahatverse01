import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { BloodSocietySection } from "@/components/sections/BloodSocietySection";
import { MemorialSection } from "@/components/sections/MemorialSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

// ── Portfolio Page (now mirrors Experience exactly) ─────────────────────────────
interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/portfolio"),
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
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
