"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

// ── Scroll Progress Bar ────────────────────────────────
interface ScrollProgressProps {
  className?: string;
  position?: "top" | "bottom";
  height?: number;
  color?: string;
}

export function ScrollProgress({
  className,
  position = "top",
  height = 3,
  color = "bg-primary",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 z-50 h-[3px] origin-left",
        color,
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{
        scaleX,
        height: `${height}px`,
      }}
    />
  );
}

// ── Scroll Indicator (Arrow) ───────────────────────────
export function ScrollIndicator({ className }: { className?: string }) {
  const prefersReducedMotion = useMotionPreference();
  const locale = useLocale();
  const isBn = locale === "bn";

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-2", className)}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { delay: 1, duration: 0.5 }}
    >
      <span className="text-xs font-medium text-muted-foreground bn">
        {isBn ? "নিচে স্ক্রল করুন" : "Scroll to explore"}
      </span>
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-muted-foreground"
        >
          <path
            d="M10 4L10 16M10 16L4 10M10 16L16 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ── Scroll to Top Button ───────────────────────────────
export function ScrollToTop({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center",
        "rounded-full border border-border bg-card/80 backdrop-blur-sm",
        "transition-colors hover:border-primary/50 hover:text-primary",
        "lg:bottom-8",
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 12L8 4M8 4L4 8M8 4L12 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
