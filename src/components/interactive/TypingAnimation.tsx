"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Typing Animation ───────────────────────────────────
// Cycles through multiple texts with typing/deleting effect

interface TypingAnimationProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingAnimation({
  texts,
  className,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: TypingAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const fullText = texts[currentTextIndex];

    if (!isDeleting) {
      // Typing
      if (currentChar < fullText.length) {
        setCurrentChar((prev) => prev + 1);
      } else {
        // Pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      // Deleting
      if (currentChar > 0) {
        setCurrentChar((prev) => prev - 1);
      } else {
        // Move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [currentChar, currentTextIndex, isDeleting, texts, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  const displayText = texts[currentTextIndex].substring(0, currentChar);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayText}</span>
      <motion.span
        className="ml-0.5 inline-block h-[1.1em] w-[2px] bg-primary"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}
