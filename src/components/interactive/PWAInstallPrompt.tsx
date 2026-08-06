"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

// ── PWA Install Prompt ─────────────────────────────────
// Shows when the app can be installed as a PWA

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function checkInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled] = useState(checkInstalled);

  const handleBeforeInstall = useCallback((e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
  }, []);

  useEffect(() => {
    if (isInstalled) return;

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show prompt after delay
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [isInstalled, handleBeforeInstall]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-in-up lg:bottom-8 lg:left-auto lg:right-8 lg:max-w-sm">
      <GlassCard className="border-primary/30">
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPrompt(false)}
              >
                পরে
              </Button>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
