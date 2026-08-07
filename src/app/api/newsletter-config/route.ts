import { NextResponse } from "next/server";
import { DEFAULT_NEWSLETTER_CONFIG, validateNewsletterConfig } from "@/lib/newsletter/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated newsletter configuration endpoint (Phase 11). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_NEWSLETTER_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "newsletter_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_NEWSLETTER_CONFIG });
    }
    return NextResponse.json({ data: validateNewsletterConfig(data.value) ?? DEFAULT_NEWSLETTER_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_NEWSLETTER_CONFIG });
  }
}
