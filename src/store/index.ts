// ── Zustand Store ──────────────────────────────────────
// Global state management

import { create } from "zustand";
import type { Locale } from "@/types";

// ── App Store ──────────────────────────────────────────
interface AppState {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

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

export const useAppStore = create<AppState>((set) => ({
  // Theme
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setTheme: (theme) => set({ theme }),

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
}));
