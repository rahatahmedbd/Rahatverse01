import { NextResponse } from "next/server";
import { DEFAULT_CONTENT_CONFIG, validateContentConfig } from "@/lib/content/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated search/FAQ/legal configuration endpoint (Phase 13). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_CONTENT_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "content_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_CONTENT_CONFIG });
    }
    return NextResponse.json({ data: validateContentConfig(data.value) ?? DEFAULT_CONTENT_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_CONTENT_CONFIG });
  }
}
