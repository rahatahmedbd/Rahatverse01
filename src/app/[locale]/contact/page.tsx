import { ContactSection } from "@/components/sections/ContactSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { JsonLd, getContactPageSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Contact Page ───────────────────────────────────────
interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/contact"));
  const title = isBn ? "যোগাযোগ — রাহাত আহমেদ" : "Contact Rahat Ahmed";
  const description = isBn
    ? "ওয়েব ডেভেলপমেন্ট, পড়াশোনা, রক্তদান বা যেকোনো সহযোগিতার জন্য রাহাত আহমেদের সাথে যোগাযোগ করুন। সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হয়।"
    : "Contact Rahat Ahmed for web development, tutoring, blood donation coordination or collaboration. Responses usually within 24 hours.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/contact"),
    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      alternateLocale: isBn ? "en_US" : "bn_BD",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: SITE_IMAGE,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLd type="ContactPage" data={getContactPageSchema(locale)} />
      <div className="mx-auto max-w-7xl px-4">
        <ContactSection locale={locale} />
        <AuroraDivider />
        <TestimonialsSection locale={locale} />
        <AuroraDivider />
        <FAQSection locale={locale} />
      </div>
    </>
  );
}
