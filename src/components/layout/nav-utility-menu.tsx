"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowUp,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  Copy,
  Download,
  FolderOpen,
  Home,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Phone,
  Share2,
  ShoppingCart,
  Sparkles,
  Trophy,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, SOCIAL_LINKS } from "@/lib/constants";
import { useAiChatStore } from "@/components/ai/ai-chat-store";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useAppStore, ACCENT_THEMES } from "@/store";
import { SUPPORTED_ACCENTS, type AccentColor } from "@/types";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const SearchDialog = dynamic(
  () => import("@/components/interactive/SearchDialog").then((mod) => mod.SearchDialog),
  { ssr: false, loading: () => <div className="h-10 w-full animate-pulse rounded-lg bg-muted/40" /> }
);


// ── Icon map for the compact page grid ─────────────────
const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  FolderOpen,
  Briefcase,
  Building2,
  Trophy,
  Image: ImageIcon,
  ShoppingCart,
  BookOpen,
  Phone,
};

interface NavUtilityMenuProps {
  locale: string;
}

/**
 * Consolidated top-nav utility menu — "Command Center".
 *
 * Previously this three-dot menu only exposed search + language + theme +
 * accent. It is now a genuinely useful quick panel:
 *  - Search (also reachable with ⌘K / Ctrl+K from anywhere)
 *  - Primary actions: Ask Nuva AI, Order, WhatsApp, Contact
 *  - Every page as a compact icon grid (mobile/tablet, where the top nav hides links)
 *  - Appearance controls (language, theme, accent)
 *  - Utilities: share page / copy link, install app (PWA), back to top
 *  - Social profiles + keyboard hint
 *
 * A11y: labelled menu, roving focus trap, Escape to close, focus restore,
 * scroll lock while open on small screens, 40px+ tap targets.
 */
export function NavUtilityMenu({ locale }: NavUtilityMenuProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const isBn = locale === "bn";
  const basePath = `/${locale}`;
  const openAiChat = useAiChatStore((state) => state.open);
  const { canInstall, promptInstall } = useInstallPrompt();
  const accent = useAppStore((state) => state.accent);
  const setAccent = useAppStore((state) => state.setAccent);

  const label = useMemo(
    () => ({
      menu: isBn ? "কুইক মেনু" : "Quick menu",
      pages: isBn ? "পেজসমূহ" : "Pages",
      appearance: isBn ? "চেহারা" : "Appearance",
      tools: isBn ? "টুলস" : "Tools",
      quickActions: isBn ? "দ্রুত অ্যাকশন" : "Quick actions",
      nuva: isBn ? "Nuva AI" : "Ask Nuva",
      order: isBn ? "অর্ডার" : "Order",
      whatsapp: isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp",
      contact: isBn ? "যোগাযোগ" : "Contact",
      share: isBn ? "শেয়ার করুন" : "Share page",
      copy: isBn ? "লিংক কপি" : "Copy link",
      copied: isBn ? "কপি হয়েছে!" : "Copied!",
      install: isBn ? "অ্যাপ ইনস্টল" : "Install app",
      top: isBn ? "উপরে যান" : "Back to top",
      close: isBn ? "বন্ধ করুন" : "Close",
      follow: isBn ? "ফলো করুন" : "Follow",
      hint: isBn ? "সার্চ করতে চাপুন" : "Press to search",
    }),
    [isBn]
  );

  const navLabels: Record<string, { bn: string; en: string }> = {
    home: { bn: "হোম", en: "Home" },
    about: { bn: "পরিচিতি", en: "About" },
    portfolio: { bn: "পোর্টফোলিও", en: "Portfolio" },
    services: { bn: "সেবা", en: "Services" },
    experience: { bn: "অভিজ্ঞতা", en: "Experience" },
    achievements: { bn: "অর্জন", en: "Awards" },
    gallery: { bn: "গ্যালারি", en: "Gallery" },
    order: { bn: "অর্ডার", en: "Order" },
    blog: { bn: "ব্লগ", en: "Blog" },
    contact: { bn: "যোগাযোগ", en: "Contact" },
  };

  const closeMenu = useCallback(
    (restoreFocus = true) => {
      setOpen(false);
      setCopied(false);
      if (restoreFocus) buttonRef.current?.focus();
    },
    []
  );

  // ── Close on route change ──
  // Render-time state adjustment (the pattern React recommends over an effect):
  // navigating away should never leave the panel hanging open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // ── Hydrate the saved accent once per page load ──
  // (previously done by AccentCustomizer, which now only renders on demand)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rahatverse_accent") as AccentColor | null;
      setAccent(saved && SUPPORTED_ACCENTS.includes(saved) ? saved : "emerald");
    } catch {
      // Ignore restricted storage
    }
  }, [setAccent]);

  // ── Global ⌘K / Ctrl+K opens the panel with search focused ──
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // ── Outside click, Escape, simple focus trap, scroll lock ──
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // The search dialog owns Escape while it is open.
        if (searchOpen) return;
        closeMenu();
        return;
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [open, searchOpen, closeMenu]);

  const handleCopyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: document.title || "RahatVerse",
      url: window.location.href,
    };
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    await handleCopyLink();
  }, [handleCopyLink]);

  const handleInstall = useCallback(async () => {
    await promptInstall();
    closeMenu(false);
  }, [promptInstall, closeMenu]);

  const handleScrollTop = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    closeMenu(false);
  }, [closeMenu]);

  const handleAskNuva = useCallback(() => {
    openAiChat();
    closeMenu(false);
  }, [openAiChat, closeMenu]);

  const primaryActionClass =
    "flex min-h-[44px] items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-left text-[13px] font-medium text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const toolButtonClass =
    "flex min-h-[40px] w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-foreground/85 transition-colors hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        data-testid="nav-utility-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={isBn ? "অতিরিক্ত মেনু" : "More options menu"}
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
          ref={panelRef}
          role="menu"
          aria-label={isBn ? "অতিরিক্ত অপশন" : "Additional options"}
          className={cn(
            "glass absolute right-0 top-12 z-50 w-[min(88vw,20rem)] rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-fade-in-down",
            "max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain"
          )}
        >
          {/* ── Header ── */}
          <div className="mb-2.5 flex items-center justify-between border-b border-border/60 pb-2">
            <span className={cn("text-sm font-semibold text-foreground", isBn && "bn")}>
              {label.menu}
            </span>
            <button
              type="button"
              onClick={() => closeMenu()}
              aria-label={label.close}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* ── Search ── */}
          <div className="[&>button]:w-full [&>button]:justify-start" role="none">
            <SearchDialog locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
          </div>

          {/* ── Primary actions ── */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5" role="group" aria-label={label.quickActions}>
            <button
              type="button"
              role="menuitem"
              onClick={handleAskNuva}
              className={cn(primaryActionClass, "border-emerald-400/30 bg-emerald-500/10")}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span className={cn("truncate", isBn && "bn")}>{label.nuva}</span>
            </button>
            <Link
              href={`${basePath}/order#order-checkout`}
              role="menuitem"
              onClick={() => closeMenu(false)}
              className={cn(primaryActionClass, "border-amber-400/30 bg-amber-500/10")}
            >
              <ShoppingCart className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <span className={cn("truncate", isBn && "bn")}>{label.order}</span>
            </Link>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => closeMenu(false)}
              className={cn(primaryActionClass, "border-green-400/30 bg-green-500/10")}
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
              <span className={cn("truncate", isBn && "bn")}>{label.whatsapp}</span>
            </a>
            <Link
              href={`${basePath}/contact`}
              role="menuitem"
              onClick={() => closeMenu(false)}
              className={cn(primaryActionClass, "border-blue-400/30 bg-blue-500/10")}
            >
              <Phone className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
              <span className={cn("truncate", isBn && "bn")}>{label.contact}</span>
            </Link>
          </div>

          {/* ── Page grid (top nav hides links below lg) ── */}
          <div className="mt-3 lg:hidden">
            <p className={cn("mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", isBn && "bn")}>
              {label.pages}
            </p>
            <div className="grid grid-cols-4 gap-1" role="group" aria-label={label.pages}>
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = NAV_ICONS[item.icon] ?? Link2;
                const href = `${basePath}${item.path}`.replace(/\/+$/, "");
                const isActive = pathname.replace(/\/+$/, "") === href;
                const text = navLabels[item.key]
                  ? isBn
                    ? navLabels[item.key].bn
                    : navLabels[item.key].en
                  : item.key;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => closeMenu(false)}
                    className={cn(
                      "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border px-1 py-1.5 text-center transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary/40 bg-primary/12 text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-white/[0.06] hover:text-foreground"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                    <span className={cn("line-clamp-1 text-[10px] font-medium leading-none", isBn && "bn")}>
                      {text}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Appearance ── */}
          <div className="mt-3">
            <p className={cn("mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", isBn && "bn")}>
              {label.appearance}
            </p>
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label={isBn ? "ভাষা ও থিম" : "Language and theme"}
            >
              <div className="flex-1 [&>button]:w-full" role="menuitem">
                <LanguageToggle />
              </div>
              <div role="menuitem">
                <ThemeToggle />
              </div>
            </div>

            {/* Accent swatches — inline so nothing is clipped by the panel */}
            <div
              className="mt-1.5 flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/50 px-2.5 py-2"
              role="group"
              aria-label={isBn ? "থিম কালার" : "Accent color"}
            >
              <Palette className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {SUPPORTED_ACCENTS.map((colorKey) => {
                const theme = ACCENT_THEMES[colorKey];
                const isSelected = accent === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    onClick={() => setAccent(colorKey)}
                    aria-label={isBn ? theme.nameBn : theme.nameEn}
                    title={isBn ? theme.nameBn : theme.nameEn}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "scale-110 border-foreground/70"
                        : "border-white/20 hover:scale-105"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
                    }}
                  >
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tools ── */}
          <div className="mt-3">
            <p className={cn("mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", isBn && "bn")}>
              {label.tools}
            </p>
            <div className="flex flex-col" role="group" aria-label={label.tools}>
              <button type="button" role="menuitem" onClick={handleShare} className={toolButtonClass}>
                <Share2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className={cn(isBn && "bn")}>{label.share}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleCopyLink}
                aria-live="polite"
                className={toolButtonClass}
              >
                {copied ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
                <span className={cn(isBn && "bn")}>{copied ? label.copied : label.copy}</span>
              </button>
              {canInstall && (
                <button type="button" role="menuitem" onClick={handleInstall} className={toolButtonClass}>
                  <Download className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className={cn(isBn && "bn")}>{label.install}</span>
                </button>
              )}
              <button type="button" role="menuitem" onClick={handleScrollTop} className={toolButtonClass}>
                <ArrowUp className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className={cn(isBn && "bn")}>{label.top}</span>
              </button>
            </div>
          </div>

          {/* ── Social + shortcut hint ── */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
            <div className="flex items-center gap-1" role="group" aria-label={label.follow}>
              {[
                { href: SOCIAL_LINKS.facebook, name: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: SOCIAL_LINKS.youtube, name: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { href: SOCIAL_LINKS.instagram, name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { href: SOCIAL_LINKS.tiktok, name: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
            <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      )}
    </div>
  );
}
