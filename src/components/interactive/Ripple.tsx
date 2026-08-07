"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Ripple Click — Phase E "মোশন ও মাইক্রো-ইন্টারঅ্যাকশন" ──
// Wraps any element and spawns a rippling circle at the click point.
// Pure CSS-compatible with framer-motion (respects MotionConfig
// reducedMotion="user"). Uses pointer-events-none so it never blocks clicks.

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  /** Ripple color/shape span class (Tailwind). */
  rippleClassName?: string;
}

export function Ripple({
  children,
  className,
  rippleClassName,
}: RippleProps) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, size }]);
    // Clean up each ripple after its animation completes
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className={cn(
              "absolute rounded-full bg-white/30",
              rippleClassName
            )}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            initial={{ scale: 0, opacity: 0.45 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </span>
    </div>
  );
}
