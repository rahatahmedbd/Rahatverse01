"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInUp } from "@/components/animations/FadeIn"
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  rating: number
  created_at: string
}

interface TestimonialsSectionProps {
  locale?: string
  limit?: number
}

export default function TestimonialsSection({ locale = "bn", limit = 6 }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const isBn = locale === "bn"

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials")
      const data = await res.json()
      
      if (data.data) {
        // Sort by rating (highest first) and limit
        const sorted = data.data
          .sort((a: Testimonial, b: Testimonial) => b.rating - a.rating)
          .slice(0, limit)
        setTestimonials(sorted)
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTestimonials()
  }, [fetchTestimonials])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <div className="py-12">
      <FadeInUp>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {isBn ? "ক্লায়েন্টদের মতামত" : "Client Testimonials"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {isBn 
              ? "আমার ক্লায়েন্টরা কী বলছেন" 
              : "What my clients say about my work"}
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-4 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.role && testimonial.company && " • "}
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
