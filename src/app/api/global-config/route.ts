import { NextResponse } from "next/server";
import { DEFAULT_GLOBAL_CONFIG, validateGlobalConfig } from "@/lib/global/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated global configuration endpoint (Phase 15). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_GLOBAL_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "global_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_GLOBAL_CONFIG });
    }
    return NextResponse.json({ data: validateGlobalConfig(data.value) ?? DEFAULT_GLOBAL_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_GLOBAL_CONFIG });
  }
}
