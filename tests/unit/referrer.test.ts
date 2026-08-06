import { describe, expect, it } from "vitest";
import { classifyReferrer } from "@/lib/analytics/referrer";

describe("classifyReferrer", () => {
  it("returns direct for empty referrers", () => {
    expect(classifyReferrer(null)).toBe("direct");
    expect(classifyReferrer("")).toBe("direct");
    expect(classifyReferrer(undefined)).toBe("direct");
  });

  it("returns direct for invalid URLs", () => {
    expect(classifyReferrer("not a url")).toBe("direct");
  });

  it("detects same-site navigation as internal", () => {
    expect(classifyReferrer("https://rahatverse01.vercel.app/blog", "rahatverse01.vercel.app")).toBe("internal");
    expect(classifyReferrer("https://www.rahatverse01.vercel.app/", "rahatverse01.vercel.app")).toBe("internal");
  });

  it("classifies known sources", () => {
    expect(classifyReferrer("https://www.google.com/search?q=x")).toBe("google");
    expect(classifyReferrer("https://www.facebook.com/")).toBe("facebook");
    expect(classifyReferrer("https://t.co/abc")).toBe("twitter");
    expect(classifyReferrer("https://m.youtube.com/watch?v=1")).toBe("youtube");
    expect(classifyReferrer("https://www.linkedin.com/")).toBe("linkedin");
  });

  it("returns the hostname for unknown sources", () => {
    expect(classifyReferrer("https://example-blog.com/article")).toBe("example-blog.com");
  });
});
