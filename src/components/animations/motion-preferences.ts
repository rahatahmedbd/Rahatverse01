"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Returns the visitor's operating-system reduced-motion preference.
 *
 * Implemented on useSyncExternalStore so SSR and the hydration pass agree
 * (server assumes motion is allowed), with the real media query applied right
 * after hydration — framer-motion's useReducedMotion reads matchMedia inside
 * a useState initializer, which caused React hydration error #418 for
 * reduced-motion visitors (audit L4).
 *
 * Framer Motion's `MotionConfig` handles declarative motion globally; this
 * hook is for imperative effects (canvas, pointer movement, timers) which
 * need to opt out before doing work.
 */
function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}
function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
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
