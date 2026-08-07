import { NextResponse } from "next/server";
import { DEFAULT_ABOUT_CONFIG, validateAboutConfig } from "@/lib/about/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated about/education/achievement configuration endpoint. */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_ABOUT_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_ABOUT_CONFIG });
    }

    const validated = validateAboutConfig(data.value);
    return NextResponse.json({ data: validated ?? DEFAULT_ABOUT_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_ABOUT_CONFIG });
  }
}
