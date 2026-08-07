import { NextResponse } from "next/server";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated order-wizard configuration endpoint (Phase 5). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_ORDERS_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "orders_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_ORDERS_CONFIG });
    }

    const validated = validateOrdersConfig(data.value);
    return NextResponse.json({ data: validated ?? DEFAULT_ORDERS_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_ORDERS_CONFIG });
  }
}
