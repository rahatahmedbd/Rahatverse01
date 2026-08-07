"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, LayoutGrid, Grid, ZoomIn } from "lucide-react";
import { LightboxModal, LightboxImageItem } from "@/components/gallery/LightboxModal";
import { getMosaicSpanClass, GalleryLayoutMode } from "@/components/gallery/mosaic-utils";
import { cn } from "@/lib/utils";

// ── Gallery Section ────────────────────────────────────
interface GallerySectionProps {
  locale?: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  altBn: string;
  category: "achievements" | "blood" | "education" | "social";
  date: string;
  caption: string;
  captionBn: string;
}

// Demo gallery images (placeholders — will be replaced with Cloudinary)
const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "",
    alt: "SSC 2025 GPA 5.00 A+ Achievement",
    altBn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন",
    category: "achievements",
    date: "১০ জুলাই, ২০২৫",
    caption: "SSC 2025 — GPA 5.00 (A+)",
    captionBn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+)",
  },
  {
    id: "2",
    src: "",
    alt: "Meritorious Student Honor Ceremony",
    altBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
    category: "achievements",
    date: "২০২৫",
    caption: "Merit Student Honor",
    captionBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
  },
  {
    id: "3",
    src: "",
    alt: "Shantichakra Blood Society Crest",
    altBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
    category: "blood",
    date: "২০২৫",
    caption: "Shantichakra Honor Crest",
    captionBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
  },
  {
    id: "4",
    src: "",
    alt: "46th National Science Fair 2025",
    altBn: "৪৬তম বিজ্ঞান মেলা ২০২৫",
    category: "achievements",
    date: "২০২৫",
    caption: "46th Science Fair — 1st Place",
    captionBn: "৪৬তম বিজ্ঞান মেলা — ১ম স্থান",
  },
  {
    id: "5",
    src: "",
    alt: "Creative Talent Search 2024",
    altBn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
    category: "achievements",
    date: "২০২৪",
    caption: "Creative Talent — 1st in Science",
    captionBn: "সৃজনশীল মেধা — বিজ্ঞানে ১ম",
  },
  {
    id: "6",
    src: "",
    alt: "44th Science Exhibition 2024",
    altBn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪",
    category: "achievements",
    date: "২ মে, ২০২৪",
    caption: "44th Science Exhibition — 1st Place",
    captionBn: "৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান",
  },
  {
    id: "7",
    src: "",
    alt: "45th National Science Fair 2023",
    altBn: "৪৫তম বিজ্ঞান মেলা ২০২৩",
    category: "achievements",
    date: "৩১ আগস্ট, ২০২৩",
    caption: "45th Science Fair",
    captionBn: "৪৫তম বিজ্ঞান মেলা",
  },
  {
    id: "8",
    src: "",
    alt: "42nd National Science Fair 2020",
    altBn: "৪২তম বিজ্ঞান মেলা ২০২০",
    category: "achievements",
    date: "২৬ নভেম্বর, ২০২০",
    caption: "42nd Science Fair — First Win",
    captionBn: "৪২তম বিজ্ঞান মেলা — প্রথম জয়",
  },
  {
    id: "9",
    src: "",
    alt: "FS Coaching Center",
    altBn: "FS কোচিং সেন্টার",
    category: "education",
    date: "৩১ ডিসেম্বর, ২০২৪",
    caption: "FS Coaching Center",
    captionBn: "FS কোচিং সেন্টার",
  },
  {
    id: "10",
    src: "",
    alt: "Helping Hand Organization",
    altBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
    category: "social",
    date: "২০২৩",
    caption: "Helping Hand Organization",
    captionBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
  },
  {
    id: "11",
    src: "",
    alt: "Shantichakra Blood Society Activities",
    altBn: "শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম",
    category: "blood",
    date: "২০২৫",
    caption: "Shantichakra Blood Society",
    captionBn: "শান্তিচক্র ব্লাড সোসাইটি",
  },
  {
    id: "12",
    src: "",
    alt: "Teaching Students",
    altBn: "শিক্ষার্থীদের পাঠদান",
    category: "education",
    date: "২০২৩ — বর্তমান",
    caption: "Teaching",
    captionBn: "শিক্ষকতা",
  },
];

// ── Gallery Component ──────────────────────────────────
export function GallerySection({ locale = "bn" }: GallerySectionProps) {
  const isBn = locale === "bn";
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [layoutMode, setLayoutMode] = useState<GalleryLayoutMode>("mosaic");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filters = [
    { key: "all", label: isBn ? "সব" : "All" },
    { key: "achievements", label: isBn ? "🏆 অর্জন" : "🏆 Achievements" },
    { key: "blood", label: isBn ? "🩸 রক্তদান" : "🩸 Blood Donation" },
    { key: "education", label: isBn ? "📚 শিক্ষা" : "📚 Education" },
    { key: "social", label: isBn ? "🤝 সমাজসেবা" : "🤝 Social" },
  ];

  const filteredImages = activeFilter === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeFilter);

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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🖼️ মুহূর্তগুলো" : "🖼️ Moments"}
          title="Photo Gallery"
          titleBn="গ্যালারি"
          subtitle={
            isBn
              ? "আমার শিক্ষাজীবন, অর্জন, সামাজিক কার্যক্রম ও উদ্যোগের কিছু মুহূর্ত"
              : "Moments from my academic journey, achievements, and social activities"
          }
          locale={locale}
        />

        {/* Filter Tabs & Layout Toggle */}
        <FadeInUp>
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Layout Mode Toggle */}
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
        </FadeInUp>

        {/* Gallery Grid / Mosaic */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(image)}
                className={cn(
                  "group cursor-pointer relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:shadow-xl",
                  getMosaicSpanClass(index, layoutMode)
                )}
              >
                <div className="relative h-full w-full">
                  {image.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt={isBn ? image.altBn : image.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center">
                      <Camera className="mb-2 h-8 w-8 text-primary/40" />
                      <p className="text-xs text-muted-foreground bn">
                        {isBn ? image.captionBn : image.caption}
                      </p>
                    </div>
                  )}

                  {/* Hover Glass Caption Overlay */}
                  <div className="glass-interactive absolute inset-x-2 bottom-2 rounded-xl p-3 sm:p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out backdrop-blur-md bg-black/60 border border-white/20 shadow-lg flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5">
                          <Badge variant="glow" className="text-[10px] py-0 px-2 uppercase">
                            {image.category}
                          </Badge>
                        </div>
                        <p className="text-white text-sm font-semibold truncate bn">
                          {isBn ? image.captionBn : image.caption}
                        </p>
                        <p className="text-[10px] text-white/70 mt-0.5">{image.date}</p>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {isBn ? "এই ক্যাটাগরিতে কোনো ছবি নেই" : "No images in this category"}
          </div>
        )}

        {/* Note about Cloudinary */}
        <FadeInUp delay={0.3}>
          <GlassCard className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bn">
              {isBn
                ? "📸 ছবিগুলো শীঘ্রই Cloudinary থেকে লোড হবে। বর্তমানে placeholder দেখানো হচ্ছে।"
                : "📸 Images will be loaded from Cloudinary soon. Currently showing placeholders."}
            </p>
          </GlassCard>
        </FadeInUp>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          image={selectedImage as unknown as LightboxImageItem}
          locale={locale}
          currentIndex={selectedIndex}
          totalCount={filteredImages.length}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
