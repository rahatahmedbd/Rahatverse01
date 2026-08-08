"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  speed?: number;
  mouseInteraction?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

/** A lightweight, visibility-aware ambient particle layer. */
export function ParticleBackground({
  className,
  particleCount = 40,
  particleColor = "rgba(245, 158, 11, 0.5)",
  particleSize = 2,
  speed = 0.3,
  mouseInteraction = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let isVisible = false;
    let pageVisible = document.visibilityState === "visible";

    const width = () => canvas.clientWidth;
    const height = () => canvas.clientHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width() * dpr));
      canvas.height = Math.max(1, Math.round(height() * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initialiseParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width(),
        y: Math.random() * height(),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * particleSize + 0.75,
        opacity: Math.random() * 0.35 + 0.15,
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

          if (mouseInteraction) {
            const deltaX = mouseRef.current.x - particle.x;
            const deltaY = mouseRef.current.y - particle.y;
            const distance = Math.hypot(deltaX, deltaY);
            if (distance > 0 && distance < 130) {
              const force = (130 - distance) / 130;
              particle.vx -= (deltaX / distance) * force * 0.012;
              particle.vy -= (deltaY / distance) * force * 0.012;
            }
          }

          const maxSpeed = speed * 1.8;
          const currentSpeed = Math.hypot(particle.vx, particle.vy);
          if (currentSpeed > maxSpeed) {
            particle.vx = (particle.vx / currentSpeed) * maxSpeed;
            particle.vy = (particle.vy / currentSpeed) * maxSpeed;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particleColor.replace("0.5", particle.opacity.toString());
        context.fill();
      }

      // Nearby lines are the costliest part, so keep their range restrained.
      for (let i = 0; i < particlesRef.current.length; i += 1) {
        for (let j = i + 1; j < particlesRef.current.length; j += 1) {
          const first = particlesRef.current[i];
          const second = particlesRef.current[j];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance < 100) {
            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.strokeStyle = particleColor.replace("0.5", (((100 - distance) / 100) * 0.12).toString());
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      }
    };

    const stop = () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };

    const animate = (timestamp: number) => {
      if (!isVisible || !pageVisible || prefersReducedMotion) {
        animationRef.current = null;
        return;
      }
      // 30fps is visually smooth for ambient motion and halves canvas work.
      if (timestamp - lastFrameRef.current >= 33) {
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
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const handleResize = () => {
      resize();
      initialiseParticles();
      draw(false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start(); else stop();
    }, { rootMargin: "120px" });
    const handleVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) start(); else stop();
    };

    resize();
    initialiseParticles();
    draw(false);
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);
    if (mouseInteraction) canvas.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (mouseInteraction) canvas.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseInteraction, particleColor, particleCount, particleSize, prefersReducedMotion, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
