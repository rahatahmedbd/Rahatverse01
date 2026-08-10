import { describe, expect, it } from "vitest";
import { validatePortfolioConfig } from "@/lib/portfolio/config";
import { validateContentConfig } from "@/lib/content/config";
import { validateServicesConfig } from "@/lib/services/config";

// Phase 4 migration payload safety: the exact values migrations 028–030 write
// into stored CMS configs must pass the app's runtime validators, otherwise
// the site would silently fall back to defaults and hide admin data.
// These fixtures replicate the post-migration document shape (old stored
// document + migration-written fields; admin content otherwise untouched).

const BASE_SECTION = {
  badgeBn: "a",
  badgeEn: "b",
  titleBn: "c",
  titleEn: "d",
  subtitleBn: "e",
  subtitleEn: "f",
};

describe("Phase 4 migration payloads pass app validators", () => {
  it("portfolio config with status + long case-study text validates", () => {
    const postMigration = {
      visible: true,
      section: { ...BASE_SECTION },
      categories: [
        { id: "pcat-all", value: "all", labelBn: "a", labelEn: "b", visible: true },
      ],
      projects: [
        {
          id: "proj-rahatverse",
          status: "live",
          title: "t",
          titleBn: "t",
          description: "d",
          descriptionBn: "d",
          longDescription: "My own digital home, designed and built end-to-end as a personal project.",
          longDescriptionBn: "আমার নিজের ডিজিটাল ঠিকানা।",
          image: "/images/gallery-web.svg",
          tags: ["Next.js 16"],
          tagsBn: ["Next.js 16"],
          liveUrl: "https://rahatahmed.site",
          githubUrl: "https://github.com/rahatahmedbd/Rahatverse01",
          category: "portfolio",
          featured: true,
          visible: true,
          completedAt: "2026",
        },
        {
          id: "proj-educare",
          status: "concept",
          title: "t",
          titleBn: "t",
          description: "d",
          descriptionBn: "d",
          image: "/images/gallery-science.svg",
          tags: ["React"],
          tagsBn: ["React"],
          liveUrl: "#",
          githubUrl: "https://github.com/rahatahmedbd",
          category: "education",
          featured: true,
          visible: true,
        },
      ],
    };
    expect(validatePortfolioConfig(postMigration)).not.toBeNull();
  });

  it("portfolio config with an invalid status is rejected", () => {
    const bad = {
      visible: true,
      section: { ...BASE_SECTION },
      categories: [
        { id: "pcat-all", value: "all", labelBn: "a", labelEn: "b", visible: true },
      ],
      projects: [
        {
          id: "p1",
          status: "shipped",
          title: "t",
          titleBn: "t",
          description: "d",
          descriptionBn: "d",
          image: "i",
          tags: [],
          liveUrl: "u",
          githubUrl: "g",
          category: "portfolio",
          featured: true,
          visible: true,
        },
      ],
    };
    expect(validatePortfolioConfig(bad)).toBeNull();
  });

  it("content config with upgraded legal pages + appended FAQ items validates", () => {
    const postMigration = {
      visible: true,
      faqSectionTitleBn: "প্রশ্নোত্তর",
      faqSectionTitleEn: "Frequently Asked Questions",
      faqSectionSubtitleBn: "সাব",
      faqSectionSubtitleEn: "Sub",
      faqCategories: [
        { id: "faq-cat-general", value: "general", labelBn: "সাধারণ", labelEn: "General", visible: true },
      ],
      faqItems: [
        {
          id: "faq-payment",
          category: "payments",
          questionBn: "পেমেন্ট কীভাবে করবো?",
          questionEn: "How do payments work?",
          answerBn: "উত্তর",
          answerEn: "Answer",
          visible: true,
        },
      ],
      searchScope: [],
      searchPlaceholderBn: "খুঁজুন",
      searchPlaceholderEn: "Search",
      legalPages: [
        {
          key: "privacy",
          titleBn: "প্রাইভেসি পলিসি",
          titleEn: "Privacy Policy",
          bodyBn: "## ১. আমরা কোন তথ্য সংগ্রহ করি\nদীর্ঘ বডি...",
          bodyEn: "## 1. Information We Collect\nLong body...",
          updatedAtBn: "৯ আগস্ট, ২০২৬",
          updatedAtEn: "August 9, 2026",
          visible: true,
        },
      ],
    };
    expect(validateContentConfig(postMigration)).not.toBeNull();
  });

  it("services config with valuesEn comparison cells validates", () => {
    const postMigration = {
      visible: true,
      section: { ...BASE_SECTION },
      services: [],
      websiteTypes: [],
      features: [],
      featuredPackages: [],
      pricingSection: { ...BASE_SECTION },
      packages: [
        {
          id: "basic",
          visible: true,
          orderValue: "basic",
          nameBn: "বেসিক",
          nameEn: "Basic",
          priceBdt: 5000,
          priceUsd: 60,
          includedPages: 3,
          includedFeatureValues: ["responsive"],
          descriptionBn: "d",
          descriptionEn: "d",
          featuresBn: ["a"],
          featuresEn: ["a"],
          popular: false,
          ctaBn: "c",
          ctaEn: "c",
        },
      ],
      comparisonSection: { ...BASE_SECTION },
      comparisonRows: [
        {
          id: "cmp-pages",
          featureBn: "পেজ সংখ্যা",
          featureEn: "Pages",
          values: { basic: "১-৩" },
          valuesEn: { basic: "1-3" },
        },
      ],
      processSection: { ...BASE_SECTION },
      processSteps: [],
      cta: {
        titleBn: null as unknown as string,
        titleEn: null as unknown as string,
        subtitleBn: "s",
        subtitleEn: "s",
        primaryLabelBn: "p",
        primaryLabelEn: "p",
        secondaryLabelBn: "s",
        secondaryLabelEn: "s",
      },
    };
    // Deliberately invalid CTA titles make the whole config invalid; fix them.
    postMigration.cta.titleBn = "অর্ডার করুন";
    postMigration.cta.titleEn = "Order now";
    expect(validateServicesConfig(postMigration)).not.toBeNull();
  });
});
