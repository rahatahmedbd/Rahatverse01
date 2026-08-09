import { LegalContent } from "@/components/sections/LegalContent";
import type { Metadata } from "next";

interface RefundPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "রিফান্ড পলিসি" : "Refund Policy",
    // Legal policy page — not intended for search indexing.
    robots: { index: false, follow: false },
  };
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="refund" />;
}
