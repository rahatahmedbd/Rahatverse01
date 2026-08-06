import { MessagesInbox } from "@/components/sections/MessagesInbox";

// ── Messages Inbox Page ────────────────────────────────
interface MessagesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <MessagesInbox locale={locale} />
    </div>
  );
}
