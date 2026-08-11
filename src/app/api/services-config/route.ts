import { NextResponse } from "next/server";
import { getServicesConfig } from "@/lib/services/server";

export const dynamic = "force-dynamic";

/** Public, validated services configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getServicesConfig();
  return NextResponse.json({ data });
}
