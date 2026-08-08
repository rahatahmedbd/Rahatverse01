"use client";

import { useState, useEffect } from "react";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState, CardSkeleton } from "@/components/ui";
import {
  ExternalLink,
  Code,
  Palette,
  ShoppingBag,
  GraduationCap,
  Eye,
  Search,
  Tag,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { DEFAULT_PORTFOLIO_CONFIG, validatePortfolioConfig } from "@/lib/portfolio/config";
import type { PortfolioConfig } from "@/types/portfolio";
import { cn } from "@/lib/utils";

function ProjectImage({
  src,
  alt,
  category,
}: {
  src: string;
  alt: string;
  category: string;
}) {
  const [hasError, setHasError] = useState(false);
  const CategoryMap: Record<string, typeof Code> = {
    portfolio: Code,
    ecommerce: ShoppingBag,
    education: GraduationCap,
    "blood-donation": Code,
    business: Palette,
    blog: Code,
  };
  const Icon = CategoryMap[category] ?? Code;

  // Cloudinary or valid remote image check
  const isMissing = !src || src.startsWith("/projects/") || hasError;

  if (isMissing) {
    return (
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-card to-amber-500/10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground bn">
            {alt} — Case Study Preview
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="bg-background/80 text-xs font-medium backdrop-blur">
            {category}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-52 overflow-hidden bg-card">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.04]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        onError={() => setHasError(true)}
      />
      <div className="absolute right-3 top-3">
        <Badge variant="secondary" className="bg-background/80 text-xs font-medium backdrop-blur shadow-sm">
          {category}
        </Badge>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

export function PortfolioSection() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const [config, setConfig] = useState<PortfolioConfig>(DEFAULT_PORTFOLIO_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portfolio-config", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validatePortfolioConfig((json as { data?: unknown } | null)?.data);
        // Only adopt a fetched config if it actually contains projects; a blank
        // stored config (empty DB row) must not wipe out the seeded placeholders.
        if (validated && validated.projects.filter((p) => p.visible).length > 0) {
          setConfig(validated);
        }
      })
      .catch(() => {
        /* fallback to DEFAULT_PORTFOLIO_CONFIG */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProjects = config.projects.filter((p) => p.visible);
  const visibleCategories = config.categories.filter((c) => c.visible);

  const filteredProjects = visibleProjects.filter((project) => {
    const matchesCat =
      selectedCategory === "all" || project.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.titleBn.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.descriptionBn.toLowerCase().includes(q) ||
      project.tags.some((t) => t.toLowerCase().includes(q)) ||
      (project.tagsBn && project.tagsBn.some((t) => t.toLowerCase().includes(q)));

    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-10">
      {/* Category Filter & Keyword Search */}
      <FadeInUp>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((cat) => (
              <Button
                key={cat.id}
                type="button"
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "rounded-full text-xs font-medium transition-all",
                  selectedCategory === cat.value && "shadow-sm shadow-primary/30"
                )}
              >
                <Tag className="mr-1.5 h-3.5 w-3.5" />
                {isBn ? cat.labelBn : cat.labelEn}
              </Button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                isBn
                  ? "প্রজেক্ট বা টেকনোলজি খুঁজুন..."
                  : "Search projects or tech stack..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm rounded-xl"
            />
          </div>
        </div>
      </FadeInUp>

      {/* Case Studies Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <FadeInUp>
          <EmptyState
            icon={FolderOpen}
            title={
              isBn ? "কোনো প্রজেক্ট পাওয়া যায়নি" : "No case studies found"
            }
            description={
              searchQuery || selectedCategory !== "all"
                ? isBn
                  ? "আপনার ফিল্টারের সাথে কোনো প্রজেক্ট বা কেস স্টাডির মিল নেই। অন্য ক্যাটাগরি চেষ্টা করুন।"
                  : "No case studies match your search or filter criteria. Try viewing all categories."
                : isBn
                  ? "এই মুহূর্তে কোনো প্রজেক্ট যুক্ত করা হয়নি। শীঘ্রই নতুন কেস স্টাডি প্রকাশিত হবে।"
                  : "No projects have been published yet. More case studies will be added soon."
            }
            action={
              searchQuery || selectedCategory !== "all"
                ? {
                    label: isBn ? "সব প্রজেক্ট দেখুন" : "Reset Filters",
                    onClick: () => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    },
                  }
                : undefined
            }
          />
        </FadeInUp>
      ) : (
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const titleText = isBn ? project.titleBn : project.title;
            const descText = isBn ? project.descriptionBn : project.description;
            const longDesc = isBn
              ? project.longDescriptionBn || descText
              : project.longDescription || descText;
            const tagsList = isBn ? project.tagsBn || project.tags : project.tags;

            return (
              <StaggerItem key={project.id}>
                <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)]">
                  <ProjectImage
                    src={project.image}
                    alt={titleText}
                    category={project.category}
                  />

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-primary border-primary/30">
                        {project.category}
                      </Badge>
                      {project.completedAt && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {project.completedAt}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-1 text-base sm:text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                      {titleText}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {descText}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col pt-0">
                    {/* Excerpt if present */}
                    {project.longDescription && (
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground/90 italic border-l-2 border-primary/30 pl-2.5">
                        {longDesc}
                      </p>
                    )}

                    {/* Tech Stack Badges */}
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {tagsList.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="rounded-lg bg-primary/10 text-primary hover:bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium border border-primary/15"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Live & GitHub Action Links */}
                    <div className="mt-auto flex gap-2.5 pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        asChild
                        className="flex-1 rounded-xl shadow-sm font-medium"
                        disabled={project.liveUrl === "#"}
                      >
                        <a
                          href={project.liveUrl !== "#" ? project.liveUrl : undefined}
                          target={project.liveUrl !== "#" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          aria-disabled={project.liveUrl === "#"}
                          onClick={(e) => project.liveUrl === "#" && e.preventDefault()}
                          className={cn(
                            "flex items-center justify-center gap-1.5",
                            project.liveUrl === "#" && "pointer-events-none opacity-60"
                          )}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {isBn ? "লাইভ ডেমো" : "Live Demo"}
                        </a>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 rounded-xl font-medium border-border/80 hover:border-primary/50"
                      >
                        <a
                          href={
                            project.githubUrl !== "#"
                              ? project.githubUrl
                              : `/${locale}/contact`
                          }
                          target={project.githubUrl !== "#" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5"
                        >
                          {project.githubUrl !== "#" ? (
                            <>
                              <Code className="h-3.5 w-3.5 text-primary" />
                              {isBn ? "গিটহাব কোড" : "GitHub Code"}
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              {isBn ? "যোগাযোগ" : "Inquire"}
                            </>
                          )}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* CTA Section */}
      <FadeInUp className="mt-14">
        <Card className="overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-amber-500/5 shadow-xl">
          <CardContent className="px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 mb-4 border border-primary/20">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {isBn ? "আপনার প্রজেক্টের পালা" : "Your Turn To Build"}
              </span>
            </div>

            <h2 className="text-heading-sm sm:text-heading-md font-bold tracking-tight">
              {isBn
                ? "আপনার আইডিয়াকে আধুনিক ওয়েব অ্যাপ্লিকেশনে রূপ দিতে চান?"
                : "Ready to Transform Your Idea Into a Custom Web Application?"}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              {isBn
                ? "দ্রুতগতি, আধুনিক আর্কিটেকচার এবং সাশ্রয়ী প্যাকেজ — আজই আপনার প্রজেক্ট নিয়ে আলোচনা করুন।"
                : "From concept to scalable deployment with Next.js and Supabase. Let's discuss your custom requirements today."}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" variant="gradient" asChild className="w-full sm:w-auto rounded-xl">
                <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2">
                  {isBn ? "প্রজেক্ট আলোচনা করুন" : "Discuss Your Project"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto rounded-xl">
                <Link href={`/${locale}/order`} className="inline-flex items-center justify-center gap-2">
                  {isBn ? "প্যাকেজ দেখুন" : "View Packages & Pricing"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
