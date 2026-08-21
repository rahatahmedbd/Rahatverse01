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
  Globe,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { HoverCard3D } from "@/components/interactive/HoverCard3D";
import { DEFAULT_PORTFOLIO_CONFIG, validatePortfolioConfig } from "@/lib/portfolio/config";
import type { PortfolioConfig, PortfolioProjectStatus } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/tracker";

// Honest lifecycle labels — a concept stays visibly a concept.
const STATUS_META: Record<
  PortfolioProjectStatus,
  { labelEn: string; labelBn: string; className: string }
> = {
  live: {
    labelEn: "Live",
    labelBn: "লাইভ",
    className:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  "in-development": {
    labelEn: "In Development",
    labelBn: "ডেভেলপমেন্ট চলছে",
    className:
      "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  concept: {
    labelEn: "Concept Project",
    labelBn: "কনসেপ্ট প্রজেক্ট",
    className: "border-dashed border-muted-foreground/40 text-muted-foreground",
  },
};

// Phase 6: conservative project → package bridge (no invented client claims)
// Maps a portfolio case-study category to a justified order package tier.
function packageForProjectCategory(category: string): string {
  switch (category) {
    case "portfolio":
      return "basic"; // personal portfolio → Basic
    case "ecommerce":
      return "premium"; // e-commerce → Premium
    case "education":
      return "standard"; // education portal → Standard
    case "blood-donation":
      return "standard"; // blood directory → Standard (organization site)
    case "business":
      return "standard";
    case "blog":
      return "basic";
    default:
      return "standard";
  }
}

function buildSimilarLabel(isBn: boolean): string {
  return isBn ? "এমন ওয়েবসাইট তৈরি করুন →" : "Build a Similar Website →";
}

// ── Live site preview ─────────────────────────────────
// For deployed projects (embedUrl set) the card embeds the REAL website in a
// lazy iframe inside a mock browser frame — no static image. A full-size link
// overlay sits on top, so clicking anywhere on the preview opens the live
// site in a new tab. If the site refuses framing, the framed backdrop with
// the domain pill still reads clearly.
function LiveSitePreview({
  embedUrl,
  liveUrl,
  title,
  isBn,
}: {
  embedUrl: string;
  liveUrl: string;
  title: string;
  isBn: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  // In development (e.g. sandboxed previews with no outbound network) start
  // with a DIRECT embed so frame-friendly sites render immediately. In
  // production start with the same-origin proxy snapshot, which works even
  // when the target blocks framing.
  const [stage, setStage] = useState<"proxy" | "direct">(
    process.env.NODE_ENV === "development" ? "direct" : "proxy"
  );
  let domain = liveUrl;
  try {
    domain = new URL(liveUrl).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw */
  }

  // Stage 1 — same-origin proxy snapshot (production default).
  // Stage 2 — direct embed from the visitor's browser: used in dev, or when
  // the proxy reports it could not fetch the target (postMessage below).
  const proxySrc = `/api/site-preview?url=${encodeURIComponent(embedUrl)}`;
  const frameSrc = stage === "proxy" ? proxySrc : embedUrl;

  // The proxy's fallback page announces itself; switch to a direct embed.
  useEffect(() => {
    if (stage !== "proxy") return;
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; url?: string } | null;
      if (data?.type === "rv-preview-fallback" && data.url === embedUrl) {
        setStage("direct");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [stage, embedUrl]);

  // If neither stage confirms a load within a reasonable window, stop the
  // endless "loading" state and tell the visitor honestly.
  useEffect(() => {
    if (loaded || failed) return;
    const timer = window.setTimeout(() => setFailed(true), 15_000);
    return () => window.clearTimeout(timer);
  }, [loaded, failed, stage]);

  const handleFrameLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    if (stage === "proxy") {
      try {
        const doc = e.currentTarget.contentDocument;
        if (doc?.body?.hasAttribute("data-preview-fallback")) {
          setStage("direct"); // server couldn't fetch — let the browser try
          return;
        }
      } catch {
        /* cross-origin surprise — treat as loaded */
      }
    }
    setLoaded(true);
    setFailed(false);
  };

  return (
    <div className="relative h-52 w-full overflow-hidden bg-card">
      {/* Backdrop — visible while loading or if the preview cannot render */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 via-card to-blue-500/[0.07]" aria-hidden="true">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Globe className={cn("h-6 w-6 text-primary", !failed && "animate-pulse")} />
        </div>
        <span className="font-mono text-xs font-semibold text-muted-foreground">{domain}</span>
        <span className="text-[10px] text-muted-foreground/70">
          {failed
            ? isBn
              ? "প্রিভিউ এখানে দেখা যাচ্ছে না — লাইভ সাইট খুলুন ↗"
              : "Preview can't render here — open the live site ↗"
            : isBn
              ? "লাইভ প্রিভিউ লোড হচ্ছে…"
              : "Loading live preview…"}
        </span>
      </div>

      {/* The real website — same-origin snapshot via /api/site-preview,
          falling back to a direct embed when the proxy can't fetch */}
      <iframe
        src={frameSrc}
        title={`${title} — ${isBn ? "লাইভ প্রিভিউ" : "live preview"}`}
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={handleFrameLoad}
        className={cn(
          "absolute inset-x-0 bottom-0 top-8 h-[calc(100%-2rem)] w-full border-0 bg-background transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Browser chrome — drawn above the iframe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-8 items-center gap-2 border-b border-white/[0.08] bg-card/85 px-3 backdrop-blur" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </span>
        <span className="flex min-w-0 items-center gap-1 rounded bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
          <Lock className="h-2.5 w-2.5 shrink-0 text-emerald-400/80" />
          <span className="truncate font-mono">{domain}</span>
        </span>
        <span className="ml-auto hidden items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-emerald-400/80 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {isBn ? "লাইভ" : "Live"}
        </span>
      </div>

      {/* Full-area click overlay — always opens the live site */}
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — ${isBn ? "লাইভ ওয়েবসাইট খুলুন" : "open the live website"}`}
        className="group/preview absolute inset-0 z-20 flex items-end justify-center pb-4 focus-visible:outline-none"
      >
        <span className="pointer-events-none inline-flex translate-y-2 items-center gap-1.5 rounded-full border border-primary/40 bg-background/85 px-3 py-1.5 text-[11px] font-semibold text-primary opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover/preview:translate-y-0 group-hover/preview:opacity-100 group-focus-visible/preview:translate-y-0 group-focus-visible/preview:opacity-100">
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          {isBn ? "লাইভ সাইট খুলুন" : "Open Live Site"}
        </span>
      </a>
    </div>
  );
}

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

interface PortfolioSectionProps {
  /** Server-loaded validated config. When provided, the full project grid is
   *  rendered in the initial HTML (crawlable) and the client refetch is
   *  skipped. Omit for legacy client-only usage (skeleton + fetch). */
  initialConfig?: PortfolioConfig;
}

export function PortfolioSection({ initialConfig }: PortfolioSectionProps) {
  const locale = useLocale();
  const isBn = locale === "bn";
  // When the server hands us the config (SSR), render the full project grid in
  // the initial HTML so crawlers see real project content. Without it — e.g. a
  // hypothetical client-only usage — keep the legacy fetch + skeleton fallback.
  const [config, setConfig] = useState<PortfolioConfig>(initialConfig ?? DEFAULT_PORTFOLIO_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(!initialConfig);

  useEffect(() => {
    // Server-loaded data is fresh per request (dynamic CMS page) — skip the
    // redundant client refetch instead of duplicating the same network call.
    if (initialConfig) return;
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
  }, [initialConfig]);

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
                {/* Subtle 3D tilt on hover (fine pointers only, reduced-motion safe) */}
                <HoverCard3D intensity={5} className="h-full overflow-visible rounded-2xl">
                <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)]">
                  {project.embedUrl && project.embedUrl !== "" ? (
                    <LiveSitePreview
                      embedUrl={project.embedUrl}
                      liveUrl={project.liveUrl}
                      title={titleText}
                      isBn={isBn}
                    />
                  ) : (
                    <ProjectImage
                      src={project.image}
                      alt={titleText}
                      category={project.category}
                    />
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-primary border-primary/30">
                          {project.category}
                        </Badge>
                        {project.status && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase tracking-wider font-semibold",
                              STATUS_META[project.status].className
                            )}
                          >
                            {isBn
                              ? STATUS_META[project.status].labelBn
                              : STATUS_META[project.status].labelEn}
                          </Badge>
                        )}
                      </div>
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
                    {/* Case-study excerpt — shown in full so the honest project
                        context (problem, scope, current status) stays visible. */}
                    {project.longDescription && (
                      <p className="mb-4 text-xs leading-relaxed text-muted-foreground/90 italic border-l-2 border-primary/30 pl-2.5">
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

                    {/* Phase 6: Portfolio → Order bridge — contextual commercial CTA */}
                    {(() => {
                      const tier = packageForProjectCategory(project.category);
                      const href = `/${locale}/order?package=${encodeURIComponent(tier)}#order-checkout`;
                      return (
                        <Link
                          href={href}
                          onClick={() =>
                            trackEvent("portfolio_project_click", {
                              category: "conversion",
                              label: project.id,
                              metadata: { project_id: project.id, location: "portfolio_card_build_similar", locale },
                            })
                          }
                          className="group/link mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bn"
                          aria-label={buildSimilarLabel(isBn)}
                        >
                          <span>{buildSimilarLabel(isBn)}</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      );
                    })()}

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
                          onClick={(e) => {
                            if (project.liveUrl === "#") {
                              e.preventDefault();
                              return;
                            }
                            trackEvent("portfolio_project_click", {
                              category: "conversion",
                              label: project.id,
                              metadata: { project_id: project.id, location: "portfolio_card_live_demo", locale },
                            });
                          }}
                          className={cn(
                            "flex items-center justify-center gap-1.5",
                            project.liveUrl === "#" && "pointer-events-none opacity-60"
                          )}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {project.liveUrl !== "#"
                            ? isBn
                              ? "লাইভ ডেমো"
                              : "Live Demo"
                            : isBn
                              ? "এখনো লাইভ নয়"
                              : "Not Live Yet"}
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
                          onClick={() =>
                            trackEvent("portfolio_project_click", {
                              category: "conversion",
                              label: project.id,
                              metadata: {
                                project_id: project.id,
                                location: project.githubUrl !== "#" ? "portfolio_card_github" : "portfolio_card_inquire",
                                locale,
                              },
                            })
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
                </HoverCard3D>
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
