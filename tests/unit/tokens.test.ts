import { describe, expect, it } from "vitest";
import {
  generateConfirmationToken,
  generateToken,
  generateUnsubscribeToken,
  isTokenExpired,
  TOKEN_EXPIRY_HOURS,
  tokenExpiryDate,
} from "@/lib/newsletter/tokens";

describe("generateToken", () => {
  it("produces a URL-safe token of the requested size", () => {
    const token = generateToken(32);
    expect(token.length).toBeGreaterThanOrEqual(40);
    expect(token).not.toMatch(/[+/=]/);
  });

  it("produces unique tokens", () => {
    expect(generateToken(32)).not.toBe(generateToken(32));
  });
});

describe("generateConfirmationToken / generateUnsubscribeToken", () => {
  it("returns non-empty unique tokens", () => {
    expect(generateConfirmationToken().length).toBeGreaterThanOrEqual(40);
    expect(generateUnsubscribeToken().length).toBeGreaterThanOrEqual(30);
  });
});

describe("tokenExpiryDate", () => {
  it("adds TOKEN_EXPIRY_HOURS to a given date", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const expiry = tokenExpiryDate(from);
    expect(expiry.getTime()).toBe(from.getTime() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  });
});

describe("isTokenExpired", () => {
  it("treats missing or invalid dates as expired", () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired(undefined)).toBe(true);
    expect(isTokenExpired("garbage")).toBe(true);
  });

  it("treats recent dates as valid and old dates as expired", () => {
    expect(isTokenExpired(new Date().toISOString())).toBe(false);
    const old = new Date(Date.now() - (TOKEN_EXPIRY_HOURS + 1) * 60 * 60 * 1000);
    expect(isTokenExpired(old.toISOString())).toBe(true);
  });
});
