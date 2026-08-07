"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// ── Page Transition — Phase E "মোশন ও মাইক্রো-ইন্টারঅ্যাকশন" ──
// Fades/slides page content in on every route change. Keying on the
// pathname makes the motion.div remount on navigation, so each route
// replays the enter animation. MotionConfig (reducedMotion="user")
// disables the transition automatically for prefers-reduced-motion users.

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
      className="flex w-full flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
