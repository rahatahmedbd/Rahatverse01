"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
} from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Content Management System (CMS) ────────────────────
// Full CRUD for blog posts (create, edit, publish/unpublish, delete).

interface BlogPost {
  id: string;
  title: string;
  title_bn: string | null;
  content: string;
  content_bn: string | null;
  excerpt: string | null;
  excerpt_bn: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  is_published: boolean;
  slug: string;
  created_at: string;
}

interface BlogManagerProps {
  locale?: string;
}

const emptyForm = {
  title: "",
  title_bn: "",
  content: "",
  content_bn: "",
  excerpt: "",
  excerpt_bn: "",
  cover_image: "",
  category: "General",
  tags: "",
  author: "Rahat Ahmed",
  is_published: false,
};

export function BlogManager({ locale = "bn" }: BlogManagerProps) {
  const isBn = locale === "bn";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BlogPost | "new" | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ status });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/blog?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setPosts(json.data || []);
    } catch {
      setError(isBn ? "ব্লগ পোস্ট লোড করা যায়নি" : "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [status, search, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  const startNew = () => {
    setForm({ ...emptyForm });
    setEditing("new");
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      title_bn: post.title_bn ?? "",
      content: post.content,
      content_bn: post.content_bn ?? "",
      excerpt: post.excerpt ?? "",
      excerpt_bn: post.excerpt_bn ?? "",
      cover_image: post.cover_image ?? "",
      category: post.category ?? "General",
      tags: (post.tags ?? []).join(", "),
      author: post.author ?? "",
      is_published: post.is_published,
    });
    setEditing(post);
  };

  const savePost = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert(isBn ? "টাইটেল ও কন্টেন্ট প্রয়োজন" : "Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        reading_time: Math.max(1, Math.ceil(form.content.split(/\s+/).length / 200)),
      };
      const res =
        editing === "new"
          ? await fetch("/api/admin/blog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/admin/blog", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: (editing as BlogPost).id, ...payload }),
            });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed");
      } else {
        setEditing(null);
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, is_published: !post.is_published }),
    });
    if (res.ok) fetchPosts();
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(isBn ? `"${post.title}" মুছবেন?` : `Delete "${post.title}"?`)) return;
    const res = await fetch(`/api/admin/blog?id=${post.id}`, { method: "DELETE" });
    if (res.ok) fetchPosts();
  };

  const categories = ["General", "Technology", "Education", "Life", "Projects", "Other"];

  return (
    <section className="py-4">
      <SectionTitle
        badge="📝"
        title="Content Management System"
        titleBn="কন্টেন্ট ম্যানেজমেন্ট সিস্টেম"
        locale={locale}
      />

      {/* Toolbar */}
      <GlassCard className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {["all", "published", "draft"].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? "default" : "outline"}
                onClick={() => setStatus(s)}
              >
                {s === "all" ? (isBn ? "সব" : "All") : s === "published" ? (isBn ? "প্রকাশিত" : "Published") : (isBn ? "খসড়া" : "Draft")}
              </Button>
            ))}
          </div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder={isBn ? "খুঁজুন..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={startNew}>
            <Plus className="h-4 w-4" />
            {isBn ? "নতুন পোস্ট" : "New Post"}
          </Button>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      {/* Editor */}
      {editing && (
        <GlassCard className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold bn">
              {editing === "new" ? (isBn ? "নতুন পোস্ট" : "New Post") : (isBn ? "পোস্ট সম্পাদনা" : "Edit Post")}
            </h3>
            <Button variant="ghost" size="icon-sm" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Title (EN)</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">শিরোনাম (BN)</label>
                <Input value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tags (comma separated)</label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Cover Image URL</label>
                <Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Excerpt (EN)</label>
                <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Excerpt (BN)</label>
                <Textarea rows={2} value={form.excerpt_bn} onChange={(e) => setForm({ ...form, excerpt_bn: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Content (EN)</label>
              <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Content (BN)</label>
              <Textarea rows={8} value={form.content_bn} onChange={(e) => setForm({ ...form, content_bn: e.target.value })} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                {isBn ? "প্রকাশিত" : "Published"}
              </label>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  <X className="h-4 w-4" />
                  {isBn ? "বাতিল" : "Cancel"}
                </Button>
                <Button onClick={savePost} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isBn ? "সংরক্ষণ" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Post list */}
      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "কোনো পোস্ট নেই" : "No posts"}
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">{isBn ? "টাইটেল" : "Title"}</th>
                <th className="px-4 py-3">{isBn ? "ক্যাটাগরি" : "Category"}</th>
                <th className="px-4 py-3">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                <th className="px-4 py-3 text-right">{isBn ? "অ্যাকশন" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border/30 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{post.title}</p>
                        <p className="truncate text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{post.category || "General"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={post.is_published ? "success" : "warning"}>
                      {post.is_published ? (isBn ? "প্রকাশিত" : "Published") : (isBn ? "খসড়া" : "Draft")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => togglePublish(post)} title={post.is_published ? "Unpublish" : "Publish"}>
                        {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => startEdit(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => deletePost(post)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </section>
  );
}
