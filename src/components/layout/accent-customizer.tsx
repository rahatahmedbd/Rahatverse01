"use client";

import { useState } from "react";
import { useAppStore, ACCENTS, type AccentKey } from "@/store";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Accent Customizer — Phase H "থিম পোলিশ" ──────────
// Lets the user pick an accent color palette (applied via CSS variables).
// Persisted through the app store (localStorage).

export function AccentCustomizer() {
  const [open, setOpen] = useState(false);
  const accent = useAppStore((s) => s.accent);
  const setAccent = useAppStore((s) => s.setAccent);

  const handleSelect = (key: AccentKey) => {
    setAccent(key);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card",
          "transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-label="Customize accent color"
        aria-expanded={open}
      >
        <Palette className="h-5 w-5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-border bg-card p-3 shadow-xl animate-scale-in">
            <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
              Accent Color
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ACCENTS) as AccentKey[]).map((key) => {
                const cfg = ACCENTS[key];
                const active = accent === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={cn(
                      "flex h-9 flex-col items-center justify-center gap-1 rounded-lg border transition-all",
                      active
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-border"
                    )}
                    aria-label={cfg.label}
                    title={cfg.label}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: cfg.swatch }}
                    />
                    {active && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
