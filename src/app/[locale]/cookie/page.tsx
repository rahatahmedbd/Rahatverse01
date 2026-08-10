import { LegalContent } from "@/components/sections/LegalContent";
import { localeAlternates } from "@/lib/seo";
import type { Metadata } from "next";

interface CookiePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CookiePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "কুকি নোটিশ" : "Cookie Notice",
    // Self-referencing canonical + hreflang: without these the page inherits
    // the locale layout's homepage canonical, which contradicts the page.
    alternates: localeAlternates(locale, "/cookie"),
    // Minor legal notice page — not intended for search.
    robots: { index: false, follow: false },
  };
}

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="cookie" />;
}
