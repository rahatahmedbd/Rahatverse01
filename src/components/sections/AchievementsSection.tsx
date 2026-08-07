"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { Counter } from "@/components/animations/Counter";
import { FadeInUp } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Sparkles, Volume2 } from "lucide-react";
import { ACHIEVEMENT_ICON_MAP } from "@/lib/about/icons";
import { DEFAULT_ABOUT_CONFIG } from "@/lib/about/config";
import type { AboutAchievement, AboutConfig, AchievementRarity } from "@/types/about";

// ── Achievements Section ───────────────────────────────
interface AchievementsSectionProps {
  locale?: string;
  config?: AboutConfig;
}

const rarityStyles: Record<AchievementRarity, string> = {
  common: "border-border/50 hover:border-green-500/30",
  rare: "border-border/50 hover:border-blue-500/30",
  epic: "border-border/50 hover:border-purple-500/30",
  legendary: "border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-500/10",
};

function getRarityBadge(rarity: AchievementRarity, isBn: boolean) {
  const labels: Record<AchievementRarity, { bn: string; en: string; variant: "success" | "info" | "warning" | "gradient" }> = {
    common: { bn: "সাধারণ", en: "Common", variant: "success" },
    rare: { bn: "বিরল", en: "Rare", variant: "info" },
    epic: { bn: "মহাকাব্যিক", en: "Epic", variant: "warning" },
    legendary: { bn: "কিংবদন্তি", en: "Legendary", variant: "gradient" },
  };
  const label = labels[rarity];
  return { label: isBn ? label.bn : label.en, variant: label.variant };
}

function playUnlockTone() {
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(990, context.currentTime + 0.12);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
  window.setTimeout(() => void context.close(), 250);
}

function AchievementCard({ achievement, locale, index }: { achievement: AboutAchievement; locale: string; index: number }) {
  const isBn = locale === "bn";
  const Icon = ACHIEVEMENT_ICON_MAP[achievement.icon];
  const rarityBadge = getRarityBadge(achievement.rarity, isBn);
  const title = isBn ? achievement.titleBn : achievement.titleEn;
  const description = isBn ? achievement.descriptionBn : achievement.descriptionEn;
  const criteria = isBn ? achievement.unlockCriteriaBn : achievement.unlockCriteriaEn;
  const year = isBn ? achievement.yearBn : achievement.yearEn;
  const completedLabel = isBn ? "সম্পন্ন" : "Completed";
  const certificateLabel = isBn ? "সার্টিফিকেট দেখুন" : "View certificate";
  const handleOpen = () => {
    if (achievement.sound) playUnlockTone();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <GlassCard
        className={`group h-full transition-all duration-300 hover:scale-[1.02] ${rarityStyles[achievement.rarity]}`}
        onClick={achievement.sound ? handleOpen : undefined}
        onKeyDown={
          achievement.sound
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") handleOpen();
              }
            : undefined
        }
        role={achievement.sound ? "button" : undefined}
        tabIndex={achievement.sound ? 0 : undefined}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                achievement.rarity === "legendary"
                  ? "bg-amber-500/20"
                  : achievement.rarity === "epic"
                    ? "bg-purple-500/20"
                    : achievement.rarity === "rare"
                      ? "bg-blue-500/20"
                      : "bg-green-500/20"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  achievement.rarity === "legendary"
                    ? "text-amber-500"
                    : achievement.rarity === "epic"
                      ? "text-purple-500"
                      : achievement.rarity === "rare"
                        ? "text-blue-500"
                        : "text-green-500"
                }`}
              />
            </div>
            <Badge variant={rarityBadge.variant} className="text-[10px]">
              <Sparkles className={`mr-1 h-2.5 w-2.5 ${achievement.sparkle ? "animate-pulse" : ""}`} />
              {rarityBadge.label}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{year}</span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {completedLabel}: {achievement.completedAt}
          </span>
          {achievement.sound && (
            <span className="inline-flex items-center gap-1 text-primary" title={isBn ? "শব্দ চালু" : "Sound enabled"}>
              <Volume2 className="h-3 w-3" />
              {isBn ? "সাউন্ড" : "Sound"}
            </span>
          )}
        </div>

        <h3 className="font-semibold bn">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground bn">{description}</p>
        <p className="mt-3 border-t border-border/30 pt-3 text-xs text-muted-foreground bn">
          <span className="font-semibold text-primary">{isBn ? "মানদণ্ড:" : "Unlock:"}</span> {criteria}
        </p>

        {achievement.certificateUrl && (
          <a
            href={achievement.certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {certificateLabel}
          </a>
        )}
      </GlassCard>
    </motion.div>
  );
}

export function AchievementsSection({ locale = "bn", config }: AchievementsSectionProps) {
  const isBn = locale === "bn";
  const about = config ?? DEFAULT_ABOUT_CONFIG;

  if (!about.visible) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? about.achievementsSection.badgeBn : about.achievementsSection.badgeEn}
          title={about.achievementsSection.titleEn}
          titleBn={about.achievementsSection.titleBn}
          subtitle={
            isBn
              ? about.achievementsSection.subtitleBn
              : about.achievementsSection.subtitleEn
          }
          locale={locale}
        />

        {/* Admin-controlled achievement statistics */}
        <FadeInUp>
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {about.achievementStats.map((stat) => (
              <GlassCard key={stat.id} className="text-center">
                <Counter
                  to={stat.id === "total" ? about.achievements.length : stat.value}
                  suffix={stat.suffix}
                  className="text-3xl font-bold text-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground bn">
                  {isBn ? stat.labelBn : stat.labelEn}
                </p>
              </GlassCard>
            ))}
          </div>
        </FadeInUp>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              locale={locale}
              index={index}
            />
          ))}
        </div>

        {about.achievements.length === 0 && (
          <GlassCard className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "এখনও কোনো অর্জন যোগ করা হয়নি।" : "No achievements have been added yet."}
          </GlassCard>
        )}
      </div>
    </section>
  );
}
