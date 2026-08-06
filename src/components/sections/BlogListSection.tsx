"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { BookOpen, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

// ── Blog List Section ──────────────────────────────────
interface BlogListSectionProps {
  locale?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  reading_time: number;
  published_at: string | null;
  created_at: string;
}

export function BlogListSection({ locale = "bn" }: BlogListSectionProps) {
  const isBn = locale === "bn";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch published blog posts
  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setPosts(data.data);
      })
      .catch(() => {});
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" ||
      post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "📝 ব্লগ" : "📝 Blog"}
          title="Blog Posts"
          titleBn="ব্লগ পোস্ট"
          subtitle={
            isBn
              ? "শিক্ষা, প্রযুক্তি, এবং সমাজসেবা নিয়ে আমার চিন্তাভাবনা"
              : "My thoughts on education, technology, and social service"
          }
          locale={locale}
        />

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "ব্লগ খুঁজুন..." : "Search blog..."}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-sm"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm bn"
            >
              <option value="">{isBn ? "সব ক্যাটাগরি" : "All Categories"}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat || ""}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <GlassCard className="group h-full transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    {/* Cover Image */}
                    {post.cover_image && (
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Category */}
                    {post.category && (
                      <Badge variant="glow" className="mb-3">
                        {post.category}
                      </Badge>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold bn group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground bn line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.reading_time} {isBn ? "মিনিট" : "min"}
                      </span>
                    </div>

                    {/* Read More */}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      {isBn ? "পড়ুন" : "Read More"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeInUp>
            <GlassCard className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium bn">
                {searchQuery
                  ? (isBn ? "কোনো ব্লগ পাওয়া যায়নি" : "No posts found")
                  : (isBn ? "এখনো কোনো ব্লগ পোস্ট নেই" : "No blog posts yet")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground bn">
                {isBn ? "শীঘ্রই নতুন কন্টেন্ট আসছে!" : "New content coming soon!"}
              </p>
            </GlassCard>
          </FadeInUp>
        )}
      </div>
    </section>
  );
}
