"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Returns the visitor's operating-system reduced-motion preference.
 *
 * Framer Motion's `MotionConfig` handles declarative motion globally; this
 * hook is for imperative effects (canvas, pointer movement, timers) which
 * need to opt out before doing work.
 */
export function useMotionPreference() {
  return Boolean(useReducedMotion());
}

/**
 * Pointer-driven effects should run only where hover is intentional and a
 * precise pointer is available. It avoids touch-device hover emulation and
 * keeps the interaction budget off of small screens.
 */
export function useFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasFinePointer(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return hasFinePointer;
}
