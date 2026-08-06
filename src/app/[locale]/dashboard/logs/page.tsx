import { SystemLogsViewer } from "@/components/admin/SystemLogsViewer";

interface LogsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LogsPage({ params }: LogsPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <SystemLogsViewer locale={locale} />
    </div>
  );
}
