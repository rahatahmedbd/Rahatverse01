import { LegalContent } from "@/components/sections/LegalContent";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    // Short duplicate route — consolidate search signal on /terms-of-service.
    robots: { index: false, follow: false },
    alternates: localeAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="terms" />;
}
