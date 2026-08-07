"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── 3D Hover Card ──────────────────────────────────────
// Card with 3D tilt effect on hover

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function HoverCard3D({
  children,
  className,
  intensity = 10,
}: HoverCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden transition-transform duration-200", className)}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
        }}
      />
    </div>
  );
}
