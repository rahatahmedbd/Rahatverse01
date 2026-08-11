import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
      data-testid="loading-spinner"
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent motion-reduce:animate-none",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export interface SectionLoaderProps {
  className?: string;
  label?: string;
  minHeight?: string;
}

export function SectionLoader({
  className,
  label = "Loading content...",
  minHeight = "min-h-[260px]",
}: SectionLoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
      data-testid="section-loader"
      className={cn(
        "glass relative flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-card/40 p-8 text-center shadow-lg",
        minHeight,
        className
      )}
      style={{ contain: "layout style" }}
    >
      <div className="relative" aria-hidden="true">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
      </div>
      <p className="text-sm font-medium text-muted-foreground bn">{label}</p>
    </div>
  );
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading table..."
      aria-live="polite"
      aria-busy="true"
      data-testid="table-skeleton"
      className={cn("glass overflow-hidden rounded-xl border border-border/50 bg-card", className)}
      style={{ contain: "layout" }}
    >
      <div className="flex items-center gap-4 border-b border-border/60 bg-muted/40 p-4" aria-hidden="true">
        {Array.from({ length: columns }).map((_, idx) => (
          <div key={idx} className="relative h-4 flex-1 overflow-hidden rounded bg-muted/70">
            <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-border/30" aria-hidden="true">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className={cn("relative h-3 overflow-hidden rounded bg-muted/50", colIdx === 0 ? "w-1/4" : "flex-1")}
              >
                <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ListSkeletonProps {
  count?: number;
  className?: string;
}

export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
  return (
    <div role="status" aria-label="Loading list..." aria-live="polite" aria-busy="true" data-testid="list-skeleton" className={cn("space-y-4", className)} style={{ contain: "layout" }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="glass relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4"
          aria-hidden="true"
        >
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted/60">
            <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative h-4 w-3/4 overflow-hidden rounded bg-muted/60">
              <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
            </div>
            <div className="relative h-3 w-1/2 overflow-hidden rounded bg-muted/50">
              <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
