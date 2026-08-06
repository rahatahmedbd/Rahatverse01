"use client";

import { useState, useEffect, useCallback } from "react";
import BlogCard from "./BlogCard";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_bn?: string;
  excerpt: string;
  excerpt_bn?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
  published_at?: string;
}

interface BlogListSectionProps {
  locale?: string;
  limit?: number;
}

export default function BlogListSection({ locale = "bn", limit }: BlogListSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isBn = locale === "bn";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      
      if (data.data) {
        let filteredPosts = data.data;
        
        // Filter by category if not "all"
        if (selectedCategory !== "all") {
          filteredPosts = filteredPosts.filter((post: BlogPost) => 
            post.category === selectedCategory
          );
        }
        
        // Apply limit if specified
        if (limit) {
          filteredPosts = filteredPosts.slice(0, limit);
        }
        
        setPosts(filteredPosts);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category || "").filter(Boolean)))];

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      {categories.length > 1 && (
        <FadeInUp>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? (isBn ? "সব" : "All") : category}
              </Button>
            ))}
          </div>
        </FadeInUp>
      )}

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <FadeInUp>
          <div className="text-center py-12 text-muted-foreground">
            {isBn ? "কোনো ব্লগ পোস্ট পাওয়া যায়নি" : "No blog posts found"}
          </div>
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
    </div>
  );
}
