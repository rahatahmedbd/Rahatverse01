import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/messages/route";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/guards", () => ({ getCurrentUserContext: vi.fn() }));
vi.mock("@/lib/email/service", () => ({ sendEmail: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/service";

const mockInsert = vi.fn();

function fakeSupabase() {
  return { from: vi.fn(() => ({ insert: mockInsert })) };
}

const validBody = () => ({
  name: "Rahat",
  email: "test@example.com",
  subject: "web_dev",
  message: "Hello, I need a website.",
});

function jsonRequest(payload: unknown): Request {
  return new Request("http://localhost/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/messages", () => {
  beforeEach(() => {
    mockInsert.mockReset();
    mockInsert.mockReturnValue({ error: null });
    vi.mocked(createClient).mockResolvedValue(fakeSupabase() as never);
    vi.mocked(sendEmail).mockResolvedValue({ id: "mock_1", provider: "mock", status: "sent" } as never);
    // Default: no admin email so no notification is attempted.
    delete process.env.ADMIN_EMAIL;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a message and returns 201", async () => {
    const res = await POST(jsonRequest(validBody()));
    expect(res.status).toBe(201);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0]).toMatchObject({ email: "test@example.com" });
  });

  it("sends an admin notification when ADMIN_EMAIL is set", async () => {
    process.env.ADMIN_EMAIL = "admin@example.com";
    const res = await POST(jsonRequest(validBody()));
    expect(res.status).toBe(201);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("does not send an admin notification when ADMIN_EMAIL is absent", async () => {
    const res = await POST(jsonRequest(validBody()));
    expect(res.status).toBe(201);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects invalid email", async () => {
    const body = { ...validBody(), email: "bad-email" };
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(400);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("rejects a missing subject", async () => {
    const body = { ...validBody(), subject: "invalid_subject" };
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(400);
  });

  it("rejects invalid optional phone", async () => {
    const body = { ...validBody(), phone: "not-a-phone" };
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid request bodies", async () => {
    const res = await POST(new Request("http://localhost/api/messages", {
      method: "POST",
      body: "no",
      headers: { "Content-Type": "application/json" },
    }));
    expect(res.status).toBe(400);
  });
});
