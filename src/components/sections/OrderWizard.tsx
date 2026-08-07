"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  TextField,
  TextAreaField,
  SelectField,
  ChipGroup,
} from "@/components/ui/form";
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
  Sparkles,
} from "lucide-react";

// ── Order Wizard ───────────────────────────────────────
// Multi-step form: Package → Design → Details → Contact → Review
// Phase 31: unified form kit + inline validation + feature count.

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{5,24}$/;

export function OrderWizard({ locale = "bn" }: OrderWizardProps) {
  const isBn = locale === "bn";
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("package") || "";

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({});

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
    // Clear the inline error for the field being edited.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
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

  // ── Per-step validation (returns error map for visible fields) ──
  const validateStep = (current: number): Partial<Record<keyof OrderData, string>> => {
    const errs: Partial<Record<keyof OrderData, string>> = {};
    if (current === 0) {
      if (!data.packageType) errs.packageType = isBn ? "প্যাকেজ বাছাই করুন" : "Please choose a package";
      if (!data.websiteType) errs.websiteType = isBn ? "ওয়েবসাইটের ধরন বাছাই করুন" : "Please choose a website type";
    }
    if (current === 2) {
      if (!data.description.trim())
        errs.description = isBn ? "প্রজেক্টের বিবরণ লিখুন" : "Please describe your project";
    }
    if (current === 3) {
      if (!data.clientName.trim())
        errs.clientName = isBn ? "আপনার নাম লিখুন" : "Please enter your name";
      if (!data.clientEmail.trim()) {
        errs.clientEmail = isBn ? "ইমেইল লিখুন" : "Please enter your email";
      } else if (!EMAIL_RE.test(data.clientEmail.trim())) {
        errs.clientEmail = isBn ? "সঠিক ইমেইল দিন" : "Enter a valid email address";
      }
      if (!data.clientPhone.trim()) {
        errs.clientPhone = isBn ? "ফোন নম্বর লিখুন" : "Please enter your phone number";
      } else if (!PHONE_RE.test(data.clientPhone.trim())) {
        errs.clientPhone = isBn ? "সঠিক ফোন নম্বর দিন" : "Enter a valid phone number";
      }
    }
    return errs;
  };

  const canAdvance = (): boolean => {
    const errs = validateStep(step);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    // Validate the final contact step once more before submitting.
    const errs = validateStep(3);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_type: data.packageType,
          website_type: data.websiteType,
          num_pages: data.numPages ? Number(data.numPages) : 1,
          description: data.description,
          color_preference: data.colorPreference,
          reference_sites: data.referenceSites
            .split(/[\n,]/)
            .map((site) => site.trim())
            .filter(Boolean),
          features: data.features,
          client_name: data.clientName,
          client_email: data.clientEmail,
          client_phone: data.clientPhone,
          client_whatsapp: data.clientWhatsapp,
          client_company: data.clientCompany,
          budget_range: data.budgetRange,
          timeline: data.timeline,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setSubmitError(
          isBn
            ? "অর্ডার জমা দেওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
            : "We could not submit your order. Please try again."
        );
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError(
        isBn
          ? "নেটওয়ার্ক সমস্যার কারণে অর্ডার জমা দেওয়া যায়নি।"
          : "Your order could not be submitted because of a network problem."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {isBn ? "অর্ডারটি নিরাপদে গ্রহণ করা হয়েছে" : "Your order was received securely"}
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
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  i <= step
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground"
                } ${i < step ? "cursor-pointer hover:bg-primary/30" : "cursor-default"}`}
              >
                <s.icon className="h-4 w-4" />
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 transition-all ${i < step ? "bg-primary" : "bg-border"}`}
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

              <FormField
                id="packageType"
                label={isBn ? "প্যাকেজ" : "Package"}
                required
                error={errors.packageType}
              >
                <ChipGroup
                  options={["basic", "standard", "premium", "enterprise"].map((pkg) => ({
                    value: pkg,
                    label: pkg.charAt(0).toUpperCase() + pkg.slice(1),
                  }))}
                  value={data.packageType}
                  onChange={(v) => updateData("packageType", v)}
                  columns={4}
                />
              </FormField>

              <FormField
                id="websiteType"
                label={isBn ? "ওয়েবসাইট টাইপ" : "Website Type"}
                required
                error={errors.websiteType}
              >
                <ChipGroup
                  options={websiteTypes.map((t) => ({
                    value: t.value,
                    label: isBn ? t.label : t.labelEn,
                  }))}
                  value={data.websiteType}
                  onChange={(v) => updateData("websiteType", v)}
                  columns={4}
                />
              </FormField>
            </div>
          )}

          {/* Step 2: Design Preferences */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "ডিজাইন পছন্দ" : "Design Preferences"}</h3>

              <FormField
                id="colorPreference"
                label={isBn ? "পছন্দের রং" : "Color Preference"}
                hint={isBn ? "যেমন: নীল, সবুজ, কালো..." : "e.g., Blue, Green, Dark..."}
              >
                <TextField
                  id="colorPreference"
                  value={data.colorPreference}
                  onChange={(e) => updateData("colorPreference", e.target.value)}
                  placeholder={isBn ? "যেমন: নীল, সবুজ, কালো..." : "e.g., Blue, Green, Dark..."}
                />
              </FormField>

              <FormField
                id="referenceSites"
                label={isBn ? "রেফারেন্স সাইট" : "Reference Sites"}
                hint={isBn ? "কমা দিয়ে আলাদা করুন" : "Separate multiple sites with commas"}
              >
                <TextField
                  id="referenceSites"
                  value={data.referenceSites}
                  onChange={(e) => updateData("referenceSites", e.target.value)}
                  placeholder={isBn ? "যেমন: example.com, site.com" : "e.g., example.com, site.com"}
                />
              </FormField>

              <FormField
                id="features"
                label={isBn ? "ফিচার সমূহ" : "Features Needed"}
                hint={
                  data.features.length > 0
                    ? isBn
                      ? `${data.features.length}টি ফিচার বাছাই করা হয়েছে`
                      : `${data.features.length} features selected`
                    : isBn
                      ? "প্রয়োজনীয় ফিচারগুলো বেছে নিন"
                      : "Select the features you need"
                }
              >
                <ChipGroup
                  options={featureOptions.map((f) => ({
                    value: f.value,
                    label: isBn ? f.label : f.labelEn,
                  }))}
                  value={data.features}
                  onChange={toggleFeature}
                  multi
                  columns={2}
                />
              </FormField>
            </div>
          )}

          {/* Step 3: Project Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "প্রজেক্টের বিস্তারিত" : "Project Details"}</h3>

              <FormField
                id="description"
                label={isBn ? "প্রজেক্টের বিবরণ" : "Project Description"}
                required
                error={errors.description}
              >
                <TextAreaField
                  id="description"
                  value={data.description}
                  onChange={(e) => updateData("description", e.target.value)}
                  placeholder={
                    isBn
                      ? "আপনার প্রজেক্ট সম্পর্কে বিস্তারিত লিখুন..."
                      : "Describe your project in detail..."
                  }
                  rows={4}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="budgetRange" label={isBn ? "বাজেট" : "Budget"}>
                  <SelectField
                    id="budgetRange"
                    value={data.budgetRange}
                    onChange={(e) => updateData("budgetRange", e.target.value)}
                    placeholder={isBn ? "বেছে নিন" : "Select"}
                  >
                    {budgetRanges.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </SelectField>
                </FormField>

                <FormField id="timeline" label={isBn ? "টাইমলাইন" : "Timeline"}>
                  <SelectField
                    id="timeline"
                    value={data.timeline}
                    onChange={(e) => updateData("timeline", e.target.value)}
                    placeholder={isBn ? "বেছে নিন" : "Select"}
                  >
                    {timelineOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {isBn ? t.label : t.labelEn}
                      </option>
                    ))}
                  </SelectField>
                </FormField>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold bn">{isBn ? "যোগাযোগের তথ্য" : "Contact Information"}</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="clientName"
                  label={isBn ? "নাম" : "Name"}
                  required
                  error={errors.clientName}
                >
                  <TextField
                    id="clientName"
                    value={data.clientName}
                    onChange={(e) => updateData("clientName", e.target.value)}
                    placeholder={isBn ? "আপনার নাম" : "Your name"}
                    invalid={!!errors.clientName}
                  />
                </FormField>
                <FormField id="clientCompany" label={isBn ? "কোম্পানি" : "Company"}>
                  <TextField
                    id="clientCompany"
                    value={data.clientCompany}
                    onChange={(e) => updateData("clientCompany", e.target.value)}
                    placeholder={isBn ? "কোম্পানির নাম" : "Company name"}
                  />
                </FormField>
                <FormField
                  id="clientEmail"
                  label={isBn ? "ইমেইল" : "Email"}
                  required
                  error={errors.clientEmail}
                >
                  <TextField
                    id="clientEmail"
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => updateData("clientEmail", e.target.value)}
                    placeholder="email@example.com"
                    invalid={!!errors.clientEmail}
                  />
                </FormField>
                <FormField
                  id="clientPhone"
                  label={isBn ? "ফোন" : "Phone"}
                  required
                  error={errors.clientPhone}
                >
                  <TextField
                    id="clientPhone"
                    type="tel"
                    value={data.clientPhone}
                    onChange={(e) => updateData("clientPhone", e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    invalid={!!errors.clientPhone}
                  />
                </FormField>
                <FormField
                  id="clientWhatsapp"
                  label={isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
                  hint={isBn ? "ঐচ্ছিক" : "Optional"}
                  className="sm:col-span-2"
                >
                  <TextField
                    id="clientWhatsapp"
                    type="tel"
                    value={data.clientWhatsapp}
                    onChange={(e) => updateData("clientWhatsapp", e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </FormField>
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
                  <span className="font-medium">
                    {data.features.length > 0
                      ? isBn
                        ? `${data.features.length}টি`
                        : `${data.features.length}`
                      : "—"}
                  </span>
                </div>
              </div>

              {data.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {featureOptions
                    .filter((f) => data.features.includes(f.value))
                    .map((f) => (
                      <Badge key={f.value} variant="outline">
                        {isBn ? f.label : f.labelEn}
                      </Badge>
                    ))}
                </div>
              )}

              {data.description && (
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground bn">{isBn ? "বিবরণ" : "Description"}</p>
                  <p className="rounded-lg bg-background p-3 text-sm bn">{data.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <span className="bn">
                  {isBn
                    ? "অর্ডার জমা দিলে আমরা ইমেইলে কনফার্মেশন পাঠাব এবং শীঘ্রই যোগাযোগ করব।"
                    : "After submitting, you'll receive an email confirmation and we'll contact you shortly."}
                </span>
              </div>
            </div>
          )}

          {submitError && (
            <p className="mt-6 text-center text-sm text-destructive" role="alert">
              {submitError}
            </p>
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
                onClick={handleNext}
                disabled={!canAdvance() && Object.keys(errors).length === 0}
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
