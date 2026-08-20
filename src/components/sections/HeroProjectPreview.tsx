"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Lock, CheckCircle2, Code2 } from "lucide-react";
import type { AboutConfig } from "@/types/about";
import { trackEvent } from "@/lib/analytics/tracker";

interface HeroProjectPreviewProps {
  locale?: string;
  aboutConfig?: AboutConfig;
}

// ── Hero visual: the WORK is the hero ──────────────────
// A mock browser window showing a live project, with the developer's photo as
// a small secondary chip. Clients buy outcomes — the preview leads, the face
// supports it.
export function HeroProjectPreview({ locale = "bn", aboutConfig }: HeroProjectPreviewProps) {
  const isBn = locale === "bn";
  const prefersReducedMotion = Boolean(useReducedMotion());

  const photoUrl = aboutConfig?.profileImage?.url || "";

  const techChips = ["Next.js", "React", "TypeScript", "Tailwind CSS"];

  return (
    <div className="relative mx-auto w-full max-w-[560px]" data-testid="hero-project-preview">
      {/* Subtle ambient glow behind the window */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/[0.08] via-transparent to-blue-500/[0.06] blur-2xl"
        aria-hidden="true"
      />

      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.96 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35),0_4px_16px_rgba(0,0,0,0.2)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-card/70 px-4 py-2.5" aria-hidden="true">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3 shrink-0 text-emerald-400/80" />
            <span className="truncate font-mono">rahatahmed.site</span>
          </div>
          <Code2 className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        </div>

        {/* Website screenshot — the actual project preview */}
        <a
          href="https://rahatahmed.site"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("cta_click", {
              category: "conversion",
              label: "hero_project_preview",
              metadata: { cta_id: "hero_project_preview", location: "hero", locale },
            })
          }
          aria-label={isBn ? "লাইভ প্রজেক্ট দেখুন — rahatahmed.site" : "View live project — rahatahmed.site"}
          className="group relative block aspect-[16/10] bg-card"
        >
          <Image
            src="/images/project-preview.png"
            alt={isBn ? "আধুনিক ওয়েবসাইট প্রিভিউ — রাহাত আহমেদের প্রজেক্ট" : "Modern website preview — a project by Rahat Ahmed"}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 560px"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Live badge */}
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {isBn ? "লাইভ" : "Live"}
          </span>
        </a>

        {/* Bottom strip — status + the developer (secondary) */}
        <div className="flex items-center gap-3 border-t border-white/[0.07] bg-card/70 px-4 py-3">
          {photoUrl ? (
            <span
              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40"
              aria-hidden="true"
            >
              <Image src={photoUrl} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/40"
              aria-hidden="true"
            >
              RA
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight bn">
              {isBn ? "রাহাত আহমেদ" : "Rahat Ahmed"}
            </p>
            <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" aria-hidden="true" />
              {isBn ? "ওয়েব ডেভেলপার — কাজ করার জন্য প্রস্তুত" : "Web Developer — available for work"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating tech chips — gentle, reduced-motion safe */}
      <motion.div
        className="pointer-events-none absolute -right-3 -top-4 hidden rounded-xl border border-white/10 bg-card/85 px-3 py-2 shadow-lg backdrop-blur sm:block md:-right-6"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: [0, -6, 0] }
        }
        transition={
          prefersReducedMotion
            ? { delay: 0.6 }
            : { delay: 0.9, duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
        aria-hidden="true"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {isBn ? "টেক স্ট্যাক" : "Tech Stack"}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {techChips.slice(0, 2).map((chip) => (
            <span key={chip} className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {chip}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-4 -left-3 hidden rounded-xl border border-white/10 bg-card/85 px-3 py-2 shadow-lg backdrop-blur sm:block md:-left-6"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: [0, 6, 0] }
        }
        transition={
          prefersReducedMotion
            ? { delay: 0.7 }
            : { delay: 1.05, duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        aria-hidden="true"
      >
        <div className="flex flex-wrap gap-1">
          {techChips.slice(2).map((chip) => (
            <span key={chip} className="rounded-md bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400">
              {chip}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
