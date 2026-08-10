import { LegalContent } from "@/components/sections/LegalContent";
import { localeAlternates } from "@/lib/seo";
import type { Metadata } from "next";

interface RefundPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "রিফান্ড পলিসি" : "Refund Policy",
    // Self-referencing canonical + hreflang: without these the page inherits
    // the locale layout's homepage canonical, which contradicts the page.
    alternates: localeAlternates(locale, "/refund"),
    // Legal policy page — not intended for search indexing.
    robots: { index: false, follow: false },
  };
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="refund" />;
}
