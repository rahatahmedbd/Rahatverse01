import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";

import { DEFAULT_ABOUT_CONFIG, validateAboutConfig } from "@/lib/about/config";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { DEFAULT_PORTFOLIO_CONFIG } from "@/lib/portfolio/config";
import { PUBLIC_ID_TO_GITHUB_URL_MAP } from "@/lib/cloudinary/utils";

const MIGRATION = "supabase/migrations/035_real_photos_from_legacy_site.sql";

// Real photographs carried over from the original static profile site.
const PHOTOS = [
  "public/images/legacy/rahat-profile.jpg",
  "public/images/legacy/farid-ahmed.jpg",
  "public/images/legacy/science-fair-2023.jpg",
  "public/images/legacy/ssc-gpa5-2025.jpg",
  "public/images/legacy/ssc-reception-2025.jpg",
  "public/images/legacy/helping-hand.jpg",
];

function isJpeg(path: string): boolean {
  const head = readFileSync(path).subarray(0, 2);
  return head[0] === 0xff && head[1] === 0xd8;
}

describe("legacy photo assets", () => {
  it.each(PHOTOS)("ships %s as a real, non-empty JPEG", (path) => {
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(5_000);
    expect(isJpeg(path)).toBe(true);
  });
});

describe("profile portrait wiring", () => {
  it("serves the real profile photograph from the repository", () => {
    expect(DEFAULT_ABOUT_CONFIG.profileImage.url).toBe("/images/legacy/rahat-profile.jpg");
  });

  it("keeps the Cloudinary public id so an admin can still upload later", () => {
    expect(DEFAULT_ABOUT_CONFIG.profileImage.publicId).not.toBe("");
  });

  it("still passes the runtime about validator", () => {
    expect(validateAboutConfig(DEFAULT_ABOUT_CONFIG)).not.toBeNull();
  });
});

describe("memorial portrait wiring", () => {
  const memorial = DEFAULT_EXPERIENCE_CONFIG.memorial;

  it("serves the real photograph of the late father from the repository", () => {
    expect(memorial.imageUrl).toBe("/images/legacy/farid-ahmed.jpg");
  });

  it("keeps the tribute content that was carried over from the old site", () => {
    expect(memorial.nameBn).toContain("ফরিদ আহমেদ");
    expect(memorial.epigraphBn.length).toBeGreaterThan(10);
    expect(memorial.roles.length).toBeGreaterThan(0);
    expect(memorial.developmentsBn.length).toBeGreaterThan(0);
    expect(memorial.developmentsEn.length).toBe(memorial.developmentsBn.length);
  });

  it("still passes the runtime experience validator", () => {
    expect(validateExperienceConfig(DEFAULT_EXPERIENCE_CONFIG)).not.toBeNull();
  });
});

describe("cloudinary fallback map", () => {
  it("falls back to committed local photos rather than back to Cloudinary", () => {
    const localFallbacks = [
      "profile",
      "rahatverse/profile",
      "rahatverse/profile/1786125213546",
      "rahatverse/father-photo",
    ];

    for (const publicId of localFallbacks) {
      const url = PUBLIC_ID_TO_GITHUB_URL_MAP[publicId];
      expect(url).toBeDefined();
      expect(url.startsWith("/images/legacy/")).toBe(true);
      expect(existsSync(`public${url}`)).toBe(true);
    }
  });

  it("never points a fallback at a path that does not exist", () => {
    for (const url of Object.values(PUBLIC_ID_TO_GITHUB_URL_MAP)) {
      if (url.startsWith("/")) {
        expect(existsSync(`public${url}`)).toBe(true);
      } else {
        expect(url.startsWith("https://")).toBe(true);
      }
    }
  });
});

describe("old profile site is not a portfolio project", () => {
  it("was removed from the shipped project list", () => {
    expect(
      DEFAULT_PORTFOLIO_CONFIG.projects.some(
        (project) => project.liveUrl === "https://rahatahmedbd.github.io/"
      )
    ).toBe(false);
  });
});

describe("migration 035", () => {
  const sql = readFileSync(MIGRATION, "utf8");

  it("targets both portrait fields", () => {
    expect(sql).toContain("{profileImage,url}");
    expect(sql).toContain("{memorial,imageUrl}");
    expect(sql).toContain("/images/legacy/rahat-profile.jpg");
    expect(sql).toContain("/images/legacy/farid-ahmed.jpg");
  });

  it("is guarded so admin-edited values are never overwritten", () => {
    // Both blocks bail out when the config row is missing and only write when
    // the stored value is still empty or a previously shipped default.
    expect(sql.match(/if cfg is null then\s+return;/g)?.length).toBe(2);
    expect(sql.match(/current = ''/g)?.length).toBe(2);
    expect(sql).not.toMatch(/delete from/i);
  });
});
