"use client";

import { useEffect } from "react";
import { useAppStore, applyThemePreferences } from "@/store";

// ── Theme Applier — Phase H "থিম পোলিশ" ──────────────
// Hydrates <html> with the persisted theme + accent on mount so the
// correct palette is applied immediately (and stays in sync with the store).

export function ThemeApplier() {
  const theme = useAppStore((s) => s.theme);
  const accent = useAppStore((s) => s.accent);

  useEffect(() => {
    applyThemePreferences(theme, accent);
  }, [theme, accent]);

  return null;
}
