"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

// ── Empty State — Phase G "স্টেট বিউটিফিকেশন" ──
// A beautiful, animated empty state with an icon, message, optional
// description, and an optional CTA button.

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-10" : "px-4 py-20",
        className
      )}
    >
      {/* Icon with soft glow ring */}
      <motion.div
        className={cn(
          "relative mb-5 flex items-center justify-center rounded-full border border-border/60 bg-card",
          compact ? "h-16 w-16" : "h-20 w-20"
        )}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/10 to-blue-500/10" />
        <div className="relative text-muted-foreground">
          {icon || <Inbox className={compact ? "h-7 w-7" : "h-9 w-9"} />}
        </div>
      </motion.div>

      <h3 className={cn("font-semibold text-foreground", compact ? "text-base" : "text-lg")}>
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
