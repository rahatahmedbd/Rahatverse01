"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMotionPreference } from "./motion-preferences";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Route-change fade-in tuned for the App Router.
 *
 * The previous version wrapped children in `AnimatePresence mode="sync"` with
 * an exit animation keyed on the pathname. App Router layouts never keep the
 * old page tree around, so the exit never actually played — instead both the
 * old and new page overlapped in the DOM for a frame, which is exactly the
 * "glitch" seen when switching tabs/pages. A mount-only fade-in removes that
 * overlap entirely: the new page renders once, settles in 220ms, and nothing
 * blocks or duplicates the render. Reduced motion disables even that.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useMotionPreference();

  return (
    <motion.div
      key={pathname}
      className="page-transition"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
