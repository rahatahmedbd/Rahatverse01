import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import {
  DEFAULT_ABOUT_CONFIG,
  validateAboutConfig,
} from "@/lib/about/config";
import {
  DEFAULT_PORTFOLIO_CONFIG,
  validatePortfolioConfig,
} from "@/lib/portfolio/config";
import { ABOUT_ICON_MAP, ACHIEVEMENT_ICON_MAP } from "@/lib/about/icons";

const MIGRATION = "supabase/migrations/034_about_depth_from_legacy_site.sql";

/** Reads every `$TAG$ ... $TAG$` payload of one dollar-quote tag, in order. */
function dollarBlocks(sql: string, tag: string): unknown[] {
  const pattern = new RegExp(`\\$${tag}\\$([\\s\\S]*?)\\$${tag}\\$`, "g");
  return [...sql.matchAll(pattern)].map((m) => JSON.parse(m[1]));
}

describe("about config depth", () => {
  it("tells the full story in four biography paragraphs", () => {
    const paragraphs = DEFAULT_ABOUT_CONFIG.biography.paragraphs;
    expect(paragraphs).toHaveLength(4);
    for (const paragraph of paragraphs) {
      expect(paragraph.bn.trim().length).toBeGreaterThan(40);
      expect(paragraph.en.trim().length).toBeGreaterThan(40);
    }
  });

  it("surfaces the organisation role, donation count and languages", () => {
    const ids = DEFAULT_ABOUT_CONFIG.personalInfo.map((item) => item.id);
    expect(ids).toEqual(
      expect.arrayContaining(["organization-role", "blood-donations", "languages"])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("lists the full set of interests without duplicates", () => {
    const ids = DEFAULT_ABOUT_CONFIG.interests.map((item) => item.id);
    expect(ids.length).toBeGreaterThanOrEqual(8);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every icon inside the supported icon maps", () => {
    for (const item of DEFAULT_ABOUT_CONFIG.personalInfo) {
      expect(Object.keys(ABOUT_ICON_MAP)).toContain(item.icon);
    }
    for (const item of DEFAULT_ABOUT_CONFIG.interests) {
      expect(Object.keys(ABOUT_ICON_MAP)).toContain(item.icon);
    }
    for (const achievement of DEFAULT_ABOUT_CONFIG.achievements) {
      expect(Object.keys(ACHIEVEMENT_ICON_MAP)).toContain(achievement.icon);
    }
  });

  it("keeps the achievement counters consistent with the listed achievements", () => {
    const stats = Object.fromEntries(
      DEFAULT_ABOUT_CONFIG.achievementStats.map((stat) => [stat.id, stat.value])
    );
    expect(stats.total).toBe(DEFAULT_ABOUT_CONFIG.achievements.length);
    expect(stats.gpa).toBe(
      DEFAULT_ABOUT_CONFIG.achievements.filter((a) => a.id.endsWith("-gpa")).length
    );
  });

  it("gives every education entry and achievement a descriptive body", () => {
    for (const entry of DEFAULT_ABOUT_CONFIG.education) {
      expect(entry.descriptionBn.length).toBeGreaterThan(30);
      expect(entry.descriptionEn.length).toBeGreaterThan(30);
    }
    for (const achievement of DEFAULT_ABOUT_CONFIG.achievements) {
      expect(achievement.descriptionBn.length).toBeGreaterThan(30);
      expect(achievement.descriptionEn.length).toBeGreaterThan(30);
    }
  });
});

describe("public content stays free of private contact details", () => {
  // The About/Portfolio narrative is profile copy, not a contact channel:
  // personal contact details and the home address stay out of it. (The
  // business contact number and inbox remain published, deliberately, on the
  // Contact page and in the assistant's contact answer.)
  const documents: Record<string, string> = {
    about: JSON.stringify(DEFAULT_ABOUT_CONFIG),
    portfolio: JSON.stringify(DEFAULT_PORTFOLIO_CONFIG),
    migration: readFileSync(MIGRATION, "utf8"),
  };

  const forbidden: [string, RegExp][] = [
    ["personal mobile number", /1626[\s-]?224878/],
    ["personal inbox", /rahatbd20505/i],
    ["home village address", /জীবদাড়া গ্রামে আমার বাড়ি|Jibdara Bazar, Shantiganj/i],
  ];

  for (const [name, doc] of Object.entries(documents)) {
    for (const [label, pattern] of forbidden) {
      it(`${name} content omits the ${label}`, () => {
        expect(doc).not.toMatch(pattern);
      });
    }
  }
});

describe("portfolio config depth", () => {
  it("does not list the old static profile site as a portfolio project", () => {
    expect(
      DEFAULT_PORTFOLIO_CONFIG.projects.some(
        (project) => project.id === "proj-legacy-profile"
      )
    ).toBe(false);
    expect(
      DEFAULT_PORTFOLIO_CONFIG.projects.some(
        (project) => project.liveUrl === "https://rahatahmedbd.github.io/"
      )
    ).toBe(false);
  });

  it("keeps every project on a known category and unique id", () => {
    const categories = new Set(
      DEFAULT_PORTFOLIO_CONFIG.categories.map((category) => category.value)
    );
    const ids = DEFAULT_PORTFOLIO_CONFIG.projects.map((project) => project.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const project of DEFAULT_PORTFOLIO_CONFIG.projects) {
      expect(categories).toContain(project.category);
    }
  });
});

describe("migration 034 payloads", () => {
  const sql = readFileSync(MIGRATION, "utf8");
  const aboutBlocks = dollarBlocks(sql, "A6");
  const portfolioBlocks = dollarBlocks(sql, "P6");

  it("declares one payload per about-config edit and no project payload", () => {
    expect(aboutBlocks).toHaveLength(6);
    expect(portfolioBlocks).toHaveLength(0);
  });

  it("produces an about document that passes the runtime validator", () => {
    const [paragraphPatch, extraParagraph, educationPatch, achievementPatch, extraInfo, extraInterests] =
      aboutBlocks as [
        { old: unknown[]; new: { bn: string; en: string } }[],
        { bn: string; en: string },
        Record<string, { old: unknown[]; new: Record<string, unknown> }>,
        Record<string, { old: unknown[]; new: Record<string, unknown> }>,
        Record<string, unknown>[],
        Record<string, unknown>[],
      ];

    // Replay the migration against the previously shipped document shape.
    const stored = JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONFIG)) as typeof DEFAULT_ABOUT_CONFIG;
    stored.biography.paragraphs = paragraphPatch.map((patch) => patch.old[0] as { bn: string; en: string });
    stored.biography.paragraphs.push(extraParagraph);
    stored.education = stored.education.map((entry) => {
      const patch = educationPatch[entry.id];
      return patch ? (patch.old[0] as unknown as typeof entry) : entry;
    });
    stored.achievements = stored.achievements.map((entry) => {
      const patch = achievementPatch[entry.id];
      return patch ? (patch.old[0] as unknown as typeof entry) : entry;
    });

    const applied = {
      ...stored,
      biography: {
        ...stored.biography,
        paragraphs: [
          ...paragraphPatch.map((patch) => patch.new),
          extraParagraph,
        ],
      },
      education: stored.education.map((entry) => {
        const patch = educationPatch[entry.id];
        return patch ? (patch.new as unknown as typeof entry) : entry;
      }),
      achievements: stored.achievements.map((entry) => {
        const patch = achievementPatch[entry.id];
        return patch ? (patch.new as unknown as typeof entry) : entry;
      }),
      personalInfo: [...stored.personalInfo, ...extraInfo],
      interests: [...stored.interests, ...extraInterests],
    };

    const validated = validateAboutConfig(applied);
    expect(validated).not.toBeNull();
    expect(validated?.biography.paragraphs).toHaveLength(4);
  });

  it("keeps the shipped portfolio defaults valid under the runtime validator", () => {
    expect(validatePortfolioConfig(DEFAULT_PORTFOLIO_CONFIG)).not.toBeNull();
  });

  it("is guarded so admin-edited values are never overwritten", () => {
    expect(sql).toMatch(/select value into cfg from public\.site_settings/);
    // Every write path is conditional on the stored value still matching a
    // previously shipped default, or on the entry being absent entirely.
    expect(sql).toMatch(/if cfg is null then\s+return;/);
    expect(sql).toMatch(/if not exists \(/);
  });
});
