import { NextResponse } from "next/server";
import { getHeroConfig } from "@/lib/hero/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getHeroConfig();
  return NextResponse.json({ data });
}
