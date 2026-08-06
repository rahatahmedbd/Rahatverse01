"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, UserCog, ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── User Management + RBAC ─────────────────────────────
// Lists profiles and lets an admin change roles (admin/client/visitor).

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

interface UserManagementProps {
  locale?: string;
}

const roleVariants: Record<string, "glow" | "info" | "secondary"> = {
  admin: "glow",
  client: "info",
  visitor: "secondary",
};

export function UserManagement({ locale = "bn" }: UserManagementProps) {
  const isBn = locale === "bn";
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ role: roleFilter });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setUsers(json.data || []);
      setTotal(json.total ?? 0);
    } catch {
      setError(isBn ? "ইউজার লোড করা যায়নি" : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const changeRole = async (user: UserRow, role: string) => {
    setSavingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed");
      } else {
        fetchUsers();
      }
    } finally {
      setSavingId(null);
    }
  };

  const roleLabels: Record<string, string> = {
    admin: isBn ? "অ্যাডমিন" : "Admin",
    client: isBn ? "ক্লায়েন্ট" : "Client",
    visitor: isBn ? "ভিজিটর" : "Visitor",
  };

  return (
    <section className="py-4">
      <SectionTitle
        badge="🛡️ RBAC"
        title="User Management"
        titleBn="ইউজার ম্যানেজমেন্ট"
        locale={locale}
      />

      <GlassCard className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={isBn ? "ইমেইল বা নাম দিয়ে খুঁজুন..." : "Search by email or name..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "admin", "client", "visitor"].map((role) => (
              <Button
                key={role}
                size="sm"
                variant={roleFilter === role ? "default" : "outline"}
                onClick={() => setRoleFilter(role)}
              >
                {role === "all" ? (isBn ? "সব" : "All") : roleLabels[role]}
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      {loading ? (
        <GlassCard className="p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </GlassCard>
      ) : (
        <GlassCard className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">{isBn ? "ইউজার" : "User"}</th>
                <th className="px-4 py-3">{isBn ? "ইমেইল" : "Email"}</th>
                <th className="px-4 py-3">{isBn ? "রোল" : "Role"}</th>
                <th className="px-4 py-3">{isBn ? "জয়েন" : "Joined"}</th>
                <th className="px-4 py-3 text-right">{isBn ? "অ্যাকশন" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    {isBn ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border/30 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <UserCog className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{user.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleVariants[user.role] ?? "secondary"}>
                        {roleLabels[user.role] ?? user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {savingId === user.id ? (
                        <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                      ) : (
                        <select
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                          value={user.role}
                          onChange={(e) => changeRole(user, e.target.value)}
                        >
                          {Object.keys(roleLabels).map((role) => (
                            <option key={role} value={role}>
                              {roleLabels[role]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center gap-2 border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            {isBn
              ? `মোট ${total} জন ইউজার`
              : `${total} users total`}
          </div>
        </GlassCard>
      )}
    </section>
  );
}
