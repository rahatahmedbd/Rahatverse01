"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ZoomIn, LayoutGrid, Grid, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { EmptyState } from "@/components/ui/empty-state";
import { LightboxModal, LightboxImageItem } from "@/components/gallery/LightboxModal";
import { getMosaicSpanClass, GalleryLayoutMode } from "@/components/gallery/mosaic-utils";
import { DEFAULT_GALLERY_CONFIG, validateGalleryConfig } from "@/lib/media/config";
import { cn } from "@/lib/utils";
import type { GalleryConfig } from "@/types/media";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "mosaic">("grid");
  const isBn = locale === "bn";

  const mappedItems = (src: GalleryImage[]) =>
    src.map((img) => ({
      src: img.url,
      alt:
        (isBn ? img.title_bn || img.title : img.title || img.title_bn) || "Gallery image",
      title: (isBn ? img.title_bn || img.title : img.title || img.title_bn) || "",
      caption: (isBn ? img.description_bn : img.description) || undefined,
      width: img.width,
      height: img.height,
    }));

  const categories = [
    { value: "all", label: isBn ? "সব" : "All" },
    ...config.albums
      .filter((album) => album.visible)
      .map((album) => ({
        value: album.value,
        label: isBn ? album.nameBn : album.nameEn,
      })),
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
      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        {/* View toggle: grid / mosaic (bento) */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "grid"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("mosaic")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              view === "mosaic"
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Mosaic view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Gallery Grid / Mosaic */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer aspect-square rounded-lg bg-muted/60"
            />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <EmptyState
          icon={Camera}
          title={isBn ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
          description={
            selectedCategory === "all"
              ? isBn
                ? "এই মুহূর্তে গ্যালারিতে কোনো ছবি আপলোড করা হয়নি।"
                : "No photos have been uploaded to the gallery yet."
              : isBn
                ? "এই ক্যাটাগরির জন্য কোনো ছবি পাওয়া যায়নি। অন্য ক্যাটাগরি চেষ্টা করুন।"
                : "No photos found for this category. Please try another category."
          }
          action={
            selectedCategory !== "all"
              ? {
                  label: isBn ? "সব ছবি দেখুন" : "View All Categories",
                  onClick: () => setSelectedCategory("all"),
                }
              : undefined
          }
        />
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
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={mappedItems(filteredImages)}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
