import { OrdersManagement } from "@/components/sections/OrdersManagement";

// ── Orders Management Page ─────────────────────────────
interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;

  return <OrdersManagement locale={locale} />;
}
