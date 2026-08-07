"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Mail,
  ShoppingCart,
  MessageSquare,
  Image as ImageIcon,
  Users,
  ScrollText,
  Settings,
  FileText,
  MessageCircle,
  Bell,
  HeartPulse,
  Terminal,
  Download,
  Clapperboard,
  BookUser,
  Briefcase,
  Settings2,
  Building2,
  Droplets,
  Images,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Admin Dashboard Navigation ─────────────────────────
// Sidebar-style navigation shared by every admin page.

interface AdminNavProps {
  locale: string;
}

const sections = [
  { href: "overview", icon: LayoutDashboard, labelBn: "ওভারভিউ", labelEn: "Overview" },
  { href: "hero", icon: Clapperboard, labelBn: "হিরো", labelEn: "Hero" },
  { href: "about", icon: BookUser, labelBn: "অ্যাবাউট", labelEn: "About & Awards" },
  { href: "services", icon: Briefcase, labelBn: "সেবা ও প্যাকেজ", labelEn: "Services & Pricing" },
  { href: "analytics", icon: BarChart3, labelBn: "অ্যানালিটিক্স", labelEn: "Analytics" },
  { href: "newsletter", icon: Mail, labelBn: "নিউজলেটার", labelEn: "Newsletter" },
  { href: "email", icon: Mail, labelBn: "ইমেইল ডেলিভারি", labelEn: "Email Delivery" },
  { href: "orders", icon: ShoppingCart, labelBn: "অর্ডার পাইপলাইন", labelEn: "Orders" },
  { href: "orders-settings", icon: Settings2, labelBn: "অর্ডার সেটিংস", labelEn: "Order Settings" },
  { href: "experience", icon: Building2, labelBn: "অভিজ্ঞতা ও স্মৃতিচারণ", labelEn: "Experience & Memorial" },
  { href: "blood-requests", icon: Droplets, labelBn: "রক্ত অনুরোধ", labelEn: "Blood Requests" },
  { href: "messages", icon: MessageSquare, labelBn: "বার্তা", labelEn: "Messages" },
  { href: "images", icon: ImageIcon, labelBn: "মিডিয়া লাইব্রেরি", labelEn: "Media Library" },
  { href: "gallery", icon: Images, labelBn: "গ্যালারি CMS", labelEn: "Gallery CMS" },
  { href: "videos", icon: Video, labelBn: "ভিডিও CMS", labelEn: "Video CMS" },
  { href: "blog", icon: FileText, labelBn: "CMS / ব্লগ", labelEn: "CMS / Blog" },
  { href: "comments", icon: MessageCircle, labelBn: "কমেন্ট", labelEn: "Comments" },
  { href: "users", icon: Users, labelBn: "ইউজার", labelEn: "Users" },
  { href: "audit", icon: ScrollText, labelBn: "অডিট লগ", labelEn: "Audit Logs" },
  { href: "notifications", icon: Bell, labelBn: "নোটিফিকেশন", labelEn: "Notifications" },
  { href: "health", icon: HeartPulse, labelBn: "সিস্টেম হেলথ", labelEn: "System Health" },
  { href: "logs", icon: Terminal, labelBn: "সিস্টেম লগ", labelEn: "System Logs" },
  { href: "settings", icon: Settings, labelBn: "সেটিংস", labelEn: "Settings" },
  { href: "export", icon: Download, labelBn: "এক্সপোর্ট", labelEn: "Export" },
];

export function AdminNav({ locale }: AdminNavProps) {
  const pathname = usePathname();
  const isBn = locale === "bn";

  const isActive = (href: string) => {
    if (href === "overview") return pathname === `/${locale}/dashboard`;
    return pathname.startsWith(`/${locale}/dashboard/${href}`);
  };

  return (
    <nav className="mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {sections.map((section) => {
          const active = isActive(section.href);
          return (
            <Link
              key={section.href}
              href={
                section.href === "overview"
                  ? `/${locale}/dashboard`
                  : `/${locale}/dashboard/${section.href}`
              }
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/25 hover:text-foreground"
              )}
            >
              <section.icon className="h-4 w-4" />
              <span className="bn">{isBn ? section.labelBn : section.labelEn}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
