"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import {
  Package,
  Palette,
  FileText,
  User,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ── Order Wizard ───────────────────────────────────────
// Multi-step form: Package → Design → Details → Contact → Review

interface OrderWizardProps {
  locale?: string;
}

interface OrderData {
  packageType: string;
  websiteType: string;
  numPages: string;
  description: string;
  colorPreference: string;
  referenceSites: string;
  features: string[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientWhatsapp: string;
  clientCompany: string;
  budgetRange: string;
  timeline: string;
}

const websiteTypes = [
  { value: "portfolio", label: "পোর্টফোলিও", labelEn: "Portfolio" },
  { value: "business", label: "ব্যবসায়িক", labelEn: "Business" },
  { value: "ecommerce", label: "ই-কমার্স", labelEn: "E-Commerce" },
  { value: "education", label: "শিক্ষা প্রতিষ্ঠান", labelEn: "Education" },
  { value: "blood_org", label: "রক্ত সংগঠন", labelEn: "Blood Organization" },
  { value: "news_portal", label: "নিউজ পোর্টাল", labelEn: "News Portal" },
  { value: "landing_page", label: "ল্যান্ডিং পেজ", labelEn: "Landing Page" },
  { value: "custom", label: "কাস্টম", labelEn: "Custom" },
];

const featureOptions = [
  { value: "responsive", label: "রেসপনসিভ ডিজাইন", labelEn: "Responsive Design" },
  { value: "seo", label: "SEO অপটিমাইজেশন", labelEn: "SEO Optimization" },
  { value: "blog", label: "ব্লগ সেকশন", labelEn: "Blog Section" },
  { value: "contact_form", label: "কন্টাক্ট ফর্ম", labelEn: "Contact Form" },
  { value: "map", label: "Google Maps", labelEn: "Google Maps" },
  { value: "payment", label: "পেমেন্ট ইন্টিগ্রেশন", labelEn: "Payment Integration" },
  { value: "auth", label: "লগইন/সাইনআপ", labelEn: "Login/Signup" },
  { value: "admin", label: "অ্যাডমিন প্যানেল", labelEn: "Admin Panel" },
  { value: "multilang", label: "মাল্টি-ল্যাংগুয়েজ", labelEn: "Multi-Language" },
  { value: "analytics", label: "অ্যানালিটিক্স", labelEn: "Analytics" },
];

const budgetRanges = [
  { value: "5k-10k", label: "৳5,000 - ৳10,000" },
  { value: "10k-20k", label: "৳10,000 - ৳20,000" },
  { value: "20k-35k", label: "৳20,000 - ৳35,000" },
  { value: "35k-50k", label: "৳35,000 - ৳50,000" },
  { value: "50k+", label: "৳50,000+" },
];

const timelineOptions = [
  { value: "1-week", label: "১ সপ্তাহ", labelEn: "1 Week" },
  { value: "2-weeks", label: "২ সপ্তাহ", labelEn: "2 Weeks" },
  { value: "1-month", label: "১ মাস", labelEn: "1 Month" },
  { value: "flexible", label: "ফ্লেক্সিবল", labelEn: "Flexible" },
];

export function OrderWizard({ locale = "bn" }: OrderWizardProps) {
  const isBn = locale === "bn";
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("package") || "";

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [data, setData] = useState<OrderData>({
    packageType: preselectedPackage || "basic",
    websiteType: "",
    numPages: "",
    description: "",
    colorPreference: "",
    referenceSites: "",
    features: [],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientWhatsapp: "",
    clientCompany: "",
    budgetRange: "",
    timeline: "",
  });

  const updateData = (field: keyof OrderData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const steps = [
    { icon: Package, title: isBn ? "প্যাকেজ" : "Package" },
    { icon: Palette, title: isBn ? "ডিজাইন" : "Design" },
    { icon: FileText, title: isBn ? "বিস্তারিত" : "Details" },
    { icon: User, title: isBn ? "যোগাযোগ" : "Contact" },
    { icon: CheckCircle2, title: isBn ? "রিভিউ" : "Review" },
  ];

  const canNext = () => {
    switch (step) {
      case 0: return data.packageType && data.websiteType;
      case 1: return true;
      case 2: return data.description;
      case 3: return data.clientName && data.clientEmail && data.clientPhone;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const [orderId] = useState(
    () => Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  if (isSubmitted) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <FadeInUp>
            <GlassCard>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold bn">
                {isBn ? "অর্ডার সফলভাবে জমা হয়েছে!" : "Order Submitted Successfully!"}
              </h2>
              <p className="mt-4 text-muted-foreground bn">
                {isBn
                  ? "আপনার অর্ডার পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
                  : "We received your order. We will contact you shortly."}
              </p>
              <Badge variant="success" className="mt-4">
                {isBn ? "অর্ডার ID: #" : "Order ID: #"}
                {orderId}
              </Badge>
            </GlassCard>
          </FadeInUp>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle
          badge={isBn ? "🛒 ওয়েবসাইট অর্ডার" : "🛒 Order Website"}
          title="Order Your Website"
          titleBn="আপনার ওয়েবসাইট অর্ডার করুন"
          subtitle={
            isBn
              ? "কয়েকটি সহজ ধাপে আপনার স্বপ্নের ওয়েবসাইট অর্ডার করুন"
              : "Order your dream website in a few simple steps"
          }
          locale={locale}
        />

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  i <= step
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 transition-all ${
                    i < step ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <GlassCard>
          {/* Step 1: Package Selection */}
          {step === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">
                {isBn ? "প্যাকেজ ও ওয়েবসাইট টাইপ বেছে নিন" : "Choose Package & Website Type"}
              </h3>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "প্যাকেজ" : "Package"}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["basic", "standard", "premium", "enterprise"].map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => updateData("packageType", pkg)}
                      className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                        data.packageType === pkg
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "ওয়েবসাইট টাইপ" : "Website Type"}</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {websiteTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateData("websiteType", type.value)}
                      className={`rounded-lg border-2 p-3 text-xs font-medium transition-all bn ${
                        data.websiteType === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {isBn ? type.label : type.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design Preferences */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "ডিজাইন পছন্দ" : "Design Preferences"}</h3>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "পছন্দের রং" : "Color Preference"}</label>
                <input
                  type="text"
                  value={data.colorPreference}
                  onChange={(e) => updateData("colorPreference", e.target.value)}
                  placeholder={isBn ? "যেমন: নীল, সবুজ, কালো..." : "e.g., Blue, Green, Dark..."}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "রেফারেন্স সাইট" : "Reference Sites"}</label>
                <input
                  type="text"
                  value={data.referenceSites}
                  onChange={(e) => updateData("referenceSites", e.target.value)}
                  placeholder={isBn ? "যেমন: example.com, site.com" : "e.g., example.com, site.com"}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "ফিচার সমূহ" : "Features Needed"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature.value}
                      onClick={() => toggleFeature(feature.value)}
                      className={`rounded-lg border-2 p-2 text-xs transition-all bn ${
                        data.features.includes(feature.value)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {isBn ? feature.label : feature.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Project Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "প্রজেক্টের বিস্তারিত" : "Project Details"}</h3>

              <div>
                <label className="mb-2 block text-sm font-medium bn">{isBn ? "প্রজেক্টের বিবরণ" : "Project Description"}</label>
                <textarea
                  value={data.description}
                  onChange={(e) => updateData("description", e.target.value)}
                  placeholder={isBn ? "আপনার প্রজেক্ট সম্পর্কে বিস্তারিত লিখুন..." : "Describe your project in detail..."}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "বাজেট" : "Budget"}</label>
                  <select
                    value={data.budgetRange}
                    onChange={(e) => updateData("budgetRange", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm bn"
                  >
                    <option value="">{isBn ? "বেছে নিন" : "Select"}</option>
                    {budgetRanges.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "টাইমলাইন" : "Timeline"}</label>
                  <select
                    value={data.timeline}
                    onChange={(e) => updateData("timeline", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm bn"
                  >
                    <option value="">{isBn ? "বেছে নিন" : "Select"}</option>
                    {timelineOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {isBn ? t.label : t.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "যোগাযোগের তথ্য" : "Contact Information"}</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "নাম *" : "Name *"}</label>
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => updateData("clientName", e.target.value)}
                    placeholder={isBn ? "আপনার নাম" : "Your name"}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "কোম্পানি" : "Company"}</label>
                  <input
                    type="text"
                    value={data.clientCompany}
                    onChange={(e) => updateData("clientCompany", e.target.value)}
                    placeholder={isBn ? "কোম্পানির নাম" : "Company name"}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "ইমেইল *" : "Email *"}</label>
                  <input
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => updateData("clientEmail", e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "ফোন *" : "Phone *"}</label>
                  <input
                    type="tel"
                    value={data.clientPhone}
                    onChange={(e) => updateData("clientPhone", e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium bn">{isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}</label>
                  <input
                    type="tel"
                    value={data.clientWhatsapp}
                    onChange={(e) => updateData("clientWhatsapp", e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "অর্ডার রিভিউ" : "Review Your Order"}</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "প্যাকেজ" : "Package"}</span>
                  <span className="font-medium">{data.packageType.charAt(0).toUpperCase() + data.packageType.slice(1)}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "ওয়েবসাইট টাইপ" : "Website Type"}</span>
                  <span className="font-medium bn">
                    {websiteTypes.find((t) => t.value === data.websiteType)?.[isBn ? "label" : "labelEn"] || data.websiteType}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "নাম" : "Name"}</span>
                  <span className="font-medium">{data.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "ইমেইল" : "Email"}</span>
                  <span className="font-medium">{data.clientEmail}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "ফোন" : "Phone"}</span>
                  <span className="font-medium">{data.clientPhone}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "বাজেট" : "Budget"}</span>
                  <span className="font-medium">{data.budgetRange || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground bn">{isBn ? "ফিচার" : "Features"}</span>
                  <span className="font-medium">{data.features.length > 0 ? data.features.length : "—"}</span>
                </div>
              </div>

              {data.description && (
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground bn">{isBn ? "বিবরণ" : "Description"}</p>
                  <p className="rounded-lg bg-background p-3 text-sm bn">{data.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              {isBn ? "পিছনে" : "Back"}
            </Button>

            {step < 4 ? (
              <Button
                variant="default"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
              >
                {isBn ? "পরবর্তী" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isBn ? "জমা হচ্ছে..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {isBn ? "অর্ডার জমা দিন" : "Submit Order"}
                  </>
                )}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
