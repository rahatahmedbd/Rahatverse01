"use client";

import { useAppStore } from "@/store";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Theme Toggle ───────────────────────────────────────
// Switches between dark / light with a smooth color-morph crossfade.
// The palette change is animated by the CSS transitions on <html> variables.

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden",
        "rounded-lg border border-border bg-card",
        "transition-all duration-300",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {/* Crossfade morph between sun and moon */}
      <span
        key={theme}
        className="animate-fade-in inline-flex"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-blue-500" />
        )}
      </span>
    </button>
  );
}
