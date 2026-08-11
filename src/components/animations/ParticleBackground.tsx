"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference, useFinePointer, useCoarsePointer } from "./motion-preferences";

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  speed?: number;
  mouseInteraction?: boolean;
  quality?: "low" | "medium" | "high" | "auto";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

type QualityLevel = "low" | "medium" | "high";

/**
 * Lightweight, visibility-aware ambient particle layer.
 * Phase 8 polish: adaptive quality, data-saver awareness, coarse-pointer
 * handling, DPR capping, robust cleanup, reduced-motion support.
 */
export function ParticleBackground({
  className,
  particleCount = 40,
  particleColor = "rgba(245, 158, 11, 0.5)",
  particleSize = 2,
  speed = 0.3,
  mouseInteraction = true,
  quality = "auto",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const prefersReducedMotion = useMotionPreference();
  const hasFinePointer = useFinePointer();
  const isCoarse = useCoarsePointer();
  const [adaptiveQuality, setAdaptiveQuality] = useState<QualityLevel>("medium");

  // Adaptive quality detection — Phase 8: async to avoid synchronous setState in effect
  useEffect(() => {
    if (quality !== "auto") {
      // schedule async to satisfy react-hooks/set-state-in-effect
      const id = window.setTimeout(() => setAdaptiveQuality(quality), 0);
      return () => window.clearTimeout(id);
    }
    try {
      const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const saveData = connection?.saveData;
      const effectiveType = connection?.effectiveType;
      const hardwareConcurrency = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
      const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;

      const determine = () => {
        if (saveData || effectiveType === "2g" || effectiveType === "slow-2g") return "low" as QualityLevel;
        if (hardwareConcurrency <= 2 || deviceMemory <= 2) return "low" as QualityLevel;
        if (hardwareConcurrency >= 8 && deviceMemory >= 8 && window.innerWidth >= 1280) return "high" as QualityLevel;
        return "medium" as QualityLevel;
      };
      const next = determine();
      const id = window.setTimeout(() => setAdaptiveQuality(next), 0);
      return () => window.clearTimeout(id);
    } catch {
      const id = window.setTimeout(() => setAdaptiveQuality("medium"), 0);
      return () => window.clearTimeout(id);
    }
  }, [quality]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion) return; // Respect reduced motion immediately
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let isVisible = false;
    let pageVisible = document.visibilityState === "visible";

    const width = () => canvas.clientWidth;
    const height = () => canvas.clientHeight;

    const getDpr = () => {
      if (adaptiveQuality === "low") return Math.min(window.devicePixelRatio || 1, 1);
      if (adaptiveQuality === "medium") return Math.min(window.devicePixelRatio || 1, 1.25);
      return Math.min(window.devicePixelRatio || 1, 1.5);
    };

    const resize = () => {
      const dpr = getDpr();
      canvas.width = Math.max(1, Math.round(width() * dpr));
      canvas.height = Math.max(1, Math.round(height() * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;

    const computeEffectiveCount = () => {
      const base = particleCount;
      if (adaptiveQuality === "low") return Math.max(6, Math.floor(base * 0.3));
      if (adaptiveQuality === "medium") {
        return isMobileDevice ? Math.max(10, Math.floor(base * 0.5)) : Math.max(18, Math.floor(base * 0.7));
      }
      // high
      return isMobileDevice ? Math.max(14, Math.floor(base * 0.6)) : base;
    };

    const effectiveCount = computeEffectiveCount();
    const effectiveSpeed = adaptiveQuality === "low" ? speed * 0.6 : adaptiveQuality === "high" ? speed : speed * 0.85;
    const shouldUseMouse = mouseInteraction && hasFinePointer && !isCoarse && adaptiveQuality !== "low";
    const shouldDrawLines = !isMobileDevice && adaptiveQuality !== "low";

    const initialiseParticles = () => {
      particlesRef.current = Array.from({ length: effectiveCount }, () => ({
        x: Math.random() * width(),
        y: Math.random() * height(),
        vx: (Math.random() - 0.5) * effectiveSpeed,
        vy: (Math.random() - 0.5) * effectiveSpeed,
        size: Math.random() * particleSize + 0.75,
        opacity: Math.random() * 0.35 + 0.12,
      }));
    };

    const draw = (updatePositions: boolean) => {
      const canvasWidth = width();
      const canvasHeight = height();
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      for (const particle of particlesRef.current) {
        if (updatePositions) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0) particle.x = canvasWidth;
          if (particle.x > canvasWidth) particle.x = 0;
          if (particle.y < 0) particle.y = canvasHeight;
          if (particle.y > canvasHeight) particle.y = 0;

          if (shouldUseMouse) {
            const deltaX = mouseRef.current.x - particle.x;
            const deltaY = mouseRef.current.y - particle.y;
            const distance = Math.hypot(deltaX, deltaY);
            if (distance > 0 && distance < 120) {
              const force = (120 - distance) / 120;
              particle.vx -= (deltaX / distance) * force * 0.01;
              particle.vy -= (deltaY / distance) * force * 0.01;
            }
          }

          const maxSpeed = effectiveSpeed * 1.6;
          const currentSpeed = Math.hypot(particle.vx, particle.vy);
          if (currentSpeed > maxSpeed) {
            particle.vx = (particle.vx / currentSpeed) * maxSpeed;
            particle.vy = (particle.vy / currentSpeed) * maxSpeed;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        // Replace 0.5 placeholder with actual opacity safely
        let fill = particleColor;
        if (fill.includes("0.5")) {
          fill = fill.replace("0.5", particle.opacity.toString());
        }
        context.fillStyle = fill;
        context.fill();
      }

      // Lines are expensive: only on medium/high, desktop, and limited range
      if (shouldDrawLines) {
        const maxLineDistance = adaptiveQuality === "high" ? 110 : 85;
        const lineOpacityFactor = adaptiveQuality === "high" ? 0.14 : 0.09;
        for (let i = 0; i < particlesRef.current.length; i += 1) {
          for (let j = i + 1; j < particlesRef.current.length; j += 1) {
            const first = particlesRef.current[i];
            const second = particlesRef.current[j];
            const dx = first.x - second.x;
            const dy = first.y - second.y;
            const distance = Math.hypot(dx, dy);
            if (distance < maxLineDistance) {
              context.beginPath();
              context.moveTo(first.x, first.y);
              context.lineTo(second.x, second.y);
              const alpha = ((maxLineDistance - distance) / maxLineDistance) * lineOpacityFactor;
              let strokeBase = particleColor;
              if (strokeBase.includes("0.5")) {
                strokeBase = strokeBase.replace("0.5", alpha.toString());
              } else {
                // fallback if custom color without placeholder
                strokeBase = `rgba(245,158,11,${alpha})`;
              }
              context.strokeStyle = strokeBase;
              context.lineWidth = 0.5;
              context.stroke();
            }
          }
        }
      }
    };

    const stop = () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };

    const frameInterval = adaptiveQuality === "low" ? 66 : adaptiveQuality === "medium" ? 40 : 33; // 15fps low, 25fps med, 30fps high

    const animate = (timestamp: number) => {
      if (!isVisible || !pageVisible || prefersReducedMotion) {
        animationRef.current = null;
        return;
      }
      if (timestamp - lastFrameRef.current >= frameInterval) {
        draw(true);
        lastFrameRef.current = timestamp;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!prefersReducedMotion && isVisible && pageVisible && animationRef.current === null) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!shouldUseMouse) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const handleResize = () => {
      resize();
      initialiseParticles();
      draw(false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { rootMargin: "160px" }
    );
    const handleVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) start();
      else stop();
    };

    resize();
    initialiseParticles();
    draw(false);
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    if (shouldUseMouse) {
      canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (shouldUseMouse) {
        canvas.removeEventListener("pointermove", handlePointerMove);
      }
      particlesRef.current = [];
    };
  }, [
    adaptiveQuality,
    hasFinePointer,
    isCoarse,
    mouseInteraction,
    particleColor,
    particleCount,
    particleSize,
    prefersReducedMotion,
    speed,
  ]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn("particle-canvas pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
