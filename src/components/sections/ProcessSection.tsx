import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { Workflow } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServicesConfig } from "@/lib/services/server";

interface ProcessSectionProps {
  locale?: string;
}

// ── "How I Work" — Discover → Plan → Design → Develop → Launch ──
// Server-rendered from the services CMS config (`processSteps`) so the admin
// dashboard stays the single source of truth.
export async function ProcessSection({ locale = "bn" }: ProcessSectionProps) {
  const isBn = locale === "bn";
  const config = await getServicesConfig();
  const steps = config.processSteps.filter((s) => s);

  if (steps.length === 0) return null;

  return (
    <section className="section-atmosphere py-8 sm:py-10 lg:py-12" aria-labelledby="how-i-work">
      <Workflow className="section-watermark -left-6 top-10 sm:left-[5%]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span id="how-i-work" className="sr-only">
          {isBn ? "আমি কীভাবে কাজ করি" : "How I work"}
        </span>
        <SectionTitle
          badge={isBn ? "🚀 আমি যেভাবে কাজ করি" : "🚀 How I Work"}
          title={isBn ? "৫টি ধাপে আপনার প্রজেক্ট" : "Your project in 5 clear steps"}
          titleBn={isBn ? "৫টি ধাপে আপনার প্রজেক্ট" : "Your project in 5 clear steps"}
          subtitle={
            isBn
              ? "প্রথম কথা থেকে লঞ্চ পর্যন্ত — প্রতিটি ধাপে আপনি জানবেন কী হচ্ছে, কখন হবে"
              : "From first call to launch — you always know what is happening and when"
          }
          locale={locale}
        />

        {/* Timeline — vertical connector on mobile, horizontal flow on desktop */}
        <StaggerGrid className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
          {steps.map((step, index) => (
            <StaggerItem key={step.id}>
              <div className="group relative h-full rounded-2xl border border-border/60 bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                {/* Step number */}
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-amber-600 text-sm font-extrabold text-white shadow-md shadow-primary/25">
                    {isBn ? step.stepBn : step.stepEn}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="hidden h-4 w-4 text-primary/40 transition-colors group-hover:text-primary lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-[15px] font-bold leading-snug bn sm:text-base">
                  {isBn ? step.titleBn : step.titleEn}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground bn sm:text-sm">
                  {isBn ? step.descriptionBn : step.descriptionEn}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Inline CTA — start the process */}
        <div className="mt-6 text-center sm:mt-8">
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {isBn ? "প্রথম ধাপ দিয়ে শুরু করি — প্রজেক্ট শুরু করুন" : "Start with step one — start a project"}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
