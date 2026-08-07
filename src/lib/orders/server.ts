import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import type { OrdersConfig } from "@/types/orders";

/** Fetches the public order-wizard payload with a safe fallback for local/CI builds. */
export async function getOrdersConfig(): Promise<OrdersConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_ORDERS_CONFIG;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "orders_config")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_ORDERS_CONFIG;
    return validateOrdersConfig(data.value) ?? DEFAULT_ORDERS_CONFIG;
  } catch {
    return DEFAULT_ORDERS_CONFIG;
  }
}
