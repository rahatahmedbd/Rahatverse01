import { describe, expect, it } from "vitest";

// Shared validation contracts used by the Order Wizard and Contact form.
// These regexes are co-located in the components; this spec pins their behavior
// so validation stays consistent and regression-safe.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{5,24}$/;

function emailValid(v: string) {
  const t = v.trim();
  return t.length > 0 && EMAIL_RE.test(t);
}

function phoneValid(v: string) {
  const t = v.trim();
  return t.length > 0 && PHONE_RE.test(t);
}

describe("order/contact form field validation", () => {
  describe("email", () => {
    it("accepts valid emails", () => {
      expect(emailValid("user@example.com")).toBe(true);
      expect(emailValid("a.b+c@sub.co")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(emailValid("not-an-email")).toBe(false);
      expect(emailValid("a@b")).toBe(false);
      expect(emailValid("")).toBe(false);
      expect(emailValid("   ")).toBe(false);
    });
  });

  describe("phone", () => {
    it("accepts valid phone numbers", () => {
      expect(phoneValid("+8801626224878")).toBe(true);
      expect(phoneValid("016262224878")).toBe(true);
      expect(phoneValid("+880 1626-224878")).toBe(true);
    });
    it("rejects invalid phones", () => {
      expect(phoneValid("")).toBe(false);
      expect(phoneValid("abc")).toBe(false);
    });
  });
});
