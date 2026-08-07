"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

// ── Shared viewport reveal ─────────────────────────────
interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "blur";

function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 20,
  direction,
}: FadeInUpProps & { direction: RevealDirection }) {
  const prefersReducedMotion = useMotionPreference();

  const initialByDirection = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: -distance },
    right: { opacity: 0, x: distance },
    scale: { opacity: 0, scale: 0.9 },
    blur: { opacity: 0, filter: "blur(10px)" },
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : initialByDirection[direction]}
      whileInView={
        prefersReducedMotion
          ? undefined
          : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-50px" }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In Up ─────────────────────────────────────────
export function FadeInUp(props: FadeInUpProps) {
  return <FadeIn {...props} direction="up" />;
}

// ── Fade In Down ───────────────────────────────────────
export function FadeInDown(props: FadeInUpProps) {
  return <FadeIn {...props} direction="down" />;
}

// ── Fade In Left ───────────────────────────────────────
export function FadeInLeft(props: FadeInUpProps) {
  return <FadeIn {...props} direction="left" />;
}

// ── Fade In Right ──────────────────────────────────────
export function FadeInRight(props: FadeInUpProps) {
  return <FadeIn {...props} direction="right" />;
}

// ── Scale In ───────────────────────────────────────────
export function ScaleIn(props: Omit<FadeInUpProps, "distance">) {
  return <FadeIn {...props} direction="scale" />;
}

// ── Blur In ────────────────────────────────────────────
export function BlurIn(props: Omit<FadeInUpProps, "distance">) {
  return <FadeIn {...props} direction="blur" />;
}
