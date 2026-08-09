import { LinkHubSection } from "@/components/sections/LinkHubSection";
import { JsonLd, getCollectionPageSchema } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import type { Metadata } from "next";
import { absoluteUrl, localeAlternates, localePath, SITE_IMAGE, SITE_NAME } from "@/lib/seo";

// ── Links Page (Link Hub) ──────────────────────────────
interface LinksPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LinksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/links"));
  const title = isBn ? "সংযুক্ত হোন — রাহাত আহমেদের সব লিংক" : "Connect — All Links by Rahat Ahmed";
  const description = isBn
    ? "রাহাত আহমেদের সব সোশ্যাল মিডিয়া, যোগাযোগ ও প্রফেশনাল লিংক এক জায়গায় — ফেসবুক, ইউটিউব, ইনস্টাগ্রাম, গিটহাব, হোয়াটসঅ্যাপ ও ইমেইল।"
    : "All social, contact and professional links by Rahat Ahmed in one place — Facebook, YouTube, Instagram, GitHub, WhatsApp and email.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/links"),
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

async function getLinksConfigServer() {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_LINKS_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "links_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_LINKS_CONFIG;
    return validateLinksConfig(data.value) ?? DEFAULT_LINKS_CONFIG;
  } catch {
    return DEFAULT_LINKS_CONFIG;
  }
}

export default async function LinksPage({ params }: LinksPageProps) {
  const { locale } = await params;
  const config = await getLinksConfigServer();

  const collectionSchema = getCollectionPageSchema({
    locale,
    path: "/links",
    name: "Connect — All Links by Rahat Ahmed",
    nameBn: "সংযুক্ত হোন — রাহাত আহমেদের সব লিংক",
    description:
      "All social, contact and professional links by Rahat Ahmed — Facebook, YouTube, Instagram, GitHub, WhatsApp and email.",
    descriptionBn:
      "রাহাত আহমেদের সব সোশ্যাল মিডিয়া, যোগাযোগ ও প্রফেশনাল লিংক এক জায়গায় — ফেসবুক, ইউটিউব, ইনস্টাগ্রাম, গিটহাব, হোয়াটসঅ্যাপ ও ইমেইল।",
  });

  // Enrich with ItemList of visible links for crawlable discovery
  const visibleLinks = config.links.filter((l) => l.visible).slice(0, 20);
  const isBn = locale === "bn";
  const itemList = {
    "@type": "ItemList" as const,
    numberOfItems: visibleLinks.length,
    itemListElement: visibleLinks.map((link, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: isBn ? link.labelBn : link.labelEn,
      url: link.url,
    })),
  };

  const enriched = {
    ...collectionSchema,
    mainEntity: itemList,
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <JsonLd type="CollectionPage" data={enriched} />
      <JsonLd type="ItemList" data={itemList} />
      <LinkHubSection locale={locale} initialConfig={config} />
    </div>
  );
}
