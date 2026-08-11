import { NextResponse } from "next/server";
import { getThemeConfig } from "@/lib/theme/server";

export const dynamic = "force-dynamic";

/** Public, validated theme configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getThemeConfig();
  return NextResponse.json({ data });
}
