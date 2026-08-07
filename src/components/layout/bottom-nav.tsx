"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Trophy, ShoppingCart, Phone } from "lucide-react";

// ── Bottom Navigation Items ────────────────────────────
const bottomNavItems = [
  { key: "home", path: "/", icon: Home },
  { key: "achievements", path: "/achievements", icon: Trophy },
  { key: "order", path: "/order", icon: ShoppingCart },
  { key: "contact", path: "/contact", icon: Phone },
];

// ── Bottom Navigation Bar (App-like) ───────────────────
// Phase K: Premium floating capsule inspired by Samsung One UI,
// Apple iOS and Google Pixel — spring-animated active pill,
// active dot indicator and a frosted-glass finish.
export function BottomNavBar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = pathname.startsWith("/en") ? "en" : "bn";
  const basePath = `/${locale}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="mx-auto mb-4 max-w-md px-4">
        <div
          className={cn(
            "glass relative flex items-center justify-around rounded-full px-2 py-2",
            "border border-border/60",
            "shadow-2xl shadow-black/40"
          )}
        >
          {bottomNavItems.map((item) => {
            // Normalize trailing slashes so the home item ("/") matches
            // the locale pathname ("/bn") on both server and client.
            const normalizedPathname = pathname.replace(/\/+$/, "");
            const href = `${basePath}${item.path}`.replace(/\/+$/, "");
            const isActive = normalizedPathname === href;
            const Icon = item.icon;
            const label = t(item.key as "home" | "achievements" | "order" | "contact");

            return (
              <Link
                key={item.key}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5",
                  "transition-colors duration-300"
                )}
              >
                {/* Spring-animated active pill (Pixel / iOS style) */}
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    className="absolute inset-0 rounded-full border border-primary/25 bg-primary/10 shadow-inner shadow-primary/10"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    "relative flex h-9 w-14 items-center justify-center rounded-full",
                    "transition-colors duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {/* Active dot indicator (Samsung One UI style) */}
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-active-dot"
                      className="absolute top-0.5 h-1 w-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isActive && "scale-110 -translate-y-px"
                    )}
                  />
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "relative text-[10px] font-medium leading-none transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
