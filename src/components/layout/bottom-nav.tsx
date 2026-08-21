"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAiChatStore } from "@/components/ai/ai-chat-store";
import { useUiSound } from "@/hooks/useUiSound";
import { Home, ShoppingCart, MessageCircle, FolderOpen, Sparkles, X } from "lucide-react";

// ── Bottom Navigation Items ────────────────────────────
// Home | Portfolio | Nuva (center premium) | Order | Contact
const leftNavItems = [
  { key: "home", path: "/", icon: Home, labelKey: "home" as const },
  { key: "portfolio", path: "/portfolio", icon: FolderOpen, labelKey: "portfolio" as const },
] as const;

const rightNavItems = [
  { key: "order", path: "/order", icon: ShoppingCart, labelKey: "order" as const },
  { key: "contact", path: "/contact", icon: MessageCircle, labelKey: "contact" as const },
] as const;

// ── Nuva Center Button ──────────────────────────────────
// Premium floating center — the central intelligence of RahatVerse
function NuvaCenterButton({
  isBn,
  onOpen,
  showTooltip,
  onDismissTooltip,
}: {
  isBn: boolean;
  onOpen: () => void;
  showTooltip: boolean;
  onDismissTooltip: () => void;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <div className="relative flex flex-col items-center">
      {/* ── Intro Tooltip ── */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-auto absolute bottom-[calc(100%+18px)] left-1/2 z-20 -translate-x-1/2"
            role="status"
            aria-live="polite"
            aria-label={isBn ? "Nuva AI সহকারী পরিচিতি" : "Nuva AI introduction"}
          >
            <div className="relative flex items-center gap-2 whitespace-nowrap rounded-full border border-white/12 bg-[rgba(10,22,40,0.92)] px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_20px_rgba(16,185,129,0.18)] backdrop-blur-[18px]">
              {/* Glow behind tooltip */}
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-violet-500/10 blur-[12px]" aria-hidden="true" />
              <span className="text-[12px] font-medium leading-none text-white">
                {isBn ? (
                  <span className="bn">✨ আমাকে জিজ্ঞেস করুন</span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    Meet Nuva <span className="text-amber-300" aria-hidden="true">✨</span>
                  </span>
                )}
              </span>
              <button
                type="button"
                aria-label={isBn ? "টুলটিপ বন্ধ করুন" : "Dismiss tooltip"}
                onClick={onDismissTooltip}
                className="ml-1 flex h-7 w-7 min-h-[28px] min-w-[28px] items-center justify-center rounded-full bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
              {/* Arrow pointing to Nuva button */}
              <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/12 bg-[rgba(10,22,40,0.92)]" aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Elevated Button Wrapper ── */}
      {/* Negative top margin makes it overlap the bar's top edge */}
      <div className="relative -mt-9 flex flex-col items-center">
        <motion.button
          type="button"
          aria-label={
            isBn ? "Nuva AI সহকারী খুলুন" : "Open Nuva AI Assistant"
          }
          onClick={onOpen}
          whileTap={{ scale: 0.94 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </motion.button>

        <span className={cn("mt-1.5 text-[10px] font-semibold leading-none text-white/85", isBn && "bn")}>
          Nuva
        </span>
      </div>
    </div>
  );
}

// ── Regular Nav Item Rendering ─────────────────────────
// Phase 8: improved a11y, 44px targets, reduced-motion safe, visible focus
function NavItem({
  item,
  href,
  isActive,
  label,
}: {
  item: { key: string; path: string; icon: React.ElementType; labelKey: string };
  href: string;
  isActive: boolean;
  label: string;
}) {
  const Icon = item.icon;
  const shouldReduceMotion = useReducedMotion();
  const { tap } = useUiSound();

  return (
    <Link
      href={href}
      onClick={() => tap()}
      aria-current={isActive ? "page" : undefined}
      aria-label={isActive ? `${label} (current page)` : label}
      className={cn(
        "group relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-full px-1.5 py-2 text-center",
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,22,40,0.9)]",
        "active:scale-[0.96]",
        "touch-manipulation",
        isActive ? "text-emerald-400" : "text-white/55 hover:text-white/85"
      )}
    >
      {isActive && !shouldReduceMotion ? (
        <motion.span
          layoutId="bottom-nav-active-pill"
          className="absolute inset-0 rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-cyan-500/10 to-teal-500/10 shadow-[0_2px_16px_rgba(16,185,129,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[6px]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          aria-hidden="true"
        />
      ) : isActive ? (
        <span
          className="absolute inset-0 rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-cyan-500/10 to-teal-500/10"
          aria-hidden="true"
        />
      ) : null}

      <span
        className={cn(
          "relative flex h-7 w-9 items-center justify-center rounded-full transition-colors duration-200",
          isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white/90"
        )}
      >
        {isActive && (
          <span
            className="absolute -top-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
            aria-hidden="true"
          />
        )}
        <Icon
          className={cn(
            "h-[22px] w-[22px] shrink-0 stroke-[1.85] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isActive && "-translate-y-px scale-110",
            "group-hover:scale-105"
          )}
          aria-hidden="true"
        />
      </span>

      <span
        className={cn(
          "relative line-clamp-1 max-w-full text-[10px] font-medium leading-none tracking-[-0.01em] transition-colors duration-200",
          isActive ? "font-semibold text-emerald-300" : "font-medium text-white/55 group-hover:text-white/80"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

// ── Bottom Navigation Bar (Premium Floating Glass with Nuva Centerpiece) ──
export function BottomNavBar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isBn = pathname.startsWith("/bn");
  const locale = isBn ? "bn" : "en";
  const basePath = `/${locale}`;
  const openAiChat = useAiChatStore((state) => state.open);
  const { tap } = useUiSound();

  const [showTooltip, setShowTooltip] = useState(false);

  // ── Intro tooltip logic — show once, not annoyingly ──
  useEffect(() => {
    const key = "rahatverse-nuva-intro-dismissed-v1";
    const seen = typeof window !== "undefined" ? localStorage.getItem(key) : "1";
    if (seen) return;

    const revealTimer = setTimeout(() => setShowTooltip(true), 1800);
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      // Auto-dismiss after showing, so it doesn't reappear too soon
      // But keep it subtle — only mark as seen after auto-hide + 1 day? For better UX, mark seen when hidden
      try {
        localStorage.setItem(key, Date.now().toString());
      } catch {}
    }, 7600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDismissTooltip = () => {
    setShowTooltip(false);
    try {
      localStorage.setItem("rahatverse-nuva-intro-dismissed-v1", Date.now().toString());
    } catch {}
  };

  const handleNuvaOpen = () => {
    handleDismissTooltip();
    tap("success");
    openAiChat();
  };

  const getLabel = (key: string) => {
    if (key === "portfolio") return isBn ? "পোর্টফোলিও" : "Portfolio";
    try {
      return t(key as "home" | "order" | "contact");
    } catch {
      return key;
    }
  };

  const normalizedPathname = pathname.replace(/\/+$/, "");

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Safe-area + floating margin — extra top padding for overlapping Nuva */}
      <div className="mx-auto max-w-[23.5rem] px-4 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] pt-10 [360px]:max-w-[24rem] sm:max-w-md">
        <div
          className={cn(
            "pointer-events-auto relative flex items-end justify-between gap-0.5 rounded-[30px] border border-white/10 bg-[rgba(10,22,40,0.78)] px-2 pb-2 pt-2 shadow-[0_12px_36px_rgba(0,0,0,0.48),0_3px_12px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[24px]",
            "supports-[backdrop-filter]:bg-[rgba(10,22,40,0.66)]",
            "dark:shadow-[0_12px_36px_rgba(0,0,0,0.56),0_3px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.07)]"
          )}
        >
          {/* Left */}
          <div className="flex flex-1 items-center gap-0.5">
            {leftNavItems.map((item) => {
              const rawHref = `${basePath}${item.path}`.replace(/\/+$/, "");
              const href = rawHref;
              const isActive = normalizedPathname === rawHref;
              const label = getLabel(item.key);
              return (
                <NavItem key={item.key} item={item} href={href} isActive={isActive} label={label} />
              );
            })}
          </div>

          {/* Center — Nuva */}
          <div className="flex flex-[1.15] justify-center">
            <NuvaCenterButton
              isBn={isBn}
              onOpen={handleNuvaOpen}
              showTooltip={showTooltip}
              onDismissTooltip={handleDismissTooltip}
            />
          </div>

          {/* Right */}
          <div className="flex flex-1 items-center gap-0.5">
            {rightNavItems.map((item) => {
              const rawHref = `${basePath}${item.path}`.replace(/\/+$/, "");
              const href = item.key === "order" ? `${rawHref}#order-checkout` : rawHref;
              const isActive = normalizedPathname === rawHref;
              const label = getLabel(item.key);
              return (
                <NavItem key={item.key} item={item} href={href} isActive={isActive} label={label} />
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
