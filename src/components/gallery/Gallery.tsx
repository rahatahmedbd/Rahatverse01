"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-6">
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

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {isBn ? "কোনো ছবি পাওয়া যায়নি" : "No images found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border bg-card cursor-pointer transition-all hover:shadow-lg"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={isBn ? image.title_bn || image.title || "" : image.title || image.title_bn || ""}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium truncate">
                      {isBn ? image.title_bn || image.title : image.title || image.title_bn}
                    </p>
                    <p className="text-white/70 text-xs">{image.category}</p>
                  </div>
                  <ZoomIn className="text-white h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.url}
                alt={isBn ? selectedImage.title_bn || selectedImage.title || "" : selectedImage.title || selectedImage.title_bn || ""}
                width={selectedImage.width || 1200}
                height={selectedImage.height || 800}
                className="max-w-full max-h-[80vh] object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">
                {isBn ? selectedImage.title_bn || selectedImage.title : selectedImage.title || selectedImage.title_bn}
              </h3>
              {(isBn ? selectedImage.description_bn : selectedImage.description) && (
                <p className="text-white/70 mt-2">
                  {isBn ? selectedImage.description_bn : selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
