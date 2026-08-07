"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Parallax3DContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}

export function Parallax3DContainer({
  children,
  className,
  intensity = 10,
  disabled = false,
}: Parallax3DContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
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

  const isEnabled = !disabled && !prefersReducedMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = -y * intensity;
    const rotateY = x * intensity;
    const translateX = x * (intensity * 0.8);
    const translateY = y * (intensity * 0.8);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0)`,
      transition: "transform 0.15s ease-out",
    });
  };

  const handleMouseLeave = () => {
    if (!isEnabled) return;
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  return (
    <div
      ref={containerRef}
      data-testid="parallax-3d-container"
      className={cn("relative transition-transform", className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
