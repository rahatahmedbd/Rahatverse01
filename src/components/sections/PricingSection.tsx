"use client";

import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Check, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";

// ── Pricing Section ────────────────────────────────────
interface PricingSectionProps {
  locale?: string;
}

interface Package {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  currency: string;
  description: string;
  descriptionBn: string;
  features: string[];
  featuresBn: string[];
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    nameBn: "বেসিক",
    price: 5000,
    currency: "৳",
    description: "Perfect for personal portfolio sites",
    descriptionBn: "ব্যক্তিগত পোর্টফোলিও সাইটের জন্য",
    features: ["1-3 Pages", "Responsive Design", "Contact Form", "Basic SEO", "1 Week Delivery"],
    featuresBn: ["১-৩ পেজ", "রেসপনসিভ ডিজাইন", "কন্টাক্ট ফর্ম", "বেসিক SEO", "১ সপ্তাহ ডেলিভারি"],
  },
  {
    id: "standard",
    name: "Standard",
    nameBn: "স্ট্যান্ডার্ড",
    price: 15000,
    currency: "৳",
    description: "Great for small businesses",
    descriptionBn: "ছোট ব্যবসার জন্য আদর্শ",
    features: ["5-10 Pages", "Responsive Design", "Blog Section", "Advanced SEO", "Contact + Map", "2 Week Delivery"],
    featuresBn: ["৫-১০ পেজ", "রেসপনসিভ ডিজাইন", "ব্লগ সেকশন", "অ্যাডভান্সড SEO", "কন্টাক্ট + ম্যাপ", "২ সপ্তাহ ডেলিভারি"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    nameBn: "প্রিমিয়াম",
    price: 30000,
    currency: "৳",
    description: "Full e-commerce solution",
    descriptionBn: "সম্পূর্ণ ই-কমার্স সলিউশন",
    features: ["Unlimited Pages", "E-Commerce", "Payment Gateway", "Admin Dashboard", "Full SEO", "3 Week Delivery"],
    featuresBn: ["আনলিমিটেড পেজ", "ই-কমার্স", "পেমেন্ট গেটওয়ে", "অ্যাডমিন ড্যাশবোর্ড", "ফুল SEO", "৩ সপ্তাহ ডেলিভারি"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameBn: "এন্টারপ্রাইজ",
    price: 0,
    currency: "৳",
    description: "Custom solution for your needs",
    descriptionBn: "আপনার প্রয়োজনে কাস্টম সলিউশন",
    features: ["Everything in Premium", "Custom Features", "Priority Support", "Monthly Maintenance", "Training Session"],
    featuresBn: ["প্রিমিয়ামের সবকিছু", "কাস্টম ফিচার", "প্রায়োরিটি সাপোর্ট", "মাসিক মেইনটেন্যান্স", "ট্রেনিং সেশন"],
  },
];

export function PricingSection({ locale = "bn" }: PricingSectionProps) {
  const isBn = locale === "bn";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "💰 প্যাকেজ সমূহ" : "💰 Pricing Packages"}
          title="Website Packages"
          titleBn="ওয়েবসাইট প্যাকেজ"
          subtitle={
            isBn
              ? "আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন"
              : "Choose a package that fits your needs"
          }
          locale={locale}
        />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <GlassCard
                className={`relative h-full flex flex-col ${
                  pkg.popular ? "border-primary/50 shadow-lg shadow-primary/10" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gradient" className="flex items-center gap-1">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {isBn ? "জনপ্রিয়" : "Popular"}
                    </Badge>
                  </div>
                )}

                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold">
                    {isBn ? pkg.nameBn : pkg.name}
                  </h3>
                  <div className="mt-3">
                    {pkg.price > 0 ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-muted-foreground">{pkg.currency}</span>
                        <span className="text-4xl font-bold text-primary">
                          {pkg.price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {isBn ? "যোগাযোগ করুন" : "Contact Us"}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground bn">
                    {isBn ? pkg.descriptionBn : pkg.description}
                  </p>
                </div>

                <div className="mb-6 flex-1 space-y-2">
                  {(isBn ? pkg.featuresBn : pkg.features).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-green-400" />
                      <span className="bn">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={pkg.popular ? "gradient" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={`/${locale}/order?package=${pkg.id}`}>
                    {isBn ? "অর্ডার করুন" : "Order Now"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Custom quote */}
        <FadeInUp delay={0.3}>
          <div className="mt-12 text-center">
            <GlassCard className="inline-block">
              <p className="text-sm text-muted-foreground bn">
                <Sparkles className="mr-1 inline h-4 w-4 text-primary" />
                {isBn
                  ? "আপনার প্রজেক্ট কি এর বাইরে? কাস্টম কোটের জন্য যোগাযোগ করুন!"
                  : "Your project is different? Contact us for a custom quote!"}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
