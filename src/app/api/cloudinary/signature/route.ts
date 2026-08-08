import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

// ── Signed Upload Signature (server-only) ─────────────
// Generates a Cloudinary upload signature so the browser can upload the image
// file DIRECTLY to Cloudinary. The API secret is only ever used here on the
// server and is never exposed to the client.

const CATEGORY_PATTERN = /^[a-z0-9-]{1,50}$/;

export async function POST(request: NextRequest) {
  try {
    // Admin gate — identical policy to /api/upload.
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Media service unavailable" }, { status: 503 });
    }

    cloudinary.config({ cloud_name: cloud, api_key: apiKey, api_secret: apiSecret });

    const body: unknown = await request.json().catch(() => null);
    const category =
      body && typeof body === "object" && "category" in body
        ? (body as { category?: unknown }).category
        : undefined;
    if (typeof category !== "string" || !CATEGORY_PATTERN.test(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "rahatverse";
    const public_id = `${category}/${timestamp}`;

    // Params that will accompany the unsigned upload request from the browser.
    const paramsToSign = { timestamp, folder, public_id, resource_type: "image" };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      success: true,
      cloud_name: cloud,
      api_key: apiKey,
      timestamp,
      signature,
      folder,
      public_id,
      resource_type: "image",
    });
  } catch {
    return NextResponse.json({ error: "Signature generation failed" }, { status: 500 });
  }
}
