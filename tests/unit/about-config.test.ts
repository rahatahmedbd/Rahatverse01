import { describe, expect, it } from "vitest";
import {
  DEFAULT_ABOUT_CONFIG,
  validateAboutConfig,
} from "@/lib/about/config";

describe("about config validation", () => {
  it("accepts the default biography, education, and achievement config", () => {
    expect(validateAboutConfig(DEFAULT_ABOUT_CONFIG)).not.toBeNull();
  });

  it("rejects a malformed profile image URL", () => {
    const bad = {
      ...DEFAULT_ABOUT_CONFIG,
      profileImage: {
        ...DEFAULT_ABOUT_CONFIG.profileImage,
        url: "javascript:alert(1)",
      },
    };

    expect(validateAboutConfig(bad)).toBeNull();
  });

  it("rejects an unsupported achievement icon", () => {
    const bad = {
      ...DEFAULT_ABOUT_CONFIG,
      achievements: DEFAULT_ABOUT_CONFIG.achievements.map((achievement, index) =>
        index === 0 ? { ...achievement, icon: "Rocket" } : achievement
      ),
    };

    expect(validateAboutConfig(bad)).toBeNull();
  });

  it("supports reorderable education and achievement arrays", () => {
    const education = [...DEFAULT_ABOUT_CONFIG.education].reverse();
    const achievements = [...DEFAULT_ABOUT_CONFIG.achievements].reverse();
    const config = { ...DEFAULT_ABOUT_CONFIG, education, achievements };

    expect(validateAboutConfig(config)?.education[0].id).toBe(
      DEFAULT_ABOUT_CONFIG.education.at(-1)?.id
    );
    expect(validateAboutConfig(config)?.achievements[0].id).toBe(
      DEFAULT_ABOUT_CONFIG.achievements.at(-1)?.id
    );
  });

  it("rejects arrays larger than the supported editorial limit", () => {
    const tooMany = Array.from(
      { length: 25 },
      (_, index) => ({
        ...DEFAULT_ABOUT_CONFIG.achievements[0],
        id: `achievement-${index}`,
      })
    );

    expect(
      validateAboutConfig({ ...DEFAULT_ABOUT_CONFIG, achievements: tooMany })
    ).toBeNull();
  });

  it("keeps certificate links restricted to safe URLs", () => {
    const bad = {
      ...DEFAULT_ABOUT_CONFIG,
      achievements: DEFAULT_ABOUT_CONFIG.achievements.map((achievement, index) =>
        index === 0
          ? { ...achievement, certificateUrl: "data:text/html,unsafe" }
          : achievement
      ),
    };

    expect(validateAboutConfig(bad)).toBeNull();
  });
});
