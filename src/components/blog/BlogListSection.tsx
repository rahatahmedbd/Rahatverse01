"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Tag,
  FileText,
  Sparkles,
  BookOpen,
  Clock,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardSkeleton, EmptyState } from "@/components/ui";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import Link from "next/link";
import BlogCard from "./BlogCard";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_bn: string | null;
  excerpt?: string | null;
  excerpt_bn?: string | null;
  summary: string | null;
  summary_bn: string | null;
  category: string;
  tags: string[];
  read_time: number | null;
  reading_time?: number | null;
  published_at: string | null;
  featured_image: string | null;
  cover_image?: string | null;
  author: {
    name: string;
    avatar: string | null;
  } | null;
}

interface BlogListSectionProps {
  locale?: string;
  initialCategory?: string;
  limit?: number;
  showSearch?: boolean;
}

function BlogComingSoonState({ locale }: { locale: string }) {
  const isBn = locale === "bn";

  const previewTopics = [
    {
      title: isBn
        ? "Next.js 16 ও Server Actions: মডার্ন ওয়েব আর্কিটেকচার"
        : "Next.js 16 & Server Actions: Designing Scalable Ecosystems",
      category: isBn ? "প্রযুক্তি" : "Technology",
      status: isBn ? "ড্রাফটিং চলছে" : "Drafting",
      readTime: "6 min read",
    },
    {
      title: isBn
        ? "শান্তিচক্র ব্লাড সোসাইটি — জরুরি রক্তদানে ডিজিটাল নেটওয়ার্ক"
        : "Shantichakra Blood Society: Digitizing Emergency Donor Discovery",
      category: isBn ? "সমাজসেবা" : "Social Service",
      status: isBn ? "রিভিউ চলছে" : "In Review",
      readTime: "5 min read",
    },
    {
      title: isBn
        ? "HSC বিজ্ঞান, BNCC ক্যাডেট দায়িত্ব ও ওয়েব ইঞ্জিনিয়ারিংয়ের ভারসাম্য"
        : "Balancing HSC Science, BNCC Cadet Duties & Web Engineering",
      category: isBn ? "শিক্ষা ও জীবন" : "Education & Life",
      status: isBn ? "শীঘ্রই আসছে" : "Upcoming",
      readTime: "7 min read",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Featured Banner */}
      <Card className="relative overflow-hidden rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-amber-500/5 p-6 sm:p-10 shadow-xl">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isBn ? "শীঘ্রই আসছে" : "Coming Soon"}</span>
          </div>

          <h2 className="text-heading-sm sm:text-heading-md font-bold tracking-tight">
            {isBn
              ? "প্রযুক্তি, শিক্ষা ও সমাজসেবা নিয়ে আর্টিকেল"
              : "Technical & Insightful Articles in Active Production"}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {isBn
              ? "আমি বর্তমানে Next.js 16, Cloudinary অপটিমাইজেশন, এবং শান্তিচক্র ব্লাড সোসাইটির ডিজিটাল রূপান্তর নিয়ে কেস স্টাডি লিখছি। প্রকাশ হওয়া মাত্রই জানতে নিউজলেটারে যুক্ত থাকুন।"
              : "I am actively drafting comprehensive articles on Next.js 16 architecture, Cloudinary optimization, and Shantichakra's digital portal. Subscribe below to get notified when they drop!"}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" variant="gradient" asChild className="w-full sm:w-auto rounded-xl">
              <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                {isBn ? "নিউজলেটার সাবস্ক্রাইব করুন" : "Subscribe For Updates"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto rounded-xl">
              <Link href={`/${locale}/portfolio`} className="inline-flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {isBn ? "পোর্টফোলিও কেস স্টাডি দেখুন" : "Read Project Case Studies"}
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Topics Showcase */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {isBn ? "আসন্ন আর্টিকেলের তালিকা" : "Upcoming Article Topics"}
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {previewTopics.map((topic, idx) => (
            <Card
              key={idx}
              className="flex h-full flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 hover:border-primary/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                    {topic.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    <Clock className="h-3 w-3" />
                    {topic.status}
                  </span>
                </div>

                <h4 className="text-base font-bold leading-snug tracking-tight text-foreground/90">
                  {topic.title}
                </h4>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <span>Rahat Ahmed</span>
                <span>{topic.readTime}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogListSection({
  locale = "bn",
  initialCategory = "all",
  limit,
  showSearch = true,
}: BlogListSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const isBn = locale === "bn";

  const categories = [
    { value: "all", label: isBn ? "সব" : "All" },
    { value: "technology", label: isBn ? "প্রযুক্তি" : "Technology" },
    { value: "blood-donation", label: isBn ? "রক্তদান" : "Blood Donation" },
    { value: "experience", label: isBn ? "অভিজ্ঞতা" : "Experience" },
    { value: "education", label: isBn ? "শিক্ষা" : "Education" },
    { value: "social-service", label: isBn ? "সমাজসেবা" : "Social Service" },
  ];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (limit) {
        params.append("limit", limit.toString());
      }

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchPosts]);

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      {showSearch && (
        <FadeInUp>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isBn ? "ব্লগ খুঁজুন..." : "Search blog posts..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  type="button"
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="text-xs rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1.5" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Blog Posts Grid or Coming Soon State */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <FadeInUp>
          {!searchQuery && selectedCategory === "all" ? (
            <BlogComingSoonState locale={locale} />
          ) : (
            <EmptyState
              icon={FileText}
              title={isBn ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি" : "No blog posts found"}
              description={
                isBn
                  ? "আপনার অনুসন্ধানের সাথে কোনো পোস্ট মিলছে না। ফিল্টার পরিবর্তন করে চেষ্টা করুন।"
                  : "No posts match your search or filter criteria. Try clearing filters."
              }
              action={{
                label: isBn ? "সব পোস্ট দেখুন" : "Reset Filters",
                onClick: () => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                },
              }}
            />
          )}
        </FadeInUp>
      ) : (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard post={post} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Results summary */}
      {!loading && posts.length > 0 && (
        <p className="text-center text-xs text-muted-foreground bn">
          {isBn
            ? `মোট ${posts.length}টি ব্লগ পোস্ট দেখানো হচ্ছে`
            : `Showing ${posts.length} blog post${posts.length > 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  );
}
