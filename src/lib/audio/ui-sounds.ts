"use client";

// ── UI Sound Engine ────────────────────────────────────
// Tiny WebAudio synthesiser for interface feedback. Nothing is downloaded:
// every sound is generated from oscillators, so this costs zero network
// bytes and adds no assets to the bundle.
//
// Design rules:
//  - One shared, lazily created AudioContext (browsers cap the number of them).
//  - Sound is OFF until the visitor opts in, and the choice is persisted.
//  - `prefers-reduced-motion: reduce` also silences audio — visitors who ask
//    for a calmer interface should not be surprised by noise.
//  - Every play call is fire-and-forget and can never throw into React.

export type UiSoundName =
  | "tap"
  | "open"
  | "close"
  | "toggle"
  | "select"
  | "success"
  | "hover";

const STORAGE_KEY = "rahatverse_sound_enabled";

interface ToneStep {
  /** Start frequency in Hz. */
  freq: number;
  /** Optional glide target in Hz. */
  to?: number;
  /** Duration in seconds. */
  duration: number;
  /** Peak gain (0–1), before the master volume is applied. */
  gain: number;
  type: OscillatorType;
  /** Delay before this step starts, in seconds. */
  delay?: number;
}

// Short, soft, non-fatiguing clicks — tuned to sit under 0.08 peak gain.
const RECIPES: Record<UiSoundName, ToneStep[]> = {
  tap: [{ freq: 420, to: 300, duration: 0.075, gain: 0.05, type: "sine" }],
  hover: [{ freq: 720, duration: 0.035, gain: 0.018, type: "sine" }],
  open: [
    { freq: 420, to: 620, duration: 0.1, gain: 0.045, type: "sine" },
    { freq: 780, duration: 0.09, gain: 0.03, type: "triangle", delay: 0.05 },
  ],
  close: [{ freq: 520, to: 300, duration: 0.11, gain: 0.04, type: "sine" }],
  toggle: [{ freq: 540, to: 660, duration: 0.07, gain: 0.045, type: "triangle" }],
  select: [
    { freq: 660, duration: 0.06, gain: 0.04, type: "sine" },
    { freq: 880, duration: 0.08, gain: 0.035, type: "sine", delay: 0.045 },
  ],
  success: [
    { freq: 660, duration: 0.08, gain: 0.05, type: "sine" },
    { freq: 880, duration: 0.08, gain: 0.045, type: "sine", delay: 0.07 },
    { freq: 1180, duration: 0.14, gain: 0.04, type: "sine", delay: 0.14 },
  ],
};

let context: AudioContext | null = null;
let master: GainNode | null = null;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (context) return context;

  const Ctor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  try {
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 1;
    master.connect(context.destination);
    return context;
  } catch {
    return null;
  }
}

// ── Preference store (module scope, subscribable) ──────
let enabled = false;
let hydrated = false;
const listeners = new Set<() => void>();

function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Reads the persisted opt-in once per page load. Safe to call repeatedly. */
export function hydrateSoundPreference(): boolean {
  if (hydrated) return enabled;
  hydrated = true;
  enabled = readStoredPreference();
  return enabled;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  hydrated = true;
  enabled = next;
  try {
    if (next) localStorage.setItem(STORAGE_KEY, "1");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode / storage disabled — keep the in-memory value.
  }
  if (next) {
    // A user gesture enabled sound, so this is the right moment to unlock
    // the AudioContext on iOS Safari and Chrome autoplay policies.
    void getContext()?.resume().catch(() => {});
  }
  listeners.forEach((listener) => listener());
}

export function subscribeToSound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ── Playback ───────────────────────────────────────────
export function playUiSound(name: UiSoundName, options?: { force?: boolean }) {
  if (typeof window === "undefined") return;
  if (!options?.force && !enabled) return;
  if (prefersReducedMotion()) return;

  const ctx = getContext();
  if (!ctx || !master) return;

  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {});
  }

  const steps = RECIPES[name];
  if (!steps) return;

  const now = ctx.currentTime;

  for (const step of steps) {
    try {
      const start = now + (step.delay ?? 0);
      const end = start + step.duration;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = step.type;
      oscillator.frequency.setValueAtTime(step.freq, start);
      if (step.to !== undefined) {
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(step.to, 1), end);
      }

      // Exponential ramps cannot touch zero, hence the tiny epsilon values.
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(step.gain, start + Math.min(0.015, step.duration / 2));
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    } catch {
      // Never let audio break an interaction.
      return;
    }
  }
}

/** Short haptic buzz on devices that support it. Pairs well with `tap`. */
export function vibrate(pattern: number | number[] = 8) {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;
  const nav = window.navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  if (typeof nav.vibrate !== "function") return;
  try {
    nav.vibrate(pattern);
  } catch {
    // Ignore — vibration is a progressive enhancement.
  }
}

/** Combined tap feedback: sound + haptics in one call. */
export function tapFeedback(name: UiSoundName = "tap") {
  playUiSound(name);
  if (enabled) vibrate(8);
}
