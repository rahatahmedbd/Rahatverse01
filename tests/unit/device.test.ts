import { describe, expect, it } from "vitest";
import { detectDeviceType } from "@/lib/analytics/device";

describe("detectDeviceType", () => {
  it("classifies desktop user agents", () => {
    expect(detectDeviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120")).toBe("desktop");
    expect(detectDeviceType("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17")).toBe("desktop");
  });

  it("classifies mobile user agents", () => {
    expect(detectDeviceType("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148")).toBe("mobile");
    expect(detectDeviceType("Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile Safari/537.36")).toBe("mobile");
  });

  it("classifies tablet user agents", () => {
    expect(detectDeviceType("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Safari/17")).toBe("tablet");
    expect(detectDeviceType("Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36")).toBe("tablet");
  });

  it("returns unknown for empty input", () => {
    expect(detectDeviceType(null)).toBe("unknown");
    expect(detectDeviceType("")).toBe("unknown");
  });
});
