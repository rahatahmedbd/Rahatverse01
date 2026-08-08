import { LegalContent } from "@/components/sections/LegalContent";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";

  return {
    title: isBn ? "প্রাইভেসি পলিসি" : "Privacy Policy",
    description: isBn
      ? "রাহাতভার্স কর্তৃক সংগৃহীত তথ্য, ডেটা নিরাপত্তা এবং ক্লায়েন্টের অধিকার সম্পর্কিত প্রাইভেসি পলিসি।"
      : "Privacy policy detailing data collection, cloud security, and client privacy rights for RahatVerse.",
    alternates: localeAlternates(locale, "/privacy-policy"),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="privacy-policy" />;
}
