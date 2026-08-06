import { createClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import {
  enumValue,
  optionalText,
  positiveInteger,
  requiredText,
  stringArray,
  validEmail,
  validPhone,
} from "@/lib/api/validation";
import { NextResponse } from "next/server";
import { orderConfirmationEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

const packageTypes = ["basic", "standard", "premium", "enterprise"] as const;
const websiteTypes = [
  "portfolio",
  "business",
  "ecommerce",
  "education",
  "blood_org",
  "ngo",
  "news_portal",
  "landing_page",
  "event",
  "custom",
] as const;

// POST — Create a new website order.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const client_name = requiredText(input.client_name, 100);
    const client_email = validEmail(input.client_email);
    const client_phone = validPhone(input.client_phone);
    const client_whatsapp = optionalText(input.client_whatsapp, 25);
    const client_company = optionalText(input.client_company, 150);
    const package_type = enumValue(input.package_type, packageTypes);
    const website_type = enumValue(input.website_type, websiteTypes);
    const description = optionalText(input.description, 5_000);
    const num_pages = positiveInteger(input.num_pages, 1, 100);
    const features = stringArray(input.features ?? [], 30, 80);
    const color_preference = optionalText(input.color_preference, 100);
    const reference_sites = stringArray(input.reference_sites ?? [], 10, 2_000);
    const budget_range = optionalText(input.budget_range, 50);
    const timeline = optionalText(input.timeline, 50);

    if (
      !client_name ||
      !client_email ||
      !client_phone ||
      !package_type ||
      !website_type ||
      num_pages === null ||
      features === null ||
      reference_sites === null ||
      (input.client_whatsapp && !validPhone(input.client_whatsapp))
    ) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error } = await supabase
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
        num_pages,
        features,
        color_preference,
        reference_sites,
        budget_range,
        timeline,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Order creation failed", error);
      return NextResponse.json({ error: "Unable to submit order" }, { status: 500 });
    }

    const delivery = await sendEmail({
      to: client_email,
      tag: "order-confirmation",
      template: orderConfirmationEmail({ name: client_name, orderId: order.id }),
    });
    if (delivery.status === "failed") console.error("Order confirmation email failed", delivery.error);
    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET — List every order for an administrator or only the caller's own orders.
export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Order retrieval failed", error);
    return NextResponse.json({ error: "Unable to retrieve orders" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
