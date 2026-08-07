import { absoluteUrl, SITE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

// ── JSON-LD Structured Data ────────────────────────────
// Schema.org type names are intentionally case-sensitive.
type SchemaType = "Person" | "Organization" | "WebSite" | "LocalBusiness" | "BlogPosting" | "CollectionPage";

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
    name: "রাহাত আহমেদ",
    alternateName: "Rahat Ahmed",
    url: SITE_URL,
    image: SITE_IMAGE,
    jobTitle: "Web Developer",
    mainEntityOfPage: absoluteUrl("/bn/portfolio"),
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
    name: "RahatVerse — রাহাত আহমেদ",
    alternateName: SITE_NAME,
    url: SITE_URL,
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য। ওয়েব ডেভেলপমেন্ট সার্ভিস।",
    inLanguage: ["bn-BD", "en"],
    publisher: {
      "@type": "Person",
      name: "রাহাত আহমেদ",
      url: absoluteUrl("/bn"),
    },
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

export function getPortfolioSchema(locale = "bn") {
  const isBn = locale === "bn";
  return {
    name: isBn ? "রাহাতভার্স — পোর্টফোলিও ও কেস স্টাডি" : "RahatVerse — Portfolio & Case Studies",
    url: absoluteUrl(`/${locale}/portfolio`),
    description: isBn
      ? "রাহাত আহমেদ কর্তৃক নির্মিত বাস্তব ওয়েব প্রজেক্ট ও সমাধান।"
      : "Featured web projects, case studies, and real-world solutions engineered by Rahat Ahmed.",
    author: {
      "@type": "Person",
      name: "Rahat Ahmed",
      url: absoluteUrl(`/${locale}`),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "RahatVerse — Personal Ecosystem & CMS",
          url: "https://rahatverse01.vercel.app",
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
