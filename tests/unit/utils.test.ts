import { describe, expect, it } from "vitest";
import { clamp, cn, formatDateBn, formatDateEn, generateId, isDefined, sleep } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes and resolves conflicts", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "bg-blue-500")).toContain("text-red-500");
    expect(cn("", null, undefined, "block")).toBe("block");
  });
});

describe("formatDateBn", () => {
  it("formats a valid date in the Bengali locale", () => {
    const out = formatDateBn(new Date("2026-01-05T00:00:00Z"));
    expect(out).toBeTruthy();
    // Bengali locale uses Bengali digits (e.g. ২০২৬ for 2026).
    expect(out).toMatch(/২০২৬|2026/);
  });
});

describe("formatDateEn", () => {
  it("formats a valid date in the US locale", () => {
    const out = formatDateEn("2026-01-05");
    expect(out.toLowerCase()).toContain("2026");
  });
});

describe("isDefined", () => {
  it("narrows null/undefined out", () => {
    expect(isDefined("x")).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });
});

describe("sleep", () => {
  it("resolves after the given delay", async () => {
    const start = Date.now();
    await sleep(10);
    expect(Date.now() - start).toBeGreaterThanOrEqual(9);
  });
});

describe("generateId", () => {
  it("produces unique, non-empty ids", () => {
    const a = generateId();
    const b = generateId();
    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });
});

describe("clamp", () => {
  it("clamps a value between min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(10, 10, 10)).toBe(10);
  });
});
