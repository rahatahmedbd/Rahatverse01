"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── Lazy Section (Intersection Observer) ───────────────
// Only renders children when section is visible
interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export function LazySection({
  children,
  className,
  fallback = null,
  rootMargin = "200px",
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn(className)}>
      {isVisible ? children : fallback}
    </div>
  );
}
