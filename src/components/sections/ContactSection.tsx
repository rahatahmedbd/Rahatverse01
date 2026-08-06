"use client";

import { useState } from "react";
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

// ── Contact Section ────────────────────────────────────
interface ContactSectionProps {
  locale?: string;
}

export function ContactSection({ locale = "bn" }: ContactSectionProps) {
  const isBn = locale === "bn";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setError(isBn ? "কিছু একটা সমস্যা হয়েছে" : "Something went wrong");
      }
    } catch {
      setError(isBn ? "নেটওয়ার্ক সমস্যা" : "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { icon: Mail, label: "rahatbd20505@gmail.com", href: "mailto:rahatbd20505@gmail.com", color: "text-primary" },
    { icon: MessageCircle, label: "+880 1626-224878", href: "https://wa.me/8801626224878", color: "text-green-400" },
    { icon: Phone, label: "+880 1626-224878", href: "tel:+8801626224878", color: "text-blue-400" },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "📞 যোগাযোগ" : "📞 Contact"}
          title="Get In Touch"
          titleBn="যোগাযোগ করুন"
          subtitle={
            isBn
              ? "পড়াশোনা, রক্তদান, ওয়েব ডেভেলপমেন্ট বা যেকোনো সহযোগিতার জন্য যোগাযোগ করুন"
              : "Contact me for tutoring, blood donation, web development, or any help"
          }
          locale={locale}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Quick Contact */}
          <div className="space-y-4">
            <FadeInLeft>
              <GlassCard>
                <h3 className="mb-4 text-lg font-bold bn">{isBn ? "দ্রুত যোগাযোগ" : "Quick Contact"}</h3>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-primary/30 hover:bg-accent/20"
                    >
                      <link.icon className={`h-5 w-5 ${link.color}`} />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </FadeInLeft>

            <FadeInLeft delay={0.1}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
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
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{isBn ? "রেসপন্স টাইম" : "Response Time"}</p>
                    <p className="font-medium bn">{isBn ? "সাধারণত ২৪ ঘণ্টার মধ্যে" : "Usually within 24 hours"}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeInLeft>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <FadeInRight>
              <GlassCard>
                {isSubmitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold bn">
                      {isBn ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}
                    </h3>
                    <p className="mt-2 text-muted-foreground bn">
                      {isBn ? "ধন্যবাদ! আমি শীঘ্রই উত্তর দেব।" : "Thank you! I will reply shortly."}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsSubmitted(false)}
                    >
                      {isBn ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold bn">{isBn ? "বার্তা পাঠান" : "Send a Message"}</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "নাম *" : "Name *"}</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={isBn ? "আপনার নাম" : "Your name"}
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "ইমেইল *" : "Email *"}</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "ফোন" : "Phone"}</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+880 1XXX-XXXXXX"
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "বিষয় *" : "Subject *"}</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm bn"
                        >
                          <option value="">{isBn ? "বিষয় বেছে নিন" : "Select subject"}</option>
                          <option value="web_dev">{isBn ? "ওয়েব ডেভেলপমেন্ট" : "Web Development"}</option>
                          <option value="tutoring">{isBn ? "টিউশন / পড়াশোনা" : "Tutoring"}</option>
                          <option value="blood">{isBn ? "রক্তদান সংক্রান্ত" : "Blood Donation"}</option>
                          <option value="collaboration">{isBn ? "সহযোগিতা" : "Collaboration"}</option>
                          <option value="general">{isBn ? "সাধারণ জিজ্ঞাসা" : "General Inquiry"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium bn">{isBn ? "বার্তা *" : "Message *"}</label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={isBn ? "বিস্তারিত লিখুন..." : "Write your message..."}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <Button type="submit" variant="gradient" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isBn ? "পাঠানো হচ্ছে..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {isBn ? "বার্তা পাঠান" : "Send Message"}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground bn">
                      🔒 {isBn ? "আপনার তথ্য সম্পূর্ণ গোপনীয়" : "Your information is completely private"}
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
