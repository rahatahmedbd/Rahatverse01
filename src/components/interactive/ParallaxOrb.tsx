"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ParallaxOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "cyan" | "purple" | "amber";
  animated?: boolean;
}

export function ParallaxOrb({
  className,
  size = "lg",
  color = "primary",
  animated = true,
}: ParallaxOrbProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const sizeMap = {
    sm: "h-40 w-40",
    md: "h-64 w-64",
    lg: "h-96 w-96",
    xl: "h-[500px] w-[500px]",
  };

  const colorMap = {
    primary:
      "from-primary/30 via-accent/20 to-cyan-500/15 border border-primary/20",
    cyan: "from-cyan-500/30 via-blue-500/20 to-teal-500/15 border border-cyan-500/20",
    purple:
      "from-purple-500/30 via-pink-500/20 to-indigo-500/15 border border-purple-500/20",
    amber:
      "from-amber-500/30 via-orange-500/20 to-red-500/15 border border-amber-500/20",
  };

  const isMotionEnabled = animated && !prefersReducedMotion;

  return (
    <div
      data-testid="parallax-orb"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full bg-gradient-to-tr blur-3xl opacity-80",
        sizeMap[size],
        colorMap[color],
        isMotionEnabled && "animate-pulse-glow",
        className
      )}
    >
      {/* Decorative inner glowing ring */}
      <div
        className={cn(
          "absolute inset-1/4 rounded-full bg-white/5 blur-xl",
          isMotionEnabled && "animate-float"
        )}
      />
    </div>
  );
}
