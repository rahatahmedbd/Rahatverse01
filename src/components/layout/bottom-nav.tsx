"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAiChatStore } from "@/components/ai/ai-chat-store";
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center">
      {/* ── Intro Tooltip ── */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-auto absolute bottom-[calc(100%+18px)] left-1/2 z-20 -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div className="relative flex items-center gap-2 whitespace-nowrap rounded-full border border-white/12 bg-[rgba(10,22,40,0.92)] px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_20px_rgba(16,185,129,0.18)] backdrop-blur-[18px]">
              {/* Glow behind tooltip */}
              <div className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-violet-500/10 blur-[12px]" />
              <span className="text-[12px] font-medium leading-none text-white">
                {isBn ? (
                  <span className="bn">✨ আমাকে জিজ্ঞেস করুন</span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    Meet Nuva <span className="text-amber-300">✨</span>
                  </span>
                )}
              </span>
              <button
                type="button"
                aria-label={isBn ? "বন্ধ করুন" : "Dismiss"}
                onClick={onDismissTooltip}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
              {/* Arrow pointing to Nuva button */}
              <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/12 bg-[rgba(10,22,40,0.92)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Elevated Button Wrapper ── */}
      {/* Negative top margin makes it overlap the bar's top edge */}
      <div className="relative -mt-9 flex flex-col items-center">
        {/* Outer glow — premium, lightweight, GPU-friendly */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-5 rounded-full",
            "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.22),rgba(6,182,212,0.16)_35%,rgba(139,92,246,0.12)_65%,transparent_72%)]",
            "blur-[10px]",
            !shouldReduceMotion && "animate-nuva-glow"
          )}
          aria-hidden="true"
        />

        {/* Pulse ring — extremely subtle */}
        {!shouldReduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border border-emerald-300/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
            aria-hidden="true"
          />
        )}
        {!shouldReduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full border border-cyan-300/20"
            initial={{ scale: 1, opacity: 0.35 }}
            animate={{ scale: [1, 1.75], opacity: [0.35, 0] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
              repeatDelay: 0.2,
            }}
            aria-hidden="true"
          />
        )}

        {/* ── Main Nuva Button ── */}
        <motion.button
          type="button"
          aria-label={
            isBn ? "Nuva AI সহকারী খুলুন" : "Open Nuva AI Assistant"
          }
          onClick={onOpen}
          whileTap={{ scale: 0.92 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className={cn(
            "group relative flex h-[64px] w-[64px] items-center justify-center rounded-full",
            "border border-white/20 bg-gradient-to-br from-amber-300 via-emerald-400 to-cyan-500",
            "shadow-[0_10px_28px_rgba(16,185,129,0.38),0_4px_12px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.12)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,22,40,0.75)]",
            !shouldReduceMotion && "animate-nuva-float",
            "will-change-transform"
          )}
          style={{
            transformOrigin: "50% 50%",
          }}
        >
          {/* Inner highlight — glassmorphism depth */}
          <span
            className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.28)_18%,transparent_42%)]"
            aria-hidden="true"
          />
          {/* Subtle inner border glow */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-70"
            aria-hidden="true"
          />

          {/* Icon — immediately recognizable AI spark */}
          <span className="relative flex items-center justify-center">
            <Sparkles
              className={cn(
                "h-7 w-7 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]",
                "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "group-hover:rotate-[8deg] group-hover:scale-110"
              )}
              aria-hidden="true"
            />
            {/* Tiny status dot — online intelligence */}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              aria-hidden="true"
            />
          </span>

          {/* Shimmer sweep on hover — lightweight */}
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" />
          </span>
        </motion.button>

        {/* Label below — simple, premium */}
        <span className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold leading-none tracking-[0.02em] text-white/85">
          <span className="text-[10px]">✨</span>
          <span className={cn(isBn ? "bn font-medium" : "font-semibold tracking-wide")}>
            Nuva
          </span>
        </span>
      </div>
    </div>
  );
}

// ── Regular Nav Item Rendering ─────────────────────────
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

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      className={cn(
        "group relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-full px-1.5 py-2 text-center",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "active:scale-[0.96]",
        isActive ? "text-emerald-400" : "text-white/55 hover:text-white/85"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="bottom-nav-active-pill"
          className="absolute inset-0 rounded-full border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-cyan-500/10 to-teal-500/10 shadow-[0_2px_16px_rgba(16,185,129,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[6px]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          aria-hidden="true"
        />
      )}

      <span
        className={cn(
          "relative flex h-7 w-9 items-center justify-center rounded-full transition-colors duration-300",
          isActive ? "text-emerald-400" : "text-white/60 group-hover:text-white/90"
        )}
      >
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
            isActive && "-translate-y-px scale-110",
            "group-hover:scale-105"
          )}
          aria-hidden="true"
        />
      </span>

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
}

// ── Bottom Navigation Bar (Premium Floating Glass with Nuva Centerpiece) ──
export function BottomNavBar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isBn = pathname.startsWith("/bn");
  const locale = isBn ? "bn" : "en";
  const basePath = `/${locale}`;
  const openAiChat = useAiChatStore((state) => state.open);

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
          {/* Subtle outer glow */}
          <div
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-r from-emerald-500/[0.08] via-cyan-500/[0.07] to-violet-500/[0.06] blur-[22px]"
            aria-hidden="true"
          />

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
