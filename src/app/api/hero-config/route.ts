import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ data: DEFAULT_HERO_CONFIG });
    }
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_HERO_CONFIG });
    }

    const validated = validateHeroConfig(data.value);
    if (!validated) {
      return NextResponse.json({ data: DEFAULT_HERO_CONFIG });
    }
    return NextResponse.json({ data: validated });
  } catch {
    return NextResponse.json({ data: DEFAULT_HERO_CONFIG });
  }
}
