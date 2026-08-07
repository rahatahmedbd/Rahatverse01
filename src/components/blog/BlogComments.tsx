"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Loader2, Send, CheckCircle2 } from "lucide-react";

// ── Public Blog Comments ───────────────────────────────
// Displays approved comments for a post and lets visitors submit new ones
// (which go to pending moderation in the admin dashboard).

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface BlogCommentsProps {
  postId: string;
  locale?: string;
}

export function BlogComments({ postId, locale = "bn" }: BlogCommentsProps) {
  const isBn = locale === "bn";
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch(`/api/comments?post_id=${encodeURIComponent(postId)}`)
      .then((r) => r.json())
      .then((json) => setComments(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setFeedback({ ok: false, message: isBn ? "সব ঘর পূরণ করুন" : "Please fill in all fields" });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, author_name: name, author_email: email, content }),
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ ok: true, message: isBn ? "মন্তব্য জমা হয়েছে — অনুমোদনের পর প্রকাশিত হবে" : "Comment submitted — will appear after approval" });
        setName("");
        setEmail("");
        setContent("");
      } else {
        setFeedback({ ok: false, message: json.error || "Failed" });
      }
    } catch {
      setFeedback({ ok: false, message: isBn ? "নেটওয়ার্ক সমস্যা" : "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="mb-4 flex items-center gap-2 text-heading-sm font-bold">
        <MessageCircle className="h-5 w-5 text-primary" />
        {isBn ? "মন্তব্য" : "Comments"}
        {comments.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
        )}
      </h2>

      {/* Approved comments */}
      <div className="space-y-3">
        {loading ? (
          <GlassCard className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </GlassCard>
        ) : comments.length === 0 ? (
          <GlassCard className="p-6 text-center text-sm text-muted-foreground">
            {isBn ? "এখনো কোনো মন্তব্য নেই — প্রথম মন্তব্য করুন!" : "No comments yet — be the first!"}
          </GlassCard>
        ) : (
          comments.map((comment) => (
            <GlassCard key={comment.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{comment.author_name}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{comment.content}</p>
            </GlassCard>
          ))
        )}
      </div>

      {/* Comment form */}
      <GlassCard className="mt-6 p-5">
        <h3 className="mb-3 font-semibold">{isBn ? "মন্তব্য লিখুন" : "Leave a comment"}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder={isBn ? "আপনার নাম" : "Your name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder={isBn ? "ইমেইল (প্রকাশিত হবে না)" : "Email (not published)"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Textarea
            rows={3}
            placeholder={isBn ? "আপনার মন্তব্য..." : "Your comment..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {feedback && (
            <p className={`flex items-center gap-2 text-sm ${feedback.ok ? "text-green-400" : "text-red-400"}`}>
              {feedback.ok ? <CheckCircle2 className="h-4 w-4" /> : null}
              {feedback.message}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isBn ? "পাঠান" : "Submit"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground bn">
          {isBn ? "মন্তব্যগুলো প্রকাশের আগে মডারেশনের মধ্য দিয়ে যায়।" : "Comments are moderated before appearing."}
        </p>
      </GlassCard>
    </section>
  );
}
