"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { ChevronDown } from "lucide-react";

// ── FAQ Section ────────────────────────────────────────
interface FAQSectionProps {
  locale?: string;
}

interface FAQItem {
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How much does a website cost?",
    questionBn: "একটি ওয়েবসাইটের খরচ কত?",
    answer: "Website packages start from ৳5,000 (Basic) to ৳30,000+ (Premium). Custom pricing available for enterprise solutions.",
    answerBn: "ওয়েবসাইট প্যাকেজ ৳৫,০০০ (বেসিক) থেকে ৳৩০,০০০+ (প্রিমিয়াম) পর্যন্ত। এন্টারপ্রাইজ সলিউশনের জন্য কাস্টম প্রাইসিং পাওয়া যায়।",
  },
  {
    question: "How long does it take to build a website?",
    questionBn: "একটি ওয়েবসাইট তৈরি করতে কত সময় লাগে?",
    answer: "Basic websites take about 1 week, Standard 2 weeks, and Premium 3 weeks. Timeline depends on project complexity.",
    answerBn: "বেসিক ওয়েবসাইটে প্রায় ১ সপ্তাহ, স্ট্যান্ডার্ড ২ সপ্তাহ, এবং প্রিমিয়াম ৩ সপ্তাহ। টাইমলাইন প্রজেক্টের জটিলতার উপর নির্ভর করে।",
  },
  {
    question: "Do you provide tutoring services?",
    questionBn: "আপনি কি টিউশন সার্ভিস দেন?",
    answer: "Yes! I provide academic tutoring for students of class 6-10 in Science subjects. Contact me for more details.",
    answerBn: "হ্যাঁ! আমি ৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের বিজ্ঞান বিষয়ে একাডেমিক টিউশন দিয়ে থাকি। বিস্তারিত জানতে যোগাযোগ করুন।",
  },
  {
    question: "How can I request blood donation?",
    questionBn: "রক্তদানের জন্য কীভাবে অনুরোধ করব?",
    answer: "You can contact me directly via WhatsApp at +880 1626-224878 or join our Shantichakra Blood Society Facebook group for emergency blood requests.",
    answerBn: "আপনি সরাসরি হোয়াটসঅ্যাপে +৮৮০ ১৬২৬-২২৪৮৭৮ নম্বরে যোগাযোগ করতে পারেন অথবা জরুরি রক্তের জন্য শান্তিচক্র ব্লাড সোসাইটির ফেসবুক গ্রুপে জয়েন করুন।",
  },
  {
    question: "What technologies do you use for websites?",
    questionBn: "ওয়েবসাইটের জন্য আপনি কোন প্রযুক্তি ব্যবহার করেন?",
    answer: "I use modern technologies: Next.js, React, TypeScript, Tailwind CSS, Supabase, and Cloudinary. All websites are responsive, fast, and SEO-optimized.",
    answerBn: "আমি আধুনিক প্রযুক্তি ব্যবহার করি: Next.js, React, TypeScript, Tailwind CSS, Supabase, এবং Cloudinary। সব ওয়েবসাইট রেসপনসিভ, দ্রুত এবং SEO-অপটিমাইজড।",
  },
  {
    question: "Can I see your previous work?",
    questionBn: "আপনার আগের কাজ কি দেখতে পারি?",
    answer: "Yes! Check out my gallery section to see my projects and achievements. You can also visit my GitHub profile for code repositories.",
    answerBn: "হ্যাঁ! আমার গ্যালারি সেকশনে আমার প্রজেক্ট ও অর্জন দেখুন। কোড রিপোজিটরির জন্য আমার GitHub প্রোফাইলও দেখতে পারেন।",
  },
];

export function FAQSection({ locale = "bn" }: FAQSectionProps) {
  const isBn = locale === "bn";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle
          badge={isBn ? "❓ প্রশ্নোত্তর" : "❓ FAQ"}
          title="Frequently Asked Questions"
          titleBn="সচরাচর জিজ্ঞাসা"
          locale={locale}
        />

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FadeInUp key={index} delay={index * 0.05}>
              <GlassCard
                className="cursor-pointer transition-all hover:border-primary/30"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="pr-4 font-semibold bn">
                    {isBn ? item.questionBn : item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <p className="text-sm text-muted-foreground bn">
                      {isBn ? item.answerBn : item.answer}
                    </p>
                  </div>
                )}
              </GlassCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
