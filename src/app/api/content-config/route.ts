import { NextResponse } from "next/server";
import { getContentConfig } from "@/lib/content/server";

export const dynamic = "force-dynamic";

/** Public, validated content configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getContentConfig();
  return NextResponse.json({ data });
}
