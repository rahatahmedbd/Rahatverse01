import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ── Button Design System — Premium Mobile Polish ────────
// Phase Mobile Polish: consistent radius/height/typography,
// subtle glass + neon for secondaries, gradient + glow for primary.

const buttonVariants = cva(
  "group button-ripple magnetic-target inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[14px] font-semibold tracking-[-0.01em] leading-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none touch-manipulation active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_20px_rgba(245,158,11,0.22)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.28)] hover:-translate-y-px active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
        outline:
          // Let's Talk — glass + thin purple/pink neon border, subtle glow
          "glass border border-violet-400/20 bg-white/[0.04] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.18)] hover:border-violet-400/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_28px_rgba(139,92,246,0.14)] hover:bg-white/[0.06] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.16)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/[0.06] shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground border border-transparent",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        // Primary CTA — premium multi-color gradient + subtle glow + shine
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_24px_rgba(245,158,11,0.28)] animate-pulse-glow",
        gradient:
          "gradient-cta text-white border border-white/10 shadow-[0_8px_24px_rgba(245,158,11,0.22),0_4px_12px_rgba(139,92,246,0.18)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.26),0_6px_16px_rgba(139,92,246,0.20)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_4px_16px_rgba(245,158,11,0.18)]",
        glass:
          // View Projects — glass + thin cyan/green neon border, subtle glow
          "glass border border-cyan-400/20 bg-white/[0.04] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.18)] hover:border-cyan-400/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_28px_rgba(6,182,212,0.14)] hover:bg-white/[0.06] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.16)]",
      },
      size: {
        default: "h-10 px-5 py-2 text-[14px]",
        sm: "h-9 px-4 py-2 text-[13px] rounded-xl",
        lg: "h-[46px] px-7 py-2 text-[15px] rounded-xl",
        xl: "h-[52px] px-8 py-2 text-[16px] rounded-xl",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ── Button Component ───────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Enables the shared pointer magnet. It safely falls back to a normal button on touch/reduced-motion devices. */
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      magnetic = true,
      onPointerDown,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);

      if (event.defaultPrevented || disabled) return;

      const target = event.currentTarget;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
      target.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
      target.dataset.rippling = "true";

      window.setTimeout(() => {
        delete target.dataset.rippling;
      }, 650);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-magnetic={magnetic && !disabled ? "true" : undefined}
        onPointerDown={handlePointerDown}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
