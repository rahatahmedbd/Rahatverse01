import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_PORTFOLIO_CONFIG,
  validatePortfolioConfig,
} from "@/lib/portfolio/config";

// ── GET /api/portfolio-config ──────────────────────────
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ data: DEFAULT_PORTFOLIO_CONFIG });
    }

    const { data, error } = await supabase
      .from("content_config")
      .select("value")
      .eq("key", "portfolio_config")
      .single();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_PORTFOLIO_CONFIG });
    }

    const validated = validatePortfolioConfig(data.value);
    // Guard against a stored config with an empty/blank project list (or no
    // visible projects) — fall back to the seeded placeholder projects so the
    // portfolio page is never blank.
    if (!validated || validated.projects.filter((p) => p.visible).length === 0) {
      return NextResponse.json({ data: DEFAULT_PORTFOLIO_CONFIG });
    }
    return NextResponse.json({ data: validated });
  } catch {
    return NextResponse.json({ data: DEFAULT_PORTFOLIO_CONFIG });
  }
}
