import { NextResponse } from "next/server";
import { getAnalyticsConfig } from "@/lib/analytics/configServer";

export const dynamic = "force-dynamic";

/** Public, validated analytics configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getAnalyticsConfig();
  return NextResponse.json({ data });
}
