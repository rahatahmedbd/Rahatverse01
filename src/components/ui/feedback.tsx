"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";

// ── Inline Feedback — Phase G "স্টেট বিউটিফিকেশন" ──
// Consistent success / error / info / pending alert used inside forms,
// sections, and after actions. role="status"/"alert" for a11y.

type FeedbackTone = "success" | "error" | "info" | "pending";

interface FeedbackProps {
  tone?: FeedbackTone;
  title?: string;
  message?: string;
  className?: string;
}

const toneConfig: Record<
  FeedbackTone,
  { icon: React.ReactNode; box: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    box: "border-green-500/30 bg-green-500/10",
    iconColor: "text-green-400",
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    box: "border-red-500/30 bg-red-500/10",
    iconColor: "text-red-400",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    box: "border-blue-500/30 bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  pending: {
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    box: "border-primary/30 bg-primary/10",
    iconColor: "text-primary",
  },
};

export function Feedback({
  tone = "info",
  title,
  message,
  className,
}: FeedbackProps) {
  const config = toneConfig[tone];
  const role = tone === "error" ? "alert" : "status";
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role={role}
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        config.box,
        className
      )}
    >
      <span className={cn("mt-0.5 shrink-0", config.iconColor)}>{config.icon}</span>
      <div className="min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </motion.div>
  );
}
