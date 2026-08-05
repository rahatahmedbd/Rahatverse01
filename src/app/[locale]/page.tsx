import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Palette, Zap, Shield, Globe } from "lucide-react";

// ── Home Page (Locale-based) ───────────────────────────
// Phase 04 will build the full cinematic hero section
// This is a preview showing the design system

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero Section (Placeholder) */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Badge variant="gradient" className="mb-6 animate-fade-in">
          <Sparkles className="mr-1 h-3 w-3" />
          Phase 02 — Design System Ready
        </Badge>

        <h1 className="bn text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in-up">
          <span className="text-gradient">রাহাত আহমেদ</span>
        </h1>

        <p className="mt-4 text-xl text-muted-foreground animate-fade-in-up stagger-1">
          RahatVerse 2.0
        </p>

        <p className="mt-6 max-w-2xl text-muted-foreground bn animate-fade-in-up stagger-2">
          শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।
          <br />
          <span className="text-sm">
            Student • Teacher • Blood Donor • BNCC Cadet • Web Developer
          </span>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up stagger-3">
          <Button variant="gradient" size="lg">
            <Zap className="h-4 w-4" />
            ওয়েবসাইট অর্ডার করুন
          </Button>
          <Button variant="glass" size="lg">
            প্রজেক্ট দেখুন
          </Button>
        </div>
      </section>

      {/* Design System Preview */}
      <section className="py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">
          ✨ Design System Components
        </h2>

        {/* Buttons */}
        <GlassCard className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="glow">Glow</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </GlassCard>

        {/* Badges */}
        <GlassCard className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="glow">Glow</Badge>
            <Badge variant="gradient">Gradient</Badge>
          </div>
        </GlassCard>

        {/* Colors */}
        <GlassCard className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Colors</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-amber-500" />
              <p className="text-xs text-muted-foreground">Amber</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-orange-500" />
              <p className="text-xs text-muted-foreground">Orange</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-blue-500" />
              <p className="text-xs text-muted-foreground">Blue</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-green-500" />
              <p className="text-xs text-muted-foreground">Green</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-purple-500" />
              <p className="text-xs text-muted-foreground">Purple</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-red-500" />
              <p className="text-xs text-muted-foreground">Red</p>
            </div>
          </div>
        </GlassCard>

        {/* Features Grid */}
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">Features</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Code, title: "Clean Code", desc: "TypeScript + Next.js 16" },
              { icon: Palette, title: "Design System", desc: "Cinematic dark theme" },
              { icon: Globe, title: "Multi-language", desc: "বাংলা + English" },
              { icon: Shield, title: "Secure", desc: "Supabase + RLS" },
              { icon: Zap, title: "Fast", desc: "Turbopack + Edge" },
              { icon: Sparkles, title: "Animated", desc: "Framer Motion + GSAP" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-accent/20"
              >
                <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
