import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { JsonLd, getCollectionPageSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";
import { absoluteUrl, localeAlternates, localePath, SITE_IMAGE, SITE_NAME } from "@/lib/seo";
import Link from "next/link";

// ── Sitemap Page ───────────────────────────────────────
interface SitemapPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SitemapPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/sitemap"));
  const title = isBn ? "সাইটম্যাপ — RahatVerse নেভিগেশন" : "Sitemap — RahatVerse Navigation";
  const description = isBn
    ? "RahatVerse ওয়েবসাইটের সম্পূর্ণ পাবলিক নেভিগেশন — মূল পেজ, সার্ভিস, ব্লগ ও আইনি পাতার তালিকা।"
    : "Complete public navigation for RahatVerse — main pages, services, blog and legal pages.";
  return {
    title,
    description,
    // Utility navigation page — not intended for organic search indexing
    robots: { index: false, follow: true },
    alternates: localeAlternates(locale, "/sitemap"),
    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      alternateLocale: isBn ? "en_US" : "bn_BD",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [{ url: SITE_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE],
    },
  };
}

interface SitemapSection {
  title: string;
  titleBn: string;
  links: { label: string; labelBn: string; url: string }[];
}

const sitemapData: SitemapSection[] = [
  {
    title: "Main Pages",
    titleBn: "মূল পেজ",
    links: [
      { label: "Home", labelBn: "হোম", url: "/" },
      { label: "About", labelBn: "আমার সম্পর্কে", url: "/about" },
      { label: "Portfolio & Case Studies", labelBn: "পোর্টফোলিও ও কেস স্টাডি", url: "/portfolio" },
      { label: "Services", labelBn: "সেবাসমূহ", url: "/services" },
      { label: "Experience", labelBn: "অভিজ্ঞতা", url: "/experience" },
      { label: "Achievements", labelBn: "অর্জনসমূহ", url: "/achievements" },
      { label: "Gallery", labelBn: "গ্যালারি", url: "/gallery" },
    ],
  },
  {
    title: "Services",
    titleBn: "সার্ভিস",
    links: [
      { label: "Order Website", labelBn: "ওয়েবসাইট অর্ডার", url: "/order" },
      { label: "Contact", labelBn: "যোগাযোগ", url: "/contact" },
    ],
  },
  {
    title: "Resources",
    titleBn: "রিসোর্স",
    links: [
      { label: "Blog", labelBn: "ব্লগ", url: "/blog" },
      { label: "Link Hub", labelBn: "সংযুক্ত হোন", url: "/links" },
    ],
  },
  {
    title: "Legal",
    titleBn: "আইনি",
    links: [
      { label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", url: "/privacy-policy" },
      { label: "Terms of Service", labelBn: "সেবা শর্তাবলি", url: "/terms-of-service" },
    ],
  },
];

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  const collectionSchema = getCollectionPageSchema({
    locale,
    path: "/sitemap",
    name: isBn ? "সাইটম্যাপ — RahatVerse নেভিগেশন" : "Sitemap — RahatVerse Navigation",
    description: isBn
      ? "RahatVerse ওয়েবসাইটের সম্পূর্ণ পাবলিক নেভিগেশন — মূল পেজ, সার্ভিস, ব্লগ ও আইনি পাতার তালিকা।"
      : "Complete public navigation for RahatVerse — main pages, services, blog and legal pages.",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd type="CollectionPage" data={collectionSchema} />
      <SectionTitle
        badge={isBn ? "🗺️ সাইটম্যাপ" : "🗺️ Sitemap"}
        title="Sitemap"
        titleBn="সাইটম্যাপ"
        subtitle={isBn ? "সম্পূর্ণ ওয়েবসাইটের মানচিত্র" : "Complete website navigation map"}
        locale={locale}
        as="h1"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sitemapData.map((section, i) => (
          <FadeInUp key={i} delay={i * 0.1}>
            <GlassCard className="h-full">
              <h3 className="mb-4 text-lg font-bold border-b border-border pb-2 bn">
                {isBn ? section.titleBn : section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={`/${locale}${link.url}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors bn"
                    >
                      {isBn ? link.labelBn : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
