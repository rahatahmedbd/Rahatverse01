"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_bn?: string | null;
  excerpt?: string | null;
  excerpt_bn?: string | null;
  summary?: string | null;
  summary_bn?: string | null;
  cover_image?: string | null;
  featured_image?: string | null;
  category?: string;
  tags?: string[];
  reading_time?: number | null;
  read_time?: number | null;
  published_at?: string | null;
}

interface BlogCardProps {
  post: BlogPost;
  locale?: string;
}

export default function BlogCard({ post, locale = "bn" }: BlogCardProps) {
  const isBn = locale === "bn";
  const title = isBn && post.title_bn ? post.title_bn : post.title;
  const excerpt =
    isBn && (post.excerpt_bn || post.summary_bn)
      ? post.excerpt_bn || post.summary_bn
      : post.excerpt || post.summary || "";
  const coverImage = post.cover_image || post.featured_image;
  const readingTime = post.reading_time ?? post.read_time;

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        {coverImage && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={coverImage}
              alt={title || "Blog cover"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {post.category && (
              <Badge className="absolute top-3 right-3" variant="secondary">
                {post.category}
              </Badge>
            )}
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors bn">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 bn">
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
              {readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {readingTime} {isBn ? "মিনিট" : "min"}
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
