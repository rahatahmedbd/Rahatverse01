import { NextResponse } from "next/server";
import { getContactConfig } from "@/lib/contact/server";

export const dynamic = "force-dynamic";

/** Public, validated contact configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getContactConfig();
  return NextResponse.json({ data });
}
