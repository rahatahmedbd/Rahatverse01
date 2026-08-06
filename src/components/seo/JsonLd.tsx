// ── JSON-LD Structured Data ────────────────────────────
// Provides search engines with structured information

interface JsonLdProps {
  type: "person" | "organization" | "website" | "localBusiness";
  data: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Pre-defined Schema Generators ──────────────────────

export function getPersonSchema() {
  return {
    name: "রাহাত আহমেদ",
    alternateName: "Rahat Ahmed",
    url: "https://rahatverse01.vercel.app",
    image: "https://rahatverse01.vercel.app/icons/icon-512.svg",
    jobTitle: "Web Developer",
    worksFor: {
      "@type": "Organization",
      name: "RahatVerse",
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
    alternateName: "RahatVerse",
    url: "https://rahatverse01.vercel.app",
    description:
      "শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য। ওয়েব ডেভেলপমেন্ট সার্ভিস।",
    inLanguage: ["bn", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rahatverse01.vercel.app/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Person",
      name: "রাহাত আহমেদ",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    name: "RahatVerse",
    description: "ওয়েব ডেভেলপমেন্ট সার্ভিস",
    url: "https://rahatverse01.vercel.app",
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
