import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── Persist Cloudinary Upload ─────────────────────────
// Called by the admin after a successful *signed* client-side upload to
// Cloudinary. Stores the returned metadata into the `images` table (the same
// source the gallery + featured gallery read from). The API secret never
// passes through here — only the Cloudinary result + form metadata.

const CATEGORY_PATTERN = /^[a-z0-9-]{1,50}$/;

export async function POST(request: NextRequest) {
  try {
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

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const b = body as Record<string, unknown>;

    const category = b.category;
    if (typeof category !== "string" || !CATEGORY_PATTERN.test(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const publicId = b.public_id;
    const url = b.url;
    if (typeof publicId !== "string" || typeof url !== "string" || !url.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid Cloudinary result" }, { status: 400 });
    }

    const width = Number(b.width) || null;
    const height = Number(b.height) || null;
    const format = typeof b.format === "string" ? b.format : null;
    const bytes = Number(b.bytes) || null;
    const title = typeof b.title === "string" ? b.title : null;
    const titleBn = typeof b.title_bn === "string" ? b.title_bn : null;
    const description = typeof b.description === "string" ? b.description : null;
    const descriptionBn = typeof b.description_bn === "string" ? b.description_bn : null;

    const { data: image, error } = await supabase
      .from("images")
      .insert({
        public_id: publicId,
        url,
        category,
        title,
        title_bn: titleBn,
        description,
        description_bn: descriptionBn,
        width,
        height,
        format,
        size: bytes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save image to database", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, image });
  } catch {
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}
