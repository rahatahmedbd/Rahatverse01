"use client"

import { useState } from "react"
import { FadeInUp } from "@/components/animations/FadeIn"
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code, Palette, ShoppingBag, GraduationCap, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLocale } from "next-intl"

function ProjectImage({ src, alt, category }: { src: string; alt: string; category: string }) {
  const [hasError, setHasError] = useState(false)
  const CategoryMap: Record<string, typeof Code> = {
    portfolio: Code,
    ecommerce: ShoppingBag,
    education: GraduationCap,
    "blood-donation": Code,
    business: Palette,
    blog: Code,
  }
  const Icon = CategoryMap[category] ?? Code

  // Public projects folder doesn't exist in repo — treat as missing → show icon fallback gracefully
  const isMissing = !src || src.startsWith("/projects/") || hasError

  if (isMissing) {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/12 via-card to-purple-500/10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
            <Icon className="h-7 w-7 text-primary/70" />
          </div>
          <span className="text-xs font-medium tracking-wide text-muted-foreground">Preview upcoming</span>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="bg-background/80 text-xs backdrop-blur">
            {category}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-48 overflow-hidden bg-card">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        onError={() => setHasError(true)}
      />
      <div className="absolute right-3 top-3">
        <Badge variant="secondary" className="bg-background/80 text-xs backdrop-blur">
          {category}
        </Badge>
      </div>
      {/* subtle gradient overlay for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}

export default function PortfolioPage() {
  const locale = useLocale()
  const isBn = locale === "bn"
  const projects = [
    {
      title: "RahatVerse - Personal Portfolio",
      titleBn: "রাহাতভার্স — ব্যক্তিগত পোর্টফোলিও",
      description: "A modern, interactive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features include multi-language support, admin dashboard, image management, and more.",
      descriptionBn: "Next.js, TypeScript, এবং Tailwind CSS দিয়ে তৈরি আধুনিক, ইন্টারঅ্যাক্টিভ পোর্টফোলিও। মাল্টি-ল্যাংগুয়েজ, অ্যাডমিন ড্যাশবোর্ড, ইমেজ ম্যানেজমেন্ট সহ।",
      image: "/projects/rahatverse.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
      tagsBn: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
      liveUrl: "https://rahatverse01.vercel.app",
      githubUrl: "https://github.com/rahatahmedbd/Rahatverse01",
      category: "portfolio",
    },
    {
      title: "E-Commerce Platform",
      titleBn: "ই-কমার্স প্ল্যাটফর্ম",
      description: "A full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking system.",
      descriptionBn: "প্রোডাক্ট ম্যানেজমেন্ট, শপিং কার্ট, পেমেন্ট ইন্টিগ্রেশন এবং অর্ডার ট্র্যাকিং সহ সম্পূর্ণ ই-কমার্স প্ল্যাটফর্ম।",
      image: "/projects/ecommerce.jpg",
      tags: ["Next.js", "React", "Stripe", "PostgreSQL"],
      tagsBn: ["Next.js", "React", "Stripe", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
      category: "ecommerce",
    },
    {
      title: "School Management System",
      titleBn: "স্কুল ম্যানেজমেন্ট সিস্টেম",
      description: "Comprehensive school management system with student records, attendance tracking, grade management, and parent portal.",
      descriptionBn: "ছাত্র রেকর্ড, উপস্থিতি ট্র্যাকিং, গ্রেড ম্যানেজমেন্ট এবং প্যারেন্টাল পোর্টাল সহ সম্পূর্ণ স্কুল ম্যানেজমেন্ট সিস্টেম।",
      image: "/projects/school.jpg",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      tagsBn: ["React", "Node.js", "MongoDB", "Express"],
      liveUrl: "#",
      githubUrl: "#",
      category: "education",
    },
    {
      title: "Blood Donation Platform",
      titleBn: "রক্তদান প্ল্যাটফর্ম",
      description: "A platform connecting blood donors with recipients. Features include donor registration, blood request system, and real-time notifications.",
      descriptionBn: "রক্তদাতাদের গ্রহীতাদের সাথে সংযুক্ত করার প্ল্যাটফর্ম। ডোনার রেজিস্ট্রেশন, ব্লাড রিকোয়েস্ট এবং রিয়েল-টাইম নোটিফিকেশন।",
      image: "/projects/blood.jpg",
      tags: ["Next.js", "Supabase", "Tailwind CSS", "Real-time"],
      tagsBn: ["Next.js", "Supabase", "Tailwind CSS", "Real-time"],
      liveUrl: "#",
      githubUrl: "#",
      category: "blood-donation",
    },
    {
      title: "Business Website Template",
      titleBn: "ব্যবসায়িক ওয়েবসাইট টেমপ্লেট",
      description: "Professional business website template with modern design, responsive layout, and SEO optimization.",
      descriptionBn: "আধুনিক ডিজাইন, রেসপনসিভ লেআউট এবং SEO অপটিমাইজেশন সহ প্রফেশনাল বিজনেস টেমপ্লেট।",
      image: "/projects/business.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
      tagsBn: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
      liveUrl: "#",
      githubUrl: "#",
      category: "business",
    },
    {
      title: "Blog Platform",
      titleBn: "ব্লগ প্ল্যাটফর্ম",
      description: "A feature-rich blog platform with markdown support, categories, tags, comments, and admin dashboard.",
      descriptionBn: "মার্কডাউন সাপোর্ট, ক্যাটাগরি, ট্যাগ, কমেন্টস এবং অ্যাডমিন ড্যাশবোর্ড সহ ফিচার-রিচ ব্লগ প্ল্যাটফর্ম।",
      image: "/projects/blog.jpg",
      tags: ["Next.js", "Markdown", "Supabase", "Rich Text"],
      tagsBn: ["Next.js", "Markdown", "Supabase", "Rich Text"],
      liveUrl: "#",
      githubUrl: "#",
      category: "blog",
    },
  ]

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-gradient text-display-sm sm:text-display-lg font-bold tracking-tight">
              {isBn ? "আমার প্রজেক্টসমূহ" : "My Projects"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              {isBn ? "বাস্তব প্রজেক্ট, পরিষ্কার কোড এবং আধুনিক ডিজাইন — প্রতিটি কাজের পেছনে গল্প আছে।" : "Real projects, clean code and modern design — every build tells a story."}
            </p>
          </div>
        </FadeInUp>

        {/* Projects Grid — 1 col on 320, 2 on 768, 3 on 1280, compact */}
        <StaggerContainer className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <StaggerItem key={index}>
              <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <ProjectImage
                  src={project.image}
                  alt={isBn ? project.titleBn : project.title}
                  category={project.category}
                />

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-[15px] font-semibold tracking-tight sm:text-lg">
                    {isBn ? project.titleBn : project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs leading-relaxed sm:text-sm">
                    {isBn ? project.descriptionBn : project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col pt-0">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(isBn ? project.tagsBn : project.tags).slice(0, 4).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                        {tag}
                      </Badge>
                    ))}
                    {(isBn ? project.tagsBn : project.tags).length > 4 && (
                      <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px]">
                        +{(isBn ? project.tagsBn : project.tags).length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button size="sm" asChild className="flex-1 rounded-xl" disabled={project.liveUrl === "#"}>
                      <a
                        href={project.liveUrl !== "#" ? project.liveUrl : undefined}
                        target={project.liveUrl !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        aria-disabled={project.liveUrl === "#"}
                        onClick={(e) => project.liveUrl === "#" && e.preventDefault()}
                        className={project.liveUrl === "#" ? "pointer-events-none opacity-60" : ""}
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        {isBn ? "লাইভ" : "Live Demo"}
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild className="flex-1 rounded-xl">
                      <a
                        href={project.githubUrl !== "#" ? project.githubUrl : `/${locale}/contact`}
                        target={project.githubUrl !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                      >
                        {project.githubUrl !== "#" ? (
                          <>
                            <Code className="mr-1 h-3.5 w-3.5" />
                            {isBn ? "কোড" : "Code"}
                          </>
                        ) : (
                          <>
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {isBn ? "বিস্তারিত" : "Details"}
                          </>
                        )}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp className="mt-12 sm:mt-16">
          <Card className="overflow-hidden rounded-2xl border-primary/15 bg-gradient-to-br from-primary/8 via-card to-violet-500/8 sm:rounded-3xl">
            <CardContent className="px-6 py-8 text-center sm:px-8 sm:py-10">
              <h2 className="text-heading-sm font-bold tracking-tight sm:text-heading-md">
                {isBn ? "আপনার প্রজেক্ট তৈরি করতে চান?" : "Have a project in mind?"}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {isBn ? "আপনার আইডিয়াকে বাস্তবে রূপ দিতে আজই যোগাযোগ করুন — দ্রুত, আধুনিক এবং সাশ্রয়ী।" : "Let's turn your idea into reality — fast, modern and affordable."}
              </p>
              <Button size="lg" variant="gradient" asChild className="mt-6 w-full sm:w-auto">
                <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2">
                  {isBn ? "যোগাযোগ করুন" : "Let's Talk"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  )
}
