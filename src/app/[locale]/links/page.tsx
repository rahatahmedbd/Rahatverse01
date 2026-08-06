import { LinkHubSection } from "@/components/sections/LinkHubSection";

// ── Links Page (Link Hub) ──────────────────────────────
interface LinksPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LinksPage({ params }: LinksPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <LinkHubSection locale={locale} />
    </div>
  );
}
