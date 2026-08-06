import { getCurrentUserContext } from "@/lib/supabase/guards";

/**
 * Records an entry in the audit log. Safe to call from any admin API route;
 * silently no-ops when Supabase is unavailable or the actor is not resolved.
 */
export async function logAudit(input: {
  action: string;
  entity?: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  const { supabase, user } = await getCurrentUserContext();
  if (!supabase || !user) return;

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: user.email ?? null,
    action: input.action.slice(0, 120),
    entity: input.entity ?? "general",
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
    ip: input.ip ?? null,
  });
}

/** Resolves a best-effort client IP from a request's forwarding headers. */
export function getClientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  return realIp;
}
