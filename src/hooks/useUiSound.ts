"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  hydrateSoundPreference,
  isSoundEnabled,
  playUiSound,
  setSoundEnabled,
  subscribeToSound,
  tapFeedback,
  vibrate,
  type UiSoundName,
} from "@/lib/audio/ui-sounds";

function subscribe(onStoreChange: () => void) {
  hydrateSoundPreference();
  return subscribeToSound(onStoreChange);
}

function getSnapshot() {
  return isSoundEnabled();
}

function getServerSnapshot() {
  return false;
}

/**
 * React binding for the UI sound engine.
 *
 * `soundEnabled` is a subscribed module-scope value, so every component that
 * uses the hook (nav menu, bottom nav, buttons…) stays in sync without a
 * provider or context.
 */
export function useUiSound() {
  const soundEnabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const play = useCallback((name: UiSoundName) => playUiSound(name), []);

  const tap = useCallback((name: UiSoundName = "tap") => tapFeedback(name), []);

  const toggleSound = useCallback(() => {
    const next = !isSoundEnabled();
    setSoundEnabled(next);
    // Play a confirmation with the *new* state so enabling is audible.
    if (next) playUiSound("success", { force: true });
  }, []);

  return { soundEnabled, setSoundEnabled, toggleSound, play, tap, vibrate };
}
