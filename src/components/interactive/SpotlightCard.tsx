"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer, useMotionPreference } from "@/components/animations/motion-preferences";

// ── Spotlight Card ─────────────────────────────────────
// A soft warm glow that follows the pointer across a card. Uses CSS variables
// (no re-renders), only activates for fine pointers and respects
// reduced-motion preferences. Pair with the `.spotlight-card` styles.
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = useMotionPreference();
  const isEnabled = hasFinePointer && !prefersReducedMotion;

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--spotlight-opacity", "0");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    cardRef.current.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    cardRef.current.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");
  };

  return (
    <div
      ref={cardRef}
      className={cn("spotlight-card", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
