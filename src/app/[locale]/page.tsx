import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeInUp, FadeInDown, FadeInLeft, FadeInRight, ScaleIn, BlurIn } from "@/components/animations/FadeIn";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { TextReveal, WordReveal } from "@/components/animations/TextReveal";
import { Counter } from "@/components/animations/Counter";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { AuroraBackground, GradientMesh } from "@/components/animations/AuroraBackground";
import { ScrollIndicator } from "@/components/animations/ScrollProgress";
import { Sparkles, Zap, Code, Palette, Globe, Shield } from "lucide-react";

// ── Home Page ──────────────────────────────────────────
// Showcases Phase 03 animation components

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <AuroraBackground variant="default" />
        <ParticleBackground
          particleCount={30}
          speed={0.2}
          mouseInteraction={true}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {/* ═══ Hero Section ═══ */}
        <section className="relative flex min-h-[80vh] flex-col items-center justify-center text-center">
          <FadeInDown delay={0.2}>
            <Badge variant="gradient" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              Phase 03 — Animation Engine Ready
            </Badge>
          </FadeInDown>

          <div className="mb-4">
            <TextReveal
              text="রাহাত আহমেদ"
              className="text-4xl font-bold text-gradient bn sm:text-5xl md:text-6xl"
              delay={0.5}
            />
          </div>

          <FadeInUp delay={1.2}>
            <p className="text-xl text-muted-foreground">RahatVerse 2.0</p>
          </FadeInUp>

          <FadeInUp delay={1.5}>
            <p className="mt-6 max-w-2xl text-muted-foreground bn">
              শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।
              <br />
              <span className="text-sm">
                Student • Teacher • Blood Donor • BNCC Cadet • Web Developer
              </span>
            </p>
          </FadeInUp>

          <FadeInUp delay={1.8}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="gradient" size="lg">
                <Zap className="h-4 w-4" />
                ওয়েবসাইট অর্ডার করুন
              </Button>
              <Button variant="glass" size="lg">
                প্রজেক্ট দেখুন
              </Button>
            </div>
          </FadeInUp>

          <div className="absolute bottom-8">
            <ScrollIndicator />
          </div>
        </section>

        {/* ═══ Fade Animations Showcase ═══ */}
        <section className="py-20">
          <FadeInUp>
            <h2 className="mb-4 text-center text-3xl font-bold">
              ✨ Fade Animations
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Scroll down to see animations in action
            </p>
          </FadeInUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FadeInUp>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">FadeInUp</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements appear from below
                </p>
              </GlassCard>
            </FadeInUp>

            <FadeInDown>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">FadeInDown</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements appear from above
                </p>
              </GlassCard>
            </FadeInDown>

            <FadeInLeft>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">FadeInLeft</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements slide from left
                </p>
              </GlassCard>
            </FadeInLeft>

            <FadeInRight>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">FadeInRight</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements slide from right
                </p>
              </GlassCard>
            </FadeInRight>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <ScaleIn>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">ScaleIn</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements scale up
                </p>
              </GlassCard>
            </ScaleIn>

            <BlurIn>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">BlurIn</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Elements unblur
                </p>
              </GlassCard>
            </BlurIn>

            <FadeInUp delay={0.3}>
              <GlassCard className="h-full text-center">
                <p className="text-lg font-semibold text-primary">Delayed</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  With 0.3s delay
                </p>
              </GlassCard>
            </FadeInUp>
          </div>
        </section>

        {/* ═══ Stagger Grid ═══ */}
        <section className="py-20">
          <FadeInUp>
            <h2 className="mb-12 text-center text-3xl font-bold">
              🎭 Stagger Animations
            </h2>
          </FadeInUp>

          <StaggerGrid>
            {[
              { icon: Code, title: "Clean Code", desc: "TypeScript + Next.js 16" },
              { icon: Palette, title: "Design System", desc: "Cinematic dark theme" },
              { icon: Globe, title: "Multi-language", desc: "বাংলা + English" },
              { icon: Shield, title: "Secure", desc: "Supabase + RLS" },
              { icon: Zap, title: "Fast", desc: "Turbopack + Edge" },
              { icon: Sparkles, title: "Animated", desc: "Framer Motion + GSAP" },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <GlassCard className="h-full">
                  <div className="flex items-start gap-3">
                    <feature.icon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        {/* ═══ Counter Animations ═══ */}
        <section className="py-20">
          <FadeInUp>
            <h2 className="mb-12 text-center text-3xl font-bold">
              🔢 Counter Animations
            </h2>
          </FadeInUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <GlassCard className="text-center">
              <Counter to={10} suffix="+" className="text-4xl font-bold text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Achievements</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Counter to={5} suffix="×" className="text-4xl font-bold text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">1st Place Wins</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Counter to={4} className="text-4xl font-bold text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Blood Donations</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Counter to={3} suffix="×" className="text-4xl font-bold text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">GPA 5.00 (A+)</p>
            </GlassCard>
          </div>
        </section>

        {/* ═══ Text Reveal ═══ */}
        <section className="py-20">
          <FadeInUp>
            <h2 className="mb-12 text-center text-3xl font-bold">
              ✍️ Text Animations
            </h2>
          </FadeInUp>

          <GlassCard className="space-y-8 text-center">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">TextReveal (Character by Character)</p>
              <TextReveal
                text="প্রতিটি অক্ষর আলাদাভাবে প্রকাশিত হয়"
                className="text-xl bn"
                delay={0}
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-muted-foreground">WordReveal (Word by Word)</p>
              <WordReveal
                text="Every word appears one by one with smooth animation"
                className="text-xl"
                delay={0.5}
              />
            </div>
          </GlassCard>
        </section>

        {/* ═══ Summary ═══ */}
        <section className="py-20">
          <GradientMesh className="rounded-3xl" />
          <FadeInUp>
            <GlassCard className="relative text-center">
              <h2 className="text-2xl font-bold">
                🎬 Phase 03 Complete!
              </h2>
              <p className="mt-4 text-muted-foreground">
                Animation Engine is ready. Next: Phase 04 — Hero & Landing Page
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Badge variant="success">Framer Motion</Badge>
                <Badge variant="success">GSAP</Badge>
                <Badge variant="success">Lenis</Badge>
                <Badge variant="success">Particle Effects</Badge>
                <Badge variant="success">Custom Cursor</Badge>
                <Badge variant="success">Scroll Progress</Badge>
              </div>
            </GlassCard>
          </FadeInUp>
        </section>
      </div>
    </div>
  );
}
