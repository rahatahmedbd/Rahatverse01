"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ZoomIn, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { EmptyState } from "@/components/ui/empty-state";
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

export default function FeaturedGallery({ 
  locale = "bn", 
  limit = 8,
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
      
      setImages(allImages.slice(0, limit));
    } catch (error) {
      console.error("Failed to fetch featured images:", error);
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

  if (images.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title={isBn ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
        description={
          isBn
            ? "ফিচার্ড গ্যালারিতে শীঘ্রই নতুন ছবি আপলোড করা হবে।"
            : "Featured photos will be uploaded soon."
        }
      />
    );
  }

  const selectedIndex = selectedImage
    ? images.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = () => {
    if (selectedIndex === -1) return;
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  const handleNext = () => {
    if (selectedIndex === -1) return;
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Bento / Mosaic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
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
          totalCount={images.length}
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
