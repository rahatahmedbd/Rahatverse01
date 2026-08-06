import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/blood-requests/route";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/guards", () => ({ getCurrentUserContext: vi.fn() }));

import { createClient } from "@/lib/supabase/server";

const mockInsert = vi.fn();

function fakeSupabase() {
  return { from: vi.fn(() => ({ insert: mockInsert })) };
}

const validBody = () => ({
  name: "Rahat",
  phone: "+8801626224878",
  blood_group: "A+",
  location: "Sunamganj",
  urgency: "urgent",
  message: "Please help.",
});

function jsonRequest(payload: unknown): Request {
  return new Request("http://localhost/api/blood-requests", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/blood-requests", () => {
  beforeEach(() => {
    mockInsert.mockReset();
    mockInsert.mockReturnValue({ error: null });
    vi.mocked(createClient).mockResolvedValue(fakeSupabase() as never);
  });

  it("creates a blood request and returns 201", async () => {
    const res = await POST(jsonRequest(validBody()));
    expect(res.status).toBe(201);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0]).toMatchObject({ blood_group: "A+", urgency: "urgent" });
  });

  it("rejects a missing phone (required field)", async () => {
    const body = { ...validBody(), phone: "" };
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(400);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("rejects an invalid blood group", async () => {
    const body = { ...validBody(), blood_group: "Z-" };
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(400);
  });

  it("defaults urgency to normal", async () => {
    const body = { ...validBody() };
    delete (body as { urgency?: string }).urgency;
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(201);
    expect(mockInsert.mock.calls[0][0]).toMatchObject({ urgency: "normal" });
  });
});
