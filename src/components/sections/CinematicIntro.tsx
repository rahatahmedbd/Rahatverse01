"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ── Check if intro already played ──────────────────────
function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("rahatverse-intro-played") === null;
}

// ── Cinematic Intro Sequence ───────────────────────────
// Plays on first visit, then never again (localStorage)
// Duration: ~4 seconds total

export function CinematicIntro() {
  const [isPlaying, setIsPlaying] = useState(shouldPlayIntro);

  const handleComplete = () => {
    setIsPlaying(false);
    localStorage.setItem("rahatverse-intro-played", "true");
  };

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          </motion.div>

          {/* Bismillah */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
            transition={{
              duration: 3.5,
              times: [0, 0.2, 0.6, 1],
              ease: "easeInOut",
            }}
          >
            <p className="text-lg text-amber-400/80 bn">
              বিসমিল্লাহির রাহমানির রাহিম
            </p>
          </motion.div>

          {/* Main Logo */}
          <div className="relative flex flex-col items-center">
            {/* Logo glow ring */}
            <motion.div
              className="absolute h-24 w-24 rounded-full border-2 border-amber-500/30"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 0.5, 0.3],
              }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />

            {/* Logo */}
            <motion.div
              className="bg-brand-gradient gradient-border relative flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-2xl shadow-primary/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.1, 1], rotate: [-180, 0] }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
              R
            </motion.div>

            {/* Text */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
              transition={{
                delay: 1.2,
                duration: 2.5,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={handleComplete}
            >
              <h1 className="text-heading-lg font-bold">
                <span className="text-gradient">Rahat</span>
                <span className="text-foreground">Verse</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground bn">
                রাহাত আহমেদ
              </p>
            </motion.div>
          </div>

          {/* Skip button */}
          <motion.button
            onClick={handleComplete}
            className="absolute bottom-8 right-8 rounded-lg border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
