import { NextResponse } from "next/server";
import { getPortfolioConfig } from "@/lib/portfolio/server";

export const dynamic = "force-dynamic";

// ── GET /api/portfolio-config ──────────────────────────
// Served from the shared 60s cache; the empty-projects guard lives in the
// shared loader so page and API can never disagree.
export async function GET() {
  const data = await getPortfolioConfig();
  return NextResponse.json({ data });
}
