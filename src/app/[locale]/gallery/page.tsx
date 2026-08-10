/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Gallery from "@/components/gallery/Gallery";
import { FadeInUp } from "@/components/animations/FadeIn";
import { JsonLd, getGalleryCollectionSchema, getCollectionPageSchema } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/gallery"));
  const title = isBn ? "গ্যালারি — রাহাত আহমেদ" : "Gallery — Rahat Ahmed";
  const description = isBn
    ? "রাহাত আহমেদের যাত্রার মুহূর্তগুলো — শিক্ষা, বিজ্ঞান মেলা, বিএনসিসি, রক্তদান ড্রাইভ ও ওয়েব ডেভেলপমেন্ট।"
    : "Photos and moments from Rahat Ahmed's journey — education, science fairs, BNCC, blood donation drives and web development.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/gallery"),
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

const FALLBACK_GALLERY_IMAGES = [
  {
    id: "default-1",
    public_id: "rahatverse/ssc-2025",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-2025",
    category: "achievements",
    title: "SSC 2025 — GPA 5.00 (A+)",
    title_bn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন",
    description: "SSC 2025 GPA 5.00 A+ achievement",
    description_bn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+) অর্জন",
    width: null,
    height: null,
  },
  {
    id: "default-2",
    public_id: "rahatverse/ssc-songbordhona",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-songbordhona",
    category: "achievements",
    title: "Meritorious Student Honor Ceremony",
    title_bn: "কৃতী শিক্ষার্থী সংবর্ধনা",
    description: "Meritorious Student Honor Ceremony",
    description_bn: "কৃতী শিক্ষার্থী সংবর্ধনা ও সম্মাননা স্মারক",
    width: null,
    height: null,
  },
  {
    id: "default-3",
    public_id: "rahatverse/ssc-crest-shantichakra",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-crest-shantichakra",
    category: "achievements",
    title: "Shantichakra Blood Society Recognition Crest",
    title_bn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
    description: "Recognition crest from Shantichakra Blood Society",
    description_bn: "শান্তিচক্র ব্লাড সোসাইটি কর্তৃক বিশেষ সম্মাননা",
    width: null,
    height: null,
  },
  {
    id: "default-4",
    public_id: "rahatverse/shantichakra-blood-society",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-blood-society",
    category: "blood-donation",
    title: "Shantichakra Blood Society Activities",
    title_bn: "শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম",
    description: "Shantichakra Blood Society activities",
    description_bn: "শান্তিচক্র ব্লাড সোসাইটির স্বেচ্ছাসেবী কার্যক্রম",
    width: null,
    height: null,
  },
  {
    id: "default-5",
    public_id: "rahatverse/46-science-fair-2025",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/46-science-fair-2025",
    category: "achievements",
    title: "46th National Science Fair 2025",
    title_bn: "৪৬তম বিজ্ঞান মেলা ২০২৫",
    description: "46th National Science Fair 2025",
    description_bn: "৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫-এ অংশগ্রহণ ও পুরস্কার অর্জন",
    width: null,
    height: null,
  },
  {
    id: "default-6",
    public_id: "rahatverse/44-science-fair-2024",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/44-science-fair-2024",
    category: "achievements",
    title: "44th National Science Exhibition 2024",
    title_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪",
    description: "44th National Science Exhibition 2024",
    description_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪-এ ১ম স্থান অর্জন",
    width: null,
    height: null,
  },
  {
    id: "default-7",
    public_id: "rahatverse/srijonshil-medha-2024",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/srijonshil-medha-2024",
    category: "achievements",
    title: "Creative Talent Search 2024",
    title_bn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
    description: "Creative Talent Search 2024",
    description_bn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিভাগে ১ম স্থান",
    width: null,
    height: null,
  },
  {
    id: "default-8",
    public_id: "rahatverse/45-science-fair-2023",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/45-science-fair-2023",
    category: "achievements",
    title: "45th National Science Fair 2023",
    title_bn: "৪৫তম বিজ্ঞান মেলা ২০২৩",
    description: "45th National Science Fair 2023",
    description_bn: "৪৫তম জাতীয় বিজ্ঞান মেলায় ১ম স্থান অর্জন",
    width: null,
    height: null,
  },
  {
    id: "default-9",
    public_id: "rahatverse/42-science-fair-2020",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/42-science-fair-2020",
    category: "achievements",
    title: "42nd National Science Fair 2020",
    title_bn: "৪২তম বিজ্ঞান মেলা ২০২০",
    description: "42nd National Science Fair 2020",
    description_bn: "৪২তম জাতীয় বিজ্ঞান মেলায় ১ম স্থান অর্জন",
    width: null,
    height: null,
  },
  {
    id: "default-10",
    public_id: "rahatverse/fs-coaching-center",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/fs-coaching-center",
    category: "experience",
    title: "FS Coaching Center",
    title_bn: "FS কোচিং সেন্টার",
    description: "FS Coaching Center at Jibdara Bazar",
    description_bn: "জীবদাড়া বাজারে FS কোচিং সেন্টার পরিচালনা",
    width: null,
    height: null,
  },
  {
    id: "default-11",
    public_id: "rahatverse/helping-hand-org",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/helping-hand-org",
    category: "social-service",
    title: "Helping Hand Organization",
    title_bn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
    description: "Helping Hand Organization activities",
    description_bn: "হেল্পিং হ্যান্ড অর্গানাইজেশনের স্বেচ্ছাসেবী কার্যক্রম",
    width: null,
    height: null,
  },
  {
    id: "default-12",
    public_id: "rahatverse/father-photo",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/father-photo",
    category: "memorial",
    title: "Late Md. Farid Ahmed — Beloved Father",
    title_bn: "মরহুম জনাব ফরিদ আহমেদ — শ্রদ্ধেয় পিতা",
    description: "Late Md. Farid Ahmed",
    description_bn: "মরহুম জনাব ফরিদ আহমেদ — আমার শ্রদ্ধেয় পিতা",
    width: null,
    height: null,
  },
];

async function getGalleryImages() {
  try {
    const supabase = await createClient();
    if (!supabase) return FALLBACK_GALLERY_IMAGES;
    const { data: images, error } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !images || images.length === 0) return FALLBACK_GALLERY_IMAGES;
    return images;
  } catch {
    return FALLBACK_GALLERY_IMAGES;
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const images = await getGalleryImages();

  const collectionSchema = getCollectionPageSchema({
    locale,
    path: "/gallery",
    name: "Gallery — Rahat Ahmed",
    nameBn: "গ্যালারি — রাহাত আহমেদ",
    description:
      "Photos and moments from Rahat Ahmed's journey — education, science fairs, BNCC, blood donation drives and web development.",
    descriptionBn:
      "রাহাত আহমেদের যাত্রার মুহূর্তগুলো — শিক্ষা, বিজ্ঞান মেলা, বিএনসিসি, রক্তদান ড্রাইভ ও ওয়েব ডেভেলপমেন্ট।",
  });

  const gallerySchema = getGalleryCollectionSchema({
    locale,
    images: images.map((img: any) => ({
      title: img.title,
      title_bn: img.title_bn,
      url: img.url,
      category: img.category,
    })),
  });

  // Merge gallery ItemList into collection for richer graph
  const enrichedGallery = {
    ...collectionSchema,
    mainEntity: gallerySchema.mainEntity,
  };

  return (
    <div className="min-h-screen py-12">
      <JsonLd type="CollectionPage" data={enrichedGallery} />
      <JsonLd type="ImageGallery" data={enrichedGallery} />
      <div className="container mx-auto px-4">
        <FadeInUp>
          <div className="text-center mb-12">
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              {isBn ? "গ্যালারি" : "Gallery"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isBn ? "আমার যাত্রার মুহূর্তগুলো দেখুন" : "See moments from my journey"}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              {isBn ? (
                <>
                  এই ছবিগুলোর পেছনের গল্প জানতে দেখুন{" "}
                  <Link href={`/${locale}/achievements`} className="font-medium text-primary hover:underline">
                    আমার অর্জন
                  </Link>{" "}
                  ও{" "}
                  <Link href={`/${locale}/experience`} className="font-medium text-primary hover:underline">
                    অভিজ্ঞতার পেজ
                  </Link>
                  ।
                </>
              ) : (
                <>
                  Every photo here has a story — read about{" "}
                  <Link href={`/${locale}/achievements`} className="font-medium text-primary hover:underline">
                    my achievements
                  </Link>{" "}
                  and{" "}
                  <Link href={`/${locale}/experience`} className="font-medium text-primary hover:underline">
                    experience
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <Gallery locale={locale} initialImages={images as any} />
        </FadeInUp>
      </div>
    </div>
  );
}
