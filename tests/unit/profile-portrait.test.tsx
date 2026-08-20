import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutPreview } from "@/components/sections/AboutPreview";
import { HeroProjectPreview } from "@/components/sections/HeroProjectPreview";
import { OrderCtaBand } from "@/components/sections/OrderCtaBand";
import { RahatPortrait } from "@/components/sections/RahatPortrait";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import { DEFAULT_LINKS_CONFIG } from "@/lib/links/config";
import { RAHAT_PORTRAIT_FIT, RAHAT_PROFILE_PHOTO } from "@/lib/profile";

describe("Rahat portrait wiring", () => {
  it("points every default identity slot at the committed photograph", () => {
    expect(DEFAULT_ABOUT_CONFIG.profileImage.url).toBe(RAHAT_PROFILE_PHOTO);
    expect(DEFAULT_LINKS_CONFIG.profile.avatar).toBe(RAHAT_PROFILE_PHOTO);
  });

  it("keeps a face-first object position so a standing photo is not cropped at the neck", () => {
    expect(RAHAT_PORTRAIT_FIT).toContain("object-cover");
    expect(RAHAT_PORTRAIT_FIT).toContain("object-[center_16%]");
  });

  it("renders the local photograph from RahatPortrait", () => {
    render(<RahatPortrait locale="en" className="h-16 w-16" />);
    const img = screen.getByTestId("rahat-portrait").querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src") ?? img?.getAttribute("srcset") ?? "").toContain("rahat-profile");
    expect(img?.getAttribute("alt")).toBe("Rahat Ahmed");
  });

  it("shows the photograph in the homepage about preview instead of a user icon", () => {
    render(<AboutPreview locale="en" config={DEFAULT_ABOUT_CONFIG} />);
    const portraits = screen.getAllByTestId("rahat-portrait");
    expect(portraits.length).toBeGreaterThan(0);
  });

  it("always shows the developer photo on the hero project chip", () => {
    render(<HeroProjectPreview locale="en" aboutConfig={DEFAULT_ABOUT_CONFIG} />);
    const images = screen.getByTestId("hero-project-preview").querySelectorAll("img");
    const srcs = [...images].map((img) => img.getAttribute("src") || img.getAttribute("srcset") || "");
    expect(srcs.some((src) => src.includes("rahat-profile"))).toBe(true);
  });

  it("puts the photograph on the order CTA band", () => {
    render(<OrderCtaBand locale="en" />);
    expect(screen.getByTestId("rahat-portrait")).toBeInTheDocument();
  });
});

describe("clipping fixes in source", () => {
  it("uses a portrait frame for the about profile so the standing photo is not square-cropped", () => {
    const source = readFileSync("src/components/sections/ProfileImage.tsx", "utf8");
    expect(source).toContain('portraitRatio = size === "sm" ? "1 / 1" : "3 / 4"');
    expect(source).toContain("RAHAT_PORTRAIT_FIT");
  });

  it("does not truncate long personal-info values on the about page", () => {
    const source = readFileSync("src/components/sections/AboutFull.tsx", "utf8");
    expect(source).toContain("break-words font-semibold bn");
    expect(source).not.toMatch(/truncate font-semibold bn/);
  });

  it("lets the hero overflow vertically so floating chips are not clipped", () => {
    const source = readFileSync("src/components/sections/HeroSection.tsx", "utf8");
    expect(source).toContain("overflow-x-clip");
    expect(source).not.toMatch(/items-center justify-center overflow-hidden py-8/);
  });
});
