"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

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

interface BlogCardProps {
  post: BlogPost;
  locale?: string;
}

export default function BlogCard({ post, locale = "bn" }: BlogCardProps) {
  const isBn = locale === "bn";
  const title = isBn && post.title_bn ? post.title_bn : post.title;
  const excerpt = isBn && post.excerpt_bn ? post.excerpt_bn : post.excerpt;

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        {post.cover_image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={post.cover_image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.category && (
              <Badge className="absolute top-3 right-3" variant="secondary">
                {post.category}
              </Badge>
            )}
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString(
                      isBn ? "bn-BD" : "en-US"
                    )}
                  </span>
                </div>
              )}
              {post.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {post.reading_time} {isBn ? "মিনিট" : "min"}
                  </span>
                </div>
              )}
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
