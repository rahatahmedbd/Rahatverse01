import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { getAboutConfig } from "@/lib/about/server";

// ── Achievements Page ──────────────────────────────────
interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
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
