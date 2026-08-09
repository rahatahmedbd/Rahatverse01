import { permanentRedirect } from "next/navigation";

// ── Legacy alias: /terms → canonical /terms-of-service ──
// Kept as a 308 redirect so old links/query-strings keep working without
// serving duplicate content under two URLs (audit L3).
interface TermsAliasProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsAliasPage({ params }: TermsAliasProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/terms-of-service`);
}
