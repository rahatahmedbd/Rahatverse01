import { NextResponse } from "next/server";
import { getOrdersConfig } from "@/lib/orders/server";

export const dynamic = "force-dynamic";

/** Public, validated orders configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getOrdersConfig();
  return NextResponse.json({ data });
}
