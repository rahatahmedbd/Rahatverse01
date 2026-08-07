"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer, useMotionPreference } from "@/components/animations/motion-preferences";

// ── 3D Hover Card ──────────────────────────────────────
// Uses CSS variables instead of React state so pointer movement never causes
// component re-renders. The effect is reserved for fine pointers and honours
// reduced-motion preferences.

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function HoverCard3D({
  children,
  className,
  intensity = 7,
}: HoverCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;

    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-glare-x", "50%");
    card.style.setProperty("--tilt-glare-y", "50%");
    card.style.setProperty("--tilt-glare-opacity", "0");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateX = (0.5 - y) * intensity;
    const rotateY = (x - 0.5) * intensity;

    cardRef.current.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-glare-x", `${(x * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--tilt-glare-y", `${(y * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--tilt-glare-opacity", "0.16");
  };

  return (
    <div
      ref={cardRef}
      className={cn("tilt-card rounded-xl", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
