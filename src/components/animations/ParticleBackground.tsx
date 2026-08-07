"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "./motion-preferences";

// ── Particle Background ────────────────────────────────
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

export function ParticleBackground({
  className,
  particleCount = 50,
  particleColor = "rgba(245, 158, 11, 0.5)",
  particleSize = 2,
  speed = 0.3,
  mouseInteraction = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initialiseParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * particleSize + 1,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = (updatePositions: boolean) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        if (updatePositions) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          if (mouseInteraction) {
            const deltaX = mouseRef.current.x - particle.x;
            const deltaY = mouseRef.current.y - particle.y;
            const distance = Math.hypot(deltaX, deltaY);

            if (distance > 0 && distance < 150) {
              const force = (150 - distance) / 150;
              particle.vx -= (deltaX / distance) * force * 0.02;
              particle.vy -= (deltaY / distance) * force * 0.02;
            }
          }

          const maxSpeed = speed * 2;
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
      });

      particlesRef.current.forEach((firstParticle, index) => {
        particlesRef.current.slice(index + 1).forEach((secondParticle) => {
          const distance = Math.hypot(
            firstParticle.x - secondParticle.x,
            firstParticle.y - secondParticle.y
          );

          if (distance < 120) {
            context.beginPath();
            context.moveTo(firstParticle.x, firstParticle.y);
            context.lineTo(secondParticle.x, secondParticle.y);
            context.strokeStyle = particleColor.replace(
              "0.5",
              (((120 - distance) / 120) * 0.2).toString()
            );
            context.lineWidth = 0.5;
            context.stroke();
          }
        });
      });
    };

    const handleResize = () => {
      resize();
      initialiseParticles();
      draw(false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    resize();
    initialiseParticles();

    // A static, decorative frame preserves the visual atmosphere without a
    // continuous animation loop for visitors who request less motion.
    if (prefersReducedMotion) {
      draw(false);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }

    const animate = () => {
      draw(true);
      animationRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    if (mouseInteraction) {
      canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mouseInteraction) {
        canvas.removeEventListener("pointermove", handlePointerMove);
      }
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
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
