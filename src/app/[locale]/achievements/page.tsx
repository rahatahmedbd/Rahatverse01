import { AchievementsSection } from "@/components/sections/AchievementsSection";

// ── Achievements Page ──────────────────────────────────
interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AchievementsPage({ params }: AchievementsPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <AchievementsSection locale={locale} />
    </div>
  );
}
