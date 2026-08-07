"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ZoomIn, LayoutGrid, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { LightboxModal, LightboxImageItem } from "@/components/gallery/LightboxModal";
import { getMosaicSpanClass, GalleryLayoutMode } from "@/components/gallery/mosaic-utils";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  public_id: string;
  url: string;
  category: string;
  title: string | null;
  title_bn: string | null;
  description: string | null;
  description_bn: string | null;
  width: number | null;
  height: number | null;
}

interface GalleryProps {
  locale?: string;
}

export default function Gallery({ locale = "bn" }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("mosaic");
  const isBn = locale === "bn";

  const categories = [
    { value: "all", label: isBn ? "সব" : "All" },
    { value: "achievements", label: isBn ? "অর্জন" : "Achievements" },
    { value: "blood-donation", label: isBn ? "রক্তদান" : "Blood Donation" },
    { value: "experience", label: isBn ? "অভিজ্ঞতা" : "Experience" },
    { value: "social-service", label: isBn ? "সমাজসেবা" : "Social Service" },
    { value: "profile", label: isBn ? "প্রোফাইল" : "Profile" },
    { value: "memorial", label: isBn ? "স্মৃতিচারণ" : "Memorial" },
  ];

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "all" 
        ? "/api/upload"
        : `/api/upload?category=${selectedCategory}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchImages();
  }, [fetchImages]);

  const filteredImages = images.filter((img) => {
    if (selectedCategory === "all") return true;
    return img.category === selectedCategory;
  });

  const selectedIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = () => {
    if (selectedIndex === -1) return;
    const prevIndex = (selectedIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleNext = () => {
    if (selectedIndex === -1) return;
    const nextIndex = (selectedIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter & Layout Mode Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Layout Mode Toggle (Mosaic vs Grid) */}
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <Button
            variant={layoutMode === "mosaic" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayoutMode("mosaic")}
            className="h-8 px-3 rounded-full text-xs"
            aria-label={isBn ? "মোসাইক ভিউ" : "Mosaic view"}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1" />
            {isBn ? "মোসাইক" : "Mosaic"}
          </Button>
          <Button
            variant={layoutMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayoutMode("grid")}
            className="h-8 px-3 rounded-full text-xs"
            aria-label={isBn ? "গ্রিড ভিউ" : "Grid view"}
          >
            <Grid className="h-3.5 w-3.5 mr-1" />
            {isBn ? "গ্রিড" : "Grid"}
          </Button>
        </div>
      </div>

      {/* Gallery Grid / Mosaic */}
      {loading ? (
        <div
          data-testid="gallery-skeleton-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/50 bg-card",
                getMosaicSpanClass(idx, layoutMode)
              )}
            >
              <ImageSkeleton />
            </div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {isBn ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border/50 bg-card cursor-pointer transition-all hover:shadow-xl",
                getMosaicSpanClass(index, layoutMode)
              )}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={isBn ? image.title_bn || image.title || "" : image.title || image.title_bn || ""}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          image={selectedImage as LightboxImageItem}
          locale={locale}
          currentIndex={selectedIndex}
          totalCount={filteredImages.length}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
