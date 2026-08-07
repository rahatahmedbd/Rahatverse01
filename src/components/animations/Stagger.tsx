"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

const revealEase = [0.16, 1, 0.3, 1] as const;

// ── Stagger Container ──────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const prefersReducedMotion = useMotionPreference();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Item ───────────────────────────────────────
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: StaggerItemProps) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    scale: { scale: 0.9 },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directionMap[direction] },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: revealEase },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Grid (Convenience) ─────────────────────────
interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: string;
  gap?: string;
}

export function StaggerGrid({
  children,
  className,
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  gap = "gap-4",
}: StaggerGridProps) {
  return (
    <StaggerContainer className={cn("grid", columns, gap, className)}>
      {children}
    </StaggerContainer>
  );
}
