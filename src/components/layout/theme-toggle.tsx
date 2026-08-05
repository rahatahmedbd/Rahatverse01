"use client";

import { useAppStore } from "@/store";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Theme Toggle ───────────────────────────────────────
export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  const handleToggle = () => {
    toggleTheme();
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center",
        "rounded-lg border border-border bg-card",
        "transition-all duration-300",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400 transition-transform duration-300" />
      )}
    </button>
  );
}
