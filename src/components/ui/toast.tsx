"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

// ── Toast — Phase G "স্টেট বিউটিফিকেশন" ──
// Lightweight toast system (no extra dependency). A tiny module-level store
// lets any component call toast.success(...) / toast.error(...) / toast.info(...).

export type ToastTone = "success" | "error" | "info";

interface ToastData {
  id: number;
  tone: ToastTone;
  title?: string;
  message?: string;
}

type Listener = (toasts: ToastData[]) => void;
let toasts: ToastData[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

function push(tone: ToastTone, title: string, message?: string) {
  const id = Date.now() + Math.random();
  toasts = [...toasts, { id, tone, title, message }];
  emit();
  window.setTimeout(() => dismiss(id), 4000);
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (title: string, message?: string) => push("success", title, message),
  error: (title: string, message?: string) => push("error", title, message),
  info: (title: string, message?: string) => push("info", title, message),
};

const toneConfig: Record<
  ToastTone,
  { icon: React.ReactNode; border: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    border: "border-red-500/30",
    iconColor: "text-red-400",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
};

export function Toaster() {
  const [items, setItems] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setItems(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 lg:bottom-8">
      <AnimatePresence>
        {items.map((t) => {
          const cfg = toneConfig[t.tone];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className={cn(
                "glass flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl",
                cfg.border
              )}
              role="status"
            >
              <span className={cn("mt-0.5 shrink-0", cfg.iconColor)}>{cfg.icon}</span>
              <div className="min-w-0 flex-1">
                {t.title && <p className="text-sm font-semibold">{t.title}</p>}
                {t.message && <p className="text-sm text-muted-foreground">{t.message}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
