"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import {
  ShoppingCart,
  MessageSquare,
  Droplets,
  Star,
  TrendingUp,
  Users,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

// ── Dashboard Overview ─────────────────────────────────
interface DashboardOverviewProps {
  locale?: string;
}

export function DashboardOverview({ locale = "bn" }: DashboardOverviewProps) {
  const isBn = locale === "bn";
  const [stats, setStats] = useState({
    orders: 0,
    messages: 0,
    bloodRequests: 0,
    testimonials: 0,
  });

  useEffect(() => {
    // Fetch counts from APIs
    Promise.all([
      fetch("/api/orders").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/messages").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/blood-requests").then((r) => r.json()).catch(() => ({ data: [] })),
      fetch("/api/testimonials").then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([orders, messages, blood, testimonials]) => {
      setStats({
        orders: orders?.data?.length || 0,
        messages: messages?.data?.length || 0,
        bloodRequests: blood?.data?.length || 0,
        testimonials: testimonials?.data?.length || 0,
      });
    });
  }, []);

  const statCards = [
    {
      icon: ShoppingCart,
      label: isBn ? "মোট অর্ডার" : "Total Orders",
      value: stats.orders,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      link: `/${locale}/dashboard/orders`,
    },
    {
      icon: MessageSquare,
      label: isBn ? "বার্তা" : "Messages",
      value: stats.messages,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      link: `/${locale}/dashboard/messages`,
    },
    {
      icon: Droplets,
      label: isBn ? "রক্তের অনুরোধ" : "Blood Requests",
      value: stats.bloodRequests,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      link: "#",
    },
    {
      icon: Star,
      label: isBn ? "মতামত" : "Testimonials",
      value: stats.testimonials,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "#",
    },
  ];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🎮 কমান্ড সেন্টার" : "🎮 Command Center"}
          title="Admin Dashboard"
          titleBn="অ্যাডমিন ড্যাশবোর্ড"
          locale={locale}
        />

        {/* Stats Grid */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StaggerItem key={card.label}>
              <Link href={card.link}>
                <GlassCard className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor}`}>
                      <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">{card.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground bn">{card.label}</p>
                  </div>
                </GlassCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quick Actions */}
        <FadeInUp delay={0.2}>
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold bn">{isBn ? "দ্রুত কাজ" : "Quick Actions"}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href={`/${locale}/dashboard/orders`}>
                <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium bn">{isBn ? "অর্ডার ম্যানেজ" : "Manage Orders"}</span>
                </GlassCard>
              </Link>
              <Link href={`/${locale}/dashboard/messages`}>
                <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <span className="font-medium bn">{isBn ? "বার্তা দেখুন" : "View Messages"}</span>
                </GlassCard>
              </Link>
              <Link href={`/${locale}/dashboard/images`}>
                <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                  <span className="font-medium bn">{isBn ? "ছবি ম্যানেজ" : "Manage Images"}</span>
                </GlassCard>
              </Link>
              <Link href={`/${locale}/contact`}>
                <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                  <Users className="h-5 w-5 text-green-400" />
                  <span className="font-medium bn">{isBn ? "যোগাযোগ পেজ" : "Contact Page"}</span>
                </GlassCard>
              </Link>
            </div>
          </div>
        </FadeInUp>

        {/* Recent Orders Preview */}
        <FadeInUp delay={0.3}>
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold bn">{isBn ? "সাম্প্রতিক অর্ডার" : "Recent Orders"}</h3>
              <Link href={`/${locale}/dashboard/orders`} className="text-sm text-primary hover:underline">
                {isBn ? "সব দেখুন" : "View All"}
              </Link>
            </div>
            <GlassCard>
              {stats.orders === 0 ? (
                <p className="text-center py-8 text-muted-foreground bn">
                  {isBn ? "এখনো কোনো অর্ডার নেই" : "No orders yet"}
                </p>
              ) : (
                <p className="text-center py-8 text-muted-foreground bn">
                  {stats.orders} {isBn ? "টি অর্ডার আছে" : "orders found"}
                </p>
              )}
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
