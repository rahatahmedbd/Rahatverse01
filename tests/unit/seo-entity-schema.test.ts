import { describe, expect, it } from "vitest";
import { getBlogPostingSchema, absoluteUrl } from "@/lib/seo";
import {
  getFAQPageSchema,
  getPersonSchema,
  getWebsiteSchema,
} from "@/components/seo/JsonLd";

// Phase 4 entity-graph guarantees:
//  * One Person (/#person) and one WebSite (/#website) entity site-wide.
//  * BlogPosting author → /#person, publisher → /#website (no duplicate
//    partial entities nested per article).
//  * FAQPage schema mirrors visible question/answer text exactly.
describe("Phase 4 — SEO entity graph", () => {
  describe("getPersonSchema", () => {
    it("keeps the stable /#person @id and public facts", () => {
      const person = getPersonSchema();
      expect(person["@id"]).toBe(absoluteUrl("/#person"));
      expect(person.name).toBe("রাহাত আহমেদ");
      expect(person.alternateName).toBe("Rahat Ahmed");
      expect(person.givenName).toBe("Rahat");
      expect(person.familyName).toBe("Ahmed");
      expect(person.birthDate).toBe("2006-06-21");
      expect(person.nationality).toEqual({
        "@type": "Country",
        name: "Bangladesh",
      });
      expect(person.memberOf).toEqual({
        "@type": "Organization",
        name: "Shantichakra Blood Society",
        url: "https://www.facebook.com/share/g/192g4S4brD/",
      });
      // sameAs profiles stay stable — no contradictory identities.
      expect(person.sameAs).toContain("https://github.com/rahatahmedbd");
      expect(person.sameAs).toHaveLength(5);
    });
  });

  describe("getWebsiteSchema", () => {
    it("keeps the stable /#website @id and references the Person publisher", () => {
      const website = getWebsiteSchema();
      expect(website["@id"]).toBe(absoluteUrl("/#website"));
      expect(website.publisher).toEqual({ "@id": absoluteUrl("/#person") });
    });
  });

  describe("getBlogPostingSchema", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post",
      slug: "test-post",
      locale: "en",
      coverImage: null,
      publishedAt: "2026-08-09T00:00:00.000Z",
      updatedAt: null,
      author: "Rahat Ahmed",
      tags: ["Next.js"],
      readingTime: 5,
    });

    it("references the single Person entity as author", () => {
      expect(schema.author).toEqual({ "@id": absoluteUrl("/#person") });
    });

    it("references the single WebSite entity as publisher", () => {
      expect(schema.publisher).toEqual({ "@id": absoluteUrl("/#website") });
    });

    it("does not nest duplicate Person/Organization objects", () => {
      const serialized = JSON.stringify(schema);
      expect(serialized).not.toContain('"@type":"Organization"');
      expect(serialized).not.toContain('"@type":"Person"');
    });

    it("keeps article-level fields intact", () => {
      expect(schema.headline).toBe("Test Post");
      expect(schema.timeRequired).toBe("PT5M");
      expect(schema.keywords).toBe("Next.js");
      expect(schema.mainEntityOfPage).toBe(absoluteUrl("/en/blog/test-post"));
    });
  });

  describe("getFAQPageSchema", () => {
    it("mirrors visible question/answer text exactly, localized", () => {
      const items = [
        {
          questionBn: "খরচ কত?",
          questionEn: "How much?",
          answerBn: "৳৫,০০০ থেকে।",
          answerEn: "From ৳5,000.",
        },
      ];
      const en = getFAQPageSchema({ locale: "en", items });
      const bn = getFAQPageSchema({ locale: "bn", items });

      expect(en.mainEntity).toEqual([
        {
          "@type": "Question",
          name: "How much?",
          acceptedAnswer: { "@type": "Answer", text: "From ৳5,000." },
        },
      ]);
      expect(bn.mainEntity).toEqual([
        {
          "@type": "Question",
          name: "খরচ কত?",
          acceptedAnswer: { "@type": "Answer", text: "৳৫,০০০ থেকে।" },
        },
      ]);
    });
  });
});
