"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { Counter } from "@/components/animations/Counter";
import { FadeInUp } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star, Sparkles } from "lucide-react";

// ── Achievements Section ───────────────────────────────
interface AchievementsSectionProps {
  locale?: string;
}

interface Achievement {
  year: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  icon: "trophy" | "medal" | "award" | "star";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function AchievementsSection({ locale = "bn" }: AchievementsSectionProps) {
  const isBn = locale === "bn";

  const iconMap = {
    trophy: Trophy,
    medal: Medal,
    award: Award,
    star: Star,
  };

  const rarityStyles = {
    common: "border-border/50 hover:border-green-500/30",
    rare: "border-border/50 hover:border-blue-500/30",
    epic: "border-border/50 hover:border-purple-500/30",
    legendary: "border-amber-500/30 hover:border-amber-500/50 shadow-md shadow-amber-500/10",
  };

  const rarityBadges = {
    common: { label: isBn ? "সাধারণ" : "Common", variant: "success" as const },
    rare: { label: isBn ? "বিরল" : "Rare", variant: "info" as const },
    epic: { label: isBn ? "মহাকাব্যিক" : "Epic", variant: "warning" as const },
    legendary: { label: isBn ? "কিংবদন্তি" : "Legendary", variant: "gradient" as const },
  };

  const achievements: Achievement[] = [
    {
      year: "২০২৫",
      title: "SSC — GPA 5.00 (A+)",
      titleBn: "SSC — জিপিএ ৫.০০ (A+)",
      description: "Science department, special recognition from Shantichakra Blood Society",
      descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+)। শান্তিচক্র ব্লাড সোসাইটি কর্তৃক বিশেষ সম্মাননা।",
      icon: "trophy",
      rarity: "legendary",
    },
    {
      year: "২০২৫",
      title: "46th National Science Fair",
      titleBn: "৪৬তম বিজ্ঞান মেলা",
      description: "1st in Quiz, 3rd in Project, 4th in Olympiad",
      descriptionBn: "বিজ্ঞান কুইজে ১ম, প্রজেক্টে ৩য়, অলিম্পিয়াডে ৪র্থ স্থান।",
      icon: "trophy",
      rarity: "epic",
    },
    {
      year: "২০২৫",
      title: "Outstanding Student Honor",
      titleBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
      description: "Among 3 top A+ students, received honor crest and financial support",
      descriptionBn: "A+ প্রাপ্ত তিনজন কৃতী শিক্ষার্থীর অন্যতম। সম্মাননা ক্রেস্ট ও আর্থিক সহায়তা।",
      icon: "award",
      rarity: "legendary",
    },
    {
      year: "২০২৫",
      title: "Shantichakra Honor Crest",
      titleBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
      description: "Received honor crest for achieving A+ in SSC",
      descriptionBn: "SSC-তে A+ অর্জনের জন্য শান্তিচক্র ব্লাড সোসাইটি কর্তৃক সম্মাননা স্মারক।",
      icon: "medal",
      rarity: "epic",
    },
    {
      year: "২০২৪",
      title: "Creative Talent Search — 1st in Science",
      titleBn: "সৃজনশীল মেধা অন্বেষণ — বিজ্ঞানে ১ম",
      description: "First place in Creative Talent Search competition in Science",
      descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান।",
      icon: "star",
      rarity: "rare",
    },
    {
      year: "২০২৪",
      title: "44th Science Exhibition — 1st Place",
      titleBn: "৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান",
      description: "Second consecutive first place in national science exhibition",
      descriptionBn: "জাতীয় বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন।",
      icon: "trophy",
      rarity: "epic",
    },
    {
      year: "২০২৩",
      title: "45th National Science Fair",
      titleBn: "৪৫তম বিজ্ঞান মেলা",
      description: "1st in Quiz, 2nd in Speech, 3rd in Science Project",
      descriptionBn: "বিজ্ঞান কুইজে ১ম, উপস্থিত বক্তৃতায় ২য়, বিজ্ঞান প্রজেক্টে ৩য় স্থান।",
      icon: "trophy",
      rarity: "rare",
    },
    {
      year: "২০২০",
      title: "42nd National Science Fair — 1st Place",
      titleBn: "৪২তম বিজ্ঞান মেলা — ১ম স্থান",
      description: "First ever win at the national science fair, district level",
      descriptionBn: "জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে উপজেলা পর্যায়ে প্রথম স্থান অর্জন।",
      icon: "trophy",
      rarity: "rare",
    },
    {
      year: "২০১৯",
      title: "PSC — GPA 5.00",
      titleBn: "PSC — জিপিএ ৫.০০",
      description: "Passed PSC examination with perfect GPA 5.00",
      descriptionBn: "জিপিএ ৫.০০ পেয়ে PSC পরীক্ষায় উত্তীর্ণ।",
      icon: "award",
      rarity: "rare",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🏆 স্বীকৃতি ও পুরস্কার" : "🏆 Recognition & Awards"}
          title="Achievements"
          titleBn="অর্জনসমূহ"
          subtitle={
            isBn
              ? "বিজ্ঞান, শিক্ষা এবং সমাজসেবায় অর্জিত সম্মাননা ও পুরস্কারসমূহ"
              : "Awards and recognition in science, education, and social service"
          }
          locale={locale}
        />

        {/* Stats Row */}
        <FadeInUp>
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <GlassCard className="text-center">
              <Counter to={10} suffix="+" className="text-3xl font-bold text-primary" />
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? "মোট অর্জন" : "Total"}</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Counter to={5} suffix="×" className="text-3xl font-bold text-primary" />
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? "১ম স্থান" : "1st Places"}</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Counter to={3} suffix="×" className="text-3xl font-bold text-primary" />
              <p className="mt-1 text-xs text-muted-foreground">GPA 5.00</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Counter to={6} suffix="+" className="text-3xl font-bold text-primary" />
              <p className="mt-1 text-xs text-muted-foreground bn">{isBn ? "বিজ্ঞান মেলা" : "Science Fairs"}</p>
            </GlassCard>
          </div>
        </FadeInUp>

        {/* Bento Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon];
            const rarity = rarityStyles[achievement.rarity];
            const rarityBadge = rarityBadges[achievement.rarity];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <GlassCard className={`group h-full transition-all duration-300 hover:scale-[1.02] ${rarity}`}>
                  {/* Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        achievement.rarity === "legendary" ? "bg-amber-500/20" :
                        achievement.rarity === "epic" ? "bg-purple-500/20" :
                        achievement.rarity === "rare" ? "bg-blue-500/20" :
                        "bg-green-500/20"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          achievement.rarity === "legendary" ? "text-amber-500" :
                          achievement.rarity === "epic" ? "text-purple-500" :
                          achievement.rarity === "rare" ? "text-blue-500" :
                          "text-green-500"
                        }`} />
                      </div>
                      <Badge variant={rarityBadge.variant} className="text-[10px]">
                        <Sparkles className="mr-1 h-2.5 w-2.5" />
                        {rarityBadge.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{achievement.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold bn">
                    {isBn ? achievement.titleBn : achievement.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-muted-foreground bn leading-relaxed">
                    {isBn ? achievement.descriptionBn : achievement.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
