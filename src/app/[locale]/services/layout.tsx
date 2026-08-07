import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  return {
    title: isBn ? "ওয়েব ডেভেলপমেন্ট সার্ভিস" : "Web Development Services",
    description: isBn
      ? "আধুনিক, দ্রুতগতির ও রেসপনসিভ ওয়েবসাইট প্যাকেজ। Next.js ও Supabase দিয়ে তৈরি কাস্টম ওয়েব সমাধান।"
      : "Professional web development packages, portfolio sites, and full-featured e-commerce solutions built with Next.js and Supabase.",
    alternates: localeAlternates(locale, "/services"),
  };
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
