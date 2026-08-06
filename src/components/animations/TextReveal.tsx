"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Text Reveal (Character by Character) ───────────────
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
}: TextRevealProps) {
  const characters = Array.from(text);

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                delay: delay + index * staggerDelay,
                duration: 0.3,
                ease: "easeOut",
              },
            },
          }}
          className="inline-block"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── Word Reveal (Word by Word) ─────────────────────────
interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function WordReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.1,
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + wordIndex * staggerDelay,
            duration: 0.4,
            ease: "easeOut",
          }}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── Line Reveal (Line by Line) ─────────────────────────
interface LineRevealProps {
  lines: string[];
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function LineReveal({
  lines,
  className,
  delay = 0,
  staggerDelay = 0.15,
}: LineRevealProps) {
  return (
    <div className={cn(className)}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + index * staggerDelay,
            duration: 0.5,
            ease: "easeOut",
          }}
          className="block"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}
