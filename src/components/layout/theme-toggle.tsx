"use client";

import * as React from "react";
import { useAppStore } from "@/store";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Theme Toggle with Crossfade & Color Morph Transition ──
export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useAppStore();

  // Hydrate saved theme from localStorage on initial mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("rahatverse_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        if (saved === "light") {
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [setTheme]);

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    const applyThemeChange = () => {
      toggleTheme();
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }

      try {
        localStorage.setItem("rahatverse_theme", nextTheme);
      } catch {
        // Ignore localStorage errors
      }

      // Add temporary crossfade class for CSS fallback color morph
      document.documentElement.classList.add("theme-morph-transition");
      setTimeout(() => {
        document.documentElement.classList.remove("theme-morph-transition");
      }, 500);
    };

    // Check for native View Transitions API support
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => void;
    };
    if (
      typeof doc.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      doc.startViewTransition(applyThemeChange);
    } else {
      applyThemeChange();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-testid="theme-toggle-button"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden",
        "rounded-lg border border-border bg-card",
        "transition-all duration-300",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
