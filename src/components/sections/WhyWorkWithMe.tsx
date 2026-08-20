import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { ShieldCheck } from "lucide-react";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { getServicesConfig } from "@/lib/services/server";
import { ServicesIcon } from "@/lib/services/icons";

interface WhyWorkWithMeProps {
  locale?: string;
}

// ── "Why Work With Me" ─────────────────────────────────
// Server-rendered from the services CMS config (`features`), so the admin
// dashboard stays the single source of truth. Falls back to the built-in
// defaults (Responsive • Fast • SEO-Ready • Clean Code • Modern UI • Support).
export async function WhyWorkWithMe({ locale = "bn" }: WhyWorkWithMeProps) {
  const isBn = locale === "bn";
  const config = await getServicesConfig();
  const features = config.features.filter((f) => f.visible).slice(0, 6);

  if (features.length === 0) return null;

  return (
    <section className="section-atmosphere py-12 sm:py-16 lg:py-20" aria-labelledby="why-work-with-me">
      <ShieldCheck className="section-watermark -right-6 top-12 sm:right-[5%]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span id="why-work-with-me" className="sr-only">
          {isBn ? "কেন আমার সাথে কাজ করবেন" : "Why work with me"}
        </span>
        <SectionTitle
          badge={isBn ? "🤝 কেন আমার সাথে কাজ করবেন" : "🤝 Why Work With Me"}
          title={isBn ? "প্রতিটি প্রজেক্টে যা যা পাবেন" : "What you get on every project"}
          titleBn={isBn ? "প্রতিটি প্রজেক্টে যা যা পাবেন" : "What you get on every project"}
          subtitle={
            isBn
              ? "ফ্রিল্যান্স মার্কেটপ্লেসে কাজ করার মানসম্মত ডেলিভারি — ছোট ল্যান্ডিং পেজ থেকে পূর্ণ ওয়েব অ্যাপ পর্যন্ত"
              : "Marketplace-grade delivery standards — from a one-page landing site to a full web application"
          }
          locale={locale}
        />

        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.id}>
              <SpotlightCard className="h-full rounded-2xl">
              <GlassCard className="group h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="icon-frame h-11 w-11 shrink-0 rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                    <ServicesIcon name={feature.icon} className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold leading-snug bn sm:text-base">
                      {isBn ? feature.titleBn : feature.titleEn}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground bn sm:text-sm">
                      {isBn ? feature.descriptionBn : feature.descriptionEn}
                    </p>
                  </div>
                </div>
              </GlassCard>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
