import { SystemHealthPanel } from "@/components/admin/SystemHealthPanel";
import { BackupPanel } from "@/components/admin/BackupPanel";

interface HealthPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HealthPage({ params }: HealthPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <h1 className="text-heading-md mb-6 font-bold">System Health & Backups</h1>
      <SystemHealthPanel locale={locale} />
      <div className="mt-8">
        <BackupPanel locale={locale} />
      </div>
    </div>
  );
}
