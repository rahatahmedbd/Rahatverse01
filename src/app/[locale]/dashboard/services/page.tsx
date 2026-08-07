import { ServicesControlPanel } from "@/components/admin/ServicesControlPanel";

interface ServicesAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesAdminPage({ params }: ServicesAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <ServicesControlPanel locale={locale} />
    </div>
  );
}
