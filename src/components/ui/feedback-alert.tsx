"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FeedbackAlertVariant = "success" | "error" | "warning" | "info";

export interface FeedbackAlertProps {
  variant?: FeedbackAlertVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  iconClassName?: string;
  showIcon?: boolean;
}

export function FeedbackAlert({
  variant = "info",
  title,
  description,
  onClose,
  className,
  iconClassName,
  showIcon = true,
}: FeedbackAlertProps) {
  const variantConfig = {
    success: {
      icon: CheckCircle2,
      container:
        "border-l-emerald-500 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-100",
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-200",
      role: "status",
    },
    error: {
      icon: AlertCircle,
      container:
        "border-l-rose-500 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20 text-rose-100",
      iconColor: "text-rose-400",
      titleColor: "text-rose-200",
      role: "alert",
    },
    warning: {
      icon: AlertTriangle,
      container:
        "border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 text-amber-100",
      iconColor: "text-amber-400",
      titleColor: "text-amber-200",
      role: "alert",
    },
    info: {
      icon: Info,
      container:
        "border-l-sky-500 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border-sky-500/20 text-sky-100",
      iconColor: "text-sky-400",
      titleColor: "text-sky-200",
      role: "status",
    },
  };

  const currentConfig = variantConfig[variant];
  const Icon = currentConfig.icon;

  return (
    <div
      role={currentConfig.role as "alert" | "status"}
      data-testid="feedback-alert"
      className={cn(
        "glass relative flex items-start gap-3 rounded-xl border border-l-4 p-4 shadow-md transition-all animate-fade-in-up",
        currentConfig.container,
        className
      )}
    >
      {showIcon && (
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("h-5 w-5", currentConfig.iconColor, iconClassName)} />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        {title && (
          <h4 className={cn("text-sm font-semibold bn", currentConfig.titleColor)}>
            {title}
          </h4>
        )}
        {description && (
          <div className="text-xs sm:text-sm text-foreground/80 bn leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 shrink-0 rounded-full text-foreground/60 hover:bg-white/10 hover:text-foreground"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
