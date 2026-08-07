import { NextResponse } from "next/server";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated services / pricing / process configuration endpoint. */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_SERVICES_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "services_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_SERVICES_CONFIG });
    }

    const validated = validateServicesConfig(data.value);
    return NextResponse.json({ data: validated ?? DEFAULT_SERVICES_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_SERVICES_CONFIG });
  }
}
