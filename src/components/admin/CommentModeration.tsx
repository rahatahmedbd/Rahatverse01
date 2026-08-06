"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Loader2,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Comment Moderation System ──────────────────────────
// Approve / reject / delete blog comments.

interface CommentRow {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  blog_posts?: { title: string; slug: string } | null;
}

interface CommentModerationProps {
  locale?: string;
}

export function CommentModeration({ locale = "bn" }: CommentModerationProps) {
  const isBn = locale === "bn";
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const pageSize = 20;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ status, page: String(page), limit: String(pageSize) });
      const res = await fetch(`/api/admin/comments?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setComments(json.data || []);
      setTotal(json.pagination?.total ?? 0);
    } catch {
      setError(isBn ? "কমেন্ট লোড করা যায়নি" : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [status, page, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
  }, [fetchComments]);

  const act = async (id: string, action: "approve" | "reject" | "delete") => {
    setActingId(id);
    try {
      const url = `/api/admin/comments${action === "delete" ? `?id=${id}` : ""}`;
      const res = await fetch(url, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: action === "delete" ? undefined : JSON.stringify({ id, approved: action === "approve" }),
      });
      if (res.ok) fetchComments();
    } finally {
      setActingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="py-4">
      <SectionTitle
        badge="💬"
        title="Comment Moderation"
        titleBn="কমেন্ট মডারেশন"
        locale={locale}
      />

      <div className="mb-6 flex items-center gap-2">
        {["pending", "approved", "all"].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={status === s ? "default" : "outline"}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
          >
            {s === "pending" ? (isBn ? "অনুমোদন pending" : "Pending") : s === "approved" ? (isBn ? "অনুমোদিত" : "Approved") : (isBn ? "সব" : "All")}
          </Button>
        ))}
      </div>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <div className="space-y-3">
        {loading ? (
          <GlassCard className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </GlassCard>
        ) : comments.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "কোনো কমেন্ট নেই" : "No comments"}
          </GlassCard>
        ) : (
          comments.map((comment) => (
            <GlassCard key={comment.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{comment.author_name}</span>
                  <span className="text-xs text-muted-foreground">{comment.author_email}</span>
                  <Badge variant={comment.is_approved ? "success" : "warning"}>
                    {comment.is_approved ? (isBn ? "অনুমোদিত" : "Approved") : (isBn ? "Pending" : "Pending")}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{comment.content}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {comment.blog_posts?.title ?? isBn ? "পোস্ট" : "Post"}
                </p>
                <div className="flex items-center gap-2">
                  {!comment.is_approved && (
                    <Button size="sm" disabled={actingId === comment.id} onClick={() => act(comment.id, "approve")}>
                      <Check className="h-4 w-4" />
                      {isBn ? "অনুমোদন" : "Approve"}
                    </Button>
                  )}
                  {comment.is_approved && (
                    <Button size="sm" variant="outline" disabled={actingId === comment.id} onClick={() => act(comment.id, "reject")}>
                      <X className="h-4 w-4" />
                      {isBn ? "লুকান" : "Reject"}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" disabled={actingId === comment.id} onClick={() => act(comment.id, "delete")}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
