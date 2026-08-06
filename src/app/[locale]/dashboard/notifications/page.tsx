import { NotificationCenter } from "@/components/admin/NotificationCenter";

interface NotificationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <NotificationCenter locale={locale} />
    </div>
  );
}
