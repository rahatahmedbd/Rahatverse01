import { NextResponse } from "next/server";
import { getAboutConfig } from "@/lib/about/server";

export const dynamic = "force-dynamic";

/** Public, validated about configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getAboutConfig();
  return NextResponse.json({ data });
}
