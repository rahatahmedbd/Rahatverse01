import { OrderKanbanBoard } from "@/components/admin/OrderKanbanBoard";

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;

  return <OrderKanbanBoard locale={locale} />;
}
