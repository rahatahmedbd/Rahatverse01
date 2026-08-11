import { NextResponse } from "next/server";
import { getGlobalConfig } from "@/lib/global/server";

export const dynamic = "force-dynamic";

/** Public, validated global configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getGlobalConfig();
  return NextResponse.json({ data });
}
