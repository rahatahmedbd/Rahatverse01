"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/components/animations/motion-preferences";

export interface Parallax3DContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}

/**
 * Pointer parallax without React renders on every mouse move. The transform is
 * written directly to the element, which keeps the hero responsive and opts
 * out automatically on touch devices and reduced-motion preferences.
 */
export function Parallax3DContainer({
  children,
  className,
  intensity = 10,
  disabled = false,
}: Parallax3DContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMotionPreference();
  const isEnabled = !disabled && !prefersReducedMotion;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = containerRef.current;
    if (!isEnabled || !element) return;

    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -y * intensity;
    const rotateY = x * intensity;
    const translateX = x * intensity * 0.65;
    const translateY = y * intensity * 0.65;

    element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0)`;
  };

  const handleMouseLeave = () => {
    const element = containerRef.current;
    if (!element) return;
    element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={containerRef}
      data-testid="parallax-3d-container"
      className={cn(
        "relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
