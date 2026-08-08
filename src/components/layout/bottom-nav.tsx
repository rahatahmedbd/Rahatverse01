"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, ShoppingCart, MessageCircle, FolderOpen, Sparkles } from "lucide-react";

// ── Bottom Navigation Items ────────────────────────────
// Mobile polish: Work label keeps /achievements route intact.
const bottomNavItems = [
  { key: "home", path: "/", icon: Home, labelKey: "home" as const },
  { key: "portfolio", path: "/portfolio", icon: FolderOpen, labelKey: "portfolio" as const },
  // AI button — non-functional placeholder (you will implement in another session)
  // Slightly elevated professional look with distinct subtle gold accent
  { key: "ai", path: "#", icon: Sparkles, labelKey: "ai" as const },
  { key: "order", path: "/order", icon: ShoppingCart, labelKey: "order" as const },
  { key: "contact", path: "/contact", icon: MessageCircle, labelKey: "contact" as const },
];

// ── Bottom Navigation Bar (Premium Floating Glass) ──────
// Floating glass capsule with backdrop blur, thin border, soft shadow,
// large touch targets, spring pill active state with cyan/emerald glow.
export function BottomNavBar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isBn = pathname.startsWith("/bn");
  const locale = isBn ? "bn" : "en";
  const basePath = `/${locale}`;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Safe-area + floating margin */}
      <div className="mx-auto max-w-[22.5rem] px-4 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] pt-2 [360px]:max-w-[23rem] sm:max-w-md">
        <div
          className={cn(
            "pointer-events-auto relative flex items-center gap-1 rounded-[28px] border border-white/10 bg-[rgba(10,22,40,0.72)] px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.44),0_2px_8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[22px]",
            "supports-[backdrop-filter]:bg-[rgba(10,22,40,0.58)]",
            "dark:shadow-[0_8px_32px_rgba(0,0,0,0.52),0_2px_10px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.07)]"
          )}
        >
          {/* Subtle outer glow (restrained, premium) */}
          <div
            className="pointer-events-none absolute -inset-2 -z-10 rounded-[32px] bg-gradient-to-r from-emerald-500/[0.07] via-cyan-500/[0.06] to-violet-500/[0.05] blur-2xl"
            aria-hidden="true"
          />

          {bottomNavItems.map((item) => {
            const normalizedPathname = pathname.replace(/\/+$/, "");
            const rawHref = `${basePath}${item.path}`.replace(/\/+$/, "");
            // Scroll to checkout when tapping the Order nav item
            const href = item.key === "order" ? `${rawHref}#order-checkout` : rawHref;
            const isActive = normalizedPathname === rawHref;
            const Icon = item.icon;
            const isAI = item.key === "ai";

            // Label handling — portfolio + custom AI button
            let label: string;
            if (item.key === "portfolio") {
              label = isBn ? "পোর্টফোলিও" : "Portfolio";
            } else if (item.key === "ai") {
              label = isBn ? "এআই" : "AI";
            } else {
              // t() expects nav keys; order/contact/home etc. exist
              try {
                label = t(item.labelKey as "home" | "order" | "contact");
              } catch {
                label = item.key;
              }
            }

            return (
              <Link
                key={item.key}
                href={isAI ? "#" : href}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                aria-disabled={isAI}
                className={cn(
                  "group relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-center",
                  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                  "active:scale-[0.98]",
                  isAI
                    ? "cursor-default text-amber-300/90 hover:text-amber-300 opacity-85 hover:opacity-100"
                    : isActive
                    ? "text-emerald-400"
                    : "text-white/55 hover:text-white/85"
                )}
                onClick={isAI ? (e) => e.preventDefault() : undefined}
              >
                {/* Active pill — glass + soft emerald/cyan glow */}
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    className="absolute inset-0 rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-cyan-500/10 to-teal-500/10 shadow-[0_2px_16px_rgba(16,185,129,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[6px]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden="true"
                  />
                )}

                {/* Icon wrap */}
                <span
                  className={cn(
                    "relative flex h-7 w-10 items-center justify-center rounded-full transition-colors duration-300",
                    isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white/90"
                  )}
                >
                  {/* Active dot — Samsung One UI inspired */}
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-active-dot"
                      className="absolute -top-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] shrink-0 stroke-[1.85] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive && "-translate-y-px scale-110"
                    )}
                    aria-hidden="true"
                  />
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "relative line-clamp-1 max-w-full text-[10px] font-medium leading-none tracking-[-0.01em] transition-colors duration-300",
                    isActive ? "font-semibold text-emerald-300" : "font-medium text-white/55 group-hover:text-white/80"
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
