import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Ensure the DOM is cleaned up between tests to avoid cross-test leakage.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom does not implement matchMedia; stub it so components that call it
// (e.g. responsive hooks) do not throw during unit tests.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
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
}

// Stub global fetch / broadcast API bits not present in jsdom.
if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (value: unknown) => JSON.parse(JSON.stringify(value));
}
