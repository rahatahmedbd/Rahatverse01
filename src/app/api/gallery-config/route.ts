import { NextResponse } from "next/server";
import { DEFAULT_GALLERY_CONFIG, validateGalleryConfig } from "@/lib/media/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated photo-gallery configuration endpoint (Phase 7). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_GALLERY_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "gallery_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_GALLERY_CONFIG });
    }
    return NextResponse.json({ data: validateGalleryConfig(data.value) ?? DEFAULT_GALLERY_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_GALLERY_CONFIG });
  }
}
