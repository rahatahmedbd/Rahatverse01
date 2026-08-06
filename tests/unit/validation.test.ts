import { describe, expect, it } from "vitest";
import {
  enumValue,
  optionalText,
  positiveInteger,
  rating,
  requiredText,
  stringArray,
  validEmail,
  validPhone,
} from "@/lib/api/validation";

describe("requiredText", () => {
  it("trims and validates non-empty strings within the length limit", () => {
    expect(requiredText("  hello  ", 10)).toBe("hello");
    expect(requiredText("", 10)).toBeNull();
    expect(requiredText("   ", 10)).toBeNull();
    expect(requiredText(123, 10)).toBeNull();
    expect(requiredText("x".repeat(11), 10)).toBeNull();
    expect(requiredText("x".repeat(10), 10)).toBe("x".repeat(10));
  });
});

describe("optionalText", () => {
  it("returns null for empty values and the value otherwise", () => {
    expect(optionalText(undefined, 10)).toBeNull();
    expect(optionalText(null, 10)).toBeNull();
    expect(optionalText("", 10)).toBeNull();
    expect(optionalText("ok", 10)).toBe("ok");
    expect(optionalText("toolongtext", 5)).toBeNull();
  });
});

describe("validEmail", () => {
  it("accepts valid emails and lowercases them", () => {
    expect(validEmail("User@Example.com")).toBe("user@example.com");
    expect(validEmail("a.b+tag@sub.domain.co")).toBe("a.b+tag@sub.domain.co");
  });
  it("rejects invalid emails", () => {
    expect(validEmail("not-an-email")).toBeNull();
    expect(validEmail("a@b")).toBeNull();
    expect(validEmail("a b@c.com")).toBeNull();
    expect(validEmail("")).toBeNull();
  });
});

describe("validPhone", () => {
  it("accepts valid phone numbers and trims them", () => {
    expect(validPhone("+8801626224878")).toBe("+8801626224878");
    expect(validPhone("01626224878")).toBe("01626224878");
  });
  it("returns null for absent or invalid values", () => {
    expect(validPhone(undefined)).toBeNull();
    expect(validPhone(null)).toBeNull();
    expect(validPhone("")).toBeNull();
    expect(validPhone("abc")).toBeNull();
  });
});

describe("enumValue", () => {
  const levels = ["normal", "urgent", "critical"] as const;
  it("returns the value when it is allowed", () => {
    expect(enumValue("urgent", levels)).toBe("urgent");
  });
  it("returns null when the value is not allowed or not a string", () => {
    expect(enumValue("nope", levels)).toBeNull();
    expect(enumValue(123, levels)).toBeNull();
  });
});

describe("stringArray", () => {
  it("validates arrays of trimmed strings within limits", () => {
    expect(stringArray([" a ", "b"], 5, 10)).toEqual(["a", "b"]);
    expect(stringArray(["a", 1], 5, 10)).toBeNull();
    expect(stringArray("nope", 5, 10)).toBeNull();
    expect(stringArray(new Array(6).fill("a"), 5, 10)).toBeNull();
  });
});

describe("positiveInteger", () => {
  it("returns the fallback for empty values", () => {
    expect(positiveInteger(undefined, 7, 100)).toBe(7);
    expect(positiveInteger("", 7, 100)).toBe(7);
  });
  it("validates positive integers within the max", () => {
    expect(positiveInteger("5", 7, 100)).toBe(5);
    expect(positiveInteger(0, 7, 100)).toBeNull();
    expect(positiveInteger(-1, 7, 100)).toBeNull();
    expect(positiveInteger(101, 7, 100)).toBeNull();
    expect(positiveInteger(2.5, 7, 100)).toBeNull();
  });
});

describe("rating", () => {
  it("returns the default for empty values", () => {
    expect(rating(undefined)).toBe(5);
    expect(rating("")).toBe(5);
  });
  it("validates an integer between 1 and 5", () => {
    expect(rating("3")).toBe(3);
    expect(rating(0)).toBeNull();
    expect(rating(6)).toBeNull();
    expect(rating(4.5)).toBeNull();
  });
});
