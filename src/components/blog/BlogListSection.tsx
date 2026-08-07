"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Tag, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardSkeleton, EmptyState } from "@/components/ui";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
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
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="text-xs"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <FadeInUp>
          <EmptyState
            icon={FileText}
            title={isBn ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি" : "No blog posts found"}
            description={
              searchQuery || selectedCategory !== "all"
                ? isBn
                  ? "আপনার অনুসন্ধানের সাথে কোনো পোস্ট মিলছে না। ফিল্টার পরিবর্তন করে চেষ্টা করুন।"
                  : "No posts match your search or filter criteria. Try clearing filters."
                : isBn
                  ? "শীঘ্রই নতুন ব্লগ পোস্ট লেখা হবে।"
                  : "New articles and blog posts will be published soon."
            }
            action={
              searchQuery || selectedCategory !== "all"
                ? {
                    label: isBn ? "সব পোস্ট দেখুন" : "Reset Filters",
                    onClick: () => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    },
                  }
                : undefined
            }
          />
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
