"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";

// ── Premium Form Field System (Phase 31) ───────────────
// A unified, gorgeous set of form primitives with consistent labels, hints,
// inline validation, success/error states, focus rings and reduced-motion aware
// transitions. Replaces the ad-hoc raw inputs used across sections.

const fieldBase =
  "w-full rounded-lg border bg-background px-3.5 text-sm text-foreground transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background " +
  "placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50";

function fieldTone(invalid?: boolean | string) {
  return invalid
    ? "border-destructive/70 focus-visible:ring-destructive/40 hover:border-destructive/60"
    : "border-input hover:border-primary/40";
}

// ── Field wrapper (label + control + hint/error/success) ──
export interface FormFieldProps {
  id: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  success,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : success ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-green-500">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          {success}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

// ── Text input ─────────────────────────────────────────
export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, "h-11", fieldTone(invalid), className)}
      aria-invalid={invalid ? "true" : undefined}
      {...props}
    />
  )
);
TextField.displayName = "TextField";

// ── Textarea ───────────────────────────────────────────
export interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      fieldBase,
      "min-h-[96px] resize-none py-3 leading-relaxed",
      fieldTone(invalid),
      className
    )}
    aria-invalid={invalid ? "true" : undefined}
    {...props}
  />
));
TextAreaField.displayName = "TextAreaField";

// ── Select (native) ────────────────────────────────────
export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  placeholder?: string;
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(({ className, invalid, placeholder, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        fieldBase,
        "h-11 appearance-none pr-10",
        fieldTone(invalid),
        "bg-[linear-gradient(to_bottom,var(--background)_49%,transparent_50%)]",
        className
      )}
      aria-invalid={invalid ? "true" : undefined}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
));
SelectField.displayName = "SelectField";

// ── Chip / toggle-option group (single or multi select) ──
export interface ChipOption {
  value: string;
  label: string;
}

export interface ChipGroupProps {
  options: ChipOption[];
  value: string | string[];
  onChange: (value: string) => void;
  multi?: boolean;
  columns?: number;
  invalid?: boolean;
  className?: string;
  name?: string;
}

export function ChipGroup({
  options,
  value,
  onChange,
  multi = false,
  columns = 2,
  invalid,
  className,
}: ChipGroupProps) {
  const values = Array.isArray(value) ? value : [value];
  const selected = (v: string) => values.includes(v);

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-invalid={invalid ? "true" : undefined}
      className={cn(
        "grid gap-2",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = selected(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border-2 px-3 py-2.5 text-center text-xs font-medium transition-all duration-200 " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
                "focus-visible:ring-offset-background " +
                "active:scale-[0.98]",
              isSelected
                ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "border-border bg-transparent text-foreground/80 hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
