"use client";

import * as React from "react";
import { Palette, Check, Sparkles, X } from "lucide-react";
import { useAppStore, ACCENT_THEMES } from "@/store";
import { AccentColor, SUPPORTED_ACCENTS } from "@/types";
import { cn } from "@/lib/utils";
import { useThemeConfig, applyPresetToDOM } from "@/hooks/useThemeConfig";

interface AccentCustomizerProps {
  locale?: string;
  className?: string;
}

export function AccentCustomizer({
  locale = "bn",
  className,
}: AccentCustomizerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { accent, setAccent } = useAppStore();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isBn = locale === "bn";
  const themeConfig = useThemeConfig();
  const [customAccent, setCustomAccent] = React.useState<string | null>(null);

  const applyCustomPreset = (preset: { id: string; nameBn: string; nameEn: string; primary: string; primaryForeground: string; ring: string; gradientStart: string; gradientMiddle: string; gradientEnd: string; selectionBg: string }) => {
    setCustomAccent(preset.id);
    applyPresetToDOM(preset);
  };

  // Hydrate saved accent from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("rahatverse_accent") as AccentColor;
      if (saved && SUPPORTED_ACCENTS.includes(saved)) {
        setAccent(saved);
      } else {
        setAccent("emerald");
      }
    } catch {
      // Fallback silently if localStorage is restricted
    }
  }, [setAccent]);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectAccent = (color: AccentColor) => {
    setAccent(color);
  };

  const activeTheme = ACCENT_THEMES[accent] || ACCENT_THEMES.emerald;

  return (
    <div ref={menuRef} className={cn("relative inline-block", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center",
          "rounded-lg border border-border bg-card",
          "transition-all duration-300",
          "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isOpen && "border-primary/50 shadow-md shadow-primary/20"
        )}
        aria-label={
          isBn
            ? "থিম কালার কাস্টমাইজ করুন"
            : "Customize theme accent color"
        }
        aria-expanded={isOpen}
      >
        <Palette className="h-5 w-5 text-primary transition-colors duration-300" />
        {/* Color indicator dot */}
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-background shadow-xs transition-colors duration-300"
          style={{ backgroundColor: activeTheme.primary }}
        />
      </button>

      {/* Floating Accent Theme Selector Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={isBn ? "থিম কালার নির্বাচন" : "Select accent color"}
          className="glass absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/20 bg-card/90 p-4 shadow-2xl backdrop-blur-xl animate-fade-in-down"
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground bn">
                {isBn ? "থিম কালার" : "Theme Accent"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              aria-label={isBn ? "বন্ধ করুন" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Color Options List */}
          <div className="space-y-1.5">
            {SUPPORTED_ACCENTS.map((colorKey) => {
              const item = ACCENT_THEMES[colorKey];
              const isSelected = accent === colorKey;

              return (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => handleSelectAccent(colorKey)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-medium transition-all",
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-xs"
                      : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Gradient color swatch */}
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full bg-gradient-to-br shadow-xs shrink-0 border border-white/20",
                        item.previewGradient
                      )}
                    />
                    <span className="bn truncate">
                      {isBn ? item.nameBn : item.nameEn}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin-defined presets (from theme_config) */}
          {themeConfig.presets.filter((preset) => preset.visible).length > 0 && (
            <>
              <div className="mt-2 border-t border-border/40 pt-2 text-center text-[11px] text-muted-foreground bn">
                {isBn ? "সাইট প্রিসেট" : "Site presets"}
              </div>
              <div className="space-y-1.5">
                {themeConfig.presets.filter((preset) => preset.visible).map((preset) => {
                  const isSelected = customAccent === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyCustomPreset(preset)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-medium transition-all",
                        isSelected
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-5 w-5 rounded-full shadow-xs shrink-0 border border-white/20"
                          style={{ background: `linear-gradient(135deg, ${preset.gradientStart}, ${preset.gradientEnd})` }}
                        />
                        <span className="bn">{isBn ? preset.nameBn : preset.nameEn}</span>
                      </span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer note */}
          <div className="mt-3 border-t border-border/40 pt-2 text-center text-[11px] text-muted-foreground bn">
            {isBn
              ? "আপনার পছন্দ ব্রাউজারে সংরক্ষিত থাকবে"
              : "Your preference is saved locally"}
          </div>
        </div>
      )}
    </div>
  );
}
