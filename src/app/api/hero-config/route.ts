import { NextResponse } from "next/server";
import { getHeroConfig } from "@/lib/hero/server";

export const dynamic = "force-dynamic";

/** Public, validated hero configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getHeroConfig();
  return NextResponse.json({ data });
}
