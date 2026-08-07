"use client";

import { MotionConfig } from "framer-motion";

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * One motion contract for the whole localized application.
 *
 * `reducedMotion="user"` lets Framer Motion honour the OS-level preference
 * for every descendant, including legacy motion components. Components with
 * imperative animation additionally use `useMotionPreference`.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
