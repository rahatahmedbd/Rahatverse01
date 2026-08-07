"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import {
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface OrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  email: string;
  projectType: string;
  packageType: "starter" | "professional" | "enterprise";
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled";
  budget: string;
  createdAt: string;
  createdAtBn: string;
}

interface OrdersManagementProps {
  locale?: string;
  orders?: OrderItem[];
}

// ── Demo Fallback Orders ───────────────────────────────
const fallbackOrders: OrderItem[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    clientName: "Mahmudul Hasan",
    email: "mahmud@example.com",
    projectType: "Personal Portfolio & Blog",
    packageType: "professional",
    status: "in_progress",
    budget: "৳ ২৫,০০০",
    createdAt: "July 25, 2025",
    createdAtBn: "২৫ জুলাই, ২০২৫",
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    clientName: "Sunrise Blood Foundation",
    email: "info@sunriseblood.org",
    projectType: "Blood Donor Management System",
    packageType: "enterprise",
    status: "pending",
    budget: "৳ ৫৫,০০০",
    createdAt: "July 28, 2025",
    createdAtBn: "২৮ জুলাই, ২০২৫",
  },
  {
    id: "3",
    orderNumber: "ORD-2025-003",
    clientName: "Ahsan Habib",
    email: "ahsan@school.edu",
    projectType: "Coaching Center Website",
    packageType: "starter",
    status: "completed",
    budget: "৳ ১৫,০০০",
    createdAt: "July 10, 2025",
    createdAtBn: "১০ জুলাই, ২০২৫",
  },
];

export function OrdersManagement({
  locale = "bn",
  orders = fallbackOrders,
}: OrdersManagementProps) {
  const isBn = locale === "bn";
  const [orderList] = useState<OrderItem[]>(orders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statusMap: Record<
    string,
    { labelEn: string; labelBn: string; variant: "default" | "glow" | "outline" | "secondary" }
  > = {
    pending: { labelEn: "Pending", labelBn: "অপেক্ষমান", variant: "outline" },
    in_progress: { labelEn: "In Progress", labelBn: "চলমান", variant: "glow" },
    review: { labelEn: "In Review", labelBn: "রিভিউ চলছে", variant: "secondary" },
    completed: { labelEn: "Completed", labelBn: "সম্পন্ন", variant: "default" },
    cancelled: { labelEn: "Cancelled", labelBn: "বাতিল", variant: "outline" },
  };

  const packageLabels: Record<string, { en: string; bn: string }> = {
    starter: { en: "Starter", bn: "স্টার্টার" },
    professional: { en: "Professional", bn: "প্রফেশনাল" },
    enterprise: { en: "Enterprise", bn: "এন্টারপ্রাইজ" },
  };

  const filteredOrders =
    statusFilter === "all"
      ? orderList
      : orderList.filter((ord) => ord.status === statusFilter);

  const filters = [
    { key: "all", label: isBn ? "সব" : "All" },
    { key: "pending", label: isBn ? "অপেক্ষমান" : "Pending" },
    { key: "in_progress", label: isBn ? "চলমান" : "In Progress" },
    { key: "completed", label: isBn ? "সম্পন্ন" : "Completed" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle
          badge={isBn ? "📦 অর্ডার সমূহ" : "📦 Orders"}
          title="Orders Management"
          titleBn="অর্ডার ম্যানেজমেন্ট"
          locale={locale}
        />

        {/* Filter Toolbar */}
        <FadeInUp>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  statusFilter === f.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <FadeInUp>
            <EmptyState
              icon={ShoppingCart}
              title={isBn ? "এখনো কোনো অর্ডার নেই" : "No orders yet"}
              description={
                statusFilter === "all"
                  ? isBn
                    ? "নতুন অর্ডার আসলে এখানে দেখাবে"
                    : "New website orders will appear here once submitted."
                  : isBn
                    ? "এই স্ট্যাটাসে কোনো অর্ডার নেই। অন্য ফিল্টার চেষ্টা করুন।"
                    : "No orders found with this status filter."
              }
              action={
                statusFilter !== "all"
                  ? {
                      label: isBn ? "সব অর্ডার দেখুন" : "View All Orders",
                      onClick: () => setStatusFilter("all"),
                    }
                  : undefined
              }
            />
          </FadeInUp>
        ) : (
          <StaggerContainer className="space-y-4">
            {filteredOrders.map((order) => (
              <StaggerItem key={order.id}>
                <GlassCard className="p-6 transition-all hover:border-primary/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-primary">
                          {order.orderNumber}
                        </span>
                        <Badge
                          variant={statusMap[order.status]?.variant || "outline"}
                          className="text-xs"
                        >
                          {isBn
                            ? statusMap[order.status]?.labelBn || order.status
                            : statusMap[order.status]?.labelEn || order.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Package className="mr-1 h-3 w-3" />
                          {isBn
                            ? packageLabels[order.packageType]?.bn || order.packageType
                            : packageLabels[order.packageType]?.en || order.packageType}
                        </Badge>
                      </div>

                      <h4 className="text-base font-semibold text-foreground">
                        {order.clientName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {order.projectType} • {order.email}
                      </p>

                      <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                          {order.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {isBn ? order.createdAtBn : order.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
