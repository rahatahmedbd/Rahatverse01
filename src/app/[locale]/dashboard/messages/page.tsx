import { MessagesManager } from "@/components/admin/MessagesManager";

interface MessagesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = await params;
  return <MessagesManager locale={locale} />;
}
