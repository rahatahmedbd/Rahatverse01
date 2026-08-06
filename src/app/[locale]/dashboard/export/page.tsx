import { ExportPanel } from "@/components/admin/ExportPanel";

interface ExportPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <ExportPanel locale={locale} />
    </div>
  );
}
