import { absoluteUrl, SITE_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

// ── JSON-LD Structured Data ────────────────────────────
// Schema.org type names are intentionally case-sensitive.
type SchemaType = "Person" | "Organization" | "WebSite" | "LocalBusiness" | "BlogPosting";

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
