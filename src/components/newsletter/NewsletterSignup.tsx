"use client";

import { useEffect, useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/card";
import { trackEvent } from "@/lib/analytics/tracker";
import { DEFAULT_NEWSLETTER_CONFIG, validateNewsletterConfig } from "@/lib/newsletter/config";
import type { NewsletterConfig } from "@/types/newsletter";

interface NewsletterSignupProps {
  locale?: string;
  variant?: "card" | "inline" | "footer";
  source?: string;
}

export function NewsletterSignup({ locale = "bn", variant = "card", source = "website" }: NewsletterSignupProps) {
  const isBn = locale === "bn";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showName, setShowName] = useState(false);
  const [config, setConfig] = useState<NewsletterConfig>(DEFAULT_NEWSLETTER_CONFIG);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/newsletter-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateNewsletterConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTopic = (value: string) => {
    setSelectedTopics((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const preferences: Record<string, boolean> = {};
      for (const topic of selectedTopics) preferences[topic] = true;
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined, source, locale, preferences }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || (isBn ? "নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে! ইনবক্স চেক করুন।" : "Confirmation email sent! Check your inbox."));
        setEmail("");
        setName("");
        trackEvent("newsletter_subscribe", { category: "conversion", label: source, metadata: { email_domain: email.split("@")[1] } });
      } else if (res.status === 409) {
        setStatus("error");
        setMessage(isBn ? "এই ইমেইল ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে।" : "This email is already subscribed.");
      } else if (res.status === 429) {
        setStatus("error");
        setMessage(isBn ? "অনেকবার চেষ্টা হয়েছে। এক মিনিট পর আবার চেষ্টা করুন।" : "Too many requests. Try again in a minute.");
      } else {
        setStatus("error");
        setMessage(data.error || (isBn ? "সাবস্ক্রাইব করা যায়নি।" : "Failed to subscribe."));
      }
    } catch {
      setStatus("error");
      setMessage(isBn ? "নেটওয়ার্ক সমস্যা।" : "Network error.");
    }
  };

  if (status === "success") {
    return (
      <GlassCard className={`border-green-500/20 bg-green-500/5 ${variant === "footer" ? "p-4" : "p-6"}`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/15">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-400 bn">{isBn ? "ইমেইল পাঠানো হয়েছে!" : "Check your email!"}</p>
            <p className="mt-1 text-sm text-muted-foreground bn">{message}</p>
            <p className="mt-2 text-xs text-muted-foreground bn">
              {isBn
                ? "৪৮ ঘণ্টার মধ্যে লিংকে ক্লিক করে নিশ্চিত করুন। স্প্যাম ফোল্ডারও দেখুন।"
                : "Click the link within 48 hours to confirm. Check spam too."}
            </p>
            <Button variant="ghost" size="sm" className="mt-3 h-8" onClick={() => setStatus("idle")}>
              {isBn ? "আরেকটি ইমেইল" : "Subscribe another"}
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm font-semibold bn">{isBn ? "নিউজলেটার" : "Newsletter"}</p>
        <p className="text-xs text-muted-foreground bn">
          {isBn ? "নতুন লেখা ও আপডেট সরাসরি ইনবক্সে" : "Get new stories and updates in your inbox"}
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isBn ? "আপনার ইমেইল" : "Your email"}
              className="pl-9 h-9 text-sm"
              disabled={status === "loading"}
            />
          </div>
          <Button type="submit" size="sm" disabled={status === "loading"} className="h-9 px-3">
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {status === "error" && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" /> {message}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground bn">
          {isBn ? "সাবস্ক্রাইব করে আপনি আপডেট পেতে সম্মত হচ্ছেন। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।" : "By subscribing you agree to receive updates. Unsubscribe anytime."}
        </p>
      </form>
    );
  }

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 sm:h-11 sm:w-11">
          <Mail className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
        </div>
        <h3 className="mt-3 text-lg font-bold tracking-tight bn sm:text-xl">
          {isBn ? "নিউজলেটারে যুক্ত হোন" : "Join the newsletter"}
        </h3>
        <p className="mx-auto mt-1.5 max-w-[32ch] text-xs leading-relaxed text-muted-foreground bn sm:text-sm">
          {isBn
            ? "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে নতুন লেখা এবং প্রজেক্ট আপডেট — সরাসরি ইনবক্সে। স্প্যাম নয়।"
            : "New stories on education, tech & social service — plus project updates. No spam, unsubscribe anytime."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left sm:mt-6">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBn ? "আপনার ইমেইল *" : "Your email *"}
                className="h-10 pl-9 text-sm"
                disabled={status === "loading"}
              />
            </div>
            <Button type="submit" variant="gradient" disabled={status === "loading"} className="h-10 w-full sm:w-auto">
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {isBn ? "পাঠানো হচ্ছে..." : "Sending..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> {isBn ? "সাবস্ক্রাইব" : "Subscribe"}
                </>
              )}
            </Button>
          </div>

          {config.topics.filter((topic) => topic.visible).length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground bn">
                {isBn ? "আগ্রহের বিষয় নির্বাচন করুন (ঐচ্ছিক):" : "Choose topics of interest (optional):"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {config.topics.filter((topic) => topic.visible).map((topic) => {
                  const active = selectedTopics.includes(topic.value);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.value)}
                      className={`rounded-full border px-2.5 py-1 text-xs transition-all sm:px-3 ${
                        active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {isBn ? topic.labelBn : topic.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showName ? (
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBn ? "আপনার নাম (ঐচ্ছিক)" : "Your name (optional)"}
                maxLength={100}
                disabled={status === "loading"}
                className="h-10 text-sm"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowName(true)}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              {isBn ? "+ নাম যোগ করুন" : "+ Add name"}
            </button>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground bn">
            {isBn ? "ডাবল অপ্ট-ইন — ইমেইল নিশ্চিত করতে হবে। ৪৮ ঘণ্টা মেয়াদ।" : "Double opt-in — you’ll confirm via email. Link valid 48h."}
          </p>
        </form>
      </div>
    </GlassCard>
  );
}

export default NewsletterSignup;
