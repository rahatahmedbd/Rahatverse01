// ── Newsletter Token Utilities ─────────────────────────

import { randomBytes } from "crypto";

/**
 * Generates a URL-safe token suitable for confirmation / unsubscribe links.
 * 32 bytes -> 43-44 chars base64url.
 */
export function generateToken(bytes = 32): string {
  // Use Web Crypto when available (Edge runtime), fallback to Node crypto
  try {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const arr = new Uint8Array(bytes);
      crypto.getRandomValues(arr);
      // base64url
      let str = "";
      for (const b of arr) str += String.fromCharCode(b);
      const b64 = btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
      return b64;
    }
  } catch {
    // fall through
  }
  return randomBytes(bytes).toString("base64url");
}

export function generateConfirmationToken(): string {
  return generateToken(32);
}

export function generateUnsubscribeToken(): string {
  return generateToken(24);
}

export const TOKEN_EXPIRY_HOURS = 48;

export function tokenExpiryDate(from = new Date()): Date {
  const d = new Date(from);
  d.setHours(d.getHours() + TOKEN_EXPIRY_HOURS);
  return d;
}

export function isTokenExpired(sentAt: string | null | undefined): boolean {
  if (!sentAt) return true;
  const sent = new Date(sentAt).getTime();
  if (Number.isNaN(sent)) return true;
  return Date.now() - sent > TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
}
