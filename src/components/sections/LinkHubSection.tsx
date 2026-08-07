"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { ExternalLink, Download, Loader2 } from "lucide-react";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import { LinkIcon } from "@/lib/links/icons";
import type { LinksConfig } from "@/types/links";

// ── Link Hub Section (DB-driven) ───────────────────────
interface LinkHubSectionProps {
  locale?: string;
}

export function LinkHubSection({ locale = "bn" }: LinkHubSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<LinksConfig>(DEFAULT_LINKS_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/links-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateLinksConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const trackClick = (id: string) => {
    fetch("/api/links/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {
      /* non-blocking */
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "লিংক লোড হচ্ছে..." : "Loading links..."}
      </div>
    );
  }

  const { section, profile, links, tools, resume } = config;
  const visibleLinks = links.filter((link) => link.visible);
  const visibleTools = tools.filter((tool) => tool.visible);
  const cvUrl = isBn ? resume.cvBnUrl || resume.cvEnUrl : resume.cvEnUrl || resume.cvBnUrl;
  const hasCv = Boolean(cvUrl);

  const toolCategories = [
    { key: "development", label: isBn ? "ডেভেলপমেন্ট" : "Development" },
    { key: "design", label: isBn ? "ডিজাইন" : "Design" },
    { key: "productivity", label: isBn ? "প্রোডাক্টিভিটি" : "Productivity" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        {/* Profile */}
        <FadeInUp>
          <div className="mb-8 text-center">
            <div className="bg-brand-gradient-soft gradient-border mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={isBn ? profile.nameBn : profile.nameEn} className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-amber-400">{profile.initials}</span>
              )}
            </div>
            <h3 className="text-xl font-bold bn">{isBn ? profile.nameBn : profile.nameEn}</h3>
            <p className="text-sm text-muted-foreground">{isBn ? profile.nameEn : profile.nameBn}</p>
            {(isBn ? profile.taglineBn : profile.taglineEn) && (
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? profile.taglineBn : profile.taglineEn}</p>
            )}
          </div>
        </FadeInUp>

        {/* Links */}
        <StaggerContainer className="space-y-3">
          {visibleLinks.map((link) => (
            <StaggerItem key={link.id}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => trackClick(link.id)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor || "bg-primary/10"}`}>
                  <LinkIcon name={link.icon} className={`h-5 w-5 ${link.color || "text-primary"}`} />
                </div>
                <span className="flex-1 font-medium bn">{isBn ? link.labelBn : link.labelEn}</span>
                {link.clicks > 0 && (
                  <span className="text-[10px] text-muted-foreground">{(link.clicks ?? 0).toLocaleString()}×</span>
                )}
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tools */}
        {visibleTools.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold bn">{isBn ? config.toolsSectionTitleBn : config.toolsSectionTitleEn}</h3>
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? config.toolsSectionSubtitleBn : config.toolsSectionSubtitleEn}</p>
            </div>
            <div className="space-y-4">
              {toolCategories.map((category) => {
                const items = visibleTools.filter((t) => t.category === category.key);
                if (items.length === 0) return null;
                return (
                  <div key={category.key}>
                    <Badge variant="outline" className="mb-2">{category.label}</Badge>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((tool) => (
                        <a
                          key={tool.id}
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30"
                        >
                          <p className="font-medium bn">{isBn ? tool.nameBn : tool.nameEn}</p>
                          {(isBn ? tool.descriptionBn : tool.descriptionEn) && (
                            <p className="mt-0.5 text-xs text-muted-foreground bn">{isBn ? tool.descriptionBn : tool.descriptionEn}</p>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resume Download */}
        <FadeInUp delay={0.3}>
          <div className="mt-8">
            <GlassCard className="text-center">
              <Download className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 font-semibold bn">{isBn ? resume.sectionTitleBn : resume.sectionTitleEn}</p>
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? resume.sectionSubtitleBn : resume.sectionSubtitleEn}</p>
              {hasCv ? (
                <a
                  href={cvUrl}
                  target={resume.previewInBrowser ? "_blank" : undefined}
                  download={resume.previewInBrowser ? undefined : true}
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  {isBn ? resume.downloadLabelBn : resume.downloadLabelEn}
                </a>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">{isBn ? resume.comingSoonBn : resume.comingSoonEn}</p>
              )}
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
