"use client";

import { useEffect, useRef } from "react";

// ── Magnetic Cursor Effect ─────────────────────────────
// Elements with data-magnetic will attract the cursor

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const magneticElements = document.querySelectorAll("[data-magnetic]");

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Move cursor to mouse position
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;

      // Magnetic effect on elements
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        const maxDistance = 100;
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = distanceX * strength * 0.3;
          const moveY = distanceY * strength * 0.3;

          (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          (el as HTMLElement).style.transform = "translate(0, 0)";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 mix-blend-difference transition-transform duration-100 hidden md:block"
      aria-hidden="true"
    />
  );
}
