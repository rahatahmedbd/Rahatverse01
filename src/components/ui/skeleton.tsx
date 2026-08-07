import { cn } from "@/lib/utils";

// ── Skeleton Loader ────────────────────────────────────
// Shimmering placeholder while content loads (Phase G).
interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        shimmer ? "animate-shimmer bg-muted/60" : "animate-pulse bg-muted/50",
        "rounded-md",
        className
      )}
    />
  );
}

// ── Card Skeleton ──────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2">
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
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState label="Loading..." />
    </div>
  );
}
