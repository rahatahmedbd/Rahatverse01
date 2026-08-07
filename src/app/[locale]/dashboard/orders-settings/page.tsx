import { OrderSettingsControlPanel } from "@/components/admin/OrderSettingsControlPanel";

interface OrderSettingsAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrderSettingsAdminPage({ params }: OrderSettingsAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <OrderSettingsControlPanel locale={locale} />
    </div>
  );
}
