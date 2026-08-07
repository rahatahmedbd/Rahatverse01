"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCog, ShieldCheck, Users } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState, TableSkeleton } from "@/components/ui";

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

export function UserManagement({ locale = "bn" }: UserManagementProps) {
  const isBn = locale === "bn";
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/admin/users${q}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError(
        isBn
          ? "ইউজার তালিকা লোড করা যায়নি। পরে চেষ্টা করুন।"
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }, [search, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSavingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      setError(
        isBn ? "রোল আপডেট করা যায়নি।" : "Failed to update user role."
      );
    } finally {
      setSavingId(null);
    }
  };

  const roleVariants: Record<string, "default" | "secondary" | "outline"> = {
    admin: "default",
    client: "secondary",
    visitor: "outline",
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        badge={isBn ? "👥 ইউজার ম্যানেজমেন্ট" : "👥 User Management"}
        title="User Roles & Access Control"
        titleBn="ইউজার রোল ও পারমিশন"
        subtitle={
          isBn
            ? "সুপাবেস auth ও profiles টেবিল থেকে ইউজার পরিচালনা ও রোল পরিবর্তন করুন"
            : "Manage profile accounts and update RBAC roles"
        }
        locale={locale}
      />

      <GlassCard className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={
                isBn ? "ইমেইল বা নাম দিয়ে খুঁজুন…" : "Search email or name…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
          >
            {isBn ? "রিফ্রেশ" : "Refresh"}
          </Button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <TableSkeleton rows={4} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                  <th className="px-4 py-3">{isBn ? "ইউজার" : "User"}</th>
                  <th className="px-4 py-3">{isBn ? "ইমেইল" : "Email"}</th>
                  <th className="px-4 py-3">{isBn ? "রোল" : "Role"}</th>
                  <th className="px-4 py-3">{isBn ? "জয়েন" : "Joined"}</th>
                  <th className="px-4 py-3 text-right">
                    {isBn ? "অ্যাকশন" : "Action"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8">
                      <EmptyState
                        size="sm"
                        icon={Users}
                        title={
                          isBn ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"
                        }
                        description={
                          search
                            ? isBn
                              ? "আপনার সার্চের সাথে কোনো ইউজার মিলছে না।"
                              : "No users match your search query."
                            : isBn
                              ? "কোনো নিবন্ধিত ইউজার নেই।"
                              : "No registered users found."
                        }
                        action={
                          search
                            ? {
                                label: isBn
                                  ? "সার্চ রিসেট করুন"
                                  : "Clear Search",
                                onClick: () => setSearch(""),
                              }
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/30 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <UserCog className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">
                            {user.full_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={roleVariants[user.role] || "secondary"}
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString(
                          isBn ? "bn-BD" : "en-US"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {(["admin", "client", "visitor"] as const).map(
                            (r) => (
                              <Button
                                key={r}
                                variant={
                                  user.role === r ? "default" : "outline"
                                }
                                size="sm"
                                className="h-7 px-2 text-xs"
                                disabled={
                                  user.role === r || savingId === user.id
                                }
                                onClick={() => handleRoleChange(user.id, r)}
                              >
                                {r === "admin" && (
                                  <ShieldCheck className="mr-1 h-3 w-3" />
                                )}
                                {r}
                              </Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
