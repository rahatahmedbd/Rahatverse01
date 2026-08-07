import { NextResponse } from "next/server";
import { DEFAULT_VIDEO_CONFIG, validateVideoConfig } from "@/lib/media/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated video-portfolio configuration endpoint (Phase 7). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_VIDEO_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "video_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_VIDEO_CONFIG });
    }
    return NextResponse.json({ data: validateVideoConfig(data.value) ?? DEFAULT_VIDEO_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_VIDEO_CONFIG });
  }
}
