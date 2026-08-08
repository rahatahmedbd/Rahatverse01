import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

// The route must keep working (KB fallback) when no provider key is set —
// chatWithProviders is mocked here so tests never hit the real network.
vi.mock("@/lib/ai/server", () => ({
  chatWithProviders: vi.fn(),
}));

import { chatWithProviders } from "@/lib/ai/server";

function jsonRequest(payload: unknown, ip = "10.0.0.1"): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
  });
}

const chatBody = (content = "How much does a website cost?") => ({
  locale: "en",
  messages: [{ role: "user", content }],
});

describe("POST /api/chat", () => {
  beforeEach(() => {
    // Default: no AI provider available → knowledge-base fallback.
    vi.mocked(chatWithProviders).mockResolvedValue(null);
  });

  afterEach(() => {
    vi.mocked(chatWithProviders).mockReset();
  });

  it("answers from the knowledge base when no provider responds", async () => {
    const response = await POST(jsonRequest(chatBody()));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.source).toBe("kb");
    expect(data.reply).toContain("Basic");
    expect(Array.isArray(data.links)).toBe(true);
  });

  it("returns the AI provider reply when one is available", async () => {
    vi.mocked(chatWithProviders).mockResolvedValue({
      reply: "A Basic site starts at ৳5,000.",
      provider: "groq",
    });

    const response = await POST(
      jsonRequest(chatBody("price?"), "10.0.0.2"),
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.source).toBe("groq");
    expect(data.reply).toContain("৳5,000");
  });

  it("answers in Bangla for the bn locale", async () => {
    const response = await POST(
      jsonRequest({ locale: "bn", messages: [{ role: "user", content: "দাম কত?" }] }, "10.0.0.3"),
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.reply).toContain("বেসিক");
  });

  it("rejects invalid payloads", async () => {
    for (const payload of [null, {}, { messages: [] }, { messages: [{ role: "assistant", content: "hi" }] }, { messages: [{ role: "user", content: "" }] }]) {
      const response = await POST(jsonRequest(payload, "10.0.0.4"));
      expect(response.status).toBe(400);
    }
  });

  it("rate-limits abusive clients", async () => {
    const ip = "10.9.9.9";
    let lastStatus = 200;
    for (let i = 0; i < 21; i += 1) {
      const response = await POST(jsonRequest(chatBody(), ip));
      lastStatus = response.status;
    }
    expect(lastStatus).toBe(429);
  });
});
