import { LegalContent } from "@/components/sections/LegalContent";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="terms" />;
}
