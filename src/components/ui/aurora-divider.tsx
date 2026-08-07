import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds vertical breathing room without coupling the divider to section spacing. */
  spacing?: "none" | "sm" | "md";
}

const spacingClasses = {
  none: "",
  sm: "my-4 sm:my-6",
  md: "my-6 sm:my-10",
} as const;

/**
 * Decorative, token-driven aurora divider used between sibling page sections.
 * Motion is disabled globally when the visitor prefers reduced motion.
 */
export function AuroraDivider({
  className,
  spacing = "none",
  ...props
}: AuroraDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("aurora-divider", spacingClasses[spacing], className)}
      {...props}
    />
  );
}
