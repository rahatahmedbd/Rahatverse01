"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Lightbox — Phase F "ইমেজ এনহ্যান্সমেন্ট" ──
// A reusable fullscreen lightbox with zoom, prev/next navigation, keyboard
// shortcuts (Esc / arrows), and a glass caption bar.

export interface LightboxItem {
  src: string;
  alt: string;
  title?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const [zoom, setZoom] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const current = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!onNavigate) return;
      const next = index + dir;
      if (next < 0 || next >= items.length) return;
      setZoom(false);
      onNavigate(next);
    },
    [index, items.length, onNavigate]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "z" || e.key === "Z") setZoom((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title || current.alt}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) go(delta > 0 ? -1 : 1);
        setTouchStartX(null);
      }}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoom((v) => !v);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg glass text-white transition-transform hover:scale-105"
            aria-label="Toggle zoom"
          >
            {zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
          <span className="rounded-lg glass px-3 py-2 text-xs text-white/80">
            {index + 1} / {items.length}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-lg glass text-white transition-transform hover:scale-105"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Prev / Next */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full glass text-white transition-transform hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full glass text-white transition-transform hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="flex max-h-[78vh] max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={current.width || 1400}
          height={current.height || 900}
          priority
          className={cn(
            "max-h-[72vh] w-auto rounded-lg object-contain transition-transform duration-300",
            zoom ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
          )}
          onClick={() => setZoom((v) => !v)}
        />
      </div>

      {/* Caption bar */}
      <div className="absolute bottom-4 left-1/2 w-[92%] max-w-2xl -translate-x-1/2">
        <div className="glass rounded-xl px-5 py-4 text-center">
          <h3 className="text-white text-base font-semibold">
            {current.title || current.alt}
          </h3>
          {current.caption && (
            <p className="mt-1 text-sm text-white/70">{current.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
