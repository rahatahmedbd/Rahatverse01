"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

// ── Quick Actions (Floating Buttons) ───────────────────
// Fixed position floating action buttons

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <motion.div
      className={cn(
        "fixed right-4 z-40 flex flex-col gap-3",
        "bottom-24 lg:bottom-8",
        className
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/8801626224878"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "glass-frost glass-sheen flex h-12 w-12 items-center justify-center rounded-full",
          "text-green-400",
          "transition-all hover:scale-110"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="WhatsApp"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-green-400">
          <MessageCircle className="h-5 w-5" />
        </span>
      </motion.a>
    </motion.div>
  );
}
