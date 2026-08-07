"use client";

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Magnetic Button — Phase E "মোশন ও মাইক্রো-ইন্টারঅ্যাকশন" ──
// Wraps a Button / element and gives it a magnetic pull: it gently follows
// the cursor on hover and springs back on leave. Disabled automatically for
// prefers-reduced-motion users.

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Max translation in px. */
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-block will-change-transform transition-transform duration-300 ease-out",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={reduceMotion ? { transform: "none" } : undefined}
    >
      {children}
    </div>
  );
}
