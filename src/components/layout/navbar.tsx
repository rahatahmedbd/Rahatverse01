"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAVIGATION_ITEMS } from "@/lib/constants";

// ── Glass Navigation Bar ───────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract locale from pathname
  const locale = pathname.startsWith("/en") ? "en" : "bn";
  const basePath = `/${locale}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={cn(
          "glass mx-4 mt-4 rounded-xl px-4 py-3",
          "flex items-center justify-between",
          "shadow-lg shadow-black/20"
        )}
      >
        {/* Logo */}
        <Link
          href={basePath}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 font-bold text-white shadow-md shadow-amber-500/30">
            R
          </div>
          <span className="hidden text-lg font-bold sm:block">
            <span className="text-gradient">Rahat</span>
            <span className="text-foreground">Verse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAVIGATION_ITEMS.map((item) => {
            const href = `${basePath}${item.path}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.key === "home" ? (locale === "bn" ? "হোম" : "Home") :
                 item.key === "about" ? (locale === "bn" ? "সম্পর্কে" : "About") :
                 item.key === "achievements" ? (locale === "bn" ? "অর্জন" : "Achievements") :
                 item.key === "services" ? (locale === "bn" ? "সার্ভিস" : "Services") :
                 item.key === "gallery" ? (locale === "bn" ? "গ্যালারি" : "Gallery") :
                 item.key === "order" ? (locale === "bn" ? "অর্ডার" : "Order") :
                 item.key === "blog" ? (locale === "bn" ? "ব্লগ" : "Blog") :
                 item.key === "contact" ? (locale === "bn" ? "যোগাযোগ" : "Contact") :
                 item.key}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="glass mx-4 mt-2 rounded-xl p-4 shadow-xl lg:hidden animate-fade-in-down">
          <div className="flex flex-col gap-1">
            {NAVIGATION_ITEMS.map((item) => {
              const href = `${basePath}${item.path}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={item.key}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {item.key === "home" ? (locale === "bn" ? "হোম" : "Home") :
                   item.key === "about" ? (locale === "bn" ? "সম্পর্কে" : "About") :
                   item.key === "achievements" ? (locale === "bn" ? "অর্জন" : "Achievements") :
                   item.key === "services" ? (locale === "bn" ? "সার্ভিস" : "Services") :
                   item.key === "gallery" ? (locale === "bn" ? "গ্যালারি" : "Gallery") :
                   item.key === "order" ? (locale === "bn" ? "অর্ডার" : "Order") :
                   item.key === "blog" ? (locale === "bn" ? "ব্লগ" : "Blog") :
                   item.key === "contact" ? (locale === "bn" ? "যোগাযোগ" : "Contact") :
                   item.key}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
