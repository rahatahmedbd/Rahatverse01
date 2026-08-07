import { describe, it, expect } from "vitest";
import { validateGlobalConfig, DEFAULT_GLOBAL_CONFIG } from "@/lib/global/config";
import type { GlobalConfig } from "@/types/global";

function clone(value: GlobalConfig): GlobalConfig {
  return JSON.parse(JSON.stringify(value)) as GlobalConfig;
}

describe("global config validation", () => {
  it("accepts default config", () => {
    expect(validateGlobalConfig(DEFAULT_GLOBAL_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_GLOBAL_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateGlobalConfig(bad)).toBeNull();
  });

  it("accepts enabling the announcement banner", () => {
    const cfg = clone(DEFAULT_GLOBAL_CONFIG);
    cfg.announcement.enabled = true;
    cfg.announcement.textEn = "Welcome!";
    expect(validateGlobalConfig(cfg)?.announcement.enabled).toBe(true);
  });

  it("accepts enabling maintenance mode", () => {
    const cfg = clone(DEFAULT_GLOBAL_CONFIG);
    cfg.maintenance.enabled = true;
    cfg.maintenance.allowAdmins = false;
    expect(validateGlobalConfig(cfg)?.maintenance.enabled).toBe(true);
  });

  it("rejects an invalid whatsapp link", () => {
    const bad = clone(DEFAULT_GLOBAL_CONFIG);
    bad.footer.businessWhatsapp = "javascript:alert(1)";
    expect(validateGlobalConfig(bad)).toBeNull();
  });

  it("allows empty business email (falls back to defaults)", () => {
    const cfg = clone(DEFAULT_GLOBAL_CONFIG);
    cfg.footer.businessEmail = "";
    expect(validateGlobalConfig(cfg)).not.toBeNull();
  });

  it("accepts an empty announcement link", () => {
    const cfg = clone(DEFAULT_GLOBAL_CONFIG);
    cfg.announcement.link = "";
    expect(validateGlobalConfig(cfg)).not.toBeNull();
  });
});
