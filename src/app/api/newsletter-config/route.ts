import { NextResponse } from "next/server";
import { getNewsletterConfig } from "@/lib/newsletter/server";

export const dynamic = "force-dynamic";

/** Public, validated newsletter configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getNewsletterConfig();
  return NextResponse.json({ data });
}
