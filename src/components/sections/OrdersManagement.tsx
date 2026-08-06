"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { ShoppingCart, Mail, Phone, Calendar, Eye } from "lucide-react";

// ── Orders Management ──────────────────────────────────
interface OrdersManagementProps {
  locale?: string;
}

interface Order {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  package_type: string;
  website_type: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "warning",
  confirmed: "info",
  in_progress: "info",
  review: "glow",
  delivered: "success",
  cancelled: "destructive",
};

const statusLabels: Record<string, Record<string, string>> = {
  pending: { bn: "অপেক্ষমান", en: "Pending" },
  confirmed: { bn: "নিশ্চিত", en: "Confirmed" },
  in_progress: { bn: "চলমান", en: "In Progress" },
  review: { bn: "রিভিউ", en: "Review" },
  delivered: { bn: "ডেলিভার্ড", en: "Delivered" },
  cancelled: { bn: "বাতিল", en: "Cancelled" },
};

export function OrdersManagement({ locale = "bn" }: OrdersManagementProps) {
  const isBn = locale === "bn";
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setOrders(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🛒 অর্ডার" : "🛒 Orders"}
          title="Order Management"
          titleBn="অর্ডার ম্যানেজমেন্ট"
          locale={locale}
        />

        {/* Orders List */}
        {orders.length === 0 ? (
          <FadeInUp>
            <GlassCard className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium bn">
                {isBn ? "এখনো কোনো অর্ডার নেই" : "No orders yet"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground bn">
                {isBn ? "নতুন অর্ডার আসলে এখানে দেখাবে" : "New orders will appear here"}
              </p>
            </GlassCard>
          </FadeInUp>
        ) : (
          <StaggerContainer className="space-y-3">
            {orders.map((order) => (
              <StaggerItem key={order.id}>
                <GlassCard
                  className="cursor-pointer transition-all hover:border-primary/30"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.client_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.package_type} • {order.website_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={(statusColors[order.status] || "default") as "warning" | "info" | "glow" | "success" | "destructive"}>
                        {isBn ? statusLabels[order.status]?.bn : statusLabels[order.status]?.en}
                      </Badge>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
            <GlassCard className="max-w-md w-full" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">{selectedOrder.client_name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.client_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.client_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground bn">
                  {isBn ? "বিস্তারিত দেখতে Supabase Dashboard ব্যবহার করুন" : "Use Supabase Dashboard for full details"}
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
