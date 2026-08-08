"use client";

// ── Nuva — Premium AI Chat Widget ──────────────────────
// Phase 14: Nuva AI Assistant UI/UX Upgrade
// - Premium floating center button on mobile (via bottom-nav)
// - Premium floating glass widget on desktop
// - Smooth emergence animation from Nuva button
// - Glassmorphism, gradient glow, lightweight animations
// - Intro tooltip, guide chips, accessible, performant

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  ExternalLink,
  Loader2,
  Send,
  Sparkles,
  User,
  X,
  MessageCircle,
  FolderOpen,
  Package,
  Compass,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiChatStore } from "@/components/ai/ai-chat-store";
import { QUICK_PROMPTS, AI_TEXTS, type AiLink } from "@/lib/ai/knowledge";

interface WidgetMessage {
  role: "user" | "assistant";
  content: string;
  links?: AiLink[];
}

const UI_TEXT = {
  en: {
    title: "Nuva",
    subtitle: "RahatVerse Intelligence • Always here to guide you",
    placeholder: "Ask Nuva anything…",
    send: "Send message",
    close: "Close Nuva chat",
    open: "Open Nuva AI Assistant",
    error: "Something went wrong — please try again, or reach us on WhatsApp.",
    poweredBy: "Nuva • RahatVerse Intelligence",
    greetingAlt: "Hello, I'm Nuva 👋 — your guide to RahatVerse",
    talk: "Talk to Nuva",
    ask: "Ask Nuva",
    meet: "Meet Nuva ✨",
  },
  bn: {
    title: "নুভা",
    subtitle: "RahatVerse ইন্টেলিজেন্স • সবসময় আপনাকে গাইড করতে প্রস্তুত",
    placeholder: "নুভাকে যেকোনো কিছু জিজ্ঞেস করুন…",
    send: "বার্তা পাঠান",
    close: "নুভা চ্যাট বন্ধ করুন",
    open: "Nuva AI খুলুন",
    error: "একটি সমস্যা হয়েছে — আবার চেষ্টা করুন, অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।",
    poweredBy: "নুভা • RahatVerse ইন্টেলিজেন্স",
    greetingAlt: "হ্যালো, আমি নুভা 👋 — RahatVerse ঘুরে দেখতে আপনাকে সাহায্য করব",
    talk: "নুভার সাথে কথা বলুন",
    ask: "আমাকে জিজ্ঞেস করুন",
    meet: "আমাকে জিজ্ঞেস করুন ✨",
  },
} as const;

// ── Guide chips — requested in Phase 14 spec ──
const NUVA_GUIDE_CHIPS = [
  {
    id: "rahat",
    en: "Tell me about Rahat",
    bn: "Rahat সম্পর্কে বলো",
    icon: User,
  },
  {
    id: "portfolio",
    en: "Show portfolio",
    bn: "Portfolio দেখাও",
    icon: FolderOpen,
  },
  {
    id: "packages",
    en: "View packages",
    bn: "Website packages দেখাও",
    icon: Package,
  },
  {
    id: "tour",
    en: "Explore RahatVerse",
    bn: "RahatVerse ঘুরে দেখাও",
    icon: Compass,
  },
  {
    id: "contact",
    en: "I want to contact",
    bn: "যোগাযোগ করতে চাই",
    icon: Mail,
  },
] as const;

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1.5" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-emerald-300/90"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

// ── Premium Desktop Floating Button ──
function DesktopNuvaButton({
  isBn,
  onOpen,
  label,
  showIntro,
  onDismissIntro,
}: {
  isBn: boolean;
  onOpen: () => void;
  label: string;
  showIntro: boolean;
  onDismissIntro: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group fixed bottom-6 right-6 z-[60] hidden lg:block">
      {/* Intro tooltip for desktop */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.92, x: "-50%" }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="pointer-events-auto absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2"
          >
            <div className="relative flex items-center gap-2 whitespace-nowrap rounded-full border border-white/12 bg-[rgba(10,22,40,0.92)] px-4 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(16,185,129,0.18)] backdrop-blur-[18px]">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-violet-500/10 blur-[16px]" />
              <span className="text-[13px] font-medium text-white">
                {isBn ? "✨ আমাকে জিজ্ঞেস করুন" : "Meet Nuva ✨"}
              </span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={onDismissIntro}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/15 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/12 bg-[rgba(10,22,40,0.92)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover label — expands to pill */}
      <div className="pointer-events-none absolute bottom-[76px] right-0 flex justify-end opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
        <div className="rounded-full border border-white/12 bg-[rgba(10,22,40,0.88)] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-[14px]">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {label}
          </span>
        </div>
      </div>

      {/* Button wrapper with glow */}
      <div className="relative">
        {/* Outer premium glow */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-6 rounded-full",
            "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.26),rgba(6,182,212,0.18)_36%,rgba(139,92,246,0.14)_64%,transparent_72%)]",
            "blur-[14px] opacity-80 transition-opacity duration-500 group-hover:opacity-100",
            !shouldReduceMotion && "animate-nuva-glow"
          )}
          aria-hidden="true"
        />
        {/* Pulse rings */}
        {!shouldReduceMotion && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full border border-emerald-300/25"
              animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeOut" }}
              aria-hidden="true"
            />
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full border border-cyan-300/15"
              animate={{ scale: [1, 1.85], opacity: [0.4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              aria-hidden="true"
            />
          </>
        )}

        <motion.button
          type="button"
          onClick={onOpen}
          aria-label={isBn ? "Nuva AI সহকারী খুলুন" : "Open Nuva AI Assistant"}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className={cn(
            "relative flex h-[64px] w-[64px] items-center justify-center rounded-full",
            "border border-white/20 bg-gradient-to-br from-amber-300 via-emerald-400 to-cyan-500",
            "shadow-[0_12px_32px_rgba(16,185,129,0.4),0_6px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(0,0,0,0.1)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            !shouldReduceMotion && "animate-nuva-float",
            "will-change-transform"
          )}
        >
          <span
            className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.28)_18%,transparent_44%)]"
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-70" />
          <span className="relative flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:rotate-[10deg] group-hover:scale-110" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
          </span>
          {/* Shimmer on hover */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[220%] group-hover:opacity-100" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export function AIChatWidget() {
  const pathname = usePathname();
  const isBn = pathname.startsWith("/bn");
  const locale = isBn ? ("bn" as const) : ("en" as const);
  const basePath = `/${locale}`;
  const t = UI_TEXT[locale];
  const shouldReduceMotion = useReducedMotion();

  const { isOpen, open, close } = useAiChatStore();
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showDesktopIntro, setShowDesktopIntro] = useState(false);
  const [origin, setOrigin] = useState("50% 100%"); // transform origin for emerge animation
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greetedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Set transform origin based on viewport
  useEffect(() => {
    const updateOrigin = () => {
      if (typeof window === "undefined") return;
      setOrigin(window.innerWidth >= 1024 ? "100% 100%" : "50% 100%");
    };
    updateOrigin();
    window.addEventListener("resize", updateOrigin);
    return () => window.removeEventListener("resize", updateOrigin);
  }, []);

  // Desktop intro tooltip — uses same storage key as mobile to avoid annoyance
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "rahatverse-nuva-intro-dismissed-v1";
    const seen = localStorage.getItem(key);
    if (seen) return;
    // Only show on desktop
    if (window.innerWidth < 1024) return;

    const reveal = setTimeout(() => setShowDesktopIntro(true), 2200);
    const hide = setTimeout(() => {
      setShowDesktopIntro(false);
      try {
        localStorage.setItem(key, Date.now().toString());
      } catch {}
    }, 7800);

    return () => {
      clearTimeout(reveal);
      clearTimeout(hide);
    };
  }, []);

  // Greet visitor first time panel opens
  useEffect(() => {
    if (isOpen && !greetedRef.current) {
      greetedRef.current = true;
      setMessages([
        {
          role: "assistant",
          content: isBn ? AI_TEXTS.greetingBn : AI_TEXTS.greetingEn,
        },
      ]);
    }
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isBn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isSending) return;

      const userMessage: WidgetMessage = { role: "user", content: text };
      const history = [...messages, userMessage];
      setMessages(history);
      setInput("");
      setIsSending(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            messages: history.map(({ role, content }) => ({ role, content })),
          }),
        });
        const data: { reply?: string; links?: AiLink[]; error?: string } =
          await response.json().catch(() => ({}));

        if (!response.ok || !data.reply) {
          throw new Error(data.error || "chat failed");
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply as string, links: data.links },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t.error, links: [] },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, messages, locale, t.error]
  );

  const showQuickPrompts =
    !isSending && messages.length > 0 && messages.every((m) => m.role === "assistant");

  const handleDismissDesktopIntro = () => {
    setShowDesktopIntro(false);
    try {
      localStorage.setItem("rahatverse-nuva-intro-dismissed-v1", Date.now().toString());
    } catch {}
  };

  return (
    <>
      {/* ── Desktop: Premium Floating Nuva Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="ai-bubble-desktop"
            initial={{ opacity: 0, scale: 0.72, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.72, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <DesktopNuvaButton
              isBn={isBn}
              onOpen={open}
              label={isBn ? t.talk : t.meet}
              showIntro={showDesktopIntro}
              onDismissIntro={handleDismissDesktopIntro}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel — premium emergence from Nuva button ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — subtle, mobile only to avoid covering desktop */}
            <motion.div
              key="nuva-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[59] bg-[rgba(5,10,21,0.32)] backdrop-blur-[2px] lg:hidden"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              key="ai-panel"
              role="dialog"
              aria-modal="true"
              aria-label={t.title}
              initial={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.98 }
                  : { opacity: 0, y: 36, scale: 0.9, filter: "blur(8px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.98 }
                  : { opacity: 0, y: 28, scale: 0.92, filter: "blur(6px)" }
              }
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              style={{ transformOrigin: origin }}
              className={cn(
                "fixed z-[60] flex flex-col overflow-hidden",
                // Mobile: above floating bottom nav, centered margin
                "inset-x-3 bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] h-[68dvh] max-h-[38rem] rounded-[28px]",
                // Tablet: slightly larger
                "md:inset-x-auto md:left-1/2 md:right-auto md:w-[26rem] md:-translate-x-1/2 lg:translate-x-0",
                // Desktop: docked bottom-right
                "lg:inset-x-auto lg:bottom-7 lg:right-7 lg:left-auto lg:h-[min(40rem,calc(100dvh-5rem))] lg:max-h-none lg:w-[27rem] lg:rounded-[24px]",
                "border border-white/12 bg-[rgba(10,22,40,0.92)] backdrop-blur-[24px]",
                "shadow-[0_24px_64px_rgba(0,0,0,0.58),0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "will-change-transform"
              )}
            >
              {/* Subtle gradient glow behind panel */}
              <div
                className="pointer-events-none absolute -inset-1 -z-10 rounded-[inherit] bg-gradient-to-br from-emerald-500/12 via-cyan-500/10 to-violet-500/10 blur-[18px] opacity-70"
                aria-hidden="true"
              />

              {/* Header — premium, glassmorphism */}
              <div className="relative flex items-center gap-3 border-b border-white/8 bg-gradient-to-r from-amber-500/10 via-emerald-500/8 to-cyan-500/8 px-4 py-3.5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-amber-300 via-emerald-400 to-cyan-500 shadow-[0_6px_18px_rgba(16,185,129,0.32),inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.85),transparent_42%)]" />
                  <Sparkles className="relative h-5 w-5 text-white drop-shadow" aria-hidden="true" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[rgba(10,22,40,0.92)] bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                      {t.title}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" /> AI
                    </span>
                  </div>
                  <p className="truncate text-[11px] leading-tight text-white/60">{t.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.close}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.06] text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4 [scrollbar-width:thin] scrollbar-thin"
              >
                {/* Welcome hint — Hello, I'm Nuva */}
                {messages.length === 1 && (
                  <div className="mb-2 rounded-2xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent px-3.5 py-2.5">
                    <p className="text-[12px] font-medium leading-relaxed text-emerald-200/90">
                      {t.greetingAlt}
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2.5",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                        message.role === "user"
                          ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
                          : "border-amber-300/20 bg-gradient-to-br from-amber-400/20 to-emerald-400/20 text-amber-200"
                      )}
                      aria-hidden="true"
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div
                      className={cn(
                        "max-w-[84%] space-y-2",
                        message.role === "user" ? "items-end text-right" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-block whitespace-pre-line rounded-[18px] px-4 py-2.5 text-left text-[13.5px] leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.12)]",
                          message.role === "user"
                            ? "rounded-tr-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                            : "rounded-tl-md border border-white/8 bg-white/[0.07] text-white/90 backdrop-blur-[6px]"
                        )}
                      >
                        {message.content}
                      </div>

                      {message.links && message.links.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {message.links.map((link) => (
                            <a
                              key={link.href + link.labelEn}
                              href={link.external ? link.href : `${basePath}${link.href}`}
                              {...(link.external
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200 transition-colors hover:border-amber-300/50 hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/40"
                            >
                              {isBn ? link.labelBn : link.labelEn}
                              {link.external && (
                                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300/15 bg-gradient-to-br from-amber-400/15 to-emerald-400/15 text-amber-200">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                    <span className="inline-block rounded-[18px] rounded-tl-md border border-white/8 bg-white/[0.06] px-4">
                      <TypingDots />
                    </span>
                  </div>
                )}

                {/* Quick actions — premium chips */}
                {showQuickPrompts && (
                  <div className="space-y-3 pt-2">
                    {/* Primary guide chips — as requested */}
                    <div className="flex flex-wrap gap-2">
                      {NUVA_GUIDE_CHIPS.map((chip) => {
                        const Icon = chip.icon;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => send(isBn ? chip.bn : chip.en)}
                            className={cn(
                              "group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-medium",
                              "border-white/12 bg-white/[0.06] text-white/80 backdrop-blur-[8px]",
                              "shadow-[0_2px_10px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]",
                              "transition-all duration-200 hover:scale-[1.02] hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-200 hover:shadow-[0_4px_16px_rgba(16,185,129,0.18)]",
                              "active:scale-[0.98]",
                              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300/40"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 text-emerald-300/80 group-hover:text-emerald-300" />
                            {isBn ? chip.bn : chip.en}
                          </button>
                        );
                      })}
                    </div>

                    {/* Secondary: original quick prompts as compact text chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt.id}
                          type="button"
                          onClick={() => send(isBn ? prompt.bn : prompt.en)}
                          className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-white/15 hover:bg-white/[0.07] hover:text-white/85"
                        >
                          {isBn ? prompt.bn : prompt.en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input — premium */}
              <form
                className="border-t border-white/8 bg-gradient-to-b from-white/[0.02] to-transparent p-3.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  send(input);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={t.placeholder}
                      maxLength={1000}
                      disabled={isSending}
                      className={cn(
                        "h-11 w-full rounded-full border border-white/12 bg-white/[0.06] pl-4 pr-4",
                        "text-[13.5px] text-white placeholder:text-white/35",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                        "focus:border-emerald-400/30 focus:outline-none focus:ring-1 focus:ring-emerald-300/25",
                        "disabled:opacity-60",
                        "transition-all duration-200"
                      )}
                    />
                    {/* Input glow on focus */}
                    <div className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-emerald-500/0 via-cyan-500/0 to-violet-500/0 opacity-0 blur-[8px] transition-opacity duration-300 peer-focus:opacity-100" />
                  </div>
                  <button
                    type="submit"
                    aria-label={t.send}
                    disabled={isSending || !input.trim()}
                    className={cn(
                      "group flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                      "bg-gradient-to-br from-amber-300 via-emerald-400 to-cyan-500 text-white",
                      "shadow-[0_6px_18px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.6)]",
                      "transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_22px_rgba(16,185,129,0.45)] active:scale-95",
                      "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-[0_6px_18px_rgba(16,185,129,0.35)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
                    )}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p className="mt-2.5 text-center text-[10px] tracking-wide text-white/30">
                  {t.poweredBy} •{" "}
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {isBn ? "সবসময় প্রস্তুত" : "Always ready to help"}
                  </span>
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
