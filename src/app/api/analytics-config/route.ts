import { NextResponse } from "next/server";
import { DEFAULT_ANALYTICS_CONFIG, validateAnalyticsConfig } from "@/lib/analytics/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated analytics configuration endpoint (Phase 14). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_ANALYTICS_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "analytics_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_ANALYTICS_CONFIG });
    }
    return NextResponse.json({ data: validateAnalyticsConfig(data.value) ?? DEFAULT_ANALYTICS_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_ANALYTICS_CONFIG });
  }
}
