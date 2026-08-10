import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "https://www.rahatahmed.site").replace(/\/$/, "");
export const SITE_NAME = "RahatVerse";
export const DEFAULT_LOCALE = "bn";
export const SITE_IMAGE =
  "https://res.cloudinary.com/kbc3dfnj/image/upload/c_fill,g_face,h_630,w_1200/f_auto/q_auto/v1786125213/rahatverse/profile/1786125213546.jpg";

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
    canonical: absoluteUrl(localePath(locale, normalisedPath)),
    languages: {
      bn: absoluteUrl(localePath("bn", normalisedPath)),
      en: absoluteUrl(localePath("en", normalisedPath)),
      "x-default": absoluteUrl(localePath("bn", normalisedPath)),
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
  // `author` is accepted for API compatibility; the schema always references
  // the single site-wide Person entity (/#person) to avoid entity duplication.
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
    // Entity references keep every BlogPosting tied to the single site-wide
    // Person (/#person) and WebSite (/#website) entities instead of nesting
    // duplicate partial entities on every article.
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#website") },
    inLanguage: locale === "bn" ? "bn-BD" : "en",
    keywords: tags?.join(", ") || undefined,
    timeRequired: readingTime ? `PT${readingTime}M` : undefined,
  };
}
