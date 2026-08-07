import { NextResponse } from "next/server";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated experience / blood society / memorial configuration endpoint. */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_EXPERIENCE_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "experience_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_EXPERIENCE_CONFIG });
    }

    const validated = validateExperienceConfig(data.value);
    return NextResponse.json({ data: validated ?? DEFAULT_EXPERIENCE_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_EXPERIENCE_CONFIG });
  }
}
