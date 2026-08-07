import { cn } from "@/lib/utils";

// ── Skeleton Loader ────────────────────────────────────
// Shimmering placeholder while content loads (Phase G).
interface SkeletonProps {
  className?: string;
  showShimmer?: boolean;
}

export function Skeleton({ className, showShimmer = true }: SkeletonProps) {
  return (
    <div
      data-testid="ui-skeleton"
      className={cn(
        shimmer ? "animate-shimmer bg-muted/60" : "animate-pulse bg-muted/50",
        "rounded-md",
        className
      )}
    >
      {showShimmer && (
        <div className="animate-shimmer absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}

// ── Card Skeleton ──────────────────────────────────────
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="card-skeleton"
      className={cn(
        "glass relative overflow-hidden rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm",
        className
      )}
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────
interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative", sizeMap[size], className)}
    >
      <div className={cn("rounded-full border-2 border-border", sizeMap[size])} />
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin",
          sizeMap[size]
        )}
      />
    </div>
  );
}

// ── Loading State (spinner + label) ────────────────────
interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

// ── Page Loader ────────────────────────────────────────
export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState label="Loading..." />
    <div
      role="status"
      aria-label={label}
      data-testid="page-loader"
      className="flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-border" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground bn">{label}</p>
      </div>
    </div>
  );
}
