import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import type { OrdersConfig } from "@/types/orders";

/** Fetches the public order-wizard payload with a safe fallback for local/CI builds. */
export async function getOrdersConfig(): Promise<OrdersConfig> {
  try {
    const value = await getCachedSiteSetting("orders_config");
    if (value == null) return DEFAULT_ORDERS_CONFIG;
    return validateOrdersConfig(value) ?? DEFAULT_ORDERS_CONFIG;
  } catch {
    return DEFAULT_ORDERS_CONFIG;
  }
}
