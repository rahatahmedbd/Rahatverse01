import { NextResponse } from "next/server";
import { getBlogConfig } from "@/lib/blog/server";

export const dynamic = "force-dynamic";

/** Public, validated blog configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getBlogConfig();
  return NextResponse.json({ data });
}
