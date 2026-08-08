"use client";

// ── Scientific Backdrop — ambient science elements ────
// Pure decoration that fills the empty page background with faint, drifting
// scientific motifs (atoms, molecules, DNA, formulas) matching Rahat's
// science-student identity. It sits behind every section, never intercepts
// clicks, and is invisible to screen readers.
//
// Subtlety rules:
//  - Everything is very low opacity (≈0.06–0.16) so text stays readable.
//  - Only a handful of elements move, and they move slowly (30–90s cycles).
//  - prefers-reduced-motion is handled globally in globals.css (all CSS
//    animations collapse to a single 0.01ms frame).

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Individual science glyphs (stroke SVGs, currentColor) ──
function AtomGlyph() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <circle cx="50" cy="50" r="6.5" fill="currentColor" stroke="none" />
      <ellipse cx="50" cy="50" rx="41" ry="15" />
      <ellipse cx="50" cy="50" rx="41" ry="15" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="41" ry="15" transform="rotate(-60 50 50)" />
      <circle cx="91" cy="50" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="85.5" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="70.5" cy="14.5" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BenzeneGlyph() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <polygon points="50,9 86,29.5 86,70.5 50,91 14,70.5 14,29.5" />
      <circle cx="50" cy="50" r="13" />
    </svg>
  );
}

function DnaGlyph() {
  return (
    <svg viewBox="0 0 44 140" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 2 C 34 20, 10 36, 36 54 C 10 72, 34 88, 8 106 C 34 124, 10 132, 30 138" />
      <path d="M36 2 C 10 20, 34 36, 8 54 C 34 72, 10 88, 36 106 C 10 124, 34 132, 14 138" />
      <line x1="16" y1="16" x2="28" y2="16" />
      <line x1="12" y1="42" x2="32" y2="42" />
      <line x1="16" y1="68" x2="28" y2="68" />
      <line x1="12" y1="94" x2="32" y2="94" />
      <line x1="17" y1="120" x2="27" y2="120" />
    </svg>
  );
}

function FlaskGlyph() {
  return (
    <svg viewBox="0 0 90 110" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M36 10 h18" />
      <path d="M40 10 v28 L18 82 a11 11 0 0 0 10 16 h34 a11 11 0 0 0 10 -16 L50 38 v-28" />
      <path
        d="M25 84 q6 -8 12 0 t12 0 t12 0"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <path d="M20 96 h50" strokeOpacity="0.5" />
    </svg>
  );
}

function PlanetGlyph() {
  return (
    <svg viewBox="0 0 110 100" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <circle cx="52" cy="52" r="17" fill="currentColor" fillOpacity="0.14" />
      <ellipse cx="52" cy="52" rx="44" ry="11.5" transform="rotate(-18 52 52)" />
      <circle cx="28" cy="30" r="2" fill="currentColor" stroke="none" />
      <circle cx="84" cy="34" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="66" cy="78" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MoleculeGlyph() {
  return (
    <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <circle cx="24" cy="30" r="9" />
      <circle cx="60" cy="30" r="9" />
      <circle cx="96" cy="30" r="9" />
      <path d="M33 30 h18 M69 30 h18" strokeWidth="2" />
      <circle cx="24" cy="30" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="60" cy="30" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="96" cy="30" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SparkleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
    </svg>
  );
}

// ── Backdrop items — position (%), size, color, optional motion ──
interface BackdropItem {
  key: string;
  glyph: React.ReactNode;
  left: string;
  top: string;
  width: string;
  color: string;
  opacity: string;
  motion?: "spin" | "drift" | "float";
  hiddenMobile?: boolean;
  hiddenTablet?: boolean;
}

const ITEMS: BackdropItem[] = [
  {
    key: "atom-a",
    glyph: <AtomGlyph />,
    left: "5%",
    top: "14%",
    width: "clamp(4.5rem, 8vw, 7.5rem)",
    color: "text-emerald-300",
    opacity: "opacity-[0.10]",
    motion: "spin",
  },
  {
    key: "benzene",
    glyph: <BenzeneGlyph />,
    left: "88%",
    top: "20%",
    width: "clamp(3.5rem, 6vw, 5.5rem)",
    color: "text-cyan-400",
    opacity: "opacity-[0.09]",
    hiddenTablet: true,
  },
  {
    key: "dna",
    glyph: <DnaGlyph />,
    left: "92%",
    top: "58%",
    width: "clamp(2rem, 3.5vw, 3rem)",
    color: "text-emerald-300",
    opacity: "opacity-[0.08]",
    motion: "float",
    hiddenMobile: true,
  },
  {
    key: "flask",
    glyph: <FlaskGlyph />,
    left: "3%",
    top: "68%",
    width: "clamp(3rem, 5vw, 4.5rem)",
    color: "text-cyan-400",
    opacity: "opacity-[0.10]",
    motion: "drift",
  },
  {
    key: "planet",
    glyph: <PlanetGlyph />,
    left: "82%",
    top: "6%",
    width: "clamp(4rem, 7vw, 6.5rem)",
    color: "text-amber-300",
    opacity: "opacity-[0.08]",
    hiddenMobile: true,
  },
  {
    key: "molecule",
    glyph: <MoleculeGlyph />,
    left: "38%",
    top: "12%",
    width: "clamp(4.5rem, 8vw, 7rem)",
    color: "text-violet-300",
    opacity: "opacity-[0.07]",
    motion: "drift",
    hiddenMobile: true,
    hiddenTablet: true,
  },
  {
    key: "atom-b",
    glyph: <AtomGlyph />,
    left: "72%",
    top: "82%",
    width: "clamp(3rem, 5.5vw, 5rem)",
    color: "text-sky-400",
    opacity: "opacity-[0.08]",
    motion: "spin",
    hiddenTablet: true,
  },
  {
    key: "formula-emc2",
    glyph: <span className="font-mono">E&nbsp;=&nbsp;mc²</span>,
    left: "12%",
    top: "44%",
    width: "auto",
    color: "text-amber-300",
    opacity: "opacity-[0.13]",
  },
  {
    key: "formula-sum",
    glyph: <span className="font-mono">Σ&nbsp;xᵢ</span>,
    left: "48%",
    top: "30%",
    width: "auto",
    color: "text-cyan-400",
    opacity: "opacity-[0.12]",
    hiddenMobile: true,
  },
  {
    key: "formula-pythagoras",
    glyph: <span className="font-mono">a²&nbsp;+&nbsp;b²&nbsp;=&nbsp;c²</span>,
    left: "30%",
    top: "86%",
    width: "auto",
    color: "text-emerald-300",
    opacity: "opacity-[0.11]",
    hiddenMobile: true,
  },
  {
    key: "formula-pi",
    glyph: <span className="font-mono">π&nbsp;≈&nbsp;3.14159</span>,
    left: "78%",
    top: "38%",
    width: "auto",
    color: "text-violet-300",
    opacity: "opacity-[0.11]",
    hiddenMobile: true,
  },
  {
    key: "formula-euler",
    glyph: <span className="font-mono">e<sup>iπ</sup>&nbsp;+&nbsp;1&nbsp;=&nbsp;0</span>,
    left: "55%",
    top: "72%",
    width: "auto",
    color: "text-sky-300",
    opacity: "opacity-[0.10]",
    hiddenMobile: true,
    hiddenTablet: true,
  },
  {
    key: "sparkle-1",
    glyph: <SparkleGlyph />,
    left: "24%",
    top: "18%",
    width: "0.9rem",
    color: "text-amber-300",
    opacity: "opacity-[0.28]",
    motion: "float",
  },
  {
    key: "sparkle-2",
    glyph: <SparkleGlyph />,
    left: "66%",
    top: "8%",
    width: "0.7rem",
    color: "text-emerald-300",
    opacity: "opacity-[0.24]",
    hiddenMobile: true,
  },
  {
    key: "sparkle-3",
    glyph: <SparkleGlyph />,
    left: "90%",
    top: "92%",
    width: "0.8rem",
    color: "text-cyan-300",
    opacity: "opacity-[0.24]",
    hiddenMobile: true,
  },
  {
    key: "sparkle-4",
    glyph: <SparkleGlyph />,
    left: "44%",
    top: "6%",
    width: "0.65rem",
    color: "text-violet-300",
    opacity: "opacity-[0.22]",
    hiddenTablet: true,
  },
];

const MOTION_CLASSES: Record<string, string> = {
  spin: "science-animate-spin",
  drift: "science-animate-drift",
  float: "science-animate-float",
};

export function ScientificBackdrop() {
  return (
    <div
      className="science-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className={cn(
            "absolute select-none",
            item.hiddenMobile && "hidden sm:block",
            item.hiddenTablet && "hidden lg:block",
          )}
          style={{ left: item.left, top: item.top, width: item.width }}
        >
          <div
            className={cn(
              "flex items-center justify-center",
              item.color,
              item.opacity,
              item.motion && MOTION_CLASSES[item.motion],
              item.width === "auto" && "whitespace-nowrap text-[clamp(0.9rem,1.6vw,1.35rem)]",
            )}
          >
            {item.glyph}
          </div>
        </div>
      ))}
    </div>
  );
}
