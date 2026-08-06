import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "https://rahatverse01.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "RahatVerse";
export const DEFAULT_LOCALE = "bn";
export const SITE_IMAGE =
  "https://res.cloudinary.com/kbc3dfnj/image/upload/c_fill,g_face,h_630,w_1200/f_auto/q_auto/rahatverse/profile";

function normalisePath(path = "") {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "") {
  return `${SITE_URL}${normalisePath(path)}`;
}

export function localePath(locale: string, path = "") {
  return `/${locale}${normalisePath(path)}`;
}

export function localeAlternates(locale: string, path = ""): Metadata["alternates"] {
  const normalisedPath = normalisePath(path);

  return {
    canonical: localePath(locale, normalisedPath),
    languages: {
      bn: localePath("bn", normalisedPath),
      en: localePath("en", normalisedPath),
    },
  };
}

export interface BlogSchemaInput {
  title: string;
  description?: string | null;
  slug: string;
  locale: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: string | null;
  tags?: string[] | null;
  readingTime?: number | null;
}

export function getBlogPostingSchema({
  title,
  description,
  slug,
  locale,
  coverImage,
  publishedAt,
  updatedAt,
  author,
  tags,
  readingTime,
}: BlogSchemaInput) {
  const postUrl = absoluteUrl(localePath(locale, `/blog/${slug}`));

  return {
    headline: title,
    description: description || undefined,
    mainEntityOfPage: postUrl,
    url: postUrl,
    image: coverImage || SITE_IMAGE,
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || publishedAt || undefined,
    author: {
      "@type": "Person",
      name: author || "Rahat Ahmed",
      url: absoluteUrl(localePath(locale)),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icons/icon-512.svg"),
      },
    },
    inLanguage: locale === "bn" ? "bn-BD" : "en",
    keywords: tags?.join(", ") || undefined,
    timeRequired: readingTime ? `PT${readingTime}M` : undefined,
  };
}
