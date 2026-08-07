"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { LightboxModal, LightboxImageItem } from "@/components/gallery/LightboxModal";
import { getMosaicSpanClass } from "@/components/gallery/mosaic-utils";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  title: string | null;
  title_bn: string | null;
  description?: string | null;
  description_bn?: string | null;
  width?: number | null;
  height?: number | null;
  created_at?: string;
}

interface FeaturedGalleryProps {
  locale?: string;
  limit?: number;
  categories?: string[];
}

const DEFAULT_FEATURED_IMAGES: GalleryImage[] = [
  {
    id: "gallery-ssc-2025",
    url: "https://rahatahmedbd.github.io/assets/images/ssc-gpa5-2025.jpg",
    category: "achievements",
    title: "SSC 2025 — GPA 5.00 (A+)",
    title_bn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+)",
    description: "Achieved GPA 5.00 (A+) in Science from Satgaon Jibdara High School.",
    description_bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয় থেকে বিজ্ঞান বিভাগে জিপিএ ৫.০০ (A+) অর্জন।",
    width: 1200,
    height: 800,
    created_at: new Date("2025-07-10").toISOString(),
  },
  {
    id: "gallery-ssc-songbordhona",
    url: "https://rahatahmedbd.github.io/assets/images/ssc-songbordhona-2025.jpg",
    category: "achievements",
    title: "Meritorious Student Honor Ceremony 2025",
    title_bn: "কৃতী শিক্ষার্থী সংবর্ধনা ২০২৫",
    description: "Honored among top A+ meritorious students at Satgaon Jibdara High School.",
    description_bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়ে A+ প্রাপ্ত কৃতী শিক্ষার্থী হিসেবে বিশেষ সম্মাননা।",
    width: 1200,
    height: 800,
    created_at: new Date("2025-07-15").toISOString(),
  },
  {
    id: "gallery-ssc-crest",
    url: "https://rahatahmedbd.github.io/assets/images/ssc-crest-shantichakra.jpg",
    category: "achievements",
    title: "Shantichakra Recognition Crest 2025",
    title_bn: "শান্তিচক্র সম্মাননা ক্রেস্ট ২০২৫",
    description: "Special recognition crest awarded by Shantichakra Blood Society Sunamganj for SSC GPA 5.00.",
    description_bn: "SSC-তে A+ অর্জনের জন্য শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ কর্তৃক সম্মাননা স্মারক (ক্রেস্ট) প্রদান।",
    width: 1200,
    height: 800,
    created_at: new Date("2025-07-20").toISOString(),
  },
  {
    id: "gallery-shantichakra-activities",
    url: "https://rahatahmedbd.github.io/assets/images/shantichakra-blood-society.jpg",
    category: "blood-donation",
    title: "Shantichakra Blood Society - Activities & Leadership",
    title_bn: "শান্তিচক্র ব্লাড সোসাইটি — রক্তদান ও সমাজসেবা",
    description: "Co-Founder and General Secretary leading voluntary blood donation activities in Sunamganj.",
    description_bn: "সুনামগঞ্জে রক্তদাতাদের সাথে রোগীদের সংযোগ তৈরি এবং জরুরি রক্তের ব্যবস্থা করা।",
    width: 1200,
    height: 800,
    created_at: new Date("2025-06-01").toISOString(),
  },
  {
    id: "gallery-science-fair-46",
    url: "https://rahatahmedbd.github.io/assets/images/46-science-fair-2025.jpg",
    category: "achievements",
    title: "46th National Science & Technology Week 2025",
    title_bn: "৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫ — ১ম স্থান (কুইজ)",
    description: "1st Place in Science Quiz and 3rd in Science Project exhibition.",
    description_bn: "বিজ্ঞান কুইজে ১ম স্থান, বিজ্ঞান প্রজেক্টে ৩য় স্থান এবং বিজ্ঞান অলিম্পিয়াডে ৪র্থ স্থান।",
    width: 1200,
    height: 800,
    created_at: new Date("2025-03-01").toISOString(),
  },
  {
    id: "gallery-srijonshil-medha",
    url: "https://rahatahmedbd.github.io/assets/images/srijonshil-medha-2024.jpg",
    category: "achievements",
    title: "Creative Talent Search Competition 2024",
    title_bn: "সৃজনশীল মেধা অন্বেষণ ২০২৪ — বিজ্ঞানে ১ম স্থান",
    description: "1st Place in Science in the Creative Talent Search Competition.",
    description_bn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান অর্জন।",
    width: 1200,
    height: 800,
    created_at: new Date("2024-05-15").toISOString(),
  },
  {
    id: "gallery-science-fair-44",
    url: "https://rahatahmedbd.github.io/assets/images/44-science-fair-2024.jpg",
    category: "achievements",
    title: "44th National Science Exhibition 2024",
    title_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪ — ১ম স্থান",
    description: "Achieved 1st Place for the second time in National Science & Technology Week.",
    description_bn: "৪৪তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহের বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন।",
    width: 1200,
    height: 800,
    created_at: new Date("2024-05-02").toISOString(),
  },
  {
    id: "gallery-science-fair-45",
    url: "https://rahatahmedbd.github.io/assets/images/45-science-fair-2023.jpg",
    category: "achievements",
    title: "45th National Science Fair 2023",
    title_bn: "৪৫তম বিজ্ঞান মেলা ২০২৩ — ১ম স্থান",
    description: "1st Place in Science Quiz and 2nd Place in Extempore Speech.",
    description_bn: "বিজ্ঞান কুইজে ১ম স্থান, উপস্থিত বক্তৃতায় ২য় স্থান এবং বিজ্ঞান প্রজেক্টে ৩য় স্থান অর্জন।",
    width: 1200,
    height: 800,
    created_at: new Date("2023-08-31").toISOString(),
  },
  {
    id: "gallery-science-fair-42",
    url: "https://rahatahmedbd.github.io/assets/images/42-science-fair-2020.jpg",
    category: "achievements",
    title: "42nd National Science Fair 2020",
    title_bn: "৪২তম বিজ্ঞান মেলা ২০২০ — ১ম স্থান (প্রথম জয়)",
    description: "First major victory: 1st Place at Upazila level in 42nd National Science Week.",
    description_bn: "৪২তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে উপজেলা পর্যায়ে প্রথম স্থান অর্জন।",
    width: 1200,
    height: 800,
    created_at: new Date("2020-11-26").toISOString(),
  },
  {
    id: "gallery-fs-coaching",
    url: "https://rahatahmedbd.github.io/assets/images/fs-coaching-center.jpg",
    category: "experience",
    title: "FS Coaching Center - Founder & Director",
    title_bn: "FS কোচিং সেন্টার — প্রতিষ্ঠাতা ও পরিচালক",
    description: "Founded FS Coaching Center at Jibdara Bazar to provide affordable education.",
    description_bn: "গ্রামের গরিব ও মেধাবী শিক্ষার্থীদের সুলভ মূল্যে মানসম্মত শিক্ষা প্রদানে প্রতিষ্ঠিত।",
    width: 1200,
    height: 800,
    created_at: new Date("2024-12-31").toISOString(),
  },
  {
    id: "gallery-helping-hand",
    url: "https://rahatahmedbd.github.io/assets/images/helping-hand-org.jpg",
    category: "experience",
    title: "Helping Hand Organization - Founder",
    title_bn: "হেল্পিং হ্যান্ড অর্গানাইজেশন — প্রতিষ্ঠাতা",
    description: "Founded Helping Hand Organization to assist underprivileged communities.",
    description_bn: "গরিব, দুঃখী ও অসহায় মানুষের পাশে দাঁড়ানোর লক্ষ্যে প্রতিষ্ঠিত সংগঠন।",
    width: 1200,
    height: 800,
    created_at: new Date("2023-11-01").toISOString(),
  },
  {
    id: "gallery-father-photo",
    url: "https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg",
    category: "experience",
    title: "Late Md. Farid Ahmed - Beloved Father & Former Chairman",
    title_bn: "মরহুম জনাব ফরিদ আহমেদ — শ্রদ্ধেয় পিতা ও সাবেক চেয়ারম্যান",
    description: "Former Chairman of Shimulbank Union Parishad (2003-2011) and community leader.",
    description_bn: "শিমুলবাঁক ইউনিয়নের সাবেক চেয়ারম্যান (২০০৩-২০১১) ও কিংবদন্তি ব্যক্তিত্ব।",
    width: 1200,
    height: 800,
    created_at: new Date("2023-05-03").toISOString(),
  },
];

export default function FeaturedGallery({ 
  locale = "bn", 
  limit = 12,
  categories = ["achievements", "blood-donation", "experience"]
}: FeaturedGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const isBn = locale === "bn";

  const fetchFeaturedImages = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch images from multiple categories
      const allImages: GalleryImage[] = [];
      
      for (const category of categories) {
        const res = await fetch(`/api/upload?category=${category}`);
        const data = await res.json();
        if (data.images) {
          allImages.push(...data.images);
        }
      }
      
      // Sort by created_at (newest first) and limit
      allImages.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      
      const finalImages = allImages.length > 0 ? allImages.slice(0, limit) : DEFAULT_FEATURED_IMAGES;
      setImages(finalImages);
    } catch (error) {
      console.error("Failed to fetch featured images:", error);
      setImages(DEFAULT_FEATURED_IMAGES);
    } finally {
      setLoading(false);
    }
  }, [categories, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeaturedImages();
  }, [fetchFeaturedImages]);

  if (loading) {
    return (
      <div
        data-testid="featured-gallery-skeleton"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border/50 bg-card",
              getMosaicSpanClass(index, "mosaic")
            )}
          >
            <ImageSkeleton />
          </div>
        ))}
      </div>
    );
  }

  const displayImages = images.length > 0 ? images : DEFAULT_FEATURED_IMAGES;

  const selectedIndex = selectedImage
    ? displayImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = () => {
    if (selectedIndex === -1) return;
    const prevIndex = (selectedIndex - 1 + displayImages.length) % displayImages.length;
    setSelectedImage(displayImages[prevIndex]);
  };

  const handleNext = () => {
    if (selectedIndex === -1) return;
    const nextIndex = (selectedIndex + 1) % displayImages.length;
    setSelectedImage(displayImages[nextIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Bento / Mosaic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/50 bg-card cursor-pointer transition-all hover:shadow-xl",
              getMosaicSpanClass(index, "mosaic")
            )}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={isBn ? image.title_bn || image.title || "" : image.title || image.title_bn || ""}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Hover Glass Caption Overlay */}
            <div className="glass-interactive absolute inset-x-2 bottom-2 rounded-xl p-3 sm:p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out backdrop-blur-md bg-black/60 border border-white/20 shadow-lg flex flex-col justify-end">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Badge variant="glow" className="text-[10px] py-0 px-2 uppercase">
                      {image.category}
                    </Badge>
                  </div>
                  <p className="text-white text-sm font-semibold truncate">
                    {isBn ? image.title_bn || image.title : image.title || image.title_bn}
                  </p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          image={selectedImage as LightboxImageItem}
          locale={locale}
          currentIndex={selectedIndex}
          totalCount={displayImages.length}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* View All Button */}
      <div className="text-center">
        <Button variant="gradient" size="lg" asChild>
          <Link href={`/${locale}/gallery`}>
            {isBn ? "সব ছবি দেখুন" : "View All Images"}
            <svg
              className="h-4 w-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
}
