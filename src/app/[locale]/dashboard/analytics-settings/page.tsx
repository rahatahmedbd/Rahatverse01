import { AnalyticsControlPanel } from "@/components/admin/AnalyticsControlPanel";

interface AnalyticsSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnalyticsSettingsPage({ params }: AnalyticsSettingsPageProps) {
  const { locale } = await params;
  return <AnalyticsControlPanel locale={locale} />;
}
