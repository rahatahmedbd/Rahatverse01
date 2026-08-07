"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OrbitingRingsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function OrbitingRings({
  className,
  size = "md",
  animated = true,
}: OrbitingRingsProps) {
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

  const sizeClasses = {
    sm: "h-48 w-48",
    md: "h-72 w-72",
    lg: "h-96 w-96",
  };

  const isMotionEnabled = animated && !prefersReducedMotion;

  return (
    <div
      data-testid="orbiting-rings"
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {/* Outer Orbit Ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border border-primary/20",
          isMotionEnabled && "animate-spin-slow"
        )}
      >
        {/* Satellite Dot 1 */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary" />
      </div>

      {/* Middle Orbit Ring */}
      <div
        className={cn(
          "absolute inset-8 rounded-full border border-cyan-500/20",
          isMotionEnabled && "animate-spin-reverse"
        )}
      >
        {/* Satellite Dot 2 */}
        <div className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400" />
      </div>

      {/* Inner Pulsing Ring */}
      <div
        className={cn(
          "absolute inset-16 rounded-full border border-amber-500/20",
          isMotionEnabled && "animate-pulse-glow"
        )}
      />
    </div>
  );
}
