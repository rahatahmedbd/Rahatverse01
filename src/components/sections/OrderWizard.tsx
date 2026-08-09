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
  Phone,
  User,
  Pencil,
} from "lucide-react";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import { calculateLiveQuote, formatQuoteAmount } from "@/lib/orders/quote";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import type { OrdersConfig } from "@/types/orders";
import type { ServicesConfig } from "@/types/services";

// ── Order Wizard — Simple 3-step ──────────────────────
// ১) প্যাকেজ → ২) প্রজেক্ট → ৩) যোগাযোগ।
// A package clicked anywhere arrives as ?package=<value>: the wizard selects it
// instantly (no network wait) and starts on the NEXT step, exactly as promised.
// Fixed bugs: no scroll-jump on page load, no duplicate element ids, labels are
// tied to their inputs, and tapping a package chip auto-advances.

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
const AUTO_ADVANCE_MS = 300;

export function OrderWizard({ locale = "bn" }: OrderWizardProps) {
  const isBn = locale === "bn";
  const searchParams = useSearchParams();
  const preselectedPackage = (searchParams.get("package") || "").trim();

  const [config, setConfig] = useState<OrdersConfig>(DEFAULT_ORDERS_CONFIG);
  const [servicesConfig, setServicesConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);

  const visiblePackages = config.packages.filter((p) => p.visible);
  const visibleWebsiteTypes = config.websiteTypes.filter((t) => t.visible);
  const visibleAddons = config.featureAddons.filter((f) => f.visible);
  const visibleDesignStyles = config.designStyles.filter((d) => d.visible);
  const visibleBudgetRanges = config.budgetRanges.filter((b) => b.visible);
  const visibleTimelines = config.timelineOptions.filter((t) => t.visible);

  // ── Initial state: preselected package starts on the NEXT step ──
  const validPreselect =
    preselectedPackage &&
    DEFAULT_ORDERS_CONFIG.packages.some((p) => p.visible && p.value === preselectedPackage)
      ? preselectedPackage
      : "";

  const [step, setStep] = useState(validPreselect ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof OrderData, string>>>({});

  const wizardRef = useRef<HTMLDivElement>(null);
  const prevParamRef = useRef(preselectedPackage);
  const autoAdvanceTimer = useRef<number | null>(null);

  const [data, setData] = useState<OrderData>({
    packageType: validPreselect || DEFAULT_ORDERS_CONFIG.packages.find((p) => p.visible)?.value || "",
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

  // ── Load configs once — never blocks or scrolls the page ──
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

    async function loadPricingConfig() {
      try {
        const [ordersResponse, servicesResponse] = await Promise.all([
          fetch("/api/orders-config", { cache: "no-store", signal: controller.signal }),
          fetch("/api/services-config", { cache: "no-store", signal: controller.signal }),
        ]);
        const [ordersJson, servicesJson] = await Promise.all([
          ordersResponse.ok ? ordersResponse.json() : null,
          servicesResponse.ok ? servicesResponse.json() : null,
        ]);
        if (controller.signal.aborted) return;

        const orders =
          validateOrdersConfig((ordersJson as { data?: unknown } | null)?.data) ??
          DEFAULT_ORDERS_CONFIG;
        const services =
          validateServicesConfig((servicesJson as { data?: unknown } | null)?.data) ??
          DEFAULT_SERVICES_CONFIG;
        setConfig(orders);
        setServicesConfig(services);

        // Keep the current selection only if it still exists in the loaded config.
        const allowedPackages = orders.packages.filter((pkg) => pkg.visible);
        setData((previous) =>
          allowedPackages.some((pkg) => pkg.value === previous.packageType)
            ? previous
            : { ...previous, packageType: allowedPackages[0]?.value ?? "" }
        );
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
  }, []);

  // ── Package click from anywhere (pricing cards, home, services page) ──
  // The click arrives as ?package=<value>. Apply it DURING RENDER (the React
  // docs pattern for prop/param-driven state): select the package instantly —
  // no network wait — and open the NEXT step. First mount is untouched because
  // the useState initializers above already handled it.
  const [appliedParam, setAppliedParam] = useState(preselectedPackage);
  if (preselectedPackage !== appliedParam) {
    setAppliedParam(preselectedPackage);
    if (preselectedPackage) {
      const allowed =
        config.packages.some((p) => p.visible && p.value === preselectedPackage) ||
        DEFAULT_ORDERS_CONFIG.packages.some((p) => p.visible && p.value === preselectedPackage);
      if (allowed) {
        setErrors({});
        setData((previous) => ({ ...previous, packageType: preselectedPackage }));
        setStep(1);
      }
    }
  }

  // ── Carry the visitor to the wizard when a new package param arrives ──
  // Pure DOM scroll in an effect (no setState). Never runs on page load, so
  // landing on /order stays at the top as expected.
  useEffect(() => {
    if (prevParamRef.current === preselectedPackage) return;
    prevParamRef.current = preselectedPackage;
    if (preselectedPackage) {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [preselectedPackage]);

  // ── Scroll to the wizard top on step change — but never on page load ──
  const prevStepRef = useRef(step);
  useEffect(() => {
    if (prevStepRef.current === step) return;
    prevStepRef.current = step;
    wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  useEffect(
    () => () => {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    },
    []
  );

  const updateData = <K extends keyof OrderData>(field: K, value: OrderData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
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

  const selectedPackageLabel =
    visiblePackages.find((p) => p.value === data.packageType)?.[isBn ? "labelBn" : "labelEn"] || "";

  // ── 3 simple steps ──
  const steps = [
    { icon: Package, title: isBn ? "প্যাকেজ" : "Package" },
    { icon: FileText, title: isBn ? "প্রজেক্ট" : "Project" },
    { icon: User, title: isBn ? "যোগাযোগ" : "Contact" },
  ];

  // ── Validation per step ──
  const validateStep = (current: number): Partial<Record<keyof OrderData, string>> => {
    const errs: Partial<Record<keyof OrderData, string>> = {};
    if (current === 0) {
      if (!data.packageType)
        errs.packageType = isBn ? "একটি প্যাকেজ বাছাই করুন" : "Please choose a package";
    }
    if (current === 1) {
      if (!data.websiteType)
        errs.websiteType = isBn ? "ওয়েবসাইটের ধরন বাছাই করুন" : "Please choose a website type";
      if (!data.description.trim())
        errs.description = isBn ? "প্রজেক্ট সম্পর্কে একটু লিখুন" : "Please describe your project";
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
    const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = el.querySelector<HTMLElement>(
      "input, textarea, select, button"
    );
    if (focusable) window.setTimeout(() => focusable.focus(), 350);
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(Math.max(0, Math.min(target, steps.length - 1)));
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      requestAnimationFrame(() => window.setTimeout(() => scrollToFirstError(errs), 60));
      return;
    }
    setErrors({});
    goToStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    goToStep(step - 1);
  };

  // Selecting a package is one tap — carry on to the next question.
  const choosePackage = (value: string) => {
    updateData("packageType", value);
    if (step === 0) {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = window.setTimeout(() => {
        setErrors({});
        goToStep(1);
      }, AUTO_ADVANCE_MS);
    }
  };

  const handleSubmit = async () => {
    // Validate every step together; jump to the first thing missing.
    const allErrs: Partial<Record<keyof OrderData, string>> = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2),
    };
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      const stepWithError = [0, 1, 2].find(
        (s) => Object.keys(validateStep(s)).length > 0
      );
      if (stepWithError !== undefined) goToStep(stepWithError);
      window.setTimeout(() => scrollToFirstError(allErrs), 150);
      return;
    }

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
              <h2 className="text-heading-md font-bold bn">
                {isBn ? config.cta.successTitleBn : config.cta.successTitleEn}
              </h2>
              <p className="mt-4 text-muted-foreground bn">
                {isBn ? config.cta.successMessageBn : config.cta.successMessageEn}
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
    <section ref={wizardRef} className="scroll-mt-24 py-20" id="order-wizard">
      <div className="mx-auto max-w-3xl px-4">
        <SectionTitle
          badge={isBn ? config.section.badgeBn : config.section.badgeEn}
          title={isBn ? config.section.titleBn : config.section.titleEn}
          titleBn={isBn ? config.section.titleBn : config.section.titleEn}
          subtitle={isBn ? config.section.subtitleBn : config.section.subtitleEn}
          locale={locale}
        />

        {/* Selected package summary — visible past step 1 with an easy switch */}
        {step > 0 && selectedPackageLabel && (
          <div className="mb-5 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-xs font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="bn">
                {isBn ? "নির্বাচিত প্যাকেজ:" : "Selected package:"}{" "}
                <span className="font-bold">{selectedPackageLabel}</span>
                {packagePriceLabel(data.packageType) ? ` · ${packagePriceLabel(data.packageType)}` : ""}
              </span>
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-primary transition-colors hover:bg-primary/10"
                aria-label={isBn ? "প্যাকেজ পরিবর্তন করুন" : "Change package"}
              >
                <Pencil className="h-3 w-3" />
                <span className="bn">{isBn ? "পরিবর্তন" : "Change"}</span>
              </button>
            </span>
          </div>
        )}

        {/* Progress + percentage */}
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="bn">
            {isBn ? `ধাপ ${step + 1} / ${steps.length}` : `Step ${step + 1} / ${steps.length}`}
          </span>
          <span className="bn">
            {isBn ? "শুধু অপশন সিলেক্ট করুন" : "Just tap an option"}
          </span>
        </div>
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Indicator */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => i < step && goToStep(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                aria-label={s.title}
                className={`flex items-center gap-2 rounded-full border-2 px-3 py-2 transition-all ${
                  i === step
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : i < step
                      ? "cursor-pointer border-primary bg-primary/15 text-primary hover:bg-primary/25"
                      : "cursor-default border-border text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="hidden text-xs font-semibold sm:inline bn">{s.title}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-6 transition-all sm:w-12 ${i < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <GlassCard>
          {/* ── ধাপ ১: প্যাকেজ ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div
                data-field="packageType"
                className={`rounded-2xl border p-4 sm:p-5 ${
                  errors.packageType
                    ? "border-destructive/60 bg-destructive/5"
                    : "border-border/60 bg-card/30"
                }`}
              >
                <div className="mb-3 text-center sm:text-left">
                  <h3 className="text-[15px] font-bold bn">
                    {isBn ? "কোন প্যাকেজটি নিতে চান?" : "Which package would you like?"}{" "}
                    <span className="text-destructive">*</span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground bn">
                    {isBn
                      ? "একটিতে ট্যাপ করুন — সঙ্গে সঙ্গে পরের ধাপে যাবে"
                      : "Tap one — you'll go straight to the next step"}
                  </p>
                </div>

                <ChipGroup
                  options={visiblePackages.map((pkg) => {
                    const price = packagePriceLabel(pkg.value);
                    return {
                      value: pkg.value,
                      label: `${isBn ? pkg.labelBn : pkg.labelEn}${price ? ` · ${price}` : ""}`,
                    };
                  })}
                  value={data.packageType}
                  onChange={choosePackage}
                  columns={2}
                  invalid={!!errors.packageType}
                />
                {errors.packageType && (
                  <p
                    role="alert"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {errors.packageType}
                  </p>
                )}
                {selectedPricingPackage && (
                  <p className="mt-3 rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-xs text-muted-foreground bn">
                    <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                    {isBn ? "নির্বাচিত:" : "Selected:"}{" "}
                    {isBn ? selectedPricingPackage.nameBn : selectedPricingPackage.nameEn} —{" "}
                    {isBn
                      ? selectedPricingPackage.descriptionBn
                      : selectedPricingPackage.descriptionEn}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── ধাপ ২: প্রজেক্ট ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div
                data-field="websiteType"
                className={`rounded-2xl border p-4 sm:p-5 ${
                  errors.websiteType
                    ? "border-destructive/60 bg-destructive/5"
                    : "border-border/60 bg-card/30"
                }`}
              >
                <div className="mb-3">
                  <h3 className="text-[15px] font-bold bn">
                    {isBn ? "কোন ধরনের ওয়েবসাইট বানাতে চান?" : "What type of website do you need?"}{" "}
                    <span className="text-destructive">*</span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground bn">
                    {isBn
                      ? "একটি অপশন সিলেক্ট করুন — বাকি সব আমরা সামলে নেব"
                      : "Select one option — we'll handle the rest"}
                  </p>
                </div>

                <ChipGroup
                  options={visibleWebsiteTypes.map((t) => ({
                    value: t.value,
                    label: isBn ? t.labelBn : t.labelEn,
                  }))}
                  value={data.websiteType}
                  onChange={(v) => updateData("websiteType", v)}
                  columns={2}
                  invalid={!!errors.websiteType}
                />
                {errors.websiteType && (
                  <p
                    role="alert"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {errors.websiteType}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                <h3 className="mb-1 text-[15px] font-bold bn">
                  {isBn ? "কতগুলো পেজ লাগবে?" : "How many pages do you need?"}
                </h3>
                <p className="mb-3 text-xs text-muted-foreground bn">
                  {isBn ? "একটি অপশন বেছে নিন" : "Pick one option"}
                </p>
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

              <div
                data-field="description"
                className={`rounded-2xl border p-4 sm:p-5 ${
                  errors.description
                    ? "border-destructive/60 bg-destructive/5"
                    : "border-border/60 bg-card/30"
                }`}
              >
                <div className="mb-3">
                  <h3 className="text-[15px] font-bold bn">
                    {isBn
                      ? "আপনার প্রজেক্ট সম্পর্কে সংক্ষেপে বলুন"
                      : "Briefly describe your project"}{" "}
                    <span className="text-destructive">*</span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground bn">
                    {isBn
                      ? "যেমন: কী ধরনের ব্যবসা, কী কী লাগবে"
                      : "e.g. business type, goals, examples"}
                  </p>
                </div>
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
                  invalid={!!errors.description}
                />
                {errors.description && (
                  <p
                    role="alert"
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {visibleBudgetRanges.length > 0 && (
                  <div className="rounded-2xl border border-border/60 bg-card/30 p-4">
                    <h4 className="mb-2 text-sm font-semibold bn">
                      {isBn ? "আপনার বাজেট কত? (ঐচ্ছিক)" : "What's your budget? (optional)"}
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
                      {isBn ? "কত দিনের মধ্যে লাগবে? (ঐচ্ছিক)" : "When do you need it? (optional)"}
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

              {(visibleDesignStyles.length > 0 || visibleAddons.length > 0) && (
                <details className="rounded-2xl border border-border/60 bg-background/30 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground bn">
                    {isBn
                      ? "ডিজাইন ও ফিচার পছন্দ যোগ করুন (সম্পূর্ণ ঐচ্ছিক)"
                      : "Add design & feature preferences (fully optional)"}
                  </summary>
                  <div className="mt-5 space-y-5">
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
                        placeholder={
                          isBn ? "যেমন: নীল, সাদা, মিনিমাল..." : "e.g., Blue, white, minimal..."
                        }
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
                        label={
                          isBn
                            ? "কোন ফিচারগুলো লাগবে? (ট্যাপ করে বাছাই করুন)"
                            : "Which features do you need? (tap to select)"
                        }
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
              )}

              <LiveQuoteEstimate estimate={quoteEstimate} config={config.quote} locale={locale} />
            </div>
          )}

          {/* ── ধাপ ৩: যোগাযোগ + রিভিউ + জমা ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm bn">
                  {isBn
                    ? "শেষ ধাপ — শুধু ৩টি ঘর পূরণ করে \"অর্ডার জমা দিন\" চাপুন।"
                    : "Final step — fill the 3 required fields and press “Submit order”."}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-5">
                <h3 className="mb-3 text-[15px] font-bold bn">
                  {isBn ? "যোগাযোগের তথ্য" : "Contact information"}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div data-field="clientName">
                    <FormField
                      id="clientName"
                      label={isBn ? "আপনার নাম" : "Your name"}
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
                  </div>
                  <FormField id="clientCompany" label={isBn ? "কোম্পানি (ঐচ্ছিক)" : "Company (optional)"}>
                    <TextField
                      id="clientCompany"
                      value={data.clientCompany}
                      onChange={(e) => updateData("clientCompany", e.target.value)}
                      placeholder={isBn ? "কোম্পানির নাম" : "Company name"}
                    />
                  </FormField>
                  <div data-field="clientEmail">
                    <FormField id="clientEmail" label={isBn ? "ইমেইল" : "Email"} required error={errors.clientEmail}>
                      <TextField
                        id="clientEmail"
                        type="email"
                        value={data.clientEmail}
                        onChange={(e) => updateData("clientEmail", e.target.value)}
                        placeholder="email@example.com"
                        invalid={!!errors.clientEmail}
                      />
                    </FormField>
                  </div>
                  <div data-field="clientPhone">
                    <FormField id="clientPhone" label={isBn ? "ফোন" : "Phone"} required error={errors.clientPhone}>
                      <TextField
                        id="clientPhone"
                        type="tel"
                        value={data.clientPhone}
                        onChange={(e) => updateData("clientPhone", e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        invalid={!!errors.clientPhone}
                      />
                    </FormField>
                  </div>
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
                    />
                  </FormField>
                </div>
              </div>

              {/* Inline mini review — no extra step needed */}
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4 sm:p-5">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold bn">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {isBn ? "আপনার অর্ডার এক নজরে" : "Your order at a glance"}
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground bn">{isBn ? "প্যাকেজ" : "Package"}</dt>
                    <dd className="font-medium">
                      {selectedPackageLabel || data.packageType}
                      <button
                        type="button"
                        onClick={() => goToStep(0)}
                        className="ml-2 text-xs font-normal text-primary hover:underline bn"
                      >
                        {isBn ? "পরিবর্তন" : "Edit"}
                      </button>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground bn">{isBn ? "ওয়েবসাইট টাইপ" : "Website type"}</dt>
                    <dd className="font-medium bn">
                      {visibleWebsiteTypes.find((t) => t.value === data.websiteType)?.[
                        isBn ? "labelBn" : "labelEn"
                      ] || data.websiteType}
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="ml-2 text-xs font-normal text-primary hover:underline bn"
                      >
                        {isBn ? "পরিবর্তন" : "Edit"}
                      </button>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
                    <dt className="text-muted-foreground bn">{isBn ? "পেজ" : "Pages"}</dt>
                    <dd className="font-medium">
                      {data.numPages} {isBn ? "পেজ" : "pages"}
                    </dd>
                  </div>
                  {data.features.length > 0 && (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-muted-foreground bn">{isBn ? "ফিচার" : "Features"}</dt>
                      <dd className="flex max-w-[60%] flex-wrap justify-end gap-1.5">
                        {visibleAddons
                          .filter((f) => data.features.includes(f.value))
                          .map((f) => (
                            <Badge key={f.value} variant="outline">
                              {isBn ? f.labelBn : f.labelEn}
                            </Badge>
                          ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <LiveQuoteEstimate estimate={quoteEstimate} config={config.quote} locale={locale} />

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

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              {isBn ? config.cta.backBn : config.cta.backEn}
            </Button>

            {step < steps.length - 1 ? (
              <Button variant="default" onClick={handleNext} className="min-w-32">
                {isBn ? config.cta.nextBn : config.cta.nextEn}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-32"
              >
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
        </GlassCard>
      </div>
    </section>
  );
}
