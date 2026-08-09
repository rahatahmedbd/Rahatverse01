import { permanentRedirect } from "next/navigation";

// ── Legacy alias: /privacy → canonical /privacy-policy ──
// Kept as a 308 redirect so old links/query-strings keep working without
// serving duplicate content under two URLs (audit L3).
interface PrivacyAliasProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyAliasPage({ params }: PrivacyAliasProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/privacy-policy`);
}
