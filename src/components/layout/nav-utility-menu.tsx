"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/interactive/SearchDialog";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { AccentCustomizer } from "@/components/interactive/AccentCustomizer";
import { NAVIGATION_ITEMS } from "@/lib/constants";

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
  const pathname = usePathname();
  const t = useTranslations("nav");
  const basePath = `/${locale}`;
  const normalizedPathname = pathname.replace(/\/+$/, "");

  // Same labels as the desktop navbar — mirrored here so mobile visitors can
  // reach every section from the top bar too (previously footer-only).
  const navLabels: Record<string, string> = {
    home: t("home"),
    about: t("about"),
    portfolio: locale === "bn" ? "পোর্টফোলিও" : "Portfolio",
    services: t("services"),
    experience: locale === "bn" ? "অভিজ্ঞতা" : "Experience",
    achievements: t("achievements"),
    gallery: t("gallery"),
    order: t("order"),
    blog: t("blog"),
    contact: t("contact"),
  };

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
            {/* Page links — mobile only; desktop already has the full navbar (audit M4) */}
            <nav aria-label={locale === "bn" ? "পেজসমূহ" : "Pages"} className="lg:hidden">
              <div className="grid grid-cols-2 gap-1">
                {NAVIGATION_ITEMS.map((item) => {
                  const rawHref = `${basePath}${item.path}`.replace(/\/+$/, "");
                  const href = item.key === "order" ? `${rawHref}#order-checkout` : rawHref;
                  const isActive = normalizedPathname === rawHref;
                  return (
                    <Link
                      key={item.key}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                      )}
                    >
                      <span className="bn">{navLabels[item.key] || item.key}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="my-1.5 h-px bg-border/60" />
            </nav>
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
