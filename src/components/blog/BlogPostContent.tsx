"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeIn";

interface BlogPostContentProps {
  title: string;
  content: string;
  author?: string;
  publishedAt?: string;
  readingTime?: number;
  category?: string;
  tags?: string[];
  locale?: string;
}

export default function BlogPostContent({
  title,
  content,
  author,
  publishedAt,
  readingTime,
  category,
  tags,
  locale = "bn",
}: BlogPostContentProps) {
  const isBn = locale === "bn";

  // Simple markdown-like rendering (can be enhanced with proper markdown library)
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-4 mt-8">{paragraph.slice(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mb-3 mt-6">{paragraph.slice(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{paragraph.slice(4)}</h3>;
      }
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        return <li key={index} className="ml-6 mb-2">{paragraph.slice(2)}</li>;
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
    });
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <FadeInUp>
        <div className="mb-8">
          {category && (
            <Badge variant="secondary" className="mb-4">
              {category}
            </Badge>
          )}
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(publishedAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US')}</span>
              </div>
            )}
            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} {isBn ? 'মিনিট পড়া' : 'min read'}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FadeInUp>

      {/* Content */}
      <FadeInUp delay={0.2}>
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {renderContent(content)}
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </article>
  );
}
