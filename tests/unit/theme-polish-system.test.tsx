import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import React from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AccentCustomizer } from "@/components/interactive/AccentCustomizer";
import { useAppStore, applyAccentToDOM, ACCENT_THEMES } from "@/store";

describe("Phase H — Theme Polish & Customization System", () => {
  beforeEach(() => {
    // Reset document element classes and store state
    document.documentElement.className = "";
    useAppStore.setState({ theme: "dark", accent: "emerald" });
    vi.clearAllMocks();
  });

  describe("ThemeToggle with Crossfade & Color Morph", () => {
    it("renders theme toggle button with accessible label", () => {
      render(<ThemeToggle />);

      const toggleBtn = screen.getByTestId("theme-toggle-button");
      expect(toggleBtn).toBeInTheDocument();
      expect(toggleBtn).toHaveAttribute("aria-label", "Switch to light mode");
    });

    it("toggles between dark and light themes and updates document classes", () => {
      render(<ThemeToggle />);

      const toggleBtn = screen.getByTestId("theme-toggle-button");

      // Click to toggle from dark to light
      fireEvent.click(toggleBtn);
      expect(useAppStore.getState().theme).toBe("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(
        document.documentElement.classList.contains("theme-morph-transition")
      ).toBe(true);

      // Click to toggle back from light to dark
      fireEvent.click(toggleBtn);
      expect(useAppStore.getState().theme).toBe("dark");
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  describe("AccentCustomizer component", () => {
    it("renders trigger button and opens accent selector dialog on click", () => {
      render(<AccentCustomizer locale="en" />);

      const triggerBtn = screen.getByRole("button", {
        name: "Customize theme accent color",
      });
      expect(triggerBtn).toBeInTheDocument();
      expect(triggerBtn).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(triggerBtn);
      expect(triggerBtn).toHaveAttribute("aria-expanded", "true");

      const dialog = screen.getByRole("dialog", {
        name: "Select accent color",
      });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Theme Accent")).toBeInTheDocument();

      // Verify options are listed
      expect(screen.getByText("Emerald Green")).toBeInTheDocument();
      expect(screen.getByText("Sapphire Blue")).toBeInTheDocument();
      expect(screen.getByText("Amethyst Violet")).toBeInTheDocument();
      expect(screen.getByText("Amber Gold")).toBeInTheDocument();
      expect(screen.getByText("Crimson Red")).toBeInTheDocument();
      expect(screen.getByText("Ocean Teal")).toBeInTheDocument();
    });

    it("updates store accent when an option is selected", () => {
      render(<AccentCustomizer locale="en" />);

      const triggerBtn = screen.getByRole("button", {
        name: "Customize theme accent color",
      });
      fireEvent.click(triggerBtn);

      const sapphireOption = screen.getByRole("button", {
        name: /Sapphire Blue/i,
      });
      fireEvent.click(sapphireOption);

      expect(useAppStore.getState().accent).toBe("sapphire");
    });
  });

  describe("applyAccentToDOM helper", () => {
    it("sets CSS variables on document.documentElement for selected accent", () => {
      applyAccentToDOM("amethyst");

      const root = document.documentElement;
      expect(root.style.getPropertyValue("--primary")).toBe(
        ACCENT_THEMES.amethyst.primary
      );
      expect(root.style.getPropertyValue("--ring")).toBe(
        ACCENT_THEMES.amethyst.ring
      );
      expect(root.style.getPropertyValue("--selection-bg")).toBe(
        ACCENT_THEMES.amethyst.selectionBg
      );
    });
  });
});
