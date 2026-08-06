"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ── Viewport-aware Component ───────────────────────────
// Renders different content based on viewport size

interface ResponsiveContainerProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({
  children,
  mobile,
  tablet,
  desktop,
  className,
}: ResponsiveContainerProps) {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport("mobile");
      } else if (width < 1024) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const content = viewport === "mobile" && mobile
    ? mobile
    : viewport === "tablet" && tablet
    ? tablet
    : viewport === "desktop" && desktop
    ? desktop
    : children;

  return <div className={cn(className)}>{content}</div>;
}
