import { absoluteUrl, localePath, SITE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

// ── JSON-LD Structured Data ────────────────────────────
// Schema.org type names are intentionally case-sensitive.
type SchemaType =
  | "Person"
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "LocalBusiness"
  | "BlogPosting"
  | "CollectionPage"
  | "ProfilePage"
  | "ContactPage"
  | "BreadcrumbList"
  | "ItemList"
  | "ImageGallery"
  | "FAQPage";

interface JsonLdProps {
  type: SchemaType;
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  // Prevent a value containing `<` from prematurely ending the script element.
  const serializedJson = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializedJson }}
    />
  );
}

export function getPersonSchema() {
  return {
    "@id": absoluteUrl("/#person"),
    name: "রাহাত আহমেদ",
    alternateName: "Rahat Ahmed",
    givenName: "Rahat",
    familyName: "Ahmed",
    birthDate: "2006-06-21",
    nationality: {
      "@type": "Country",
      name: "Bangladesh",
    },
    url: SITE_URL,
    image: SITE_IMAGE,
    description:
      "রাহাত আহমেদ — শিক্ষার্থী, শিক্ষক, রক্তদাতা, BNCC ক্যাডেট ও Next.js ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
    jobTitle: "Web Developer",
    mainEntityOfPage: absoluteUrl("/bn/about"),
    memberOf: {
      "@type": "Organization",
      name: "Shantichakra Blood Society",
      url: "https://www.facebook.com/share/g/192g4S4brD/",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Full-Stack Web Developer",
      occupationalCategory: "Software Development",
      skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
    },
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "সুনামগঞ্জ সরকারি কলেজ",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "সুনামগঞ্জ",
      addressRegion: "সিলেট",
      addressCountry: "BD",
    },
    sameAs: [
      "https://www.facebook.com/rahat.ahmed.948943",
      "https://www.instagram.com/rahatahm6d/",
      "https://www.youtube.com/@RahatAhmedOfficial0",
      "https://www.tiktok.com/@rahatvives",
      "https://github.com/rahatahmedbd",
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Case Studies",
      "Web Applications",
      "E-Commerce Platforms",
    ],
  };
}

export function getWebsiteSchema() {
  return {
    "@id": absoluteUrl("/#website"),
    name: "RahatVerse — রাহাত আহমেদ",
    alternateName: SITE_NAME,
    url: SITE_URL,
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য। ওয়েব ডেভেলপমেন্ট সার্ভিস।",
    inLanguage: ["bn-BD", "en"],
    publisher: { "@id": absoluteUrl("/#person") },
    hasPart: [
      { "@type": "CollectionPage", name: "Portfolio & Case Studies", url: absoluteUrl("/bn/portfolio") },
      { "@type": "CollectionPage", name: "Services & Packages", url: absoluteUrl("/bn/services") },
      { "@type": "CollectionPage", name: "Experience & Social Service", url: absoluteUrl("/bn/experience") },
      { "@type": "CollectionPage", name: "Gallery", url: absoluteUrl("/bn/gallery") },
      { "@type": "Blog", name: "Blog", url: absoluteUrl("/bn/blog") },
      { "@type": "WebPage", name: "Privacy Policy", url: absoluteUrl("/bn/privacy-policy") },
      { "@type": "WebPage", name: "Terms of Service", url: absoluteUrl("/bn/terms-of-service") },
    ],
  };
}

// Homepage WebPage schema — ties the page to the Person entity (Rahat Ahmed)
// via a stable @id, and to the WebSite via isPartOf.
export function getWebPageSchema(locale = "bn") {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale));
  return {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: isBn ? "রাহাত আহমেদ — হোমপেজ" : "Rahat Ahmed — Home",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    mainEntity: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? ["bn-BD", "en"] : ["en", "bn-BD"],
  };
}

// Generic entity-tied WebPage schema for pages whose primary subject is
// Rahat Ahmed / RahatVerse content but which are neither collections nor
// profile/contact pages (e.g. experience, achievements, order). Every page is
// tied to the single site-wide Person (/#person) and WebSite (/#website)
// entities so they reinforce entity authority instead of fragmenting it.
export function getEntityWebPageSchema({
  locale,
  path,
  name,
  nameBn,
}: {
  locale: string;
  path: string;
  name: string;
  nameBn: string;
}) {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, path));
  return {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: isBn ? nameBn : name,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    mainEntity: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? ["bn-BD", "en"] : ["en", "bn-BD"],
  };
}

export function getPortfolioSchema(locale = "bn") {
  const isBn = locale === "bn";
  return {
    "@id": `${absoluteUrl(`/${locale}/portfolio`)}#collection`,
    url: absoluteUrl(`/${locale}/portfolio`),
    name: isBn ? "রাহাতভার্স — পোর্টফোলিও ও কেস স্টাডি" : "RahatVerse — Portfolio & Case Studies",
    description: isBn
      ? "রাহাত আহমেদ কর্তৃক নির্মিত বাস্তব ওয়েব প্রজেক্ট ও সমাধান।"
      : "Featured web projects, case studies, and real-world solutions engineered by Rahat Ahmed.",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? "bn-BD" : "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "RahatVerse — Personal Ecosystem & CMS",
          url: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shantichakra Blood Society Portal",
          url: absoluteUrl(`/${locale}/experience`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "EduCare — Interactive Tutoring System",
          url: absoluteUrl(`/${locale}/portfolio`),
        },
      ],
    },
  };
}

// ProfilePage (About) — ties the page to the global Person entity (Rahat Ahmed).
export function getProfilePageSchema(locale = "bn") {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, "/about"));
  return {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: isBn ? "রাহাত আহমেদ সম্পর্কে" : "About Rahat Ahmed",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    mainEntity: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? ["bn-BD", "en"] : ["en", "bn-BD"],
  };
}

// ContactPage — ties the page to the global Person entity and the site.
export function getContactPageSchema(locale = "bn") {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, "/contact"));
  return {
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: isBn ? "যোগাযোগ — রাহাত আহমেদ" : "Contact Rahat Ahmed",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    mainEntity: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? ["bn-BD", "en"] : ["en", "bn-BD"],
  };
}

// ── CollectionPage helpers ────────────────────────────
export function getCollectionPageSchema({
  locale,
  path,
  name,
  nameBn,
  description,
  descriptionBn,
}: {
  locale: string;
  path: string;
  name: string;
  nameBn?: string;
  description: string;
  descriptionBn?: string;
}) {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, path));
  return {
    "@id": `${canonical}#collection`,
    url: canonical,
    name: isBn && nameBn ? nameBn : name,
    description: isBn && descriptionBn ? descriptionBn : description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? "bn-BD" : "en",
  };
}

export function getBlogCollectionSchema({
  locale,
  posts,
}: {
  locale: string;
  posts: Array<{ slug: string; title: string; titleBn?: string | null }>;
}) {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, "/blog"));
  return {
    "@id": `${canonical}#collection`,
    url: canonical,
    name: isBn ? "ব্লগ — রাহাত আহমেদের লেখা" : "Blog — Articles by Rahat Ahmed",
    description: isBn
      ? "ওয়েব ডেভেলপমেন্ট, প্রযুক্তি, শিক্ষা, রক্তদান ও সমাজসেবা নিয়ে রাহাত আহমেদের লেখা ও অভিজ্ঞতা।"
      : "Articles and insights by Rahat Ahmed on web development, technology, education, blood donation and social service.",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? "bn-BD" : "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: isBn && post.titleBn ? post.titleBn : post.title,
        url: absoluteUrl(localePath(locale, `/blog/${post.slug}`)),
      })),
    },
  };
}

export function getGalleryCollectionSchema({
  locale,
  images,
}: {
  locale: string;
  images: Array<{ title?: string | null; title_bn?: string | null; url: string; category: string }>;
}) {
  const isBn = locale === "bn";
  const canonical = absoluteUrl(localePath(locale, "/gallery"));
  return {
    "@id": `${canonical}#collection`,
    url: canonical,
    name: isBn ? "গ্যালারি — রাহাত আহমেদ" : "Gallery — Rahat Ahmed",
    description: isBn
      ? "রাহাত আহমেদের যাত্রার মুহূর্তগুলো — শিক্ষা, বিজ্ঞান মেলা, বিএনসিসি, রক্তদান ড্রাইভ ও ওয়েব ডেভেলপমেন্ট।"
      : "Photos and moments from Rahat Ahmed's journey — education, science fairs, BNCC, blood donation drives and web development.",
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#person") },
    author: { "@id": absoluteUrl("/#person") },
    inLanguage: isBn ? "bn-BD" : "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: images.length,
      itemListElement: images.slice(0, 20).map((img, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name:
          (isBn ? img.title_bn || img.title : img.title || img.title_bn) ||
          (isBn ? "গ্যালারি ছবি" : "Gallery image"),
        image: img.url,
        url: canonical,
      })),
    },
  };
}

// ── FAQPage ───────────────────────────────────────────
// Only emit this for content that is visibly rendered on the page (the FAQ
// accordion keeps every answer in the DOM). Question/answer text must match
// the visible text exactly.
export function getFAQPageSchema({
  locale,
  items,
}: {
  locale: string;
  items: Array<{
    questionBn: string;
    questionEn: string;
    answerBn: string;
    answerEn: string;
  }>;
}) {
  const isBn = locale === "bn";
  return {
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: isBn ? item.questionBn : item.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: isBn ? item.answerBn : item.answerEn,
      },
    })),
  };
}

// ── BreadcrumbList ────────────────────────────────────
export function getBreadcrumbListSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getLocalBusinessSchema() {
  return {
    name: SITE_NAME,
    description: "ওয়েব ডেভেলপমেন্ট সার্ভিস",
    url: SITE_URL,
    image: SITE_IMAGE,
    telephone: "+8801626224878",
    email: "rahatbd20505@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "সুনামগঞ্জ",
      addressRegion: "সিলেট",
      addressCountry: "BD",
    },
    priceRange: "৳5,000 - ৳30,000",
    openingHours: "Mo-Su 09:00-21:00",
    sameAs: [
      "https://www.facebook.com/rahat.ahmed.948943",
      "https://www.instagram.com/rahatahm6d/",
    ],
  };
}
