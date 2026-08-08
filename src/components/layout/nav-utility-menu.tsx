"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/interactive/SearchDialog";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { AccentCustomizer } from "@/components/interactive/AccentCustomizer";

interface NavUtilityMenuProps {
  locale: string;
}

/**
 * Consolidated top-nav utility menu.
 * Folds Search, Language, Theme and Accent controls behind a single
 * overflow/menu button so the top bar stays clean while the bottom tab bar
 * remains the primary navigation on mobile.
 */
export function NavUtilityMenu({ locale }: NavUtilityMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={locale === "bn" ? "মেনু" : "Menu"}
        aria-expanded={open}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-all duration-300",
          "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "border-primary/50 shadow-md shadow-primary/20"
        )}
      >
        <MoreHorizontal className="h-5 w-5 text-foreground" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={locale === "bn" ? "অতিরিক্ত অপশন" : "Additional options"}
          className="glass absolute right-0 top-12 z-50 w-56 rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl animate-fade-in-down"
        >
          <div className="flex flex-col gap-1.5">
            <SearchDialog locale={locale} />
            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <LanguageToggle />
              </div>
              <ThemeToggle />
            </div>
            <AccentCustomizer locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
}
