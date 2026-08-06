"use server";

// ── Auth Server Actions ────────────────────────────────
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ── Login Action ───────────────────────────────────────
export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Database not configured" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/bn/dashboard");
}

// ── Signup Action ──────────────────────────────────────
export async function signupAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Database not configured" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  if (!email || !password || !fullName) {
    return { error: "All fields are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Check your email to confirm your account" };
}

// ── Logout Action ──────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient();
  if (!supabase) return;

  await supabase.auth.signOut();
  redirect("/bn");
}

// ── Google Sign In Action ──────────────────────────────
export async function googleSignInAction() {
  const supabase = await createClient();
  if (!supabase) return { error: "Database not configured" };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

// ── Magic Link Action ──────────────────────────────────
export async function magicLinkAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Database not configured" };

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Check your email for the magic link" };
}
