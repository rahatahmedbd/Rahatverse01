"use client";

import * as React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "gradient" | "glow" | "outline" | "secondary" | "ghost";
}

export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  action?: EmptyStateAction;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  size = "md",
  className,
  iconClassName,
}: EmptyStateProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const sizeClasses = {
    sm: {
      container: "py-8 px-4",
      iconWrapper: "h-12 w-12",
      icon: "h-6 w-6",
      title: "text-base font-semibold",
      description: "text-xs mt-1",
    },
    md: {
      container: "py-12 px-6",
      iconWrapper: "h-16 w-16",
      icon: "h-8 w-8",
      title: "text-lg sm:text-xl font-semibold",
      description: "text-sm mt-2",
    },
    lg: {
      container: "py-16 px-8",
      iconWrapper: "h-20 w-20",
      icon: "h-10 w-10",
      title: "text-xl sm:text-2xl font-bold",
      description: "text-base mt-3",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      data-testid="empty-state"
      className={cn(
        "glass relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-card/40 text-center shadow-lg transition-all",
        currentSize.container,
        className
      )}
    >
      {/* Subtle background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Floating / Pulsing Icon Container */}
      <div
        className={cn(
          "relative mb-4 flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-inner",
          currentSize.iconWrapper,
          !prefersReducedMotion && "animate-float"
        )}
      >
        <Icon className={cn(currentSize.icon, iconClassName)} />
      </div>

      {/* Title & Description */}
      <div className="relative z-10 max-w-md">
        <h3 className={cn("text-foreground bn", currentSize.title)}>
          {title}
        </h3>
        {description && (
          <div
            className={cn(
              "text-muted-foreground bn leading-relaxed",
              currentSize.description
            )}
          >
            {description}
          </div>
        )}
      </div>

      {/* CTA Action Button */}
      {action && (
        <div className="relative z-10 mt-6">
          <Button
            variant={action.variant || "gradient"}
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            onClick={action.onClick}
            className="shadow-md"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
