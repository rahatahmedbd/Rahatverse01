import { DashboardOverview } from "@/components/sections/DashboardOverview";

// ── Dashboard Page ─────────────────────────────────────
interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <DashboardOverview locale={locale} />
    </div>
  );
}
