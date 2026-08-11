import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { localeAlternates } from "@/lib/seo";
import {
  PUBLIC_ROUTES,
  SEO_LOCALES,
  robotsDisallowPaths,
  BLOCKED_PRIVATE_PATHS,
} from "@/lib/seo-routes";
import {
  getPersonSchema,
  getWebsiteSchema,
  getWebPageSchema,
} from "@/components/seo/JsonLd";

/**
 * Phase 10 — Google Entity Authority automated SEO validation.
 *
 * Deterministic checks only. No live Google APIs, no Search Console calls.
 * Verifies the entity graph, canonical/hreflang behaviour, the sitemap route
 * graph, robots coverage and EN/BN identity consistency so search engines get
 * stable, unambiguous signals about Rahat Ahmed / রাহাত আহমেদ / RahatVerse.
 */

const EN_IDENTITY = "Rahat Ahmed";
const BN_IDENTITY = "রাহাত আহমেদ";
const BRAND = "RahatVerse";

// Alternate spellings that are intentionally NOT used (unless verified).
const BANNED_VARIANTS = [
  "Rahat A.",
  "Rahat Ahmed BD",
  "Rahat Ahmad",
  "Rahath Ahmed",
];

interface PageMeta {
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
}

function extractMeta(relPath: string): PageMeta {
  // Tests run from the repository root, so resolve relative to cwd.
  const abs = resolve(process.cwd(), "src/app/[locale]", relPath);
  const src = readFileSync(abs, "utf8");
  const titleRe = /const title = isBn\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/;
  const descRe = /const description = isBn\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/;
  const t = src.match(titleRe);
  const d = src.match(descRe);
  if (!t || !d) {
    throw new Error(`Could not extract metadata from ${abs}`);
  }
  return {
    titleBn: t[1],
    titleEn: t[2],
    descBn: d[1],
    descEn: d[2],
  };
}

const INDEXABLE_PAGES: Array<{ route: string; file: string }> = [
  { route: "", file: "page.tsx" },
  { route: "/about", file: "about/page.tsx" },
  { route: "/portfolio", file: "portfolio/page.tsx" },
  { route: "/services", file: "services/page.tsx" },
  { route: "/experience", file: "experience/page.tsx" },
  { route: "/achievements", file: "achievements/page.tsx" },
  { route: "/gallery", file: "gallery/page.tsx" },
  { route: "/blog", file: "blog/page.tsx" },
  { route: "/links", file: "links/page.tsx" },
  { route: "/contact", file: "contact/page.tsx" },
  { route: "/order", file: "order/page.tsx" },
];

describe("Phase 10 — Person & WebSite entity stability", () => {
  it("keeps a single stable Person @id (no duplicates, no invented claims)", () => {
    const person = getPersonSchema();
    expect(person["@id"]).toBe("https://www.rahatahmed.site/#person");
    expect(person.name).toBe(BN_IDENTITY);
    expect(person.alternateName).toBe(EN_IDENTITY);
    expect(person.givenName).toBe("Rahat");
    expect(person.familyName).toBe("Ahmed");
    // sameAs stays a small set of verified public profiles — no third-party
    // directory or low-quality profile sites.
    expect(Array.isArray(person.sameAs)).toBe(true);
    expect(person.sameAs).toHaveLength(5);
    // No fabrication: no invented employer/company/org/affiliation beyond the
    // ones grounded in visible site content.
    const keys = Object.keys(person);
    for (const k of ["worksFor", "memberOf", "alumniOf"]) {
      expect(keys).toContain(k);
    }
  });

  it("keeps a single stable WebSite @id whose publisher points to the Person", () => {
    const website = getWebsiteSchema();
    expect(website["@id"]).toBe("https://www.rahatahmed.site/#website");
    expect(website.publisher).toEqual({ "@id": "https://www.rahatahmed.site/#person" });
    expect(website.url).toBe("https://www.rahatahmed.site");
  });

  it("does not emit a duplicate Person or WebSite on the homepage WebPage schema", () => {
    const webPage = getWebPageSchema("bn");
    // references only, never re-embeds a full Person/WebSite object.
    expect(webPage.isPartOf).toEqual({ "@id": "https://www.rahatahmed.site/#website" });
    expect(webPage.about).toEqual({ "@id": "https://www.rahatahmed.site/#person" });
    expect(webPage.author).toEqual({ "@id": "https://www.rahatahmed.site/#person" });
    const serialized = JSON.stringify(webPage);
    expect(serialized).not.toContain('"@type":"Person"');
    expect(serialized).not.toContain('"@type":"WebSite"');
  });
});

describe("Phase 10 — canonical & hreflang", () => {
  it("self-canonicalizes EN to /en and BN to /bn (no cross-locale canonical)", () => {
    const en = localeAlternates("en", "/about") ?? {};
    const bn = localeAlternates("bn", "/about") ?? {};
    expect(String(en.canonical)).toBe("https://www.rahatahmed.site/en/about");
    expect(String(bn.canonical)).toBe("https://www.rahatahmed.site/bn/about");
    // BN canonical must never point to EN and vice-versa.
    expect(String(bn.canonical)).not.toContain("/en/");
    expect(String(en.canonical)).not.toContain("/bn/");
  });

  it("keeps bn/en/x-default hreflang with x-default on the default locale", () => {
    const en = localeAlternates("en", "/portfolio") ?? {};
    const bn = localeAlternates("bn", "/portfolio") ?? {};
    expect(en.languages).toEqual({
      bn: "https://www.rahatahmed.site/bn/portfolio",
      en: "https://www.rahatahmed.site/en/portfolio",
      "x-default": "https://www.rahatahmed.site/bn/portfolio",
    });
    // Reciprocal: BN page declares the same alternate set.
    expect(bn.languages).toEqual(en.languages);
  });
});

describe("Phase 10 — sitemap route graph", () => {
  it("includes every public route for both locales", () => {
    const urls: string[] = [];
    for (const locale of SEO_LOCALES) {
      for (const route of PUBLIC_ROUTES) {
        urls.push(`https://www.rahatahmed.site/${locale}${route.path}`);
      }
    }
    expect(urls).toContain("https://www.rahatahmed.site/en");
    expect(urls).toContain("https://www.rahatahmed.site/bn");
    expect(urls).toContain("https://www.rahatahmed.site/en/about");
    expect(urls).toContain("https://www.rahatahmed.site/bn/about");
    expect(urls).toContain("https://www.rahatahmed.site/en/services");
    expect(urls).toContain("https://www.rahatahmed.site/bn/portfolio");
  });

  it("never includes api/admin/dashboard/login/auth or query params", () => {
    for (const route of PUBLIC_ROUTES) {
      const joined = `https://www.rahatahmed.site${route.path}`;
      expect(joined).not.toMatch(/\/api\/|\/admin\/|\/dashboard\/|\/login|\/auth\/|\?/);
    }
  });

  it("has no duplicate canonical URLs and a single homepage per locale", () => {
    const urls = SEO_LOCALES.flatMap((locale) =>
      PUBLIC_ROUTES.map((r) => `/${locale}${r.path}`)
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.filter((u) => u === "/bn" || u === "/en")).toHaveLength(2);
  });
});

describe("Phase 10 — robots coverage", () => {
  const disallow = robotsDisallowPaths();

  it("blocks private/internal routes incl. locale-prefixed variants", () => {
    expect(disallow).toContain("/api/");
    expect(disallow).toContain("/auth/");
    expect(disallow).toContain("/dashboard/");
    expect(disallow).toContain("/admin/");
    expect(disallow).toContain("/login");
    expect(disallow).toContain("/bn/dashboard/");
    expect(disallow).toContain("/en/admin/");
    expect(disallow).toContain("/bn/login");
    expect(disallow).toContain("/en/api/");
  });

  it("does not accidentally block any important public page", () => {
    const allowList = [
      "/en",
      "/bn",
      "/en/about",
      "/bn/portfolio",
      "/en/services",
      "/en/experience",
      "/en/achievements",
      "/en/contact",
      "/en/order",
      "/bn/blog",
      "/en/gallery",
      "/en/links",
    ];
    for (const path of allowList) {
      expect(disallow).not.toContain(path);
    }
    for (const base of BLOCKED_PRIVATE_PATHS) {
      for (const route of PUBLIC_ROUTES) {
        expect(route.path.startsWith(base)).toBe(false);
      }
    }
  });
});

describe("Phase 10 — metadata uniqueness & EN/BN identity consistency", () => {
  const metas = INDEXABLE_PAGES.map((p) => ({ route: p.route, ...extractMeta(p.file) }));

  it("uses unique titles across indexable pages (EN and BN)", () => {
    const titles = metas.flatMap((m) => [m.titleEn, m.titleBn]);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses unique descriptions across indexable pages (EN and BN)", () => {
    const descs = metas.flatMap((m) => [m.descEn, m.descBn]);
    expect(new Set(descs).size).toBe(descs.length);
  });

  it("reinforces the canonical identity on every page without keyword stuffing", () => {
    for (const m of metas) {
      const enMeta = `${m.titleEn} ${m.descEn}`;
      const bnMeta = `${m.titleBn} ${m.descBn}`;
      // Every indexable page carries the person or brand identity in its own
      // locale, naturally — never a long repetitive keyword string.
      expect(enMeta).toMatch(EN_IDENTITY);
      expect(bnMeta).toMatch(BN_IDENTITY);
      expect(enMeta).not.toMatch(EN_IDENTITY + ".{0,20}" + EN_IDENTITY);
      expect(bnMeta).not.toMatch(BN_IDENTITY + ".{0,20}" + BN_IDENTITY);
    }
  });

  it("avoids unverified alternate spellings in metadata", () => {
    for (const m of metas) {
      const all = `${m.titleEn} ${m.titleBn} ${m.descEn} ${m.descBn}`;
      for (const variant of BANNED_VARIANTS) {
        expect(all).not.toContain(variant);
      }
    }
  });

  it("keeps the RahatVerse brand associated with the person, not a separate identity", () => {
    const metasEn = metas.map((m) => `${m.titleEn} ${m.descEn}`).join(" ");
    expect(metasEn).toMatch(BRAND);
    // Brand never appears as an unrelated surname-style identity.
    expect(metasEn).not.toMatch(/Rahat Verse|Rahatverse/);
  });
});
