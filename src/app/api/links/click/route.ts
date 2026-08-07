import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// POST /api/links/click — increment the click-through count for a link in the
// links_config document. Public and non-blocking (used by the Link Hub).
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ success: false });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "links_config")
      .maybeSingle();

    if (error || !data?.value) return NextResponse.json({ success: false });

    const value = data.value as Record<string, unknown>;
    const links = Array.isArray(value.links) ? value.links : [];
    const next = links.map((link) => {
      if (!link || typeof link !== "object") return link;
      const record = link as Record<string, unknown>;
      if (record.id !== body.id) return link;
      const current = Number(record.clicks ?? 0);
      return { ...(link as object), clicks: Number.isFinite(current) ? current + 1 : 1 };
    });

    await supabase
      .from("site_settings")
      .update({ value: { ...value, links: next } })
      .eq("key", "links_config");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
