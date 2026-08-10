import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeIn";

// Minimal inline renderer for markdown-style links written inside post
// bodies: [label](https://… or /locale/path). Everything else stays plain
// text — this is intentionally a small subset, not full markdown.
function renderInlineLinks(text: string, keyPrefix: string): ReactNode {
  const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  if (!linkPattern.test(text)) return text;
  linkPattern.lastIndex = 0;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let links = 0;
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const [, label, url] = match;
    const isExternal = /^https?:\/\//i.test(url);
    parts.push(
      <a
        key={`${keyPrefix}-link-${links++}`}
        href={url}
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

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
        // Body-level "# " headings are demoted to <h2> so the post title (an
        // <h1>) remains the only H1 on the page.
        return <h2 key={index} className="text-heading-lg font-bold mb-4 mt-8">{paragraph.slice(2)}</h2>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-heading-md font-bold mb-3 mt-6">{paragraph.slice(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mb-2 mt-4">{paragraph.slice(4)}</h3>;
      }
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        return (
          <li key={index} className="ml-6 mb-2">
            {renderInlineLinks(paragraph.slice(2), `li-${index}`)}
          </li>
        );
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-4 leading-relaxed">
          {renderInlineLinks(paragraph, `p-${index}`)}
        </p>
      );
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
          <h1 className="text-display-lg font-bold mb-4">{title}</h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <Link
                  href={`/${locale}/about`}
                  className="font-medium text-primary hover:underline"
                >
                  {author}
                </Link>
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

      {/* Author card — factual, reusable bio tied to the site entity */}
      <FadeInUp delay={0.3}>
        <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <User className="h-4 w-4 text-primary" />
              {isBn ? "লেখক সম্পর্কে" : "About the author"}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isBn
                ? "রাহাত আহমেদ — সুনামগঞ্জের একজন শিক্ষার্থী, শিক্ষক ও ওয়েব ডেভেলপার, এবং রাহাতভার্সের স্রষ্টা। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই তার লক্ষ্য।"
                : "Rahat Ahmed is a student, teacher and web developer from Sunamganj, Bangladesh, and the creator of RahatVerse."}
            </p>
            <nav
              aria-label={isBn ? "লেখকের আরও কাজ" : "More from the author"}
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm"
            >
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {isBn ? "আমার সম্পর্কে" : "About me"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {isBn ? "পোর্টফোলিও ও কেস স্টাডি" : "Portfolio & case studies"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {isBn ? "ওয়েব ডেভেলপমেন্ট সার্ভিস" : "Web development services"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </CardContent>
        </Card>
      </FadeInUp>
    </article>
  );
}
