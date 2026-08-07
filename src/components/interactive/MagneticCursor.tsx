"use client";

import { useEffect } from "react";
import { useFinePointer, useMotionPreference } from "@/components/animations/motion-preferences";

// ── Magnetic Button Effect ─────────────────────────────
// Targets opt in through `data-magnetic` (the shared Button does so by default).
// It intentionally has no visible cursor: CustomCursor owns that visual layer.

export function MagneticCursor() {
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    if (!hasFinePointer || prefersReducedMotion) return;

    const targets = new Set<HTMLElement>();
    const selector = "[data-magnetic='true']";
    let frame: number | null = null;
    let pointer = { x: 0, y: 0 };

    const collectTargets = () => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => targets.add(element));
      for (const element of targets) {
        if (!element.isConnected || element.dataset.magnetic !== "true") {
          targets.delete(element);
        }
      }
    };

    const resetTarget = (element: HTMLElement) => {
      element.style.setProperty("--magnetic-x", "0px");
      element.style.setProperty("--magnetic-y", "0px");
    };

    const applyMagnetism = () => {
      frame = null;

      for (const element of targets) {
        const bounds = element.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const deltaX = pointer.x - centerX;
        const deltaY = pointer.y - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        const maximumDistance = Math.max(72, Math.min(140, Math.max(bounds.width, bounds.height) * 1.25));

        if (distance < maximumDistance) {
          const strength = (maximumDistance - distance) / maximumDistance;
          element.style.setProperty("--magnetic-x", `${(deltaX * strength * 0.18).toFixed(2)}px`);
          element.style.setProperty("--magnetic-y", `${(deltaY * strength * 0.18).toFixed(2)}px`);
        } else {
          resetTarget(element);
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (frame === null) frame = window.requestAnimationFrame(applyMagnetism);
    };

    const resetAll = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      targets.forEach(resetTarget);
    };

    collectTargets();
    const observer = new MutationObserver(collectTargets);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetAll);
    document.addEventListener("pointerleave", resetAll);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetAll);
      document.removeEventListener("pointerleave", resetAll);
      resetAll();
    };
  }, [hasFinePointer, prefersReducedMotion]);

  return null;
}
