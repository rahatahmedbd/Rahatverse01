"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export interface FlipCard3DProps {
  frontTitle: React.ReactNode;
  frontSubtitle?: React.ReactNode;
  frontIcon?: React.ReactNode;
  frontBadge?: React.ReactNode;
  backTitle?: React.ReactNode;
  backContent: React.ReactNode;
  backActionLabel?: string;
  onBackAction?: () => void;
  className?: string;
  locale?: string;
}

export function FlipCard3D({
  frontTitle,
  frontSubtitle,
  frontIcon,
  frontBadge,
  backTitle,
  backContent,
  backActionLabel,
  onBackAction,
  className,
  locale = "bn",
}: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const isBn = locale === "bn";

  return (
    <div
      data-testid="flip-card-3d"
      className={cn(
        "group relative h-72 w-full cursor-pointer [perspective:1000px]",
        className
      )}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      {/* 3D Flip Card Container */}
      <div
        className={cn(
          "relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d]",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "group-hover:[transform:rotateY(180deg)]"
        )}
      >
        {/* Front Face */}
        <div className="glass absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 p-6 shadow-xl [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            {frontIcon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-inner">
                {frontIcon}
              </div>
            )}
            {frontBadge && <div>{frontBadge}</div>}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground bn">
              {frontTitle}
            </h3>
            {frontSubtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground bn line-clamp-2">
                {frontSubtitle}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/30 pt-3 text-xs text-primary">
            <span className="font-medium bn">
              {isBn ? "বিস্তারিত দেখতে ক্লিক করুন" : "Click or hover to flip"}
            </span>
            <RotateCw className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Back Face */}
        <div className="glass absolute inset-0 flex flex-col justify-between rounded-2xl border border-primary/30 bg-card/90 p-6 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-primary bn">
                {backTitle || (isBn ? "ফিচার সমূহ" : "Key Features")}
              </h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                aria-label={isBn ? "ফেরত যান" : "Flip back"}
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-foreground/90 bn max-h-36 overflow-y-auto">
              {backContent}
            </div>
          </div>

          {backActionLabel && (
            <div className="pt-2">
              <Button
                variant="gradient"
                size="sm"
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onBackAction?.();
                }}
              >
                {backActionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
