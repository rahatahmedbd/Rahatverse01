/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { createClient } from "@/lib/supabase/server";

interface BlogPreviewProps {
  locale?: string;
}

async function getLatestPosts(limit = 3) {
  try {
    const supabase = await createClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, title_bn, excerpt, excerpt_bn, category, read_time, reading_time, published_at, featured_image, cover_image")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as any[];
  } catch {
    return [];
  }
}

function formatDate(value: string | null, isBn: boolean) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

// ── Latest from the blog (homepage, bottom) ────────────
// Secondary content on the homepage — renders nothing when no posts are
// published yet (or when Supabase is not configured), keeping the client
// acquisition sections above the fold.
export async function BlogPreview({ locale = "bn" }: BlogPreviewProps) {
  const isBn = locale === "bn";
  const posts = await getLatestPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="section-atmosphere py-8 sm:py-10 lg:py-12" aria-labelledby="latest-writing">
      <span id="latest-writing" className="sr-only">
        {isBn ? "সাম্প্রতিক লেখা" : "Latest writing"}
      </span>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={isBn ? "✍️ সাম্প্রতিক লেখা" : "✍️ Latest Writing"}
          title={isBn ? "ব্লগ থেকে" : "From the Blog"}
          titleBn={isBn ? "ব্লগ থেকে" : "From the Blog"}
          subtitle={
            isBn
              ? "ওয়েব ডেভেলপমেন্ট, প্রযুক্তি ও অভিজ্ঞতার গল্প"
              : "Notes on web development, technology and lessons learned"
          }
          locale={locale}
        />

        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {posts.map((post) => {
            const title = isBn && post.title_bn ? post.title_bn : post.title;
            const excerpt = (isBn ? post.excerpt_bn || post.excerpt : post.excerpt) || "";
            const readTime = post.read_time ?? post.reading_time ?? null;
            const image = post.featured_image || post.cover_image || null;
            return (
              <StaggerItem key={post.id}>
                <Link href={`/${locale}/blog/${post.slug}`} className="group block h-full">
                  <GlassCard className="flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                    {image && (
                      <span className="relative block aspect-[16/9] overflow-hidden rounded-t-2xl">
                        <Image
                          src={image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-5">
                      <span className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-[10px] font-semibold">
                          <Tag className="h-2.5 w-2.5" aria-hidden="true" />
                          {post.category}
                        </Badge>
                        {post.published_at && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" aria-hidden="true" />
                            {formatDate(post.published_at, isBn)}
                          </span>
                        )}
                        {readTime ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3 w-3" aria-hidden="true" />
                            {isBn ? `${readTime} মিনিট` : `${readTime} min`}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-2.5 line-clamp-2 text-[15px] font-bold leading-snug bn transition-colors group-hover:text-primary">
                        {title}
                      </span>
                      {excerpt && (
                        <span className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                          {excerpt}
                        </span>
                      )}
                    </span>
                  </GlassCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <FadeInUp delay={0.15}>
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {isBn ? "সব লেখা পড়ুন" : "Read all articles"}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
