"use client";

import { SectionTitle } from "./SectionTitle";
import {
  ScrollStoryline,
  StorylineItem,
} from "@/components/interactive";

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
      description: "Appeared in PSC exam from Sunamganj. Completed primary education with distinction.",
      descriptionBn: "সুনামগঞ্জে এসে জীবদাড়া সরকারি প্রাথমিক বিদ্যালয় থেকে পিএসসি পরীক্ষায় অংশগ্রহণ করি এবং কৃতিত্বের সাথে উত্তীর্ণ হই।",
    },
    {
      year: "২০২০ — ২০২৩",
      title: "High School Journey",
      titleBn: "মাধ্যমিক শিক্ষাজীবন",
      institution: "Sunamganj Govt. Jubilee High School",
      institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
      description: "Gained foundational interest in Science, Technology, and Mathematics. Started web development self-study.",
      descriptionBn: "বিজ্ঞান ও প্রযুক্তির প্রতি গভীর আগ্রহ তৈরি হয়। পাশাপাশি ওয়েব ডেভেলপমেন্ট শেখা শুরু করি।",
    },
    {
      year: "২০২৩",
      title: "45th National Science Fair",
      titleBn: "৪৫তম জাতীয় বিজ্ঞান মেলা",
      institution: "District Science Fair, Sunamganj",
      institutionBn: "জেলা বিজ্ঞান মেলা, সুনামগঞ্জ",
      description: "Showcased technology project at the 45th National Science and Technology Week. Awarded 1st place.",
      descriptionBn: "৪৫তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে প্রজেক্ট প্রদর্শন করে প্রথম স্থান অর্জন করি।",
      badge: isBn ? "১ম স্থান" : "1st Place",
      badgeType: "glow",
    },
    {
      year: "২০২৪",
      title: "44th Science Exhibition & Competition",
      titleBn: "৪৪তম বিজ্ঞান প্রদর্শনী ও প্রতিযোগিতা",
      institution: "Regional Level",
      institutionBn: "আঞ্চলিক পর্যায়",
      description: "Participated in the 44th Science Exhibition with an innovative smart-city model.",
      descriptionBn: "স্মার্ট সিটি মডেল নিয়ে ৪৪তম বিজ্ঞান প্রদর্শনীতে অংশগ্রহণ ও পুরস্কার লাভ।",
      badge: isBn ? "১ম স্থান" : "1st Place",
      badgeType: "glow",
    },
    {
      year: "২০২৪",
      title: "Creative Talent Search 2024",
      titleBn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
      institution: "National Talent Search",
      institutionBn: "জাতীয় মেধা অন্বেষণ প্রতিযোগিতা",
      description: "Won 1st place in Science category at the Creative Talent Search competition.",
      descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিভাগে প্রথম স্থান অর্জন।",
      badge: isBn ? "১ম স্থান" : "1st Place",
      badgeType: "glow",
    },
    {
      year: "২০২৫",
      title: "SSC — Secondary School Certificate",
      titleBn: "SSC — মাধ্যমিক স্কুল সার্টিফিকেট",
      institution: "Sunamganj Govt. Jubilee High School",
      institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
      description: "Passed SSC from Science group with GPA 5.00 (Golden A+). Honored at Meritorious Student Ceremony.",
      descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (গোল্ডেন এ+) অর্জন করে এসএসসি পাস। কৃতী শিক্ষার্থী সংবর্ধনা লাভ।",
      badge: "GPA 5.00 (A+)",
      badgeType: "glow",
      gpa: "5.00",
    },
    {
      year: "২০২৫ — বর্তমান",
      title: "HSC — Higher Secondary (Science)",
      titleBn: "HSC — উচ্চ মাধ্যমিক (বিজ্ঞান)",
      institution: "Sunamganj Govt. College",
      institutionBn: "সুনামগঞ্জ সরকারি কলেজ",
      description: "Currently studying in HSC 2nd Year (Science). Active BNCC cadet (No: 25071152) and Shantichakra Blood Society member.",
      descriptionBn: "বর্তমানে সুনামগঞ্জ সরকারি কলেজে এইচএসসি ২য় বর্ষে বিজ্ঞান বিভাগে অধ্যায়নরত। বিএনসিসি ক্যাডেট এবং শান্তিচক্র ব্লাড সোসাইটির সদস্য।",
      badge: isBn ? "বর্তমান" : "Current",
      badgeType: "glow",
    },
  ];

  const storylineItems: StorylineItem[] = timeline.map((item, idx) => ({
    id: `edu-timeline-${idx}`,
    year: item.year,
    title: item.title,
    titleBn: item.titleBn,
    subtitle: item.institution,
    subtitleBn: item.institutionBn,
    description: item.description,
    descriptionBn: item.descriptionBn,
    badge: item.badge,
    badgeType: item.badgeType || "glow",
  }));

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

        {/* Phase I Scroll-Driven Storytelling Timeline */}
        <ScrollStoryline items={storylineItems} locale={locale} />
      </div>
    </section>
  );
}
