import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the authenticated user and their administrative role for server-only
 * routes. Authorization always relies on Supabase's verified user, never on a
 * client-provided role or user id.
 */
export async function getCurrentUserContext() {
  const supabase = await createClient();

  if (!supabase) {
    return { supabase: null, user: null, isAdmin: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    isAdmin: profile?.role === "admin",
  };
}
