import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/analytics/route";

// Mock the Supabase guard so the route works without a real DB connection.
vi.mock("@/lib/supabase/guards", () => ({
  getCurrentUserContext: vi.fn(),
}));

import { getCurrentUserContext } from "@/lib/supabase/guards";

const mockInsert = vi.fn();

function fakeSupabase() {
  return {
    from: vi.fn(() => ({ insert: mockInsert })),
  };
}

function jsonRequest(payload: unknown): Request {
  return new Request("http://localhost/api/analytics", {
    method: "POST",
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

const validPayload = () => ({
  sessionId: "sess_12345678",
  pageViews: [
    {
      path: "/home",
      referrer: "https://www.google.com/",
      screenWidth: 1920,
      ts: Date.now(),
    },
  ],
  events: [
    {
      name: "cta_click",
      category: "engagement",
      label: "hire-me",
      path: "/home",
      value: 1,
      metadata: { button: "primary" },
      ts: Date.now(),
    },
  ],
});

describe("POST /api/analytics", () => {
  beforeEach(() => {
    mockInsert.mockReset();
    mockInsert.mockReturnValue({ error: null });
    vi.mocked(getCurrentUserContext).mockResolvedValue({
      supabase: fakeSupabase() as never,
      user: null,
      isAdmin: false,
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("stores page views and events and returns success", async () => {
    const res = await POST(jsonRequest(validPayload()));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.stored).toBe(true);
    // Two insert calls: one for page views, one for events.
    expect(mockInsert).toHaveBeenCalledTimes(2);
  });

  it("returns 413 for oversized payloads", async () => {
    const big = { sessionId: "sess_12345678", pageViews: [], events: [], pad: "x".repeat(70 * 1024) };
    const res = await POST(jsonRequest(big));
    expect(res.status).toBe(413);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(jsonRequest("not json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a missing session id", async () => {
    const payload = validPayload();
    delete (payload as { sessionId?: string }).sessionId;
    const res = await POST(jsonRequest(payload));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid session id", async () => {
    const payload = { ...validPayload(), sessionId: "!!bad!!" };
    const res = await POST(jsonRequest(payload));
    expect(res.status).toBe(400);
  });

  it("returns 400 when a page view has an invalid path", async () => {
    const payload = validPayload();
    payload.pageViews[0].path = "relative-path";
    const res = await POST(jsonRequest(payload));
    expect(res.status).toBe(400);
  });

  it("accepts an empty batch without hitting the database", async () => {
    const res = await POST(jsonRequest({ sessionId: "sess_12345678", pageViews: [], events: [] }));
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
