"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ZoomIn, Camera } from "lucide-react";
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
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-2025",
    category: "achievements",
    title: "SSC 2025 — GPA 5.00 (A+)",
    title_bn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+)",
    description: "Achieved GPA 5.00 (A+) in Science from Satgaon Jibdara High School.",
    description_bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয় থেকে বিজ্ঞান বিভাগে জিপিএ ৫.০০ (A+) অর্জন।",
    width: 800,
    height: 600,
    created_at: new Date("2025-07-10").toISOString(),
  },
  {
    id: "gallery-ssc-songbordhona",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-songbordhona",
    category: "achievements",
    title: "Meritorious Student Honor Ceremony 2025",
    title_bn: "কৃতী শিক্ষার্থী সংবর্ধনা ২০২৫",
    description: "Honored among top A+ meritorious students at Satgaon Jibdara High School.",
    description_bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়ে A+ প্রাপ্ত কৃতী শিক্ষার্থী হিসেবে বিশেষ সম্মাননা।",
    width: 800,
    height: 600,
    created_at: new Date("2025-07-15").toISOString(),
  },
  {
    id: "gallery-ssc-crest",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-crest-shantichakra",
    category: "achievements",
    title: "Shantichakra Recognition Crest 2025",
    title_bn: "শান্তিচক্র সম্মাননা ক্রেস্ট ২০২৫",
    description: "Special recognition crest awarded by Shantichakra Blood Society Sunamganj for SSC GPA 5.00.",
    description_bn: "SSC-তে A+ অর্জনের জন্য শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ কর্তৃক সম্মাননা স্মারক (ক্রেস্ট) প্রদান।",
    width: 800,
    height: 600,
    created_at: new Date("2025-07-20").toISOString(),
  },
  {
    id: "gallery-shantichakra-activities",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-blood-society",
    category: "blood-donation",
    title: "Shantichakra Blood Society - Activities & Leadership",
    title_bn: "শান্তিচক্র ব্লাড সোসাইটি — রক্তদান ও সমাজসেবা",
    description: "Co-Founder and General Secretary leading voluntary blood donation activities in Sunamganj.",
    description_bn: "সুনামগঞ্জে রক্তদাতাদের সাথে রোগীদের সংযোগ তৈরি এবং জরুরি রক্তের ব্যবস্থা করা।",
    width: 800,
    height: 600,
    created_at: new Date("2025-06-01").toISOString(),
  },
  {
    id: "gallery-science-fair-46",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/46-science-fair-2025",
    category: "achievements",
    title: "46th National Science & Technology Week 2025",
    title_bn: "৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫ — ১ম স্থান (কুইজ)",
    description: "1st Place in Science Quiz and 3rd in Science Project exhibition.",
    description_bn: "বিজ্ঞান কুইজে ১ম স্থান, বিজ্ঞান প্রজেক্টে ৩য় স্থান এবং বিজ্ঞান অলিম্পিয়াডে ৪র্থ স্থান।",
    width: 800,
    height: 600,
    created_at: new Date("2025-03-01").toISOString(),
  },
  {
    id: "gallery-srijonshil-medha",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/srijonshil-medha-2024",
    category: "achievements",
    title: "Creative Talent Search Competition 2024",
    title_bn: "সৃজনশীল মেধা অন্বেষণ ২০২৪ — বিজ্ঞানে ১ম স্থান",
    description: "1st Place in Science in the Creative Talent Search Competition.",
    description_bn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান অর্জন।",
    width: 800,
    height: 600,
    created_at: new Date("2024-05-15").toISOString(),
  },
  {
    id: "gallery-science-fair-44",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/44-science-fair-2024",
    category: "achievements",
    title: "44th National Science Exhibition 2024",
    title_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪ — ১ম স্থান",
    description: "Achieved 1st Place for the second time in National Science & Technology Week.",
    description_bn: "৪৪তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহের বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন।",
    width: 800,
    height: 600,
    created_at: new Date("2024-05-02").toISOString(),
  },
  {
    id: "gallery-science-fair-45",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/45-science-fair-2023",
    category: "achievements",
    title: "45th National Science Fair 2023",
    title_bn: "৪৫তম বিজ্ঞান মেলা ২০২৩ — ১ম স্থান",
    description: "1st Place in Science Quiz and 2nd Place in Extempore Speech.",
    description_bn: "বিজ্ঞান কুইজে ১ম স্থান, উপস্থিত বক্তৃতায় ২য় স্থান এবং বিজ্ঞান প্রজেক্টে ৩য় স্থান অর্জন।",
    width: 800,
    height: 600,
    created_at: new Date("2023-08-31").toISOString(),
  },
];

function normalizeImageUrl(url?: string | null): string {
  if (!url) return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-2025";
  if (url.includes("rahatahmedbd.github.io/assets/images/profile.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/v1786125213/rahatverse/profile/1786125213546.jpg";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/logo.png")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-logo";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/father-photo";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/ssc-gpa5-2025.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-2025";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/ssc-songbordhona-2025.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-songbordhona";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/ssc-crest-shantichakra.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-crest-shantichakra";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/shantichakra-blood-society.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-blood-society";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/46-science-fair-2025.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/46-science-fair-2025";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/45-science-fair-2023.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/45-science-fair-2023";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/44-science-fair-2024.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/44-science-fair-2024";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/42-science-fair-2020.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/42-science-fair-2020";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/srijonshil-medha-2024.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/srijonshil-medha-2024";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/fs-coaching-center.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/fs-coaching-center";
  }
  if (url.includes("rahatahmedbd.github.io/assets/images/helping-hand-org.jpg")) {
    return "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/helping-hand-org";
  }
  return url;
}

function GalleryImageWithFallback({ image, locale, onClick }: { image: GalleryImage; locale: string; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);
  const isBn = locale === "bn";
  const alt = isBn ? image.title_bn || image.title || "" : image.title || image.title_bn || "";

  if (hasError) {
    return (
      <div
        className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-4 transition-all hover:shadow-lg"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={alt}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Camera className="h-6 w-6 text-primary/60" />
        </div>
        <p className="mt-3 line-clamp-2 text-center text-xs font-medium text-muted-foreground bn">{alt || (isBn ? "ছবি উপলব্ধ নয়" : "Image unavailable")}</p>
        <Badge variant="outline" className="mt-2 text-[10px] uppercase">{image.category}</Badge>
      </div>
    );
  }

  const resolvedUrl = normalizeImageUrl(image.url);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:shadow-xl"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={alt}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <Image
        src={resolvedUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-black/55 p-3 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
        <div className="min-w-0 flex-1">
          <Badge variant="glow" className="mb-1 text-[10px] uppercase">
            {image.category}
          </Badge>
          <p className="truncate text-xs font-semibold text-white bn">{alt}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedGallery({
  locale = "bn",
  limit = 8,
  categories = ["achievements", "blood-donation", "experience"],
}: FeaturedGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const isBn = locale === "bn";

  const fetchFeaturedImages = useCallback(async () => {
    setLoading(true);
    try {
      const allImages: GalleryImage[] = [];
      for (const category of categories) {
        try {
          const res = await fetch(`/api/upload?category=${category}`);
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data.images) && data.images.length > 0) {
            // Filter out broken URLs (empty or non-http)
            const valid = data.images.filter((img: GalleryImage) => img.url && typeof img.url === "string" && img.url.length > 4);
            allImages.push(...valid);
          }
        } catch {
          // ignore per-category failures
        }
      }
      allImages.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      const finalImages = allImages.length > 0 ? allImages.slice(0, limit) : DEFAULT_FEATURED_IMAGES.slice(0, limit);
      setImages(finalImages);
    } catch {
      setImages(DEFAULT_FEATURED_IMAGES.slice(0, limit));
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
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border/30 bg-card/50",
              getMosaicSpanClass(index, "mosaic")
            )}
          >
            <ImageSkeleton />
          </div>
        ))}
      </div>
    );
  }

  const displayImages = images.length > 0 ? images : DEFAULT_FEATURED_IMAGES.slice(0, limit);
  const selectedIndex = selectedImage ? displayImages.findIndex((img) => img.id === selectedImage.id) : -1;

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

  if (displayImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/30 px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Camera className="h-6 w-6 text-primary/60" />
        </div>
        <p className="mt-3 text-sm font-medium bn">{isBn ? "এখনো কোনো ছবি যোগ করা হয়নি" : "No images yet"}</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground bn">{isBn ? "গ্যালারি শীঘ্রই আপডেট করা হবে" : "Gallery will be updated soon"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {displayImages.map((image, index) => (
          <div key={image.id} className={cn(getMosaicSpanClass(index, "mosaic"), "min-w-0")}>
            <GalleryImageWithFallback image={image} locale={locale ?? "bn"} onClick={() => setSelectedImage(image)} />
          </div>
        ))}
      </div>

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

      <div className="text-center">
        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
          <Link href={`/${locale}/gallery`} className="inline-flex items-center justify-center gap-2">
            {isBn ? "সব ছবি দেখুন" : "View All Images"}
            <ZoomIn className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
