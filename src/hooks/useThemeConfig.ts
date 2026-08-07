"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME_CONFIG, validateThemeConfig } from "@/lib/theme/config";
import type { ThemeConfig } from "@/types/theme";

/** Loads the public theme/xp/audio config once and caches it in module scope. */
let cache: ThemeConfig | null = null;
let inflight: Promise<ThemeConfig> | null = null;

export function useThemeConfig(): ThemeConfig {
  const [config, setConfig] = useState<ThemeConfig>(cache ?? DEFAULT_THEME_CONFIG);

  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = fetch("/api/theme-config", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((json) => {
          const validated = validateThemeConfig((json as { data?: unknown } | null)?.data);
          cache = validated ?? DEFAULT_THEME_CONFIG;
          return cache;
        })
        .catch(() => {
          cache = DEFAULT_THEME_CONFIG;
          return cache;
        })
        .finally(() => {
          inflight = null;
        });
    }
    let cancelled = false;
    inflight.then((value) => {
      if (!cancelled) setConfig(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}

/** Applies a preset's colors to the DOM accent CSS variables. */
export function applyPresetToDOM(preset: { primary: string; primaryForeground: string; ring: string; gradientStart: string; gradientMiddle: string; gradientEnd: string; selectionBg: string }) {
  const root = document.documentElement;
  root.style.setProperty("--primary", preset.primary);
  root.style.setProperty("--primary-foreground", preset.primaryForeground);
  root.style.setProperty("--ring", preset.ring);
  root.style.setProperty("--gradient-start", preset.gradientStart);
  root.style.setProperty("--gradient-middle", preset.gradientMiddle);
  root.style.setProperty("--gradient-end", preset.gradientEnd);
  root.style.setProperty("--selection-bg", preset.selectionBg);
}
