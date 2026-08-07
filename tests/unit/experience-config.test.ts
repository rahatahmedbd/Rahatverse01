import { describe, it, expect } from "vitest";
import { validateExperienceConfig, DEFAULT_EXPERIENCE_CONFIG } from "@/lib/experience/config";
import type { ExperienceConfig } from "@/types/experience";

function clone(value: ExperienceConfig): ExperienceConfig {
  return JSON.parse(JSON.stringify(value)) as ExperienceConfig;
}

describe("experience config validation", () => {
  it("accepts default config", () => {
    expect(validateExperienceConfig(DEFAULT_EXPERIENCE_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("accepts all experience statuses", () => {
    const cfg = clone(DEFAULT_EXPERIENCE_CONFIG);
    cfg.experience.items[0].status = "completed";
    expect(validateExperienceConfig(cfg)?.experience.items[0].status).toBe("completed");
  });

  it("rejects an invalid experience status", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    bad.experience.items[0].status = "weird" as never;
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("rejects an invalid experience icon", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    bad.experience.items[0].icon = "Hacker" as never;
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("rejects an empty blood hotline number", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    bad.blood.emergency.hotlineNumber = "   ";
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("accepts a string-form blood stat (e.g. A+)", () => {
    const cfg = clone(DEFAULT_EXPERIENCE_CONFIG);
    cfg.blood.stats[1].value = null;
    cfg.blood.stats[1].text = "O+";
    expect(validateExperienceConfig(cfg)?.blood.stats[1].text).toBe("O+");
  });

  it("rejects invalid memorial role icon", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    bad.memorial.roles[0].icon = "Hacker" as never;
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("rejects empty tribute text", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    bad.memorial.tributeBn = "";
    expect(validateExperienceConfig(bad)).toBeNull();
  });

  it("rejects too many experience items", () => {
    const bad = clone(DEFAULT_EXPERIENCE_CONFIG);
    const base = bad.experience.items[0];
    bad.experience.items = Array.from({ length: 25 }, (_, i) => ({ ...base, id: `exp-${i}` }));
    expect(validateExperienceConfig(bad)).toBeNull();
  });
});
