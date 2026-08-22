"use client";

import { useEffect, useRef, useState } from "react";
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
import { LiveQuoteEstimate } from "@/components/sections/LiveQuoteEstimate";
import { FadeInUp } from "@/components/animations/FadeIn";
import {
  Package,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  HelpCircle,
  Phone,
  ShieldCheck,
  Info,
  Mail,
  MessageCircle,
  Zap,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics/tracker";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import { calculateLiveQuote, formatQuoteAmount } from "@/lib/orders/quote";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import { DEFAULT_CONTACT_CONFIG } from "@/lib/contact/config";
import type { OrdersConfig } from "@/types/orders";
import type { ServicesConfig } from "@/types/services";

// ── Order Wizard — Simple 3-step flow ─────────────────
// Goal: anyone can place an order in ~1 minute with minimal taps.
//   1) কী বানাবেন  — package + website type (auto-advances when both chosen)
//   2) প্রজেক্ট     — pages + optional description, extras tucked away
//   3) যোগাযোগ ও অর্ডার — name/phone/email + compact summary + submit
// A WhatsApp shortcut is always available for people who prefer to skip forms.

interface OrderWizardProps {
  locale?: string;
}

interface OrderData {
  packageType: string;
  websiteType: string;
  designStyle: string;
  numPages: number;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{5,24}$/;

export function OrderWizard({ locale = "bn" }: OrderWizardProps) {
  const isBn = locale === "bn";
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("package") || "";
  const initialPackage =
    DEFAULT_ORDERS_CONFIG.packages.find(
      (pkg) => pkg.visible && pkg.value === preselectedPackage
    )?.value ?? DEFAULT_ORDERS_CONFIG.packages.find((pkg) => pkg.visible)?.value ?? "";

  const [config, setConfig] = useState<OrdersConfig>(DEFAULT_ORDERS_CONFIG);
  const [servicesConfig, setServicesConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);
  const [whatsappUrl, setWhatsappUrl] = useState(
    DEFAULT_CONTACT_CONFIG.quickLinks.whatsappUrl
  );

  const visiblePackages = config.packages.filter((p) => p.visible);
  const visibleWebsiteTypes = config.websiteTypes.filter((t) => t.visible);
  const visibleAddons = config.featureAddons.filter((f) => f.visible);
  const visibleDesignStyles = config.designStyles.filter((d) => d.visible);
  const visibleBudgetRanges = config.budgetRanges.filter((b) => b.visible);
  const visibleTimelines = config.timelineOptions.filter((t) => t.visible);

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({});

  const wizardRef = useRef<HTMLDivElement>(null);
  const orderStartFiredRef = useRef(false);
  const orderCompleteFiredRef = useRef(false);
  const submitLockRef = useRef(false);

  const [data, setData] = useState<OrderData>({
    packageType: initialPackage,
    websiteType: "",
    designStyle: "",
    numPages: 1,
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

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

    async function loadPricingConfig() {
      try {
        const [ordersResponse, servicesResponse, contactResponse] = await Promise.all([
          fetch("/api/orders-config", { cache: "no-store", signal: controller.signal }),
          fetch("/api/services-config", { cache: "no-store", signal: controller.signal }),
          fetch("/api/contact-config", { cache: "no-store", signal: controller.signal }),
        ]);
        const [ordersJson, servicesJson, contactJson] = await Promise.all([
          ordersResponse.ok ? ordersResponse.json() : null,
          servicesResponse.ok ? servicesResponse.json() : null,
          contactResponse.ok ? contactResponse.json() : null,
        ]);
        if (controller.signal.aborted) return;

        const orders = validateOrdersConfig(
          (ordersJson as { data?: unknown } | null)?.data
        ) ?? DEFAULT_ORDERS_CONFIG;
        const services = validateServicesConfig(
          (servicesJson as { data?: unknown } | null)?.data
        ) ?? DEFAULT_SERVICES_CONFIG;
        setConfig(orders);
        setServicesConfig(services);

        const contactRaw = (contactJson as { data?: unknown } | null)?.data as
          | { quickLinks?: { whatsappUrl?: unknown } }
          | null;
        const wa = contactRaw?.quickLinks?.whatsappUrl;
        if (typeof wa === "string" && /^(https?|whatsapp):\/\//i.test(wa)) {
          setWhatsappUrl(wa);
        }

        const allowedPackages = orders.packages.filter((pkg) => pkg.visible);
        const requestedPackage = allowedPackages.find(
          (pkg) => pkg.value === preselectedPackage
        )?.value;
        setData((previous) => {
          if (requestedPackage && requestedPackage !== previous.packageType) {
            return { ...previous, packageType: requestedPackage };
          }
          return allowedPackages.some((pkg) => pkg.value === previous.packageType)
            ? previous
            : { ...previous, packageType: allowedPackages[0]?.value ?? "" };
        });
      } catch {
        // defaults remain
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    void loadPricingConfig();
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [preselectedPackage]);

  // Scroll wizard top into view when step changes
  useEffect(() => {
    if (wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // ── Phase 6 analytics: order_start once per session ──
  useEffect(() => {
    if (orderStartFiredRef.current) return;
    orderStartFiredRef.current = true;
    try {
      const key = "rv_order_start_fired";
      if (typeof window !== "undefined" && window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {}
    trackEvent("order_start", { category: "conversion", metadata: { locale } });
  }, [locale]);

  // ── Phase 6 mobile UX: keep focused fields visible when keyboard opens ──
  useEffect(() => {
    const container = wizardRef.current;
    if (!container) return;
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isField =
        target.matches("input, textarea, select") ||
        target.matches("button[role=\"radio\"], button[role=\"checkbox\"]");
      if (!isField) return;
      window.setTimeout(() => {
        try {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {}
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const bottomOverlap = 96;
        if (rect.bottom > viewportHeight - bottomOverlap) {
          window.scrollBy({ top: rect.bottom - (viewportHeight - bottomOverlap) + 16, behavior: "smooth" });
        }
      }, 280);
    };
    container.addEventListener("focusin", onFocusIn);
    const vv = window.visualViewport;
    const onResize = () => {
      const active = document.activeElement as HTMLElement | null;
      if (active && active.matches("input, textarea, select")) {
        active.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    vv?.addEventListener("resize", onResize);
    return () => {
      container.removeEventListener("focusin", onFocusIn);
      vv?.removeEventListener("resize", onResize);
    };
  }, []);

  const updateData = <K extends keyof OrderData>(field: K, value: OrderData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (field === "packageType" && typeof value === "string" && value) {
      trackEvent("service_select", {
        category: "conversion",
        label: value,
        metadata: { package_id: value, location: "order_wizard", locale },
      });
    }
  };

  const toggleFeature = (feature: string) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const quoteEstimate = calculateLiveQuote(
    {
      packageValue: data.packageType,
      pages: data.numPages,
      featureValues: data.features,
    },
    servicesConfig.packages,
    visibleAddons,
    config.quote
  );

  const selectedPricingPackage = servicesConfig.packages.find(
    (pkg) => pkg.visible && pkg.orderValue === data.packageType
  );

  const packagePriceLabel = (packageValue: string) => {
    const pricing = servicesConfig.packages.find(
      (pkg) => pkg.visible && pkg.orderValue === packageValue
    );
    if (!pricing) return "";
    if (pricing.priceBdt <= 0) return isBn ? "কাস্টম কোট" : "Custom quote";
    return formatQuoteAmount(pricing.priceBdt, "BDT", locale);
  };

  // ── 3 simple steps ──
  const steps = [
    { icon: Package, title: isBn ? "কী বানাবেন" : "What to build" },
    { icon: FileText, title: isBn ? "প্রজেক্ট" : "Project" },
    { icon: CheckCircle2, title: isBn ? "যোগাযোগ ও অর্ডার" : "Contact & order" },
  ];

  // ── Validation per step (only what is truly required) ──
  const validateStep = (current: number): Partial<Record<keyof OrderData, string>> => {
    const errs: Partial<Record<keyof OrderData, string>> = {};
    if (current === 0) {
      if (!data.packageType) errs.packageType = isBn ? "একটি প্যাকেজ বাছাই করুন" : "Please choose a package";
      if (!data.websiteType) errs.websiteType = isBn ? "ওয়েবসাইটের ধরন বাছাই করুন" : "Please choose a website type";
    }
    if (current === 2) {
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

  const scrollToFirstError = (errs: Partial<Record<keyof OrderData, string>>) => {
    const firstKey = Object.keys(errs)[0] as keyof OrderData | undefined;
    if (!firstKey) return;
    const el =
      document.getElementById(firstKey) ||
      document.getElementById(`q-${firstKey}`) ||
      document.querySelector(`[data-field="${firstKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const headerOffset = 80;
        const bottomNavOffset = 96;
        if (rect.top < headerOffset) {
          window.scrollBy({ top: rect.top - headerOffset - 12, behavior: "smooth" });
        } else if (rect.bottom > window.innerHeight - bottomNavOffset) {
          window.scrollBy({ top: rect.bottom - (window.innerHeight - bottomNavOffset) + 12, behavior: "smooth" });
        }
      }, 360);
      const focusable = el.querySelector<HTMLElement>("input, textarea, select, button");
      if (focusable) {
        setTimeout(() => {
          try {
            focusable.focus({ preventScroll: true } as FocusOptions);
          } catch {
            focusable.focus();
          }
        }, 380);
      } else if (el instanceof HTMLElement) {
        const chip = el.querySelector<HTMLElement>('button[role="radio"], button[role="checkbox"]');
        chip?.focus();
      }
    }
  };

  const goNext = () => {
    const completedStep = step + 1; // 1-based for analytics
    trackEvent("order_step_complete", {
      category: "conversion",
      label: String(completedStep),
      metadata: { step: completedStep, locale },
    });
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      requestAnimationFrame(() => setTimeout(() => scrollToFirstError(errs), 60));
      return;
    }
    setErrors({});
    goNext();
  };

  // Auto-advance once both quick taps on step 1 are done — zero "Next" clicks.
  const selectPackage = (value: string) => {
    updateData("packageType", value);
    if (step === 0 && value && data.websiteType) {
      window.setTimeout(() => goNext(), 320);
    }
  };
  const selectWebsiteType = (value: string) => {
    updateData("websiteType", value);
    if (step === 0 && value && data.packageType) {
      window.setTimeout(() => goNext(), 320);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (submitLockRef.current) return;
    const allErrs: Partial<Record<keyof OrderData, string>> = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      const stepWithError = [0, 1, 2].find((s) =>
        Object.keys(validateStep(s)).some((k) => k in allErrs)
      );
      if (stepWithError !== undefined) setStep(stepWithError);
      setTimeout(() => scrollToFirstError(allErrs), 120);
      return;
    }

    submitLockRef.current = true;
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_type: data.packageType,
          website_type: data.websiteType,
          design_style: data.designStyle,
          num_pages: data.numPages || 1,
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

      if (!orderCompleteFiredRef.current) {
        orderCompleteFiredRef.current = true;
        trackEvent("order_complete", {
          category: "conversion",
          metadata: { locale, package_id: data.packageType },
        });
      }
      setIsSubmitted(true);
    } catch {
      setSubmitError(
        isBn
          ? "নেটওয়ার্ক সমস্যার কারণে অর্ডার জমা দেওয়া যায়নি। ইন্টারনেট চেক করে আবার চেষ্টা করুন।"
          : "Your order could not be submitted because of a network problem. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // WhatsApp quick-order: prefills a message so anyone can order without the form.
  const waPackageLabel = visiblePackages.find((p) => p.value === data.packageType)?.[isBn ? "labelBn" : "labelEn"] ?? "";
  const waTypeLabel = visibleWebsiteTypes.find((t) => t.value === data.websiteType)?.[isBn ? "labelBn" : "labelEn"] ?? "";
  const waMessage = isBn
    ? `আসসালামু আলাইকুম! আমি একটি ওয়েবসাইট অর্ডার করতে চাই।\nপ্যাকেজ: ${waPackageLabel}\nটাইপ: ${waTypeLabel}\nপেজ: ${data.numPages}টি`
    : `Hi! I'd like to order a website.\nPackage: ${waPackageLabel}\nType: ${waTypeLabel}\nPages: ${data.numPages}`;
  const whatsappHref = `${whatsappUrl}${whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(waMessage)}`;

  const handleWhatsappClick = () => {
    trackEvent("whatsapp_click", {
      category: "conversion",
      label: "order_wizard_quick_order",
      metadata: { location: "order_wizard", locale },
    });
  };

  if (isSubmitted) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <FadeInUp>
            <GlassCard className="text-left sm:text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-heading-md font-bold bn text-center">
                {isBn ? config.cta.successTitleBn : config.cta.successTitleEn}
              </h2>
              <p className="mt-3 text-muted-foreground bn text-center">
                {isBn ? config.cta.successMessageBn : config.cta.successMessageEn}
              </p>
              <Badge variant="success" className="mt-4 mx-auto">
                {isBn ? "অর্ডারটি নিরাপদে গ্রহণ করা হয়েছে" : "Your order was received securely"}
              </Badge>

              <div className="mt-8 space-y-4 text-left">
                <div className="rounded-xl border border-border/60 bg-card/40 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold bn">
                    <Info className="h-4 w-4 text-primary" />
                    {isBn ? "এরপর কী হবে?" : "What happens next?"}
                  </h3>
                  <ol className="mt-3 space-y-2 text-sm text-muted-foreground bn list-decimal list-inside leading-relaxed">
                    <li>{isBn ? "আমরা আপনার প্রয়োজনগুলো পর্যালোচনা করব।" : "We'll review your requirements carefully."}</li>
                    <li>
                      {isBn
                        ? "আপনার বেছে নেওয়া মাধ্যমে — ইমেইল, ফোন বা হোয়াটসঅ্যাপ — যোগাযোগ করে বিস্তারিত চূড়ান্ত করব।"
                        : "We'll contact you through your selected method — email, phone or WhatsApp — to finalize the details."}
                    </li>
                    <li>
                      {isBn
                        ? "আলোচনার পর কাস্টম পরিধি ও কোট নিশ্চিত করা হবে — এখন কোনো পেমেন্টের প্রয়োজন নেই।"
                        : "After the discussion your custom scope and quote will be confirmed — no payment is required now."}
                    </li>
                  </ol>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="text-sm leading-relaxed bn">
                    <p className="font-semibold text-foreground">
                      {isBn ? "এখন কোনো পেমেন্টের প্রয়োজন নেই" : "No payment required now"}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {isBn
                        ? "এই অনুরোধ জমা দেওয়া একটি ফ্রি পরামর্শ ও কাস্টম প্রজেক্ট কোটের প্রক্রিয়া শুরু করে। চূড়ান্ত কোট অনুমোদনের পরেই পেমেন্টের বিষয় আসবে।"
                        : "Submitting this request starts a free consultation and custom project quote. Payment is only discussed after you approve the final quote."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{isBn ? "ইমেইলে কনফার্মেশন পাঠানো হয়েছে" : "Confirmation sent to your email"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{isBn ? "প্রয়োজনে ফোন/হোয়াটসঅ্যাপে যোগাযোগ" : "We'll reach you by phone/WhatsApp if needed"}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeInUp>
        </div>
      </section>
    );
  }

  return (
    <section ref={wizardRef} className="py-20 scroll-mt-24 scroll-pb-28 pb-28 sm:pb-20" id="order-wizard">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle
          badge={isBn ? config.section.badgeBn : config.section.badgeEn}
          title={isBn ? config.section.titleBn : config.section.titleEn}
          titleBn={isBn ? config.section.titleBn : config.section.titleEn}
          subtitle={isBn ? config.section.subtitleBn : config.section.subtitleEn}
          locale={locale}
        />

        {/* Progress + percentage */}
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="bn">
            {isBn ? `ধাপ ${step + 1} / ${steps.length}` : `Step ${step + 1} / ${steps.length}`}
          </span>
          <span className="bn inline-flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" />
            {isBn ? "মাত্র ৩টি সহজ ধাপ" : "Just 3 easy steps"}
          </span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-1.5 sm:gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                aria-label={s.title}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  i === step
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : i < step
                      ? "border-primary bg-primary/15 text-primary hover:bg-primary/25 cursor-pointer"
                      : "border-border text-muted-foreground cursor-default"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </button>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-10 transition-all ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mb-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <span
                className={`whitespace-nowrap leading-tight ${i === step ? "text-primary font-semibold" : i < step ? "text-primary/70" : ""}`}
              >
                {s.title}
              </span>
              {i < steps.length - 1 && <span className="mx-3 text-border">•</span>}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <GlassCard>
          {/* STEP 1: Package + Website Type */}
          {step === 0 && (
            <div className="space-y-5">
              <div
                id="q-packageType"
                data-field="packageType"
                className={`rounded-2xl border p-4 sm:p-5 ${errors.packageType ? "border-destructive/60 bg-destructive/5" : "border-border/60 bg-card/30"}`}
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold bn flex items-center gap-1.5">
                      {isBn ? "কোন প্যাকেজটি নিতে চান?" : "Which package would you like?"}
                      <span className="text-destructive">*</span>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground bn">
                      {isBn ? "একটি ট্যাপ করুন — দাম সহ দেখানো আছে" : "Tap one — price shown"}
                    </p>
                  </div>
                </div>

                <div id="packageType">
                  <ChipGroup
                    options={visiblePackages.map((pkg) => {
                      const price = packagePriceLabel(pkg.value);
                      return {
                        value: pkg.value,
                        label: `${isBn ? pkg.labelBn : pkg.labelEn}${price ? ` · ${price}` : ""}`,
                      };
                    })}
                    value={data.packageType}
                    onChange={selectPackage}
                    columns={2}
                    invalid={!!errors.packageType}
                  />
                </div>
                {errors.packageType && (
                  <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {errors.packageType}
                  </p>
                )}
                {selectedPricingPackage && (
                  <p className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground bn border border-primary/10">
                    <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                    {isBn ? "নির্বাচিত:" : "Selected:"} {isBn ? selectedPricingPackage.nameBn : selectedPricingPackage.nameEn} — {isBn ? selectedPricingPackage.descriptionBn : selectedPricingPackage.descriptionEn}
                  </p>
                )}
              </div>

              <div
                id="q-websiteType"
                data-field="websiteType"
                className={`rounded-2xl border p-4 sm:p-5 ${errors.websiteType ? "border-destructive/60 bg-destructive/5" : "border-border/60 bg-card/30"}`}
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold bn flex items-center gap-1.5">
                      {isBn ? "কোন ধরনের ওয়েবসাইট বানাতে চান?" : "What type of website do you need?"}
                      <span className="text-destructive">*</span>
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground bn">
                      {isBn ? "একটি ট্যাপ করুন — বাকি সব আমরা সামলে নেব" : "Tap one — we'll handle the rest"}
                    </p>
                  </div>
                </div>

                <div id="websiteType">
                  <ChipGroup
                    options={visibleWebsiteTypes.map((t) => ({
                      value: t.value,
                      label: isBn ? t.labelBn : t.labelEn,
                    }))}
                    value={data.websiteType}
                    onChange={selectWebsiteType}
                    columns={2}
                    invalid={!!errors.websiteType}
                  />
                </div>
                {errors.websiteType && (
                  <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {errors.websiteType}
                  </p>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground bn">
                {isBn
                  ? "দুটোই বেছে নিলে স্বয়ংক্রিয়ভাবে পরের ধাপে চলে যাবেন"
                  : "Choosing both will automatically take you to the next step"}
              </p>
            </div>
          )}

          {/* STEP 2: Project details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    3
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold bn">
                      {isBn ? "কতগুলো পেজ লাগবে?" : "How many pages do you need?"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground bn">
                      {isBn ? "একটি অপশন বেছে নিন" : "Pick one option"}
                    </p>
                  </div>
                </div>
                {config.pageIncrements.length > 0 && (
                  <ChipGroup
                    options={config.pageIncrements.map((p) => ({
                      value: String(p),
                      label: `${p} ${isBn ? "পেজ" : "pages"}`,
                    }))}
                    value={String(data.numPages)}
                    onChange={(v) => updateData("numPages", Number(v) || 1)}
                    columns={4}
                  />
                )}
              </div>

              <div id="q-description" data-field="description" className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    4
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold bn flex items-center gap-1.5">
                      {isBn ? "প্রজেক্ট সম্পর্কে একটু বলুন (ঐচ্ছিক)" : "Tell us about your project (optional)"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground bn">
                      {isBn ? "এক লাইনই যথেষ্ট — না লিখলেও সমস্যা নেই" : "One line is enough — you can skip this"}
                    </p>
                  </div>
                </div>
                <div id="description">
                  <TextAreaField
                    id="description"
                    value={data.description}
                    onChange={(e) => updateData("description", e.target.value)}
                    placeholder={
                      isBn
                        ? "যেমন: আমার একটি রেস্টুরেন্টের জন্য মেনু, অর্ডার ও লোকেশন সহ ওয়েবসাইট লাগবে..."
                        : "e.g. I need a restaurant website with menu, ordering and location..."
                    }
                    rows={4}
                  />
                </div>
              </div>

              <details className="rounded-2xl border border-border/60 bg-background/30 px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground bn">
                  {isBn ? "আরও বিকল্প যোগ করুন (ঐচ্ছিক) — শুধু ট্যাপ করুন" : "Add more options (optional) — just tap to select"}
                </summary>
                <div className="mt-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visibleBudgetRanges.length > 0 && (
                      <div className="rounded-2xl border border-border/60 bg-card/30 p-4">
                        <h4 className="mb-2 text-sm font-semibold bn">
                          {isBn ? "আপনার বাজেট কত?" : "What's your budget?"}
                        </h4>
                        <SelectField
                          id="budgetRange"
                          value={data.budgetRange}
                          onChange={(e) => updateData("budgetRange", e.target.value)}
                          placeholder={isBn ? "একটি বেছে নিন" : "Select one"}
                        >
                          {visibleBudgetRanges.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                    )}

                    {visibleTimelines.length > 0 && (
                      <div className="rounded-2xl border border-border/60 bg-card/30 p-4">
                        <h4 className="mb-2 text-sm font-semibold bn">
                          {isBn ? "কত দিনের মধ্যে লাগবে?" : "When do you need it?"}
                        </h4>
                        <SelectField
                          id="timeline"
                          value={data.timeline}
                          onChange={(e) => updateData("timeline", e.target.value)}
                          placeholder={isBn ? "একটি বেছে নিন" : "Select one"}
                        >
                          {visibleTimelines.map((t) => (
                            <option key={t.value} value={t.value}>
                              {isBn ? t.labelBn : t.labelEn}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                    )}
                  </div>

                  {visibleDesignStyles.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium bn">
                        {isBn ? "কোন ডিজাইন স্টাইল পছন্দ?" : "Which design style do you prefer?"}
                      </p>
                      <ChipGroup
                        options={visibleDesignStyles.map((d) => ({
                          value: d.value,
                          label: isBn ? d.labelBn : d.labelEn,
                        }))}
                        value={data.designStyle}
                        onChange={(v) => updateData("designStyle", v)}
                        columns={2}
                      />
                      {data.designStyle && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {
                            visibleDesignStyles.find((d) => d.value === data.designStyle)?.[
                              isBn ? "descriptionBn" : "descriptionEn"
                            ]
                          }
                        </p>
                      )}
                    </div>
                  )}

                  <FormField
                    id="colorPreference"
                    label={isBn ? "পছন্দের রং কী?" : "Preferred colors?"}
                    hint={isBn ? "যেমন: নীল, সবুজ, কালো..." : "e.g., Blue, Green, Dark..."}
                  >
                    <TextField
                      id="colorPreference"
                      value={data.colorPreference}
                      onChange={(e) => updateData("colorPreference", e.target.value)}
                      placeholder={isBn ? "যেমন: নীল, সাদা, মিনিমাল..." : "e.g., Blue, white, minimal..."}
                    />
                  </FormField>

                  <FormField
                    id="referenceSites"
                    label={isBn ? "পছন্দের কোনো রেফারেন্স সাইট আছে?" : "Any reference sites you like?"}
                    hint={isBn ? "কমা দিয়ে আলাদা করুন" : "Separate with commas"}
                  >
                    <TextField
                      id="referenceSites"
                      value={data.referenceSites}
                      onChange={(e) => updateData("referenceSites", e.target.value)}
                      placeholder={isBn ? "যেমন: example.com, site.com" : "e.g., example.com, site.com"}
                    />
                  </FormField>

                  {visibleAddons.length > 0 && (
                    <FormField
                      id="features"
                      label={isBn ? "কোন ফিচারগুলো লাগবে? (ট্যাপ করে বাছাই করুন)" : "Which features do you need? (tap to select)"}
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
                        options={visibleAddons.map((f) => ({
                          value: f.value,
                          label: `${isBn ? f.labelBn : f.labelEn}${
                            selectedPricingPackage?.includedFeatureValues.includes(f.value)
                              ? isBn
                                ? " · অন্তর্ভুক্ত"
                                : " · Included"
                              : f.priceBdt > 0
                                ? ` · +${formatQuoteAmount(f.priceBdt, "BDT", locale)}`
                                : ""
                          }`,
                        }))}
                        value={data.features}
                        onChange={toggleFeature}
                        multi
                        columns={2}
                      />
                    </FormField>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* STEP 3: Contact + summary + submit */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm bn">
                  {isBn
                    ? "শেষ ধাপ — শুধু নাম, ফোন ও ইমেইল দিন, তারপর অর্ডার জমা দিন"
                    : "Last step — just add your name, phone and email, then submit"}
                </p>
              </div>

              <div
                id="q-clientName"
                data-field="clientName"
                className={`rounded-2xl border p-4 sm:p-5 ${errors.clientName ? "border-destructive/60 bg-destructive/5" : "border-border/60 bg-card/30"}`}
              >
                <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold bn">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    5
                  </span>
                  {isBn ? "যোগাযোগের তথ্য" : "Contact Information"}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField id="clientName" label={isBn ? "আপনার নাম" : "Your name"} required error={errors.clientName}>
                    <div id="clientName">
                      <TextField
                        id="clientName-input"
                        value={data.clientName}
                        onChange={(e) => updateData("clientName", e.target.value)}
                        placeholder={isBn ? "আপনার নাম" : "Your name"}
                        autoComplete="name"
                        invalid={!!errors.clientName}
                      />
                    </div>
                  </FormField>
                  <FormField id="clientPhone" label={isBn ? "ফোন" : "Phone"} required error={errors.clientPhone}>
                    <div id="clientPhone">
                      <TextField
                        id="clientPhone-input"
                        type="tel"
                        value={data.clientPhone}
                        onChange={(e) => updateData("clientPhone", e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        autoComplete="tel"
                        invalid={!!errors.clientPhone}
                      />
                    </div>
                  </FormField>
                  <FormField id="clientEmail" label={isBn ? "ইমেইল" : "Email"} required error={errors.clientEmail}>
                    <div id="clientEmail">
                      <TextField
                        id="clientEmail-input"
                        type="email"
                        value={data.clientEmail}
                        onChange={(e) => updateData("clientEmail", e.target.value)}
                        placeholder="email@example.com"
                        autoComplete="email"
                        invalid={!!errors.clientEmail}
                      />
                    </div>
                  </FormField>
                  <FormField id="clientCompany" label={isBn ? "কোম্পানি (ঐচ্ছিক)" : "Company (optional)"}>
                    <TextField
                      id="clientCompany"
                      value={data.clientCompany}
                      onChange={(e) => updateData("clientCompany", e.target.value)}
                      placeholder={isBn ? "কোম্পানির নাম" : "Company name"}
                      autoComplete="organization"
                    />
                  </FormField>
                  <FormField
                    id="clientWhatsapp"
                    label={isBn ? "হোয়াটসঅ্যাপ (ঐচ্ছিক)" : "WhatsApp (optional)"}
                    hint={isBn ? "ঐচ্ছিক" : "Optional"}
                    className="sm:col-span-2"
                  >
                    <TextField
                      id="clientWhatsapp"
                      type="tel"
                      value={data.clientWhatsapp}
                      onChange={(e) => updateData("clientWhatsapp", e.target.value)}
                      placeholder="+880 1XXX-XXXXXX"
                      autoComplete="tel"
                    />
                  </FormField>
                </div>
                {(errors.clientName || errors.clientEmail || errors.clientPhone) && (
                  <p className="mt-3 text-xs text-destructive bn">
                    {isBn ? "লাল চিহ্নিত ঘরগুলো পূরণ করুন, তারপর অর্ডার জমা দিন" : "Please fill the highlighted fields, then submit"}
                  </p>
                )}
              </div>

              {/* Compact summary */}
              <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold bn">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {isBn ? "আপনার অর্ডার এক নজরে" : "Your order at a glance"}
                </h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2">
                    <span className="text-muted-foreground bn">{isBn ? "প্যাকেজ" : "Package"}</span>
                    <span className="font-medium text-right">
                      {visiblePackages.find((p) => p.value === data.packageType)?.[isBn ? "labelBn" : "labelEn"] || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2">
                    <span className="text-muted-foreground bn">{isBn ? "টাইপ" : "Type"}</span>
                    <span className="font-medium text-right">
                      {visibleWebsiteTypes.find((t) => t.value === data.websiteType)?.[isBn ? "labelBn" : "labelEn"] || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2">
                    <span className="text-muted-foreground bn">{isBn ? "পেজ" : "Pages"}</span>
                    <span className="font-medium">
                      {data.numPages} {isBn ? "পেজ" : "pages"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2">
                    <span className="text-muted-foreground bn">{isBn ? "ফিচার" : "Features"}</span>
                    <span className="font-medium">
                      {data.features.length > 0 ? (isBn ? `${data.features.length}টি` : `${data.features.length}`) : "—"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(0)}>
                    {isBn ? "প্যাকেজ/টাইপ ঠিক করুন" : "Edit package/type"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    {isBn ? "প্রজেক্ট ঠিক করুন" : "Edit project"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <span className="bn">
                  {isBn
                    ? "অর্ডার জমা দিলে আমরা ইমেইলে কনফার্মেশন পাঠাব এবং শীঘ্রই যোগাযোগ করব।"
                    : "After submitting, you'll receive an email confirmation and we'll contact you shortly."}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div className="space-y-1.5 text-sm leading-relaxed bn">
                    <p className="font-semibold text-foreground">
                      {isBn
                        ? "এখন কোনো পেমেন্টের প্রয়োজন নেই — এই অনুরোধ জমা দিলে ফ্রি পরামর্শ ও কাস্টম কোটের প্রক্রিয়া শুরু হবে।"
                        : "No payment required now — submitting this request starts a free consultation and custom project quote."}
                    </p>
                    <p className="text-muted-foreground">
                      {isBn
                        ? "জমা দেওয়ার পর আমরা আপনার প্রয়োজনগুলো পর্যালোচনা করে আপনার বেছে নেওয়া মাধ্যমে (ইমেইল / ফোন / হোয়াটসঅ্যাপ) যোগাযোগ করব।"
                        : "After submission, we'll review your requirements and contact you through your selected contact method."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <LiveQuoteEstimate estimate={quoteEstimate} config={config.quote} locale={locale} />

          {submitError && (
            <p className="mt-6 text-center text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0} className="min-h-[44px]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {isBn ? config.cta.backBn : config.cta.backEn}
            </Button>

            {step < steps.length - 1 ? (
              <Button variant="default" onClick={handleNext} className="min-w-32 min-h-[44px]">
                {isBn ? config.cta.nextBn : config.cta.nextEn}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="gradient" onClick={handleSubmit} busy={isSubmitting} className="min-w-32 min-h-[46px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isBn ? config.cta.submittingBn : config.cta.submittingEn}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {isBn ? config.cta.submitBn : config.cta.submitEn}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* WhatsApp quick order — always available */}
          <div className="mt-5 border-t border-border/50 pt-5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-500 transition-colors hover:bg-green-500/15 min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {isBn ? "ফর্ম পূরণ করতে চান না? হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন" : "Prefer to skip the form? Order directly on WhatsApp"}
            </a>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
