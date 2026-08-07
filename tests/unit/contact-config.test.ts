import { describe, it, expect } from "vitest";
import { validateContactConfig, DEFAULT_CONTACT_CONFIG } from "@/lib/contact/config";
import type { ContactConfig } from "@/types/contact";

function clone(value: ContactConfig): ContactConfig {
  return JSON.parse(JSON.stringify(value)) as ContactConfig;
}

describe("contact config validation", () => {
  it("accepts default config", () => {
    expect(validateContactConfig(DEFAULT_CONTACT_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_CONTACT_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateContactConfig(bad)).toBeNull();
  });

  it("accepts empty time slots (no booking UI)", () => {
    const cfg = clone(DEFAULT_CONTACT_CONFIG);
    cfg.booking.timeSlots = [];
    expect(validateContactConfig(cfg)).not.toBeNull();
  });

  it("rejects invalid buffer minutes", () => {
    const bad = clone(DEFAULT_CONTACT_CONFIG);
    bad.booking.bufferMinutes = -5;
    expect(validateContactConfig(bad)).toBeNull();
  });

  it("rejects invalid carousel count", () => {
    const bad = clone(DEFAULT_CONTACT_CONFIG);
    bad.testimonials.carouselCount = 0;
    expect(validateContactConfig(bad)).toBeNull();
  });

  it("rejects empty WhatsApp URL", () => {
    const bad = clone(DEFAULT_CONTACT_CONFIG);
    bad.quickLinks.whatsappUrl = "";
    expect(validateContactConfig(bad)).toBeNull();
  });

  it("accepts hiding a booking purpose", () => {
    const cfg = clone(DEFAULT_CONTACT_CONFIG);
    cfg.booking.purposes[0].visible = false;
    expect(validateContactConfig(cfg)?.booking.purposes[0].visible).toBe(false);
  });
});
