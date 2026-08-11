import { NextResponse } from "next/server";
import { getExperienceConfig } from "@/lib/experience/server";

export const dynamic = "force-dynamic";

/** Public, validated experience configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getExperienceConfig();
  return NextResponse.json({ data });
}
