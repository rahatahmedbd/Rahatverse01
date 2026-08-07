import { LegalContent } from "@/components/sections/LegalContent";

interface CookiePageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="cookie" />;
}
