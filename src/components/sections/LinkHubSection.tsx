"use client";

import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { FadeInUp } from "@/components/animations/FadeIn";
import {
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Download,
} from "lucide-react";

// ── Social SVG Icons ───────────────────────────────────
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ── Link Hub Section ───────────────────────────────────
interface LinkHubSectionProps {
  locale?: string;
}

interface LinkItem {
  icon: React.ElementType;
  label: string;
  labelBn: string;
  url: string;
  color: string;
  bgColor: string;
}

const socialLinks: LinkItem[] = [
  {
    icon: FacebookIcon,
    label: "Facebook",
    labelBn: "ফেসবুক",
    url: "https://www.facebook.com/rahat.ahmed.948943",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    labelBn: "ইনস্টাগ্রাম",
    url: "https://www.instagram.com/rahatahm6d/",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: YoutubeIcon,
    label: "YouTube",
    labelBn: "ইউটিউব",
    url: "https://www.youtube.com/@RahatAhmedOfficial0",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: TikTokIcon,
    label: "TikTok",
    labelBn: "টিকটক",
    url: "https://www.tiktok.com/@rahatvives",
    color: "text-white",
    bgColor: "bg-white/10",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    labelBn: "হোয়াটসঅ্যাপ",
    url: "https://wa.me/8801626224878",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Mail,
    label: "Email",
    labelBn: "ইমেইল",
    url: "mailto:rahatbd20505@gmail.com",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Phone,
    label: "Phone",
    labelBn: "ফোন",
    url: "tel:+8801626224878",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    labelBn: "গিটহাব",
    url: "https://github.com/rahatahmedbd",
    color: "text-gray-300",
    bgColor: "bg-gray-500/10",
  },
];

export function LinkHubSection({ locale = "bn" }: LinkHubSectionProps) {
  const isBn = locale === "bn";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <SectionTitle
          badge={isBn ? "🔗 সব লিংক" : "🔗 All Links"}
          title="Link Hub"
          titleBn="সংযুক্ত হোন"
          subtitle={
            isBn
              ? "সব সোশ্যাল মিডিয়া ও যোগাযোগ এক জায়গায়"
              : "All social media and contact links in one place"
          }
          locale={locale}
        />

        {/* Profile */}
        <FadeInUp>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500/30">
              <span className="text-2xl font-bold text-amber-400">RA</span>
            </div>
            <h3 className="text-xl font-bold bn">রাহাত আহমেদ</h3>
            <p className="text-sm text-muted-foreground">Rahat Ahmed</p>
            <p className="mt-1 text-xs text-muted-foreground bn">
              {isBn ? "শিক্ষার্থী • শিক্ষক • ওয়েব ডেভেলপার" : "Student • Teacher • Web Developer"}
            </p>
          </div>
        </FadeInUp>

        {/* Links */}
        <StaggerContainer className="space-y-3">
          {socialLinks.map((link) => (
            <StaggerItem key={link.label}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor}`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className="flex-1 font-medium bn">{isBn ? link.labelBn : link.label}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Resume Download */}
        <FadeInUp delay={0.3}>
          <div className="mt-8">
            <GlassCard className="text-center">
              <Download className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 font-semibold bn">{isBn ? "রিজিউম ডাউনলোড" : "Download Resume"}</p>
              <p className="mt-1 text-xs text-muted-foreground bn">
                {isBn ? "আমার CV PDF ফরম্যাটে" : "My CV in PDF format"}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {isBn ? "শীঘ্রই আসছে..." : "Coming soon..."}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
