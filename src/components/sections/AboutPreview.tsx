import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { ABOUT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";
import { UserRound, ArrowRight, MapPin, BookOpen, Code2, Rocket } from "lucide-react";
import Link from "next/link";
import { RahatPortrait } from "./RahatPortrait";
import { HoverCard3D } from "@/components/interactive/HoverCard3D";

interface AboutPreviewProps {
  locale?: string;
  config?: AboutConfig;
}

// Homepage "About" preview — deliberately client-focused.
// Deep personal details (education, blood group, BNCC, birth date…) live on
// the /about page; here we show only what a potential client needs to trust
// the developer: who they are, what they build, where they are, languages.
const HOMEPAGE_INFO_IDS = new Set(["location", "languages"]);

export function AboutPreview({ locale = "bn", config }: AboutPreviewProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  // Quick professional facts — static so the section stays meaningful even
  // before CMS content loads.
  const quickFacts = [
    { icon: Code2, label: isBn ? "Next.js • React • TypeScript" : "Next.js • React • TypeScript" },
    { icon: MapPin, label: isBn ? "সুনামগঞ্জ, বাংলাদেশ — রিমোটলি কাজ করি" : "Sunamganj, Bangladesh — working remotely" },
    { icon: BookOpen, label: isBn ? "বাংলা ও ইংরেজি" : "Bangla & English" },
  ];

  // CMS-driven personal info is filtered to client-relevant basics only.
  const clientFacingInfo = about.personalInfo.filter((card) => HOMEPAGE_INFO_IDS.has(card.id));

  return (
    <section className="section-atmosphere py-8 sm:py-10 lg:py-12">
      <UserRound className="section-watermark -right-5 top-10 sm:right-[6%]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={isBn ? about.section.badgeBn : about.section.badgeEn}
          title={about.section.titleEn}
          titleBn={about.section.titleBn}
          subtitle={
            isBn
              ? "সুনামগঞ্জের ওয়েব ডেভেলপার — ব্যবসা ও ব্যক্তিগত ব্র্যান্ডের জন্য আধুনিক ওয়েবসাইট বানাই"
              : "A web developer from Sunamganj — building modern websites for businesses and personal brands"
          }
          locale={locale}
        />

        <div className="mx-auto max-w-4xl">
          {/* Professional summary + quick facts — compact two-column card */}
          <FadeInUp delay={0.1}>
            <HoverCard3D intensity={6} className="rounded-xl">
            <GlassCard className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
                {/* Small photo — secondary on the homepage */}
                <div className="mx-auto flex items-center gap-3 sm:mx-0 sm:flex-col sm:gap-2">
                  <RahatPortrait
                    locale={locale}
                    src={about.profileImage.url || undefined}
                    alt={isBn ? about.profileImage.altBn : about.profileImage.altEn}
                    className="h-20 w-20 shrink-0 ring-2 ring-primary/40 shadow-lg shadow-primary/20 sm:h-24 sm:w-24"
                    sizes="96px"
                    rounded="2xl"
                  />
                  <Badge variant="glow" className="bn whitespace-nowrap text-xs">
                    {isBn ? "ওয়েব ডেভেলপার" : "Web Developer"}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold leading-snug bn sm:text-lg">
                    {isBn
                      ? "আমি রাহাত আহমেদ — রাহাতভার্সের স্রষ্টা"
                      : "I'm Rahat Ahmed — the creator of RahatVerse"}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground bn sm:text-[15px]">
                    {isBn
                      ? "ছোট ব্যবসা ও ব্যক্তিগত ব্র্যান্ডের জন্য দ্রুত, রেসপনসিভ ও SEO-রেডি ওয়েবসাইট তৈরি করি। প্রতিটি প্রজেক্টে সরাসরি ডেভেলপারের সাথে কাজ করেন — কোনো মধ্যস্থতাকারী নেই।"
                      : "I build fast, responsive, SEO-ready websites for small businesses and personal brands. On every project you work directly with the developer — no middlemen."}
                  </p>
                  <StaggerGrid
                    columns="grid-cols-1 sm:grid-cols-3"
                    gap="gap-2.5"
                    className="mt-4"
                  >
                    {quickFacts.map((fact) => (
                      <StaggerItem key={fact.label}>
                        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2">
                          <fact.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="text-xs font-medium leading-tight bn">{fact.label}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                </div>
              </div>
            </GlassCard>
            </HoverCard3D>
          </FadeInUp>

          {/* CMS quick facts (location / languages only on the homepage) */}
          {clientFacingInfo.length > 0 && (
            <StaggerGrid
              columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
              gap="gap-3 sm:gap-4"
              className="mt-4"
            >
              {clientFacingInfo.map((card) => {
                const Icon = ABOUT_ICON_MAP[card.icon];
                return (
                  <StaggerItem key={card.id}>
                    <GlassCard className="h-full min-h-[96px] p-4 text-center">
                      <span className="icon-frame mx-auto mb-2.5 h-9 w-9 rounded-xl sm:h-10 sm:w-10">
                        <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
                      </span>
                      <p className="text-[11px] font-medium leading-tight text-muted-foreground sm:text-xs">
                        {isBn ? card.labelBn : card.labelEn}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-tight bn sm:text-sm">
                        {isBn ? card.valueBn : card.valueEn}
                      </p>
                    </GlassCard>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          )}

          {/* Quote — compact */}
          <div className="mt-5 sm:mt-6">
            <HoverCard3D intensity={5} className="rounded-xl">
            <GlassCard className="border-l-4 border-l-primary p-6 text-center sm:p-8">
              <p className="text-base italic leading-relaxed text-muted-foreground bn sm:text-lg">
                &ldquo;{isBn ? about.biography.quote.bn : about.biography.quote.en}&rdquo;
              </p>
              <Badge variant="glow" className="mt-4">
                {isBn ? about.biography.quoteBy.bn : about.biography.quoteBy.en}
              </Badge>
            </GlassCard>
            </HoverCard3D>
          </div>
        </div>

        {/* Entity-strong internal link — homepage preview → canonical About page.
            Signature "aurora button": a slowly spinning rainbow ring, gradient
            label, and a hover shine sweep. The ring renders paused and the
            AnimationGovernor resumes it only while visible; reduced-motion
            users get a calm static rainbow ring. */}
        <FadeInUp delay={0.15}>
          <div className="mt-6 text-center sm:mt-8">
            <Link
              href={`/${locale}/about`}
              data-fx
              className="btn-aurora group inline-flex transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(245,158,11,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="btn-aurora-core inline-flex min-h-[50px] items-center gap-2.5 overflow-hidden px-7 py-3 text-sm font-semibold sm:text-[15px]">
                {/* Shine sweep across the pill on hover (transform-only) */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
                  <span className="absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />
                </span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  aria-hidden="true"
                >
                  <Rocket className="h-4 w-4" />
                </span>
                <span className="bn text-gradient">
                  {isBn ? "রাহাত আহমেদ সম্পর্কে আরও জানুন" : "Learn more about Rahat Ahmed"}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
