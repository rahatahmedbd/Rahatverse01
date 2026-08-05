"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Fade In Up ─────────────────────────────────────────
interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 20,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In Down ───────────────────────────────────────
export function FadeInDown({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 20,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In Left ───────────────────────────────────────
export function FadeInLeft({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 20,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -distance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In Right ──────────────────────────────────────
export function FadeInRight({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 20,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Scale In ───────────────────────────────────────────
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── Blur In ────────────────────────────────────────────
export function BlurIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
