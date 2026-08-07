"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { IMAGE_IDS } from "@/lib/cloudinary/utils";
import { motion } from "framer-motion";
import {
  Building,
  GraduationCap,
  BookOpen,
  Pen,
  Scale,
  Star,
} from "lucide-react";

// ── Memorial Section ───────────────────────────────────
// Tribute to Late Md. Farid Ahmed (Father)
interface MemorialSectionProps {
  locale?: string;
}

export function MemorialSection({ locale = "bn" }: MemorialSectionProps) {
  const isBn = locale === "bn";

  const roles = [
    {
      icon: Building,
      title: isBn ? "সাবেক চেয়ারম্যান" : "Former Chairman",
      description: isBn ? "শিমুলবাঁক ইউনিয়ন পরিষদ" : "Shimulbank Union Parishad",
      period: "০৩/০৫/২০০৩ — ০২/০৮/২০১১",
    },
    {
      icon: GraduationCap,
      title: isBn ? "সাবেক সভাপতি" : "Former President",
      description: isBn ? "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়" : "Satgaon Jibdara High School",
      period: "২০/০৬/২০২০ — ০৪/০৭/২০২৩",
    },
    {
      icon: BookOpen,
      title: isBn ? "সভাপতি" : "President",
      description: isBn ? "পঞ্চগ্রাম জীবদাড়া মাদ্রাসা" : "Panchgaon Jibdara Madrasa",
      period: "",
    },
    {
      icon: Pen,
      title: isBn ? "ডিড রাইটার" : "Deed Writer",
      description: isBn ? "শান্তিগঞ্জ সাব রেজিস্ট্রার অফিস" : "Shantiganj Sub-Registrar Office",
      period: "",
    },
    {
      icon: Scale,
      title: isBn ? "প্রখ্যাত সালিশ ব্যক্তিত্ব" : "Renowned Arbitrator",
      description: isBn ? "শিমুলবাঁক ইউনিয়ন ও ভাটি অঞ্চল" : "Shimulbank Union & Haor Region",
      period: "",
    },
  ];

  const developments = [
    isBn ? "নোয়াখালী — ভীমখালী রাস্তা নির্মাণে অগ্রণী ভূমিকা" : "Key role in Noakhali-Bheemkhali road construction",
    isBn ? "শিমুলবাঁক ইউনিয়ন পরিষদ ভবন নির্মাণ ও বাস্তবায়ন" : "Construction of Shimulbank Union Parishad building",
    isBn ? "ইউনিয়ন ডিজিটাল সেন্টার (ইউডিসি) চালু" : "Launch of Union Digital Center (UDC)",
    isBn ? "কান্দাগাঁও — মুক্তাখাই দৃষ্টিনন্দন সড়ক নির্মাণ" : "Kandagaon-Mukhtakhai scenic road construction",
    isBn ? "মুক্তাখাই — চানপুর সড়ক নির্মাণ" : "Mukhtakhai-Chanpur road construction",
    isBn ? "নুরপুর — কেশবপুর সড়ক নির্মাণ" : "Nurpur-Keshabpur road construction",
    isBn ? "নেতাই নদীতে বাঁধ ও ব্রিজ নির্মাণে ভূমিকা" : "Role in Netai River dam and bridge construction",
    isBn ? "ধনপুর হতে জামালগঞ্জ — সুনামগঞ্জ সংযোগ রাস্তা" : "Dhanpur-Jamalgonj-Sunamganj connecting road",
    isBn ? "জীবদাড়া সিঙ্গি বিলের জাঙ্গাল নির্মাণ" : "Jibdara-Singi Beel canal construction",
    isBn ? "জীবদাড়া — গোভিন্দপুর রাস্তা নির্মাণ" : "Jibdara-Gobindapur road construction",
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Title */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-lg text-amber-400/80">۞</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isBn
                ? "ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন"
                : "Indeed we belong to Allah, and indeed to Him we will return"}
            </p>
          </motion.div>
        </div>

        <SectionTitle
          badge={isBn ? "🕯️ স্মৃতিতে অম্লান" : "🕯️ Eternal Memory"}
          title="Tribute"
          titleBn="শ্রদ্ধাঞ্জলি"
          subtitle={
            isBn
              ? "তাঁর সততা, নেতৃত্ব ও মানুষের প্রতি ভালোবাসা আজও হাজারো মানুষের হৃদয়ে অম্লান"
              : "His honesty, leadership, and love for people remain eternal in thousands of hearts"
          }
          locale={locale}
        />

        {/* Main Tribute Card */}
        <FadeInUp>
          <GlassCard className="border-t-4 border-t-amber-500/50 text-center">
            <motion.div
              className="bg-brand-gradient-soft gradient-border mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-primary/30"
              whileHover={{ scale: 1.05 }}
            >
              <CloudinaryImage
                publicId={IMAGE_IDS.FATHER_PHOTO}
                alt={isBn ? "মরহুম জনাব ফরিদ আহমেদ" : "Late Md. Farid Ahmed"}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>

            <h3 className="text-2xl font-bold bn">
              {isBn ? "মরহুম জনাব ফরিদ আহমেদ" : "Late Md. Farid Ahmed"}
            </h3>
            <p className="mt-1 text-muted-foreground bn">
              {isBn ? "আমার শ্রদ্ধেয় পিতা" : "My Beloved Father"}
            </p>
            <Badge variant="glow" className="mt-3">
              {isBn ? "মৃত্যু: ৩ মে, ২০২৩" : "Passed: May 3, 2023"}
            </Badge>

            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground bn leading-relaxed">
              {isBn
                ? "তিনি শুধু আমার বাবা ছিলেন না — তিনি ছিলেন শিমুলবাঁক ইউনিয়নের একজন উজ্জ্বল নক্ষত্র, একজন কিংবদন্তি। তাঁর সততা, নেতৃত্ব ও মানুষের প্রতি ভালোবাসা আজও হাজারো মানুষের হৃদয়ে অম্লান।"
                : "He was not just my father — he was a shining star of Shimulbank Union, a legend. His honesty, leadership, and love for people remain eternal in thousands of hearts."}
            </p>
          </GlassCard>
        </FadeInUp>

        {/* Roles */}
        <FadeInUp delay={0.2}>
          <div className="mt-8">
            <h4 className="mb-4 text-center text-lg font-bold bn">
              {isBn ? "✦ তাঁর পরিচয় ✦" : "✦ His Identity ✦"}
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <GlassCard key={role.title} className="!p-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <role.icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="font-semibold text-sm bn">{role.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground bn">{role.description}</p>
                  {role.period && (
                    <p className="mt-1 text-xs text-amber-400/60">{role.period}</p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Development Works */}
        <FadeInUp delay={0.3}>
          <div className="mt-8">
            <h4 className="mb-4 text-center text-lg font-bold bn">
              {isBn ? "✦ উন্নয়নমূলক কাজের ঝলক ✦" : "✦ Development Work Highlights ✦"}
            </h4>
            <GlassCard>
              <div className="grid gap-2 sm:grid-cols-2">
                {developments.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Star className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                    <span className="bn text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm italic text-muted-foreground bn">
                {isBn ? "এবং আরও অনেক উন্নয়নমূলক কাজ..." : "And many more development works..."}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>

        {/* Doa */}
        <FadeInUp delay={0.4}>
          <div className="mt-8 text-center">
            <GlassCard className="mx-auto max-w-xl border-amber-500/20">
              <p className="text-lg bn">🤲</p>
              <p className="mt-3 text-muted-foreground bn italic">
                {isBn
                  ? "আল্লাহ পাক যেন আমার বাবার সকল ভালো কাজের বিনিময়ে তাঁকে মাফ করে দেন এবং জান্নাতুল ফেরদাউস দান করেন। আমিন।"
                  : "May Allah forgive my father for all his good deeds and grant him Jannatul Firdaus. Ameen."}
              </p>
              <p className="mt-3 text-xs text-muted-foreground bn">
                {isBn ? "— শ্রদ্ধা ও ভালোবাসায়, রাহাত আহমেদ ও পরিবার" : "— With respect and love, Rahat Ahmed & Family"}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
