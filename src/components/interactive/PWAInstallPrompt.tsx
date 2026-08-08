"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

// ── PWA Install Prompt — Fixed Version ─────────────────
// Problem before: showed again and again on every navigation / reload,
// even after install, and showed even when deferredPrompt was null.
// Fix: persist dismissal & installed state in localStorage, gate on
// deferredPrompt existence, respect standalone display-mode, listen to
// appinstalled event, and don't re-prompt for 7 days after dismissal.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEYS = {
  dismissed: "rahatverse-pwa-dismissed-v1",
  installed: "rahatverse-pwa-installed-v1",
};

const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // Standard PWA standalone check
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari standalone
  const nav = window.navigator as unknown as { standalone?: boolean };
  if (nav.standalone) return true;
  // Android referrer check (when launched from TWA)
  if (document.referrer.includes("android-app://")) return true;
  return false;
}

function isMarkedInstalled(): boolean {
  return !!safeGet(STORAGE_KEYS.installed);
}

function isRecentlyDismissed(): boolean {
  const raw = safeGet(STORAGE_KEYS.dismissed);
  if (!raw) return false;
  const ts = Number(raw);
  if (Number.isNaN(ts)) {
    safeRemove(STORAGE_KEYS.dismissed);
    return false;
  }
  const elapsed = Date.now() - ts;
  if (elapsed < DISMISS_DURATION_MS) return true;
  // Expired — clean up so we can show again after 7 days
  safeRemove(STORAGE_KEYS.dismissed);
  return false;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const showTimerRef = useRef<number | null>(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const markDismissed = useCallback(() => {
    safeSet(STORAGE_KEYS.dismissed, Date.now().toString());
    setShowPrompt(false);
    clearShowTimer();
  }, [clearShowTimer]);

  const markInstalled = useCallback(() => {
    safeSet(STORAGE_KEYS.installed, "1");
    safeRemove(STORAGE_KEYS.dismissed);
    setShowPrompt(false);
    setDeferredPrompt(null);
    clearShowTimer();
  }, [clearShowTimer]);

  const handleBeforeInstall = useCallback(
    (e: Event) => {
      // Prevent Chrome's mini-infobar
      e.preventDefault();

      // If already installed or dismissed recently, don't even keep the prompt
      if (isStandalone() || isMarkedInstalled() || isRecentlyDismissed()) {
        return;
      }

      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Schedule showing — only after we know install is available
      // Gives user time to explore first (6-8s after capability detected)
      clearShowTimer();
      showTimerRef.current = window.setTimeout(() => {
        if (isStandalone() || isMarkedInstalled() || isRecentlyDismissed()) return;
        setShowPrompt(true);
      }, 7000);
    },
    [clearShowTimer]
  );

  const handleAppInstalled = useCallback(() => {
    // Browser confirms PWA was installed
    markInstalled();
  }, [markInstalled]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. If running as standalone PWA, never show install prompt — mark as installed
    if (isStandalone()) {
      safeSet(STORAGE_KEYS.installed, "1");
      safeRemove(STORAGE_KEYS.dismissed);
      return;
    }

    // 2. If we previously marked as installed, don't show
    if (isMarkedInstalled()) return;

    // 3. If dismissed within last 7 days, don't show
    if (isRecentlyDismissed()) return;

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearShowTimer();
    };
  }, [handleBeforeInstall, handleAppInstalled, clearShowTimer]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        markInstalled();
      } else {
        // User dismissed the native prompt — treat as "later", hide for 7 days
        safeSet(STORAGE_KEYS.dismissed, Date.now().toString());
        setShowPrompt(false);
        setDeferredPrompt(null);
        clearShowTimer();
      }
    } catch {
      // If prompt fails, just dismiss for now
      markDismissed();
      setDeferredPrompt(null);
    }
  };

  const handleDismissLater = () => {
    markDismissed();
  };

  // Don't render if:
  // - No deferredPrompt (install not available)
  // - Not supposed to show
  // - Standalone mode
  // - Marked installed
  if (!deferredPrompt || !showPrompt) return null;
  if (isStandalone() || isMarkedInstalled()) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-in-up lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-sm">
      <GlassCard className="border-primary/30 shadow-[0_12px_32px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold bn">RahatVerse ইনস্টল করুন</p>
            <p className="mt-1 text-xs text-muted-foreground bn">
              অ্যাপের মতো ব্যবহার করুন — দ্রুত এবং অফলাইনে কাজ করে
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="gradient" onClick={handleInstall}>
                ইনস্টল করুন
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismissLater}>
                পরে
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismissLater}
            aria-label="Dismiss install prompt"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
