"use client";

import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { HoverCard3D } from "@/components/interactive/HoverCard3D";
import { FlipCard3D } from "@/components/interactive/FlipCard3D";
import {
  Globe,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Newspaper,
  Palette,
  Zap,
  Shield,
  Search,
  Smartphone,
  ArrowRight,
  Code2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Services Preview Section ───────────────────────────
interface ServicesPreviewProps {
  locale?: string;
}

export function ServicesPreview({ locale = "bn" }: ServicesPreviewProps) {
  const isBn = locale === "bn";
  const router = useRouter();

  const websiteTypes = [
    { icon: Globe, label: isBn ? "পোর্টফোলিও" : "Portfolio" },
    { icon: Briefcase, label: isBn ? "ব্যবসায়িক" : "Business" },
    { icon: ShoppingBag, label: isBn ? "ই-কমার্স" : "E-Commerce" },
    { icon: GraduationCap, label: isBn ? "শিক্ষা প্রতিষ্ঠান" : "Education" },
    { icon: Newspaper, label: isBn ? "নিউজ পোর্টাল" : "News Portal" },
    { icon: Palette, label: isBn ? "ল্যান্ডিং পেজ" : "Landing Page" },
  ];

  const features = [
    { icon: Zap, label: isBn ? "দ্রুতগতির লোডিং" : "Lightning Fast" },
    { icon: Smartphone, label: isBn ? "সব ডিভাইসে রেসপনসিভ" : "Fully Responsive" },
    { icon: Search, label: isBn ? "SEO ফ্রেন্ডলি" : "SEO Friendly" },
    { icon: Shield, label: isBn ? "নিরাপদ ও সুরক্ষিত" : "Secure & Protected" },
  ];

  const featuredPackages = [
    {
      icon: <Globe className="h-6 w-6" />,
      titleEn: "Personal Portfolio & Blog",
      titleBn: "পার্সোনাল পোর্টফোলিও ও ব্লগ",
      subtitleEn:
        "Modern, responsive portfolio website with custom blog CMS and contact form.",
      subtitleBn:
        "আধুনিক ও রেসপনসিভ পোর্টফোলিও ওয়েবসাইট, কাস্টম ব্লগ সিএমএস এবং যোগাযোগের ফরমসহ।",
      badge: (
        <Badge variant="glow" className="text-xs">
          {isBn ? "জনপ্রিয়" : "Popular"}
        </Badge>
      ),
      featuresEn: [
        "Responsive glassmorphism UI",
        "SEO-ready metadata & sitemap",
        "Dynamic Markdown/MDX blog",
        "Fast Next.js 16 static rendering",
      ],
      featuresBn: [
        "রেসপনসিভ গ্লাসমর্ফিজম ডিজাইন",
        "এসইও অপটিমাইজড ও সাইটম্যাপ",
        "ডাইনামিক ব্লগ ব্যবস্থা",
        "Next.js ১৬ স্ট্যাটিক রেন্ডারিং",
      ],
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      titleEn: "Business & E-Commerce",
      titleBn: "ব্যবসায়িক ও ই-কমার্স সাইট",
      subtitleEn:
        "Complete business presence with order management and customer support tools.",
      subtitleBn:
        "অর্ডার ম্যানেজমেন্ট ও কাস্টমার সাপোর্ট ব্যবস্থাসহ পূর্ণাঙ্গ ব্যবসায়িক ওয়েবসাইট।",
      badge: (
        <Badge variant="outline" className="text-xs">
          {isBn ? "প্রফেশনাল" : "Professional"}
        </Badge>
      ),
      featuresEn: [
        "Product & order wizard",
        "Customer dashboard",
        "Supabase real-time database",
        "Automated email notifications",
      ],
      featuresBn: [
        "প্রোডাক্ট ও অর্ডার উইজার্ড",
        "কাস্টমার ড্যাশবোর্ড",
        "সুপাবেস রিয়েলটাইম ডাটাবেস",
        "স্বয়ংক্রিয় ইমেইল নোটিফিকেশন",
      ],
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      titleEn: "Custom Web Application",
      titleBn: "কাস্টম ওয়েব অ্যাপ্লিকেশন",
      subtitleEn:
        "Tailor-made web solutions with complex backend APIs and admin dashboards.",
      subtitleBn:
        "জটিল ব্যাকএন্ড এপিআই এবং অ্যাডমিন ড্যাশবোর্ডসহ কাস্টম ওয়েব অ্যাপ্লিকেশন সমাধান।",
      badge: (
        <Badge variant="secondary" className="text-xs">
          {isBn ? "এন্টারপ্রাইজ" : "Enterprise"}
        </Badge>
      ),
      featuresEn: [
        "RBAC authentication & roles",
        "Custom Supabase RPC & triggers",
        "Cloudinary media integration",
        "Full admin command center",
      ],
      featuresBn: [
        "ইউজার রোল ও সিকিউরিটি পারমিশন",
        "কাস্টম সুপাবেস ও ডাটাবেস স্কিমা",
        "ক্লাউডিনারি মিডিয়া ইন্টিগ্রেশন",
        "সম্পূর্ণ অ্যাডমিন কমান্ড সেন্টার",
      ],
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "💻 ওয়েব সেবা সমূহ" : "💻 Web Services"}
          title="What I Build"
          titleBn="আমার সেবাসমূহ"
          subtitle={
            isBn
              ? "আধুনিক প্রযুক্তি ব্যবহার করে যেকোনো ধরণের ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি করি"
              : "I build all types of websites and web applications using modern technologies"
          }
          locale={locale}
        />

        {/* Phase I 3D Flip / Interactive Glow Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredPackages.map((pkg, idx) => (
            <div key={idx} className="h-full">
              <FlipCard3D
                locale={locale}
                frontIcon={pkg.icon}
                frontBadge={pkg.badge}
                frontTitle={isBn ? pkg.titleBn : pkg.titleEn}
                frontSubtitle={isBn ? pkg.subtitleBn : pkg.subtitleEn}
                backTitle={isBn ? pkg.titleBn : pkg.titleEn}
                backContent={
                  <ul className="space-y-2 text-left">
                    {(isBn ? pkg.featuresBn : pkg.featuresEn).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                }
                backActionLabel={
                  isBn ? "অর্ডার করতে ক্লিক করুন" : "Order This Package"
                }
                onBackAction={() => router.push(`/${locale}/order`)}
                className="hover:glow-amber transition-shadow"
              />
            </div>
          ))}
        </div>

        {/* Website Types Grid */}
        <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {websiteTypes.map((type) => (
            <StaggerItem key={type.label}>
              <HoverCard3D className="h-full">
                <GlassCard className="h-full text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                  <type.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="text-sm font-medium bn">{type.label}</p>
                </GlassCard>
              </HoverCard3D>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.label}>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/20 hover:bg-accent/10">
                <feature.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium bn">{feature.label}</span>
              </div>
            </StaggerItem>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="gradient" size="lg" asChild>
            <Link href={`/${locale}/order`}>
              {isBn ? "প্রজেক্টের জন্য যোগাযোগ করুন" : "Start Your Project"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
