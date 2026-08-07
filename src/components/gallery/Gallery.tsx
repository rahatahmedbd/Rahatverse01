"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, Grid3x3, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurUpImage } from "@/components/ui/blur-image";
import { Lightbox } from "@/components/ui/lightbox";
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

      {/* Gallery Grid */}
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
        <div className="text-center py-12 text-muted-foreground">
          {isBn ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3"
          )}
        >
          {filteredImages.map((image, i) => {
            // Bento / mosaic layout: accent the 1st & 6th tiles to span 2 rows
            const mosaicSpan =
              view === "mosaic" && (i === 0 || i === 5);
            return (
              <div
                key={image.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10",
                  mosaicSpan && "row-span-2"
                )}
                onClick={() => setLightboxIndex(filteredImages.indexOf(image))}
              >
                <div className="relative h-full min-h-48">
                  <BlurUpImage
                    src={image.url}
                    alt={isBn ? image.title_bn || image.title || "" : image.title || image.title_bn || ""}
                    className="h-full w-full"
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                {/* Glass caption overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="glass mx-2 mb-2 flex items-center justify-between gap-2 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {isBn ? image.title_bn || image.title : image.title || image.title_bn}
                      </p>
                      <p className="truncate text-xs opacity-70">{image.category}</p>
                    </div>
                    <ZoomIn className="h-4 w-4 shrink-0 opacity-80" />
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
