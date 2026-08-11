"use client";

import { useEffect } from "react";
import { useMotionPreference } from "./motion-preferences";

/**
 * AnimationGovernor — one global IntersectionObserver that pauses expensive
 * decorative CSS animations while their element is off screen.
 *
 * Matching CSS lives in globals.css: `.aurora-divider` and
 * `.gradient-border::before` render with `animation-play-state: paused` and
 * resume only while the element carries `.anim-active`. This keeps every
 * off-screen divider / gradient ring at zero paint cost without sprinkling
 * observers through individual components.
 *
 * It also observes nodes added later (client-side route transitions) via a
 * MutationObserver, and honours reduced motion by never toggling anything
 * (the global reduced-motion block already forces animation: none).
 */

const OBSERVED_SELECTOR = ".aurora-divider, .gradient-border";

export function AnimationGovernor() {
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("anim-active", entry.isIntersecting);
        }
      },
      { rootMargin: "120px" }
    );

    const observed = new WeakSet<Element>();
    const scan = (root: ParentNode) => {
      root.querySelectorAll(OBSERVED_SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    // Initial pass (elements already streamed from the server).
    scan(document);

    // Watch for elements added later (App Router client-side navigation).
    let raf = 0;
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length === 0) continue;
        // Debounce to one scan per frame — a navigation swaps many nodes.
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => scan(document));
        break;
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return null;
}
