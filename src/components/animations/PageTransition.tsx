"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMotionPreference } from "./motion-preferences";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * A lightweight route transition that keeps page navigation responsive while
 * making route changes feel deliberate. It uses opacity and a short vertical
 * settle rather than a full-screen overlay, so links remain fast and stable.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useMotionPreference();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        className="page-transition"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
        transition={prefersReducedMotion ? { duration: 0 } : undefined}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
