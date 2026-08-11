import { NextResponse } from "next/server";
import { getVideoConfig } from "@/lib/media/server";

export const dynamic = "force-dynamic";

/** Public, validated video configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getVideoConfig();
  return NextResponse.json({ data });
}
