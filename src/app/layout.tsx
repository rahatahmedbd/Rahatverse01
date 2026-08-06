import type { Metadata } from "next";
import "./globals.css";
import {
  JsonLd,
  getPersonSchema,
  getWebsiteSchema,
  getLocalBusinessSchema,
} from "@/components/seo/JsonLd";

// ── Root Metadata ──────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://rahatverse01.vercel.app"),
  title: {
    default: "RahatVerse — রাহাত আহমেদ | Student, Teacher & Web Developer",
    template: "%s | RahatVerse",
  },
  description:
    "আমি একজন শিক্ষার্থী, গৃহশিক্ষক, রক্তদাতা, BNCC ক্যাডেট এবং উদীয়মান ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
  keywords: [
    "Rahat Ahmed",
    "রাহাত আহমেদ",
    "Web Developer",
    "Sunamganj",
    "Portfolio",
    "Bangladesh",
    "Next.js Developer",
    "ওয়েব ডেভেলপার",
    "সুনামগঞ্জ",
  ],
  authors: [{ name: "Rahat Ahmed", url: "https://rahatverse01.vercel.app" }],
  creator: "Rahat Ahmed",
  publisher: "RahatVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    siteName: "RahatVerse",
    title: "RahatVerse — রাহাত আহমেদ",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
    url: "https://rahatverse01.vercel.app",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "RahatVerse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RahatVerse — রাহাত আহমেদ",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
    images: ["/icons/icon-512.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    languages: {
      bn: "/bn",
      en: "/en",
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "technology",
};

// ── Root Layout ────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* JSON-LD Structured Data */}
      <JsonLd type="person" data={getPersonSchema()} />
      <JsonLd type="website" data={getWebsiteSchema()} />
      <JsonLd type="localBusiness" data={getLocalBusinessSchema()} />
    </>
  );
}
