// ── Supabase Client (Browser) ──────────────────────────
// Use this in client components
// Returns null if env vars are not configured

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase env vars not configured. Using mock client."
    );
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
