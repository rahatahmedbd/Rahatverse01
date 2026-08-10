import { createClient } from "@/lib/supabase/server";

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  created_at: string;
}

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

/**
 * Server helper to fetch approved, non-placeholder testimonials directly from
 * Supabase during SSR/build without client-side API waterfall requests.
 */
export async function getApprovedTestimonialsServer(limit = 12): Promise<TestimonialItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(limit * 2);

    if (error || !data) return [];
    const filtered = (data as TestimonialItem[]).filter((row) => !isPlaceholderTestimonial(row));
    return filtered.slice(0, limit);
  } catch {
    return [];
  }
}
