"use client";

import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

// ── Aurora Background ──────────────────────────────────
// Subtle animated gradient background effect
// Phase 8: respects reduced motion, low power

interface AuroraBackgroundProps {
  className?: string;
  variant?: "default" | "amber" | "blue" | "purple";
  animated?: boolean;
}

export function AuroraBackground({ className, variant = "default", animated = true }: AuroraBackgroundProps) {
  const prefersReducedMotion = useMotionPreference();
  const shouldAnimate = animated && !prefersReducedMotion;

  const variantClasses = {
    default: "from-amber-500/10 via-blue-500/5 to-purple-500/10",
    amber: "from-amber-500/20 via-orange-500/10 to-red-500/5",
    blue: "from-blue-500/20 via-cyan-500/10 to-indigo-500/5",
    purple: "from-purple-500/20 via-pink-500/10 to-indigo-500/5",
  };

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {/* Main gradient blob */}
      <div
        className={cn(
          "absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-gradient-conic opacity-30 blur-3xl",
          shouldAnimate && "animate-spin-slow",
          variantClasses[variant]
        )}
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(245, 158, 11, 0.1) 60deg, transparent 120deg, rgba(59, 130, 246, 0.05) 180deg, transparent 240deg, rgba(139, 92, 246, 0.1) 300deg, transparent 360deg)`,
        }}
      />

      {/* Glow spots — static if reduced motion */}
      <div
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ── Gradient Mesh Background ───────────────────────────
interface GradientMeshProps {
  className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(245, 158, 11, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(249, 115, 22, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

// ── Glow Effect ────────────────────────────────────────
interface GlowProps {
  className?: string;
  color?: "amber" | "blue" | "green" | "purple";
}

export function Glow({ className, color = "amber" }: GlowProps) {
  const colors = {
    amber: "rgba(245, 158, 11, 0.4)",
    blue: "rgba(59, 130, 246, 0.4)",
    green: "rgba(16, 185, 129, 0.4)",
    purple: "rgba(139, 92, 246, 0.4)",
  };

  return (
    <div
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
      }}
    />
  );
}
