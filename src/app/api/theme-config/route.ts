import { NextResponse } from "next/server";
import { DEFAULT_THEME_CONFIG, validateThemeConfig } from "@/lib/theme/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated theme/xp/audio/effects configuration endpoint (Phase 12). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_THEME_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "theme_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_THEME_CONFIG });
    }
    return NextResponse.json({ data: validateThemeConfig(data.value) ?? DEFAULT_THEME_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_THEME_CONFIG });
  }
}
