"use client"

import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn"
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Code, 
  Palette, 
  ShoppingBag, 
  GraduationCap, 
  Droplets, 
  Building2,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Search,
  Clock,
  Users
} from "lucide-react"
import Link from "next/link"
import { useLocale } from "next-intl"

export default function ServicesPage() {
  const locale = useLocale();

  const services = [
    {
      icon: Code,
      title: "ওয়েব ডেভেলপমেন্ট",
      titleEn: "Web Development",
      description: "আধুনিক, দ্রুতগতির ও Responsive ওয়েবসাইট তৈরি করি",
      descriptionEn: "Modern, fast, and responsive websites",
      features: [
        "Next.js ও React দিয়ে তৈরি",
        "TypeScript ব্যবহার",
        "Tailwind CSS দিয়ে স্টাইলিং",
        "Supabase ব্যাকএন্ড",
        "Cloudinary ইমেজ ম্যানেজমেন্ট"
      ],
      featuresEn: [
        "Built with Next.js and React",
        "TypeScript implementation",
        "Tailwind CSS styling",
        "Supabase backend",
        "Cloudinary image management"
      ],
      price: "৳5,000 - ৳30,000",
      priceEn: "৳5,000 - ৳30,000"
    },
    {
      icon: Palette,
      title: "পোর্টফোলিও ওয়েবসাইট",
      titleEn: "Portfolio Website",
      description: "আপনার কাজ ও দক্ষতা প্রদর্শনের জন্য প্রফেশনাল পোর্টফোলিও",
      descriptionEn: "Professional portfolio to showcase your work and skills",
      features: [
        "আকর্ষণীয় ডিজাইন",
        "প্রজেক্ট শোকেস",
        "রেজুমে ডাউনলোড",
        "যোগাযোগ ফর্ম",
        "সোশ্যাল মিডিয়া ইন্টিগ্রেশন"
      ],
      featuresEn: [
        "Attractive design",
        "Project showcase",
        "Resume download",
        "Contact form",
        "Social media integration"
      ],
      price: "৳5,000 - ৳10,000",
      priceEn: "৳5,000 - ৳10,000"
    },
    {
      icon: ShoppingBag,
      title: "ই-কমার্স ওয়েবসাইট",
      titleEn: "E-Commerce Website",
      description: "অনলাইনে পণ্য বিক্রির জন্য সম্পূর্ণ ই-কমার্স সমাধান",
      descriptionEn: "Complete e-commerce solution for selling products online",
      features: [
        "পণ্য ক্যাটালগ",
        "শপিং কার্ট",
        "পেমেন্ট ইন্টিগ্রেশন",
        "অর্ডার ম্যানেজমেন্ট",
        "ইনভেন্টরি ট্র্যাকিং"
      ],
      featuresEn: [
        "Product catalog",
        "Shopping cart",
        "Payment integration",
        "Order management",
        "Inventory tracking"
      ],
      price: "৳20,000 - ৳50,000",
      priceEn: "৳20,000 - ৳50,000"
    },
    {
      icon: GraduationCap,
      title: "শিক্ষা প্রতিষ্ঠান",
      titleEn: "Educational Institution",
      description: "স্কুল, কলেজ বা কোচিং সেন্টারের জন্য ওয়েবসাইট",
      descriptionEn: "Website for schools, colleges, or coaching centers",
      features: [
        "কোর্স তালিকা",
        "শিক্ষক প্রোফাইল",
        "ভর্তি তথ্য",
        "নোটিশ বোর্ড",
        "ইভেন্ট ক্যালেন্ডার"
      ],
      featuresEn: [
        "Course listing",
        "Teacher profiles",
        "Admission info",
        "Notice board",
        "Event calendar"
      ],
      price: "৳10,000 - ৳25,000",
      priceEn: "৳10,000 - ৳25,000"
    },
    {
      icon: Droplets,
      title: "রক্ত সংগঠন",
      titleEn: "Blood Donation Organization",
      description: "রক্তদান সংগঠনের জন্য সম্পূর্ণ ওয়েবসাইট সলিউশন",
      descriptionEn: "Complete website solution for blood donation organizations",
      features: [
        "ডোনার রেজিস্ট্রেশন",
        "রক্ত অনুরোধ সিস্টেম",
        "ডোনার ডেটাবেস",
        "ইভেন্ট ম্যানেজমেন্ট",
        "রিয়েল-টাইম নোটিফিকেশন"
      ],
      featuresEn: [
        "Donor registration",
        "Blood request system",
        "Donor database",
        "Event management",
        "Real-time notifications"
      ],
      price: "৳15,000 - ৳30,000",
      priceEn: "৳15,000 - ৳30,000"
    },
    {
      icon: Building2,
      title: "ব্যবসায়িক ওয়েবসাইট",
      titleEn: "Business Website",
      description: "আপনার ব্যবসার জন্য প্রফেশনাল ওয়েবসাইট",
      descriptionEn: "Professional website for your business",
      features: [
        "কোম্পানি প্রোফাইল",
        "সার্ভিস পেজ",
        "টিম পেজ",
        "ব্লগ সেকশন",
        "লিড জেনারেশন ফর্ম"
      ],
      featuresEn: [
        "Company profile",
        "Service pages",
        "Team page",
        "Blog section",
        "Lead generation form"
      ],
      price: "৳10,000 - ৳25,000",
      priceEn: "৳10,000 - ৳25,000"
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "দ্রুতগতির পারফরম্যান্স",
      titleEn: "Lightning Fast Performance",
      description: "অপটিমাইজড কোড এবং CDN ব্যবহার করে দ্রুত লোডিং"
    },
    {
      icon: Shield,
      title: "সিকিউরিটি",
      titleEn: "Security",
      description: "সর্বোচ্চ নিরাপত্তা ব্যবস্থা সহ সুরক্ষিত ওয়েবসাইট"
    },
    {
      icon: Smartphone,
      title: "মোবাইল রেসপনসিভ",
      titleEn: "Mobile Responsive",
      description: "সব ডিভাইসে পারফেক্ট দেখায়"
    },
    {
      icon: Search,
      title: "SEO অপটিমাইজড",
      titleEn: "SEO Optimized",
      description: "সার্চ ইঞ্জিনে ভালো র‍্যাঙ্কিং পাবে"
    },
    {
      icon: Clock,
      title: "সময়মতো ডেলিভারি",
      titleEn: "On-Time Delivery",
      description: "নির্ধারিত সময়ের মধ্যে ডেলিভারি নিশ্চিত"
    },
    {
      icon: Users,
      title: "সাপোর্ট",
      titleEn: "Support",
      description: "ডেলিভারির পরও সাপোর্ট পাবেন"
    }
  ]

  const process = [
    {
      step: "০১",
      title: "আলোচনা",
      titleEn: "Discussion",
      description: "আপনার প্রয়োজনীয়তা বুঝে নেওয়া"
    },
    {
      step: "০২",
      title: "ডিজাইন",
      titleEn: "Design",
      description: "আকর্ষণীয় ডিজাইন তৈরি"
    },
    {
      step: "০৩",
      title: "ডেভেলপমেন্ট",
      titleEn: "Development",
      description: "কোড লেখা এবং ফিচার যোগ করা"
    },
    {
      step: "০৪",
      title: "টেস্টিং",
      titleEn: "Testing",
      description: "সব ফিচার টেস্ট করা"
    },
    {
      step: "০৫",
      title: "ডেলিভারি",
      titleEn: "Delivery",
      description: "ওয়েবসাইট ডেলিভারি এবং সাপোর্ট"
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-16">
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              আমাদের সার্ভিসসমূহ
            </h1>
            <p className="text-xl text-muted-foreground">
              আধুনিক, দ্রুতগতির ও Responsive ওয়েবসাইট তৈরি করি
            </p>
          </div>
        </FadeInUp>

        {/* Services Grid */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <service.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">ফিচারসমূহ:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {service.price}
                        </span>
                        <Button asChild>
                          <Link href={`/${locale}/order`}>
                            অর্ডার করুন
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Why Choose Us */}
        <FadeInUp>
          <div className="mb-20">
            <h2 className="text-heading-lg font-bold text-center mb-12">
              কেন আমাদের বেছে নেবেন?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <FadeInLeft key={index} delay={index * 0.1}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </FadeInLeft>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Process */}
        <FadeInUp>
          <div className="mb-20">
            <h2 className="text-heading-lg font-bold text-center mb-12">
              আমাদের কাজের প্রক্রিয়া
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>
              <div className="space-y-8">
                {process.map((step, index) => (
                  <FadeInRight key={index} delay={index * 0.1}>
                    <div className={`flex items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">{step.step}</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </FadeInRight>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* CTA */}
        <FadeInUp>
          <Card className="bg-brand-gradient-soft gradient-border border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-heading-md font-bold mb-4">
                আজই আপনার ওয়েবসাইট অর্ডার করুন
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                আপনার স্বপ্নের ওয়েবসাইট তৈরি করতে আমাদের সাথে যোগাযোগ করুন
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="gradient" asChild>
                  <Link href={`/${locale}/order`}>
                    অর্ডার করুন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/${locale}/contact`}>
                    যোগাযোগ করুন
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  )
}
