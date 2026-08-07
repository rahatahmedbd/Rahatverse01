import { AboutFull } from "@/components/sections/AboutFull";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { PerformanceReport } from "@/components/sections/PerformanceReport";
import { AuroraDivider } from "@/components/ui/aurora-divider";

// ── About Page ─────────────────────────────────────────
interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <AboutFull locale={locale} />
      <AuroraDivider />
      <EducationTimeline locale={locale} />
      <AuroraDivider />
      <PerformanceReport locale={locale} />
    </div>
  );
}
