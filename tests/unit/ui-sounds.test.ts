import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  hydrateSoundPreference,
  isSoundEnabled,
  playUiSound,
  setSoundEnabled,
  subscribeToSound,
  tapFeedback,
  vibrate,
} from "@/lib/audio/ui-sounds";

// ── Minimal WebAudio test double ───────────────────────
function createAudioContextStub() {
  const started: number[] = [];
  const oscillators: Array<Record<string, unknown>> = [];

  class GainStub {
    gain = {
      value: 1,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    };
    connect = vi.fn();
    disconnect = vi.fn();
  }

  class ContextStub {
    state: AudioContextState = "running";
    currentTime = 0;
    destination = {} as AudioDestinationNode;
    resume = vi.fn().mockResolvedValue(undefined);
    close = vi.fn().mockResolvedValue(undefined);

    createGain() {
      return new GainStub();
    }

    createOscillator() {
      const oscillator = {
        type: "sine",
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn((when: number) => started.push(when)),
        stop: vi.fn(),
        onended: null as (() => void) | null,
      };
      oscillators.push(oscillator);
      return oscillator;
    }
  }

  return { ContextStub, started, oscillators };
}

const { ContextStub, oscillators } = createAudioContextStub();

describe("UI sound engine", () => {
  beforeEach(() => {
    oscillators.length = 0;
    localStorage.clear();
    setSoundEnabled(false);
    // Fresh AudioContext stub for every test.
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: ContextStub,
    });
    // Default: motion is allowed.
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it("stays silent until the visitor opts in", () => {
    playUiSound("tap");
    expect(oscillators).toHaveLength(0);

    setSoundEnabled(true);
    playUiSound("tap");
    expect(oscillators.length).toBeGreaterThan(0);
  });

  it("persists the opt-in across page loads", () => {
    setSoundEnabled(true);
    expect(localStorage.getItem("rahatverse_sound_enabled")).toBe("1");
    expect(isSoundEnabled()).toBe(true);

    setSoundEnabled(false);
    expect(localStorage.getItem("rahatverse_sound_enabled")).toBeNull();
    expect(hydrateSoundPreference()).toBe(false);
  });

  it("respects prefers-reduced-motion even when sound is enabled", () => {
    setSoundEnabled(true);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    playUiSound("tap");
    expect(oscillators).toHaveLength(0);
  });

  it("can force a sound (used to confirm the toggle itself)", () => {
    playUiSound("success", { force: true });
    expect(oscillators.length).toBeGreaterThan(0);
  });

  it("plays multi-step recipes as separate oscillators", () => {
    setSoundEnabled(true);
    playUiSound("success");
    // The success recipe is a three-note arpeggio.
    expect(oscillators).toHaveLength(3);
  });

  it("notifies subscribers when the preference changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToSound(listener);

    setSoundEnabled(true);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setSoundEnabled(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("never throws when WebAudio is unavailable", () => {
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: undefined,
    });
    setSoundEnabled(true);

    expect(() => playUiSound("tap")).not.toThrow();
  });

  it("vibrates only while sound is enabled via tapFeedback", () => {
    const vibrateSpy = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: vibrateSpy,
    });

    tapFeedback();
    expect(vibrateSpy).not.toHaveBeenCalled();

    setSoundEnabled(true);
    tapFeedback();
    expect(vibrateSpy).toHaveBeenCalledWith(8);
  });

  it("skips haptics when the device has no vibration support", () => {
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    expect(() => vibrate()).not.toThrow();
  });
});
