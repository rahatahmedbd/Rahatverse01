"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

// ── Language Toggle ────────────────────────────────────
export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current locale from pathname
  const currentLocale: Locale = pathname.startsWith("/en") ? "en" : "bn";
  const nextLocale: Locale = currentLocale === "bn" ? "en" : "bn";

  const handleToggle = () => {
    // Replace current locale in pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    router.push(newPathname || `/${nextLocale}`);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-10 items-center gap-2 px-3",
        "rounded-lg border border-border bg-card",
        "transition-all duration-300",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Switch to ${nextLocale === "en" ? "English" : "বাংলা"}`}
    >
      <Globe className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">
        {currentLocale === "bn" ? "EN" : "বাংলা"}
      </span>
    </button>
  );
}
