import { AuditLogViewer } from "@/components/admin/AuditLogViewer";

interface AuditPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <AuditLogViewer locale={locale} />
    </div>
  );
}
