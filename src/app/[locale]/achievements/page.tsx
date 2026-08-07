import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { getAboutConfig } from "@/lib/about/server";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

// ── Achievements Page ──────────────────────────────────
interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AchievementsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/achievements"),
  };
}

export default async function AchievementsPage({ params }: AchievementsPageProps) {
  const { locale } = await params;
  const aboutConfig = await getAboutConfig();

  return (
    <div className="mx-auto max-w-7xl px-4">
      <AchievementsSection locale={locale} config={aboutConfig} />
    </div>
  );
}
