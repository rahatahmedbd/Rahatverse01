"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";

// ── Education Timeline ─────────────────────────────────
interface EducationTimelineProps {
  locale?: string;
}

interface TimelineItem {
  year: string;
  title: string;
  titleBn: string;
  institution: string;
  institutionBn: string;
  description: string;
  descriptionBn: string;
  badge?: string;
  badgeType?: "success" | "warning" | "info" | "glow" | "gradient";
  gpa?: string;
}

export function EducationTimeline({ locale = "bn" }: EducationTimelineProps) {
  const isBn = locale === "bn";

  const timeline: TimelineItem[] = [
    {
      year: "২০১৬ — ২০১৯",
      title: "Primary Education (Sylhet)",
      titleBn: "প্রাথমিক পড়াশোনা (সিলেট)",
      institution: "Scholars Home, Sylhet",
      institutionBn: "স্কলারস হোম, সিলেট",
      description: "Class 4 onwards, studied in Sylhet. Gained diverse experiences in the city environment.",
      descriptionBn: "চতুর্থ শ্রেণি পর্যন্ত সিলেটে থেকে পড়াশোনা করেছি। শহরের বৈচিত্র্যপূর্ণ পরিবেশে নতুন অভিজ্ঞতা অর্জন করি।",
    },
    {
      year: "২০১৯",
      title: "PSC — Primary School Certificate",
      titleBn: "PSC — প্রাথমিক শিক্ষা সমাপনী",
      institution: "Jibdara Govt. Primary School",
      institutionBn: "জীবদাড়া সরকারি প্রাথমিক বিদ্যালয়",
      description: "Returned to village and passed PSC with GPA 5.00. First major academic achievement.",
      descriptionBn: "গ্রামে ফিরে এসে PSC পরীক্ষায় জিপিএ ৫.০০ পেয়ে উত্তীর্ণ হই। এটি ছিল আমার শিক্ষাজীবনের প্রথম বড় অর্জন।",
      badge: "GPA 5.00",
      badgeType: "success",
      gpa: "5.00",
    },
    {
      year: "২০২০ — ২০২৫",
      title: "Secondary Education (Class 6-10)",
      titleBn: "মাধ্যমিক শিক্ষা (৬ষ্ঠ — ১০ম শ্রেণি)",
      institution: "Satgaon Jibdara High School",
      institutionBn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়",
      description: "Won multiple national science fairs, started teaching, founded Helping Hand Organization and FS Coaching Center.",
      descriptionBn: "একাধিক জাতীয় বিজ্ঞান মেলায় প্রথম স্থান অর্জন, শিক্ষকতা শুরু, হেল্পিং হ্যান্ড অর্গানাইজেশন ও FS কোচিং সেন্টার প্রতিষ্ঠা করি।",
    },
    {
      year: "১০ জুলাই, ২০২৫",
      title: "SSC — Secondary School Certificate",
      titleBn: "SSC — মাধ্যমিক স্কুল সার্টিফিকেট",
      institution: "Satgaon Jibdara High School (Science)",
      institutionBn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয় (বিজ্ঞান)",
      description: "Passed SSC with GPA 5.00 (A+) from Science department. Received special recognition from Shantichakra Blood Society.",
      descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+) অর্জন করি। শান্তিচক্র ব্লাড সোসাইটি ও বিদ্যালয় কর্তৃক বিশেষ সম্মাননা পাই।",
      badge: "GPA 5.00 (A+)",
      badgeType: "gradient",
      gpa: "5.00",
    },
    {
      year: isBn ? "বর্তমান" : "Present",
      title: "HSC 2nd Year — Science",
      titleBn: "HSC ২য় বর্ষ — বিজ্ঞান বিভাগ",
      institution: "Sunamganj Govt. College",
      institutionBn: "সুনামগঞ্জ সরকারি কলেজ",
      description: "Currently studying HSC 2nd year in Science. Alongside studies, continuing social service, teaching, and web development.",
      descriptionBn: "বর্তমানে সুনামগঞ্জ সরকারি কলেজে উচ্চ মাধ্যমিক ২য় বর্ষে বিজ্ঞান বিভাগে অধ্যয়নরত। পড়াশোনার পাশাপাশি সমাজসেবা, শিক্ষকতা ও ওয়েব ডেভেলপমেন্ট চালিয়ে যাচ্ছি।",
      badge: isBn ? "চলমান" : "Ongoing",
      badgeType: "glow",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <SectionTitle
          badge={isBn ? "🎓 একাডেমিক যাত্রা" : "🎓 Academic Journey"}
          title="Education Timeline"
          titleBn="শিক্ষাজীবন"
          subtitle={
            isBn
              ? "সিলেট থেকে সুনামগঞ্জ — শিক্ষার একটি অবিরাম যাত্রা"
              : "From Sylhet to Sunamganj — a continuous educational journey"
          }
          locale={locale}
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:left-1/2 md:-translate-x-px" />

          {/* Timeline items */}
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <FadeInUp key={item.year} delay={index * 0.1}>
                <div className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Dot on line */}
                  <motion.div
                    className="absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  />

                  {/* Card */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <GlassCard className="relative">
                      {/* Year badge */}
                      <div className="mb-3 flex items-center gap-3">
                        <Badge variant="glow" className="text-xs">
                          {item.year}
                        </Badge>
                        {item.badge && (
                          <Badge variant={item.badgeType || "default"} className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold bn">
                        {isBn ? item.titleBn : item.title}
                      </h3>

                      {/* Institution */}
                      <p className="mt-1 text-sm text-primary font-medium bn">
                        {isBn ? item.institutionBn : item.institution}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-sm text-muted-foreground bn leading-relaxed">
                        {isBn ? item.descriptionBn : item.description}
                      </p>

                      {/* GPA highlight */}
                      {item.gpa && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
                          <span className="text-2xl font-bold text-primary">{item.gpa}</span>
                          <span className="text-xs text-muted-foreground">GPA</span>
                        </div>
                      )}
                    </GlassCard>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
