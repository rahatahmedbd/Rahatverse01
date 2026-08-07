// ── Utility Functions ──────────────────────────────────

import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom twMerge instance that understands the Phase C typography tokens.
 * Without this, tailwind-merge classifies unknown `text-*` utilities
 * (component tokens like `text-heading-lg`) as text-color classes,
 * silently dropping branding classes such as `text-gradient`.
 */
const twMergeCustom = extendTailwindMerge<"text-brand-gradient">({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "heading-lg",
            "heading-md",
            "heading-sm",
            "lead",
          ],
        },
      ],
      // Brand gradient text never conflicts with size or color utilities.
      "text-brand-gradient": [{ text: ["gradient"] }],
    },
  },
});

/**
 * Merge Tailwind classes with clsx for conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMergeCustom(clsx(inputs));
}

/**
 * Format a date in Bengali locale
 */
export function formatDateBn(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date in English locale
 */
export function formatDateEn(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if a value is not null/undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Sleep utility for animations/delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
