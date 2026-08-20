"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracker";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  FormField,
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/ui/form";
import { OrbitingRings } from "@/components/interactive";
import { RahatPortrait } from "./RahatPortrait";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{5,24}$/;

interface ContactSectionProps {
  locale?: string;
}

export function ContactSection({ locale = "bn" }: ContactSectionProps) {
  const isBn = locale === "bn";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const submitRef = useRef(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (error) setError("");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = isBn ? "আপনার নাম লিখুন" : "Please enter your name";
    if (!form.email.trim()) {
      errs.email = isBn ? "ইমেইল লিখুন" : "Please enter your email";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errs.email = isBn ? "সঠিক ইমেইল দিন" : "Enter a valid email address";
    }
    if (form.phone && !PHONE_RE.test(form.phone.trim())) {
      errs.phone = isBn ? "সঠিক ফোন নম্বর দিন" : "Enter a valid phone number";
    }
    if (!form.projectType) errs.projectType = isBn ? "প্রজেক্টের ধরন বেছে নিন" : "Please choose a project type";
    if (!form.budget) errs.budget = isBn ? "বাজেট বেছে নিন" : "Please choose a budget";
    if (!form.timeline) errs.timeline = isBn ? "সময়রেখা বেছে নিন" : "Please choose a timeline";
    if (!form.requirements.trim()) errs.requirements = isBn ? "প্রজেক্টের বিবরণ লিখুন" : "Please describe your project";
    return errs;
  };

  const scrollToFirstContactError = (errs: Record<string, string>) => {
    const order = ["name", "email", "phone", "projectType", "budget", "timeline", "requirements"];
    const firstKey = order.find((k) => k in errs);
    if (!firstKey) return;
    const el =
      document.getElementById(`contact-${firstKey}`) ||
      document.querySelector(`[data-field="contact-${firstKey}"]`);
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
      }
    }
  };

  useEffect(() => {
    const container = formRef.current ?? contactSectionRef.current;
    if (!container) return;
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!target.matches("input, textarea, select")) return;
      window.setTimeout(() => {
        try {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {}
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const bottomOverlap = 110;
        if (rect.bottom > viewportHeight - bottomOverlap) {
          window.scrollBy({ top: rect.bottom - (viewportHeight - bottomOverlap) + 16, behavior: "smooth" });
        }
      }, 260);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitRef.current) return; // prevent duplicate
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      requestAnimationFrame(() => setTimeout(() => scrollToFirstContactError(errs), 60));
      return;
    }

    submitRef.current = true;
    setIsSubmitting(true);
    setError("");

    // Compose a structured enquiry for the messages API: the subject stays
    // within its enum, and project type / budget / timeline lead the message
    // body so replies can reference them directly.
    const composedMessage = [
      `Project type: ${form.projectType}`,
      `Budget: ${form.budget}`,
      `Timeline: ${form.timeline}`,
      "",
      form.requirements.trim(),
    ].join("\n");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: "web_dev",
          message: composedMessage,
        }),
      });

      if (res.ok) {
        trackEvent("contact_submit", { category: "conversion", metadata: { locale } });
        setIsSubmitted(true);
        setForm({ name: "", email: "", phone: "", projectType: "", budget: "", timeline: "", requirements: "" });
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || (isBn ? "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again."));
      }
    } catch {
      setError(isBn ? "নেটওয়ার্ক সমস্যা। ইন্টারনেট চেক করে আবার চেষ্টা করুন।" : "Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      submitRef.current = false;
    }
  };

  const quickLinks = [
    { icon: Mail, label: "rahatbd20505@gmail.com", href: "mailto:rahatbd20505@gmail.com", color: "text-primary" },
    { icon: MessageCircle, label: "+880 1626-224878", href: "https://wa.me/8801626224878", color: "text-green-400" },
    { icon: Phone, label: "+880 1626-224878", href: "tel:+8801626224878", color: "text-blue-400" },
  ];

  return (
    <section
      ref={contactSectionRef}
      className="relative py-20 overflow-hidden scroll-mt-24 scroll-pb-28 pb-28 sm:pb-20"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute left-10 bottom-10 -z-10 flex items-center justify-center opacity-30" aria-hidden="true">
        <OrbitingRings size="lg" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          as="h1"
          badge={isBn ? "🚀 প্রজেক্ট শুরু করুন" : "🚀 Start a Project"}
          title="Start a Project"
          titleBn="প্রজেক্ট শুরু করুন"
          subtitle={
            isBn
              ? "আপনার প্রজেক্টের ধরন, বাজেট ও সময়রেখা জানান — আমি সাধারণত ২৪ ঘণ্টার মধ্যে বিস্তারিত উত্তর দিই"
              : "Tell me your project type, budget and timeline — I usually reply with details within 24 hours"
          }
          locale={locale}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <FadeInLeft>
              <GlassCard className="flex items-center gap-4 overflow-visible">
                <RahatPortrait
                  locale={locale}
                  className="h-16 w-16 shrink-0 ring-2 ring-primary/40 shadow-md shadow-primary/20 sm:h-20 sm:w-20"
                  sizes="80px"
                  rounded="2xl"
                />
                <div className="min-w-0">
                  <p className="text-base font-bold bn">{isBn ? "রাহাত আহমেদ" : "Rahat Ahmed"}</p>
                  <p className="text-sm text-muted-foreground bn">
                    {isBn ? "ওয়েব ডেভেলপার — সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই" : "Web Developer — I usually reply within 24 hours"}
                  </p>
                </div>
              </GlassCard>
            </FadeInLeft>

            <FadeInLeft>
              <GlassCard className="relative overflow-hidden">
                <OrbitingRings size="sm" className="absolute -right-16 -top-16 opacity-30 pointer-events-none" />
                <h3 id="quick-contact-heading" className="mb-4 text-lg font-bold bn">
                  {isBn ? "দ্রুত যোগাযোগ" : "Quick Contact"}
                </h3>
                <div className="space-y-3" role="list" aria-labelledby="quick-contact-heading">
                  {quickLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      role="listitem"
                      onClick={() => {
                        if (link.href.includes("wa.me") || link.href.includes("whatsapp")) {
                          trackEvent("whatsapp_click", {
                            category: "conversion",
                            metadata: { location: "contact_quick_links", locale },
                          });
                        } else {
                          trackEvent("cta_click", {
                            category: "conversion",
                            metadata: { cta_id: link.label, location: "contact_quick_links", locale },
                          });
                        }
                      }}
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-primary/30 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
                    >
                      <link.icon className={`h-5 w-5 shrink-0 ${link.color}`} aria-hidden="true" />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </FadeInLeft>

            <FadeInLeft delay={0.1}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">{isBn ? "অবস্থান" : "Location"}</p>
                    <p className="font-medium bn">{isBn ? "সুনামগঞ্জ, বাংলাদেশ" : "Sunamganj, Bangladesh"}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeInLeft>

            <FadeInLeft delay={0.2}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">{isBn ? "রেসপন্স টাইম" : "Response Time"}</p>
                    <p className="font-medium bn">{isBn ? "সাধারণত ২৪ ঘণ্টার মধ্যে" : "Usually within 24 hours"}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeInLeft>
          </div>

          <div className="lg:col-span-2">
            <FadeInRight>
              <GlassCard>
                {isSubmitted ? (
                  <div className="py-8 text-center" role="status" aria-live="polite">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20" aria-hidden="true">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold bn">{isBn ? "রিকোয়েস্ট পাঠানো হয়েছে!" : "Request Sent!"}</h3>
                    <p className="mt-2 text-muted-foreground bn">{isBn ? "ধন্যবাদ! আমি সাধারণত ২৪ ঘণ্টার মধ্যে পরবর্তী ধাপ ও কোটেশন নিয়ে যোগাযোগ করি।" : "Thank you! I usually reply within 24 hours with next steps and a quote."}</p>
                    <Button variant="outline" className="mt-4 min-h-[44px]" onClick={() => setIsSubmitted(false)}>
                      {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate data-form aria-labelledby="contact-form-heading">
                    <h3 id="contact-form-heading" className="text-lg font-bold bn">
                      {isBn ? "প্রজেক্টের বিবরণ দিন" : "Tell me about your project"}
                    </h3>

                    {Object.keys(errors).length > 0 && (
                      <div className="form-error-summary flex items-start gap-2 text-sm" role="alert" aria-live="assertive">
                        <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-semibold text-destructive">{isBn ? "অনুগ্রহ করে নিচের সমস্যাগুলো ঠিক করুন:" : "Please fix the following issues:"}</p>
                          <ul className="mt-1 list-disc list-inside text-muted-foreground">
                            {Object.entries(errors).map(([k, v]) => (
                              <li key={k}>{v}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="contact-name" label={isBn ? "নাম" : "Name"} required error={errors.name}>
                        <TextField
                          id="contact-name"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder={isBn ? "আপনার নাম" : "Your name"}
                          invalid={!!errors.name}
                          autoComplete="name"
                        />
                      </FormField>
                      <FormField id="contact-email" label={isBn ? "ইমেইল" : "Email"} required error={errors.email}>
                        <TextField
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="email@example.com"
                          invalid={!!errors.email}
                          autoComplete="email"
                          inputMode="email"
                        />
                      </FormField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="contact-phone" label={isBn ? "ফোন / হোয়াটসঅ্যাপ" : "Phone / WhatsApp"} hint={isBn ? "ঐচ্ছিক" : "Optional"} error={errors.phone}>
                        <TextField
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+880 1XXX-XXXXXX"
                          invalid={!!errors.phone}
                          autoComplete="tel"
                          inputMode="tel"
                        />
                      </FormField>
                      <FormField id="contact-project-type" label={isBn ? "প্রজেক্টের ধরন" : "Project Type"} required error={errors.projectType}>
                        <SelectField
                          id="contact-project-type"
                          value={form.projectType}
                          onChange={(e) => updateField("projectType", e.target.value)}
                          placeholder={isBn ? "বেছে নিন" : "Select project type"}
                          invalid={!!errors.projectType}
                        >
                          <option value="business-website">{isBn ? "বিজনেস ওয়েবসাইট" : "Business Website"}</option>
                          <option value="landing-page">{isBn ? "ল্যান্ডিং পেজ" : "Landing Page"}</option>
                          <option value="ecommerce">{isBn ? "ই-কমার্স সাইট" : "E-Commerce Website"}</option>
                          <option value="web-application">{isBn ? "ওয়েব অ্যাপ্লিকেশন" : "Web Application"}</option>
                          <option value="portfolio">{isBn ? "পোর্টফোলিও ওয়েবসাইট" : "Portfolio Website"}</option>
                          <option value="other">{isBn ? "অন্য কিছু / এখনো নিশ্চিত নই" : "Something else / not sure yet"}</option>
                        </SelectField>
                      </FormField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="contact-budget" label={isBn ? "বাজেট" : "Budget"} required error={errors.budget}>
                        <SelectField
                          id="contact-budget"
                          value={form.budget}
                          onChange={(e) => updateField("budget", e.target.value)}
                          placeholder={isBn ? "বেছে নিন" : "Select budget"}
                          invalid={!!errors.budget}
                        >
                          <option value="৳5,000–10,000">{isBn ? "৳৫,০০০ – ৳১০,০০০" : "৳5,000 – ৳10,000"}</option>
                          <option value="৳10,000–25,000">{isBn ? "৳১০,০০০ – ৳২৫,০০০" : "৳10,000 – ৳25,000"}</option>
                          <option value="৳25,000–50,000">{isBn ? "৳২৫,০০০ – ৳৫০,০০০" : "৳25,000 – ৳50,000"}</option>
                          <option value="৳50,000+">{isBn ? "৳৫০,০০০+" : "৳50,000+"}</option>
                          <option value="Not sure yet">{isBn ? "এখনো নিশ্চিত নই — আলোচনা করতে চাই" : "Not sure yet — let's discuss"}</option>
                        </SelectField>
                      </FormField>
                      <FormField id="contact-timeline" label={isBn ? "সময়রেখা" : "Timeline"} required error={errors.timeline}>
                        <SelectField
                          id="contact-timeline"
                          value={form.timeline}
                          onChange={(e) => updateField("timeline", e.target.value)}
                          placeholder={isBn ? "বেছে নিন" : "Select timeline"}
                          invalid={!!errors.timeline}
                        >
                          <option value="ASAP (~1 week)">{isBn ? "যত দ্রুত সম্ভব (১ সপ্তাহ)" : "ASAP (~1 week)"}</option>
                          <option value="2-3 weeks">{isBn ? "২–৩ সপ্তাহ" : "2–3 weeks"}</option>
                          <option value="About a month">{isBn ? "প্রায় এক মাস" : "About a month"}</option>
                          <option value="Flexible">{isBn ? "নমনীয় — গুণগত মান আগে" : "Flexible — quality first"}</option>
                        </SelectField>
                      </FormField>
                    </div>

                    <FormField
                      id="contact-requirements"
                      label={isBn ? "প্রজেক্টের বিবরণ" : "Project Requirements"}
                      hint={isBn ? "কী দরকার, কাদের জন্য, রেফারেন্স সাইট — যা জানেন তা লিখুন" : "What you need, who it's for, reference sites — whatever you know"}
                      required
                      error={errors.requirements}
                    >
                      <TextAreaField
                        id="contact-requirements"
                        value={form.requirements}
                        onChange={(e) => updateField("requirements", e.target.value)}
                        placeholder={
                          isBn
                            ? "যেমন: আমার একটি ক্যাটালগ ওয়েবসাইট দরকার — ৫টি পেজ, যোগাযোগ ফর্ম, বাংলা-ইংরেজি দুই ভাষায়..."
                            : "e.g. I need a catalog website — 5 pages, a contact form, bilingual..."
                        }
                        rows={5}
                        invalid={!!errors.requirements}
                      />
                    </FormField>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert" aria-live="assertive">
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button type="submit" variant="gradient" busy={isSubmitting} className="w-full min-h-[46px]" aria-label={isBn ? "প্রজেক্ট রিকোয়েস্ট পাঠান" : "Send project request"}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          {isBn ? "পাঠানো হচ্ছে..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          {isBn ? "প্রজেক্ট রিকোয়েস্ট পাঠান" : "Send Project Request"}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground bn">
                      <span aria-hidden="true">🔒</span> {isBn ? "আপনার তথ্য সম্পূর্ণ গোপনীয়" : "Your information is completely private"}
                    </p>
                  </form>
                )}
              </GlassCard>
            </FadeInRight>
          </div>
        </div>
      </div>
    </section>
  );
}
