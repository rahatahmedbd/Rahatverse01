"use client";

import { cn } from "@/lib/utils";

// ── Glow Effect Component ──────────────────────────────
// Animated glow background for sections

interface GlowEffectProps {
  className?: string;
  color?: "amber" | "blue" | "purple" | "green";
  size?: "sm" | "md" | "lg";
}

export function GlowEffect({
  className,
  color = "amber",
  size = "md",
}: GlowEffectProps) {
  const colorMap = {
    amber: "bg-amber-500/20",
    blue: "bg-blue-500/20",
    purple: "bg-purple-500/20",
    green: "bg-green-500/20",
  };

  const sizeMap = {
    sm: "h-32 w-32",
    md: "h-64 w-64",
    lg: "h-96 w-96",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl animate-pulse",
        colorMap[color],
        sizeMap[size],
        className
      )}
      aria-hidden="true"
    />
  );
}
