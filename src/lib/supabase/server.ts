// ── Supabase Server Client ─────────────────────────────
// Use this in Server Components and API Routes
// Returns null if env vars are not configured

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase env vars not configured. Using mock client."
    );
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — ignore cookie set errors
        }
      },
    },
  });
}

/** Service-role client for trusted server-only jobs/webhooks. Never import in client code. */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createSupabaseClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Cookie-less, stateless anon client for PUBLIC read paths (site_settings CMS).
 *
 * Unlike {@link createClient} it never touches `cookies()`, so it is safe to
 * call inside `unstable_cache` and never opts a route into per-user dynamic
 * rendering. Row-level security still applies exactly the same as the
 * cookie-bound anon client — it only drops request-scoped auth state, which
 * public config reads never use.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
