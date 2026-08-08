"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { SearchDialog } from "@/components/interactive/SearchDialog";
import { AccentCustomizer } from "@/components/interactive/AccentCustomizer";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAVIGATION_ITEMS } from "@/lib/constants";

// ── Glass Navigation Bar — premium, responsive 320→1536+ ─
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const locale = pathname.startsWith("/en") ? "en" : "bn";
  const basePath = `/${locale}`;

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

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* Centered container for 320→1536+, avoids stretched look */}
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
        <nav
          className={cn(
            "pointer-events-auto glass mt-2 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 sm:mt-4 sm:px-4 sm:py-3",
            "border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.12)]",
            "backdrop-blur-[18px]"
          )}
        >
          {/* Logo — always visible, compact on 320 */}
          <Link
            href={basePath}
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="RahatVerse home"
          >
            <div className="bg-brand-gradient gradient-border flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-md shadow-primary/20 sm:h-9 sm:w-9 sm:text-base">
              R
            </div>
            <span className="hidden text-[15px] font-bold tracking-tight sm:block sm:text-lg">
              <span className="text-gradient">Rahat</span>
              <span className="text-foreground">Verse</span>
            </span>
          </Link>

          {/* Desktop Navigation — clean, minimal, scales 1024→1536+ */}
          <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAVIGATION_ITEMS.map((item) => {
              const normalizedPathname = pathname.replace(/\/+$/, "");
              const href = `${basePath}${item.path}`.replace(/\/+$/, "");
              const isActive = normalizedPathname === href;
              return (
                <Link
                  key={item.key}
                  href={href}
                  className={cn(
                    "relative rounded-lg px-2 py-1.5 text-xs font-medium tracking-[-0.01em] transition-all duration-200 xl:px-2.5 xl:py-2 xl:text-[13px] 2xl:px-3 2xl:text-sm",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                  )}
                >
                  {navLabels[item.key] || item.key}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary xl:w-6" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions — always accessible */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <SearchDialog locale={locale} />
            <LanguageToggle />
            <AccentCustomizer locale={locale} />
            <ThemeToggle />

            {/* Mobile Menu Button — 44px touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-card/80 backdrop-blur transition-colors hover:bg-accent lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu — glass, no giant empty, fits 320 */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto glass mx-0 mt-2 rounded-xl p-3 shadow-xl lg:hidden animate-fade-in-down sm:mx-0 sm:p-4">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {NAVIGATION_ITEMS.map((item) => {
                const normalizedPathname = pathname.replace(/\/+$/, "");
                const href = `${basePath}${item.path}`.replace(/\/+$/, "");
                const isActive = normalizedPathname === href;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-all text-center sm:text-left truncate",
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/25 font-semibold"
                        : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                    )}
                  >
                    {navLabels[item.key] || item.key}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
