import { NextResponse } from "next/server";
import { getGalleryConfig } from "@/lib/media/server";

export const dynamic = "force-dynamic";

/** Public, validated gallery configuration endpoint (served from the shared 60s config cache). */
export async function GET() {
  const data = await getGalleryConfig();
  return NextResponse.json({ data });
}
