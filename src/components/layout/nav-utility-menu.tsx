"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const SearchDialog = dynamic(
  () => import("@/components/interactive/SearchDialog").then((mod) => mod.SearchDialog),
  { ssr: false, loading: () => <div className="h-9 w-full animate-pulse rounded-lg bg-muted/40" /> }
);
const AccentCustomizer = dynamic(
  () => import("@/components/interactive/AccentCustomizer").then((mod) => mod.AccentCustomizer),
  { ssr: false, loading: () => <div className="h-9 w-full animate-pulse rounded-lg bg-muted/40" /> }
);

interface NavUtilityMenuProps {
  locale: string;
}

/**
 * Consolidated top-nav utility menu.
 * Phase 8: improved keyboard nav, focus trap, aria, tap targets
 */
export function NavUtilityMenu({ locale }: NavUtilityMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      // Close on Tab if focus leaves the menu: simplified focus trap
      if (event.key === "Tab") {
        const focusable = ref.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
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
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={locale === "bn" ? "অতিরিক্ত মেনু" : "More options menu"}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="nav-utility-panel"
        className={cn(
          "relative inline-flex h-10 min-h-[40px] w-10 min-w-[40px] items-center justify-center rounded-lg border border-border bg-card transition-all duration-200 touch-manipulation",
          "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open && "border-primary/50 shadow-md shadow-primary/20"
        )}
      >
        <MoreHorizontal className="h-5 w-5 text-foreground" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="nav-utility-panel"
          role="menu"
          aria-label={locale === "bn" ? "অতিরিক্ত অপশন" : "Additional options"}
          className="glass absolute right-0 top-12 z-50 w-60 rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl animate-fade-in-down"
        >
          <div className="flex flex-col gap-1.5" role="group">
            <div role="menuitem">
              <SearchDialog locale={locale} />
            </div>
            <div className="flex items-center gap-1.5" role="group" aria-label={locale === "bn" ? "ভাষা ও থিম" : "Language and theme"}>
              <div className="flex-1" role="menuitem">
                <LanguageToggle />
              </div>
              <div role="menuitem">
                <ThemeToggle />
              </div>
            </div>
            <div role="menuitem">
              <AccentCustomizer locale={locale} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
