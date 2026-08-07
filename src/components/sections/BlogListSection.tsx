"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { ArrowRight, Clock, BookOpen, Search, Sparkles } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { Input } from "@/components/ui/input";
import { DEFAULT_BLOG_CONFIG, validateBlogConfig } from "@/lib/blog/config";
import type { BlogConfig } from "@/types/blog";

// ── Types ──────────────────────────────────────────────
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
  category: string;
  categoryBn: string;
  readTime: string;
  readTimeBn: string;
  publishedAt: string;
  publishedAtBn: string;
  featuredImage?: string;
  featured?: boolean;
}

interface BlogListSectionProps {
  locale?: string;
  posts?: BlogPost[];
}

// ── Demo Blog Posts (Fallback) ─────────────────────────
const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    slug: "science-fair-project-2025",
    title: "How I Won 1st Prize at the National Science Fair 2025",
    titleBn: "কীভাবে জাতীয় বিজ্ঞান মেলা ২০২৫-এ ১ম স্থান অর্জন করলাম",
    summary:
      "A deep dive into my winning project, the preparation journey, and tips for future participants.",
    summaryBn:
      "আমার বিজয়ী প্রজেক্ট, প্রস্তুতির যাত্রা এবং ভবিষ্যৎ অংশগ্রহণকারীদের জন্য কিছু গুরুত্বপূর্ণ টিপস।",
    category: "science",
    categoryBn: "বিজ্ঞান",
    readTime: "5 min read",
    readTimeBn: "৫ মিনিট পাঠ",
    publishedAt: "July 15, 2025",
    publishedAtBn: "১৫ জুলাই, ২০২৫",
    featuredImage: "blog/science-fair-2025",
    featured: true,
  },
  {
    id: "2",
    slug: "blood-donation-awareness-campaign",
    title: "Shantichakra Blood Society: Saving Lives Together",
    titleBn: "শান্তিচক্র ব্লাড সোসাইটি: একসাথে জীবন বাঁচানোর উদ্যোগ",
    summary:
      "Our recent voluntary blood donation drive in Bogura and how community awareness is changing lives.",
    summaryBn:
      "বগুড়ায় আমাদের সাম্প্রতিক স্বেচ্ছায় রক্তদান কর্মসূচি এবং কীভাবে সামাজিক সচেতনতা জীবন বদলে দিচ্ছে।",
    category: "social",
    categoryBn: "সমাজসেবা",
    readTime: "4 min read",
    readTimeBn: "৪ মিনিট পাঠ",
    publishedAt: "June 20, 2025",
    publishedAtBn: "২০ জুন, ২০২৫",
    featuredImage: "blog/blood-donation",
    featured: true,
  },
  {
    id: "3",
    slug: "ssc-preparation-strategy-gpa-5",
    title: "My Complete Study Strategy for SSC GPA 5.00",
    titleBn: "এসএসসি জিপিএ ৫.০০ অর্জনের সম্পূর্ণ পড়াশোনা কৌশল",
    summary:
      "Subject-wise study plans, time management techniques, and revision strategies that helped me succeed.",
    summaryBn:
      "বিষয়ভিত্তিক পড়ার পরিকল্পনা, সময় ব্যবস্থাপনা এবং রিভিশন কৌশল যা আমাকে সফল হতে সাহায্য করেছে।",
    category: "education",
    categoryBn: "শিক্ষা",
    readTime: "7 min read",
    readTimeBn: "৭ মিনিট পাঠ",
    publishedAt: "May 10, 2025",
    publishedAtBn: "১০ মে, ২০২৫",
    featuredImage: "blog/ssc-study",
    featured: false,
  },
];

// ── Component ──────────────────────────────────────────
export function BlogListSection({
  locale = "bn",
  posts = fallbackPosts,
}: BlogListSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<BlogConfig>(DEFAULT_BLOG_CONFIG);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateBlogConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    { key: "all", label: isBn ? "সব পোস্ট" : "All Posts" },
    ...config.categories
      .filter((category) => category.visible)
      .map((category) => ({
        key: category.value,
        label: isBn ? category.labelBn : category.labelEn,
      })),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.titleBn.includes(searchQuery) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "📝 লেখালেখি" : "📝 Blog & Articles"}
          title="Thoughts & Experiences"
          titleBn="ব্লগ ও নিবন্ধ"
          subtitle={
            isBn
              ? "বিজ্ঞান, শিক্ষা, প্রযুক্তি ও সামাজিক উদ্যোগ নিয়ে আমার কিছু চিন্তাভাবনা ও অভিজ্ঞতা"
              : "My thoughts and experiences on science, education, technology, and social initiatives"
          }
          locale={locale}
        />

        {/* Filter & Search Bar */}
        <FadeInUp>
          <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isBn ? "ব্লগ খুঁজুন..." : "Search articles..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card/50"
              />
            </div>
          </div>
        </FadeInUp>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <GlassCard className="group h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between">
                    <div>
                      {/* Image Preview */}
                      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted/50">
                        {post.featuredImage ? (
                          <CloudinaryImage
                            publicId={post.featuredImage}
                            alt={isBn ? post.titleBn : post.title}
                            width={600}
                            height={340}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                            <BookOpen className="h-10 w-10 text-primary/30" />
                          </div>
                        )}
                        {post.featured && (
                          <Badge
                            variant="glow"
                            className="absolute left-3 top-3"
                          >
                            <Sparkles className="mr-1 h-3 w-3" />
                            {isBn ? "ফিচার্ড" : "Featured"}
                          </Badge>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {isBn ? post.categoryBn : post.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {isBn ? post.readTimeBn : post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary bn">
                        {isBn ? post.titleBn : post.title}
                      </h3>

                      {/* Summary */}
                      <p className="line-clamp-2 text-sm text-muted-foreground bn">
                        {isBn ? post.summaryBn : post.summary}
                      </p>
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
            <EmptyState
              icon={BookOpen}
              title={
                searchQuery
                  ? isBn
                    ? "কোনো ব্লগ পাওয়া যায়নি"
                    : "No posts found"
                  : isBn
                    ? "এখনো কোনো ব্লগ পোস্ট নেই"
                    : "No blog posts yet"
              }
              description={
                searchQuery || activeCategory !== "all"
                  ? isBn
                    ? "আপনার অনুসন্ধানের সাথে কোনো পোস্ট মিলছে না। ফিল্টার পরিবর্তন করে চেষ্টা করুন।"
                    : "No articles match your current search or category filter."
                  : isBn
                    ? "শীঘ্রই নতুন কন্টেন্ট প্রকাশ করা হবে!"
                    : "New articles and content coming soon!"
              }
              action={
                searchQuery || activeCategory !== "all"
                  ? {
                      label: isBn ? "সব পোস্ট দেখুন" : "Clear Filters",
                      onClick: () => {
                        setSearchQuery("");
                        setActiveCategory("all");
                      },
                    }
                  : undefined
              }
            />
          </FadeInUp>
        )}
      </div>
    </section>
  );
}
