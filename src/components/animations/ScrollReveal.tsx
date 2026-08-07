"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

// ── Scroll Reveal Animation ────────────────────────────
// Elements fade in once as they enter the viewport.

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  distance?: number;
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  distance = 50,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={prefersReducedMotion ? false : { opacity: 0, ...directionMap[direction] }}
      animate={isVisible || prefersReducedMotion ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
