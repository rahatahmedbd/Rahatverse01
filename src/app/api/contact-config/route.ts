import { NextResponse } from "next/server";
import { DEFAULT_CONTACT_CONFIG, validateContactConfig } from "@/lib/contact/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated contact/booking/testimonial configuration endpoint (Phase 9). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_CONTACT_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_CONTACT_CONFIG });
    }
    return NextResponse.json({ data: validateContactConfig(data.value) ?? DEFAULT_CONTACT_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_CONTACT_CONFIG });
  }
}
