import { LegalContent } from "@/components/sections/LegalContent";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="privacy" />;
}
