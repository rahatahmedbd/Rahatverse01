"use client";

import { cn } from "@/lib/utils";

// ── Section Divider — Phase B "গ্র্যাডিয়েন্ট ম্যাজিক" ──
// Flowing aurora / mesh gradient divider that visually separates
// two sections. Pure CSS gradients + keyframe animation (cheap on GPU).

interface SectionDividerProps {
  variant?: "aurora" | "mesh";
  className?: string;
  height?: number;
}

export function SectionDivider({
  variant = "aurora",
  className,
  height = 140,
}: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full select-none", className)}
      style={{ height }}
    >
      {variant === "mesh" ? (
        <>
          <div
            className="aurora-divider absolute inset-x-[-10%] top-1/2 h-[120%] -translate-y-1/2"
            style={{
              filter: "blur(24px)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
            }}
          />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </>
      ) : (
        <>
          <div
            className="aurora-divider absolute inset-x-[-10%] top-0 bottom-0"
            style={{
              filter: "blur(28px)",
              opacity: 0.55,
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          />
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </>
      )}
    </div>
  );
}
