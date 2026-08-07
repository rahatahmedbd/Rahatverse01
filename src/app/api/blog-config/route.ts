import { NextResponse } from "next/server";
import { DEFAULT_BLOG_CONFIG, validateBlogConfig } from "@/lib/blog/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public, validated blog + comment configuration endpoint (Phase 8). */
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ data: DEFAULT_BLOG_CONFIG });

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "blog_config")
      .maybeSingle();

    if (error || !data?.value) {
      return NextResponse.json({ data: DEFAULT_BLOG_CONFIG });
    }
    return NextResponse.json({ data: validateBlogConfig(data.value) ?? DEFAULT_BLOG_CONFIG });
  } catch {
    return NextResponse.json({ data: DEFAULT_BLOG_CONFIG });
  }
}
