import { NextResponse } from "next/server";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated links/tools/resume configuration endpoint (Phase 10). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_LINKS_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "links_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_LINKS_CONFIG });
    }
    return NextResponse.json({ data: validateLinksConfig(data.value) ?? DEFAULT_LINKS_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_LINKS_CONFIG });
  }
}
