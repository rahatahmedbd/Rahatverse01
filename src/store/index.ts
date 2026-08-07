// ── Zustand Store ──────────────────────────────────────
// Global state management

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "@/types";

// ── Accent presets (Phase H "থিম পোলিশ") ──────────────
// Each accent carries CSS variable overrides applied to <html>.
export type AccentKey = "amber" | "blue" | "green" | "purple" | "rose" | "teal";

export interface AccentConfig {
  label: string;
  swatch: string; // CSS color for the picker swatch
}

export const ACCENTS: Record<AccentKey, AccentConfig> = {
  amber: { label: "Amber", swatch: "#f59e0b" },
  blue: { label: "Blue", swatch: "#3b82f6" },
  green: { label: "Green", swatch: "#10b981" },
  purple: { label: "Purple", swatch: "#8b5cf6" },
  rose: { label: "Rose", swatch: "#f43f5e" },
  teal: { label: "Teal", swatch: "#14b8a6" },
};

// ── App Store ──────────────────────────────────────────
interface AppState {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

  // Accent (Phase H)
  accent: AccentKey;
  setAccent: (accent: AccentKey) => void;

  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Navigation
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),

      // Accent
      accent: "amber",
      setAccent: (accent) => set({ accent }),

      // Locale
      locale: "bn",
      setLocale: (locale) => set({ locale }),

      // Navigation
      isMobileMenuOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      // Loading
      isLoading: true,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "rahatverse-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, accent: state.accent }),
    }
  )
);

/** Applies theme + accent to <html> based on store state. Callable from components. */
export function applyThemePreferences(theme: "dark" | "light", accent: AccentKey) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.dataset.accent = accent;
}
