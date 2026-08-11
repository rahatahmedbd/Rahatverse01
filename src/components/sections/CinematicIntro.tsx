"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { useMotionPreference } from "@/components/animations/motion-preferences";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";
import type { HeroConfig } from "@/types/hero";

function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("rahatverse-intro-played") === null;
  } catch {
    return false;
  }
}

interface CinematicIntroProps {
  config?: HeroConfig;
}

export function CinematicIntro({ config }: CinematicIntroProps = {}) {
  const locale = useLocale();
  const isBn = locale === "bn";
  const [isPlaying, setIsPlaying] = useState(shouldPlayIntro);
  const prefersReducedMotion = useMotionPreference();
  const reducedMotionFramer = Boolean(useReducedMotion());
  const initialGreeting = config ? config.intro.greetingBn : DEFAULT_HERO_CONFIG.intro.greetingBn;
  const initialDuration = config ? config.intro.durationMs : DEFAULT_HERO_CONFIG.intro.durationMs;
  const [greeting, setGreeting] = useState(initialGreeting);
  const [durationMs, setDurationMs] = useState(initialDuration);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (config) return;
    let alive = true;
    fetch("/api/hero-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        const v = validateHeroConfig(json.data);
        if (v) {
          setGreeting(v.intro.greetingBn);
          setDurationMs(v.intro.durationMs);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [config]);

  // Safety timeout: never block longer than duration + 1.5s
  useEffect(() => {
    if (!isPlaying) return;
    const maxDuration = Math.min(durationMs + 2500, 7000);
    timeoutRef.current = window.setTimeout(() => {
      setIsPlaying(false);
      try {
        localStorage.setItem("rahatverse-intro-played", "true");
      } catch {}
    }, maxDuration);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, durationMs]);

  const handleComplete = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    try {
      localStorage.setItem("rahatverse-intro-played", "true");
    } catch {}
  }, []);

  // Keyboard: Escape skips
  useEffect(() => {
    if (!isPlaying) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleComplete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, handleComplete]);

  // Never block content behind a cinematic sequence for reduced motion
  if (prefersReducedMotion || reducedMotionFramer) {
    return null;
  }

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? "রাহাতভার্স পরিচিতি" : "RahatVerse introduction"}
        >
          {/* Background glow — static to avoid GPU cost */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          </div>

          {/* Greeting — admin editable */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
            transition={{
              duration: Math.min(durationMs / 1000, 4),
              times: [0, 0.2, 0.65, 1],
              ease: "easeInOut",
            }}
          >
            <p className="text-lg text-amber-400/80 bn">{greeting}</p>
          </motion.div>

          {/* Main Logo */}
          <div className="relative flex flex-col items-center">
            <motion.div
              className="absolute h-24 w-24 rounded-full border-2 border-amber-500/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.15, 1], opacity: [0, 0.45, 0.28] }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              aria-hidden="true"
            />

            <motion.div
              className="bg-brand-gradient gradient-border relative flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-2xl shadow-primary/30"
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: [0, 1.05, 1], rotate: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            >
              R
            </motion.div>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8] }}
              transition={{
                delay: 0.9,
                duration: 2.2,
                times: [0, 0.35, 0.72, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={handleComplete}
            >
              <div className="text-heading-lg font-bold">
                <span className="text-gradient">Rahat</span>
                <span className="text-foreground">Verse</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground bn">রাহাত আহমেদ</p>
            </motion.div>
          </div>

          {/* Skip button — large tap target, keyboard accessible, premium */}
          <motion.button
            type="button"
            onClick={handleComplete}
            className="absolute bottom-8 right-8 flex min-h-[44px] items-center gap-2 rounded-full border border-border/60 bg-background/70 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-foreground/85 shadow-lg transition-all hover:border-primary/50 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            aria-label={isBn ? "ইন্ট্রো এড়িয়ে মূল ওয়েবসাইটে যান (Escape)" : "Skip intro and enter portfolio (Escape)"}
          >
            <span className="bn">{isBn ? "মূল ওয়েবসাইটে যান" : "Enter Portfolio"}</span>
            <span aria-hidden="true" className="text-primary">
              →
            </span>
          </motion.button>

          {/* Progress indicator for loading perception */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-white/5" aria-hidden="true">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: Math.min(durationMs / 1000, 4.5), ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
