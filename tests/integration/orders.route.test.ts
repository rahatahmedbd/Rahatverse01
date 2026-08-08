import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ORDERS_CONFIG } from "@/lib/orders/config";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/guards", () => ({ getCurrentUserContext: vi.fn() }));
vi.mock("@/lib/email/service", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/orders/server", () => ({ getOrdersConfig: vi.fn() }));

import { POST } from "@/app/api/orders/route";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/service";
import { getOrdersConfig } from "@/lib/orders/server";

const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));

function fakeSupabase() {
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    from: vi.fn(() => ({ insert: mockInsert })),
  };
}

function jsonRequest(payload: unknown): Request {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = () => ({
  client_name: "Rahat",
  client_email: "client@example.com",
  client_phone: "+8801626224878",
  package_type: "basic",
  website_type: "portfolio",
  num_pages: 3,
  features: [],
  reference_sites: [],
  description: "A portfolio website",
});

describe("POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockResolvedValue({ data: { id: "order-1" }, error: null });
    vi.mocked(createClient).mockResolvedValue(fakeSupabase() as never);
    vi.mocked(sendEmail).mockResolvedValue({ id: "email-1", provider: "mock", status: "sent" } as never);
    vi.mocked(getOrdersConfig).mockResolvedValue(DEFAULT_ORDERS_CONFIG);
  });

  it("creates an order using configured default options", async () => {
    const response = await POST(jsonRequest(validBody()));

    expect(response.status).toBe(201);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ package_type: "basic", website_type: "portfolio" })
    );
  });

  it("accepts visible admin-created package and website options", async () => {
    vi.mocked(getOrdersConfig).mockResolvedValue({
      ...DEFAULT_ORDERS_CONFIG,
      packages: [
        ...DEFAULT_ORDERS_CONFIG.packages,
        { id: "pkg-custom", value: "agency", labelBn: "এজেন্সি", labelEn: "Agency", visible: true },
      ],
      websiteTypes: [
        ...DEFAULT_ORDERS_CONFIG.websiteTypes,
        { id: "wt-saas", value: "saas", labelBn: "সাস", labelEn: "SaaS", visible: true },
      ],
    });

    const response = await POST(
      jsonRequest({ ...validBody(), package_type: "agency", website_type: "saas" })
    );

    expect(response.status).toBe(201);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ package_type: "agency", website_type: "saas" })
    );
  });

  it("rejects unknown or hidden configured options", async () => {
    const unknown = await POST(jsonRequest({ ...validBody(), package_type: "forged" }));
    expect(unknown.status).toBe(400);
    expect(mockInsert).not.toHaveBeenCalled();

    vi.mocked(getOrdersConfig).mockResolvedValue({
      ...DEFAULT_ORDERS_CONFIG,
      packages: DEFAULT_ORDERS_CONFIG.packages.map((option) =>
        option.value === "basic" ? { ...option, visible: false } : option
      ),
    });
    const hidden = await POST(jsonRequest(validBody()));
    expect(hidden.status).toBe(400);
  });
});
