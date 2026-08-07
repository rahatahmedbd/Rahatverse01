import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { BloodSocietySection } from "@/components/sections/BloodSocietySection";
import { MemorialSection } from "@/components/sections/MemorialSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";

// ── Experience Page ────────────────────────────────────
interface ExperiencePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
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
