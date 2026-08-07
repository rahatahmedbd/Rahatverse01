import type { Metadata } from "next";
import "./globals.css";
import {
  JsonLd,
  getPersonSchema,
  getWebsiteSchema,
  getLocalBusinessSchema,
} from "@/components/seo/JsonLd";
import { SITE_IMAGE, SITE_URL } from "@/lib/seo";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: "Rahat Ahmed", url: SITE_URL }],
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
    url: SITE_URL,
    images: [
      {
        url: SITE_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rahat Ahmed — RahatVerse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RahatVerse — রাহাত আহমেদ",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
    images: [SITE_IMAGE],
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
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icons/icon-512.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    shortcut: "/icons/icon-192.svg",
  },
  verification: googleVerification ? { google: googleVerification } : undefined,
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <JsonLd type="Person" data={getPersonSchema()} />
      <JsonLd type="WebSite" data={getWebsiteSchema()} />
      <JsonLd type="LocalBusiness" data={getLocalBusinessSchema()} />
    </>
  );
}
