"use client"

import { FadeInUp } from "@/components/animations/FadeIn"
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Code, Palette, ShoppingBag, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"

export default function PortfolioPage() {
  const locale = useLocale();
  const projects = [
    {
      title: "RahatVerse - Personal Portfolio",
      titleBn: "রাহাতভার্স - ব্যক্তিগত পোর্টফোলিও",
      description: "A modern, interactive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features include multi-language support, admin dashboard, image management, and more.",
      descriptionBn: "Next.js, TypeScript, এবং Tailwind CSS দিয়ে তৈরি একটি আধুনিক, ইন্টারঅ্যাক্টিভ পোর্টফোলিও ওয়েবসাইট। মাল্টি-ল্যাংগুয়েজ সাপোর্ট, অ্যাডমিন ড্যাশবোর্ড, ইমেজ ম্যানেজমেন্ট এবং আরও অনেক কিছু।",
      image: "/projects/rahatverse.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
      tagsBn: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
      liveUrl: "https://rahatverse01.vercel.app",
      githubUrl: "https://github.com/rahatahmedbd/Rahatverse01",
      category: "portfolio"
    },
    {
      title: "E-Commerce Platform",
      titleBn: "ই-কমার্স প্ল্যাটফর্ম",
      description: "A full-featured e-commerce platform with product management, shopping cart, payment integration, and order tracking system.",
      descriptionBn: "প্রোডাক্ট ম্যানেজমেন্ট, শপিং কার্ট, পেমেন্ট ইন্টিগ্রেশন, এবং অর্ডার ট্র্যাকিং সিস্টেম সহ একটি সম্পূর্ণ ই-কমার্স প্ল্যাটফর্ম।",
      image: "/projects/ecommerce.jpg",
      tags: ["Next.js", "React", "Stripe", "PostgreSQL"],
      tagsBn: ["Next.js", "React", "Stripe", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
      category: "ecommerce"
    },
    {
      title: "School Management System",
      titleBn: "স্কুল ম্যানেজমেন্ট সিস্টেম",
      description: "Comprehensive school management system with student records, attendance tracking, grade management, and parent portal.",
      descriptionBn: "ছাত্র রেকর্ড, উপস্থিতি ট্র্যাকিং, গ্রেড ম্যানেজমেন্ট, এবং প্যারেন্টাল পোর্টাল সহ একটি সম্পূর্ণ স্কুল ম্যানেজমেন্ট সিস্টেম।",
      image: "/projects/school.jpg",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      tagsBn: ["React", "Node.js", "MongoDB", "Express"],
      liveUrl: "#",
      githubUrl: "#",
      category: "education"
    },
    {
      title: "Blood Donation Platform",
      titleBn: "রক্তদান প্ল্যাটফর্ম",
      description: "A platform connecting blood donors with recipients. Features include donor registration, blood request system, and real-time notifications.",
      descriptionBn: "রক্তদাতাদের গ্রহীতাদের সাথে সংযুক্ত করার একটি প্ল্যাটফর্ম। ডোনার রেজিস্ট্রেশন, ব্লাড রিকোয়েস্ট সিস্টেম, এবং রিয়েল-টাইম নোটিফিকেশন।",
      image: "/projects/blood.jpg",
      tags: ["Next.js", "Supabase", "Tailwind CSS", "Real-time"],
      tagsBn: ["Next.js", "Supabase", "Tailwind CSS", "Real-time"],
      liveUrl: "#",
      githubUrl: "#",
      category: "blood-donation"
    },
    {
      title: "Business Website Template",
      titleBn: "ব্যবসায়িক ওয়েবসাইট টেমপ্লেট",
      description: "Professional business website template with modern design, responsive layout, and SEO optimization.",
      descriptionBn: "আধুনিক ডিজাইন, রেসপনসিভ লেআউট, এবং SEO অপটিমাইজেশন সহ প্রফেশনাল বিজনেস ওয়েবসাইট টেমপ্লেট।",
      image: "/projects/business.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
      tagsBn: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
      liveUrl: "#",
      githubUrl: "#",
      category: "business"
    },
    {
      title: "Blog Platform",
      titleBn: "ব্লগ প্ল্যাটফর্ম",
      description: "A feature-rich blog platform with markdown support, categories, tags, comments, and admin dashboard.",
      descriptionBn: "মার্কডাউন সাপোর্ট, ক্যাটাগরি, ট্যাগ, কমেন্টস, এবং অ্যাডমিন ড্যাশবোর্ড সহ একটি ফিচার-রিচ ব্লগ প্ল্যাটফর্ম।",
      image: "/projects/blog.jpg",
      tags: ["Next.js", "Markdown", "Supabase", "Rich Text"],
      tagsBn: ["Next.js", "Markdown", "Supabase", "Rich Text"],
      liveUrl: "#",
      githubUrl: "#",
      category: "blog"
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "portfolio":
        return Code
      case "ecommerce":
        return ShoppingBag
      case "education":
        return GraduationCap
      case "blood-donation":
        return Code
      case "business":
        return Palette
      default:
        return Code
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-16">
            <h1 className="text-gradient mb-4 text-4xl font-bold md:text-5xl">
              আমার প্রজেক্টসমূহ
            </h1>
            <p className="text-xl text-muted-foreground">
              আমার তৈরি কিছু উল্লেখযোগ্য প্রজেক্ট দেখুন
            </p>
          </div>
        </FadeInUp>

        {/* Projects Grid */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.filter((project) => project.liveUrl !== "#" || project.githubUrl !== "#").map((project, index) => {
            const CategoryIcon = getCategoryIcon(project.category)
            
            return (
              <StaggerItem key={index}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon className="h-16 w-16 text-primary/50" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">{project.titleBn}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.descriptionBn}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tagsBn.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex gap-2">
                      {project.liveUrl !== "#" && (
                        <Button size="sm" asChild className="flex-1">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            লাইভ
                          </a>
                        </Button>
                      )}
                      {project.githubUrl !== "#" && (
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Code className="h-4 w-4 mr-1" />
                            কোড
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* CTA */}
        <FadeInUp className="mt-20">
          <Card className="bg-brand-gradient-soft gradient-border border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                আপনার প্রজেক্ট তৈরি করতে চান?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                আপনার আইডিয়াকে বাস্তবে রূপ দিতে আজই যোগাযোগ করুন
              </p>
              <Button size="lg" variant="gradient" asChild>
                <Link href={`/${locale}/contact`}>
                  যোগাযোগ করুন
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  )
}
