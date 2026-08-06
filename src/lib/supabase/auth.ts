// ── Auth Helpers ───────────────────────────────────────
// Reusable auth functions for client and server

import { createClient } from "./server";

// ── Get Current User ───────────────────────────────────
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Get Current User Profile ───────────────────────────
export async function getCurrentProfile() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

// ── Check if User is Admin ─────────────────────────────
export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

// ── Sign In with Email/Password ────────────────────────
export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  if (!supabase) return { error: { message: "Supabase not configured" } };

  return supabase.auth.signInWithPassword({ email, password });
}

// ── Sign Up with Email/Password ────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = await createClient();
  if (!supabase) return { error: { message: "Supabase not configured" } };

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
}

// ── Sign In with Google ────────────────────────────────
export async function signInWithGoogle() {
  const supabase = await createClient();
  if (!supabase) return { error: { message: "Supabase not configured" } };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  return { data, error };
}

// ── Sign Out ───────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  if (!supabase) return { error: { message: "Supabase not configured" } };

  return supabase.auth.signOut();
}

// ── Send Magic Link ────────────────────────────────────
export async function sendMagicLink(email: string) {
  const supabase = await createClient();
  if (!supabase) return { error: { message: "Supabase not configured" } };

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
}
