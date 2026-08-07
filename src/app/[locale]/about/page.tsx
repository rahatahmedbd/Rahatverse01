import { AboutFull } from "@/components/sections/AboutFull";
import { EducationTimeline } from "@/components/sections/EducationTimeline";
import { PerformanceReport } from "@/components/sections/PerformanceReport";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

// ── About Page ─────────────────────────────────────────
interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const aboutConfig = await getAboutConfig();

  return (
    <div className="mx-auto max-w-7xl px-4">
      <AboutFull locale={locale} config={aboutConfig} />
      <AuroraDivider />
      <EducationTimeline locale={locale} config={aboutConfig} />
      <AuroraDivider />
      <PerformanceReport locale={locale} />
    </div>
  );
}
