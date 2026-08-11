import { NextResponse } from "next/server";
import { getLinksConfig } from "@/lib/links/server";

export const dynamic = "force-dynamic";

/** Public, validated links configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getLinksConfig();
  return NextResponse.json({ data });
}
