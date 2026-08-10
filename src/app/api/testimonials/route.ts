import { createClient } from "@/lib/supabase/server";
import { optionalText, rating, requiredText } from "@/lib/api/validation";
import { NextResponse } from "next/server";

// POST — Submit a testimonial for moderation.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const name = requiredText(input.name, 100);
    const role = optionalText(input.role, 100);
    const company = optionalText(input.company, 150);
    const content = requiredText(input.content, 2_000);
    const testimonialRating = rating(input.rating);

    if (!name || !content || testimonialRating === null) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("testimonials")
      .insert({ name, role, company, content, rating: testimonialRating });

    if (error) {
      console.error("Testimonial submission failed", error);
      return NextResponse.json({ error: "Unable to submit testimonial" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Phase 4A guard — never serve recognizable placeholder testimonials publicly.
// Keeps the public surface clean even if a placeholder seed row were approved
// (or re-approved) before migration 027 has been applied to the database.
function isPlaceholderTestimonial(row: {
  name?: unknown;
  role?: unknown;
  company?: unknown;
  content?: unknown;
}): boolean {
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const role = typeof row.role === "string" ? row.role.trim() : "";
  const company = typeof row.company === "string" ? row.company.trim() : "";
  const content = typeof row.content === "string" ? row.content.trim() : "";
  if (/^client name$/i.test(name)) return true;
  if (/^testimonial content$/i.test(content)) return true;
  if (/^role$/i.test(role) && /^company$/i.test(company)) return true;
  return false;
}

// GET — List public, approved testimonials only.
export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: [] });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Testimonial retrieval failed", error);
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data: (data ?? []).filter((row) => !isPlaceholderTestimonial(row)) });
}
