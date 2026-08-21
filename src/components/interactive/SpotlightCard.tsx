"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer, useMotionPreference } from "@/components/animations/motion-preferences";

// ── Spotlight + 3D tilt card ───────────────────────────
// Pointer glow and a light perspective tilt in one handler (no React
// re-renders). Fine pointers only; reduced-motion and touch stay flat.
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Perspective tilt that follows the pointer. Defaults on. */
  tilt?: boolean;
  /** Max tilt in degrees. */
  intensity?: number;
}

export function SpotlightCard({
  children,
  className,
  tilt = true,
  intensity = 8,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = useMotionPreference();
  const isEnabled = hasFinePointer && !prefersReducedMotion;

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--spotlight-opacity", "0");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-glare-opacity", "0");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    cardRef.current.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    cardRef.current.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
    cardRef.current.style.setProperty("--spotlight-opacity", "1");

    if (tilt) {
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      cardRef.current.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      cardRef.current.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      cardRef.current.style.setProperty("--tilt-glare-x", `${(x * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty("--tilt-glare-y", `${(y * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty("--tilt-glare-opacity", "0.14");
    }
  };

  return (
    <div
      ref={cardRef}
      data-testid="spotlight-card"
      className={cn("spotlight-card", tilt && "tilt-card", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
