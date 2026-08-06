"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Animated Counter ───────────────────────────────────
interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className,
  suffix = "",
  prefix = "",
  separator = "",
}: CounterProps) {
  const [count, setCount] = useState(to); // Start with target value
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    // On first mount, if in view, animate from 0 to target
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (isInView && !hasAnimated.current) {
        setCount(from); // Reset to from value to start animation
        hasAnimated.current = true;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
          if (startTime === null) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(from + (to - from) * eased);

          setCount(current);

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          } else {
            setCount(to);
          }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
      }
    }
  }, [isInView, from, to, duration]);

  const formatNumber = (num: number) => {
    if (separator) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    return num.toString();
  };

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

// ── Percentage Counter ─────────────────────────────────
interface PercentageCounterProps {
  value: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function PercentageCounter({
  value,
  className,
  size = 100,
  strokeWidth = 8,
}: PercentageCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (count / 100) * circumference;

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let animationFrame: number;
    const dur = 1.5;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (dur * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-100"
        />
      </svg>
      <span className="absolute text-xl font-bold">{count}%</span>
    </div>
  );
}
