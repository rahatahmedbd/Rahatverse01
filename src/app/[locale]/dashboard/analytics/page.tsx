import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

// ── Analytics Dashboard Page ───────────────────────────
// Admin-only (guarded by the dashboard layout).
interface AnalyticsPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { locale } = await params;

  return <AnalyticsDashboard locale={locale} />;
}
