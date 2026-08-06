import { MessagesInbox } from "@/components/sections/MessagesInbox";

// ── Messages Inbox Page ────────────────────────────────
interface MessagesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = await params;

  return <MessagesInbox locale={locale} />;
}
