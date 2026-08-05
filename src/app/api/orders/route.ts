// ── API: Orders (Website Orders) ───────────────────────
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST — Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone,
      client_whatsapp,
      client_company,
      package_type,
      website_type,
      description,
      num_pages,
      features,
      color_preference,
      reference_sites,
      budget_range,
      timeline,
    } = body;

    // Validation
    if (!client_name || !client_email || !client_phone || !package_type || !website_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        client_name,
        client_email,
        client_phone,
        client_whatsapp,
        client_company,
        package_type,
        website_type,
        description,
        num_pages: num_pages || 1,
        features: features || [],
        color_preference,
        reference_sites: reference_sites || [],
        budget_range,
        timeline,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET — List orders (admin or user's own)
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // If not admin, only show user's own orders
    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
