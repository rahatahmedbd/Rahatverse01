import type { Metadata } from "next";
import "./globals.css";

// ── Font Setup ─────────────────────────────────────────
// Phase 01: Using Google Fonts via <link> in root layout
// Phase 02: Will integrate optimized self-hosted fonts

// ── Metadata ────────────────────────────────────────────
export const metadata: Metadata = {
  title: "RahatVerse — রাহাত আহমেদ | Student, Teacher & Web Developer",
  description:
    "আমি একজন শিক্ষার্থী, গৃহশিক্ষক, রক্তদাতা, BNCC ক্যাডেট এবং উদীয়মান ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
  keywords: [
    "Rahat Ahmed",
    "রাহাত আহমেদ",
    "Web Developer",
    "Sunamganj",
    "Portfolio",
    "Bangladesh",
  ],
  authors: [{ name: "Rahat Ahmed", url: "https://rahatahmedbd.github.io" }],
  creator: "Rahat Ahmed",
  publisher: "RahatVerse",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "RahatVerse",
    title: "RahatVerse — রাহাত আহমেদ",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
  },
  twitter: {
    card: "summary_large_image",
    title: "RahatVerse — রাহাত আহমেদ",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* Google Fonts - loaded globally in root layout (App Router) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
