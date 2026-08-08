"use client";

// ── Rahat AI — Chat Widget ─────────────────────────────
// Floating assistant available on every page:
//   • Desktop (lg+): floating gold bubble, bottom-right
//   • Mobile: opened from the bottom navigation "AI" button
// The panel talks to /api/chat, which answers with a real (free-tier) LLM
// when a key is configured, or with the built-in knowledge base otherwise.

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ExternalLink, Loader2, Send, Sparkles, User, X } from "lucide-react";
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
    title: "Rahat AI",
    subtitle: "Always here to help",
    placeholder: "Ask about services, prices…",
    send: "Send message",
    close: "Close AI chat",
    open: "Open AI chat",
    error: "Something went wrong — please try again, or reach us on WhatsApp.",
    poweredBy: "Free built-in assistant",
  },
  bn: {
    title: "রাহাত এআই",
    subtitle: "সবসময় সাহায্যের জন্য আছি",
    placeholder: "সেবা, দাম ইত্যাদি জিজ্ঞেস করুন…",
    send: "বার্তা পাঠান",
    close: "এআই চ্যাট বন্ধ করুন",
    open: "এআই চ্যাট খুলুন",
    error: "একটি সমস্যা হয়েছে — আবার চেষ্টা করুন, অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।",
    poweredBy: "ফ্রি বিল্ট-ইন সহকারী",
  },
} as const;

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1.5" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-amber-300/90"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function AIChatWidget() {
  const pathname = usePathname();
  const isBn = pathname.startsWith("/bn");
  const locale = isBn ? ("bn" as const) : ("en" as const);
  const basePath = `/${locale}`;
  const t = UI_TEXT[locale];

  const { isOpen, open, close } = useAiChatStore();
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greetedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Greet the visitor the first time the panel opens.
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
      // Wait for the open animation before focusing.
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isBn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  // Close on Escape.
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
    [isSending, messages, locale, t.error],
  );

  const showQuickPrompts =
    !isSending && messages.length > 0 && messages.every((m) => m.role === "assistant");

  return (
    <>
      {/* ── Floating bubble (desktop only; mobile uses the bottom nav) ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="ai-bubble"
            type="button"
            onClick={open}
            aria-label={t.open}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={cn(
              "group fixed bottom-6 right-6 z-[60] hidden lg:flex",
              "h-14 w-14 items-center justify-center rounded-full",
              "border border-amber-300/30 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500",
              "shadow-[0_8px_28px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]",
              "transition-transform duration-300 hover:scale-105 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            )}
          >
            {/* Soft glow */}
            <span
              className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-amber-400/25 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <Sparkles className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={cn(
              "fixed z-[60] flex flex-col overflow-hidden",
              // Mobile: sit right above the floating bottom nav.
              "inset-x-3 bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px))] h-[62dvh] max-h-[34rem] rounded-3xl",
              // Desktop: docked panel at the bottom-right corner.
              "lg:inset-x-auto lg:bottom-6 lg:right-6 lg:h-[min(38rem,calc(100dvh-4rem))] lg:max-h-none lg:w-[25rem]",
              "border border-white/10 bg-[rgba(10,22,40,0.86)] backdrop-blur-2xl",
              "shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]",
            )}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/8 bg-gradient-to-r from-amber-500/12 via-transparent to-emerald-500/10 px-4 py-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/30 bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_4px_14px_rgba(245,158,11,0.35)]">
                <Sparkles className="h-4.5 w-4.5 text-white" aria-hidden="true" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[rgba(10,22,40,1)] bg-emerald-400"
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{t.title}</p>
                <p className="truncate text-[11px] text-emerald-300/90">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t.close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 [scrollbar-width:thin]"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full",
                      message.role === "user"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-400/15 text-amber-300",
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
                      "max-w-[82%] space-y-2",
                      message.role === "user" ? "items-end text-right" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "inline-block whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-left text-[13px] leading-relaxed",
                        message.role === "user"
                          ? "rounded-tr-md bg-emerald-500/85 text-white shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
                          : "rounded-tl-md border border-white/8 bg-white/[0.06] text-white/90",
                      )}
                    >
                      {message.content}
                    </div>

                    {/* Action link chips (knowledge-base answers) */}
                    {message.links && message.links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.links.map((link) => (
                          <a
                            key={link.href + link.labelEn}
                            href={link.external ? link.href : `${basePath}${link.href}`}
                            {...(link.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-200 transition-colors hover:border-amber-300/50 hover:bg-amber-400/20"
                          >
                            {isBn ? link.labelBn : link.labelEn}
                            {link.external && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex gap-2">
                  <span
                    className="mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300"
                    aria-hidden="true"
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <span className="inline-block rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.06] px-3">
                    <TypingDots />
                  </span>
                </div>
              )}

              {/* Quick prompts — shown before the first user message */}
              {showQuickPrompts && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => send(isBn ? prompt.bn : prompt.en)}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11.5px] text-white/75 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200"
                    >
                      {isBn ? prompt.bn : prompt.en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              className="border-t border-white/8 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t.placeholder}
                  maxLength={1000}
                  disabled={isSending}
                  className={cn(
                    "h-10 min-w-0 flex-1 rounded-full border border-white/12 bg-white/[0.06] px-4",
                    "text-[13px] text-white placeholder:text-white/35",
                    "focus:border-amber-300/40 focus:outline-none focus:ring-1 focus:ring-amber-300/30",
                    "disabled:opacity-60",
                  )}
                />
                <button
                  type="submit"
                  aria-label={t.send}
                  disabled={isSending || !input.trim()}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
                    "shadow-[0_4px_14px_rgba(245,158,11,0.35)]",
                    "transition-all duration-200 hover:scale-105 active:scale-95",
                    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60",
                  )}
                >
                  {isSending ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/30">{t.poweredBy}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
