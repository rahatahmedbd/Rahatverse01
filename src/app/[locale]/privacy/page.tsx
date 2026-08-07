import { LegalContent } from "@/components/sections/LegalContent";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="privacy" />;
}
