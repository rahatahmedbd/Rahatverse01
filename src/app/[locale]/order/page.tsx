import { Suspense } from "react";
import { PricingSection } from "@/components/sections/PricingSection";
import { OrderWizard } from "@/components/sections/OrderWizard";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { JsonLd, getEntityWebPageSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Order Page ─────────────────────────────────────────
interface OrderPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/order"));
  const title = isBn ? "ওয়েবসাইট অর্ডার করুন — প্যাকেজ ও মূল্য" : "Order a Website — Packages & Pricing";
  const description = isBn
    ? "আপনার প্রজেক্টের জন্য ওয়েবসাইট প্যাকেজ বেছে নিন — পোর্টফোলিও, ব্যবসায়িক, ই-কমার্স ও কাস্টম ওয়েব অ্যাপ্লিকেশন, রাহাতভার্সে তৈরি।"
    : "Choose a website package and start your project — portfolio, business, e-commerce and custom web applications built by RahatVerse.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/order"),
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

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <>
      <JsonLd
        type="WebPage"
        data={getEntityWebPageSchema({
          locale,
          path: "/order",
          name: "Order a Website — Packages & Pricing | RahatVerse",
          nameBn: "ওয়েবসাইট অর্ডার করুন — প্যাকেজ ও মূল্য | রাহাতভার্স",
        })}
      />
      <JsonLd
        type="BreadcrumbList"
        data={getBreadcrumbListSchema([
          { name: isBn ? "হোম" : "Home", url: absoluteUrl(localePath(locale)) },
          {
            name: isBn ? "ওয়েবসাইট অর্ডার" : "Order a Website",
            url: absoluteUrl(localePath(locale, "/order")),
          },
        ])}
      />
    <div className="mx-auto max-w-7xl px-4">
      {/* Pricing Packages */}
      <PricingSection locale={locale} />

      <AuroraDivider />

      {/* Order Wizard (Checkout) — anchored so "Order Now" links scroll here */}
      <div id="order-checkout">
        <Suspense>
          <OrderWizard locale={locale} />
        </Suspense>
      </div>
    </div>
    </>
  );
}
