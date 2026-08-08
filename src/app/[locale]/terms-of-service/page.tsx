import { LegalContent } from "@/components/sections/LegalContent";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsOfServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn ? "সেবা শর্তাবলি" : "Terms of Service",
    description: isBn
      ? "রাহাতভার্স ওয়েব ডেভেলপমেন্ট সেবার শর্তাবলি, পেমেন্ট (bKash/Nagad/Bank Transfer) শর্ত এবং রিফান্ড পলিসি।"
      : "Terms of service covering freelance web development, payment methods (bKash/Nagad/EFT), revisions, and code ownership.",
    alternates: localeAlternates(locale, "/terms-of-service"),
  };
}

export default async function TermsOfServicePage({
  params,
}: TermsOfServicePageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="terms-of-service" />;
}
