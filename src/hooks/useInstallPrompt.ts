"use client";

import { useCallback, useSyncExternalStore } from "react";

// ── PWA install availability hook ──────────────────────
// The browser fires `beforeinstallprompt` exactly once per page load, so we
// cache the event in module scope. That way any component mounted *after* the
// event fired (e.g. the lazily loaded nav utility menu) can still offer an
// "Install app" action instead of silently missing the opportunity.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let cachedPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
let bound = false;

function broadcast(value: BeforeInstallPromptEvent | null) {
  cachedPrompt = value;
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  if (!bound && typeof window !== "undefined") {
    bound = true;
    window.addEventListener("beforeinstallprompt", (event) => {
      broadcast(event as BeforeInstallPromptEvent);
    });
    window.addEventListener("appinstalled", () => broadcast(null));
  }
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): BeforeInstallPromptEvent | null {
  return cachedPrompt;
}

function getServerSnapshot(): BeforeInstallPromptEvent | null {
  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return true;
  }
  const nav = window.navigator as unknown as { standalone?: boolean };
  return Boolean(nav?.standalone);
}

export function useInstallPrompt() {
  const promptEvent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const promptInstall = useCallback(async () => {
    if (!promptEvent) return "unavailable" as const;
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") broadcast(null);
      return outcome;
    } catch {
      return "dismissed" as const;
    }
  }, [promptEvent]);

  return {
    canInstall: Boolean(promptEvent) && !isStandalone(),
    promptInstall,
  };
}
