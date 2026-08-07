"use client";

import * as React from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LightboxImageItem {
  id: string;
  url?: string;
  src?: string;
  title?: string | null;
  title_bn?: string | null;
  alt?: string;
  altBn?: string;
  description?: string | null;
  description_bn?: string | null;
  caption?: string;
  captionBn?: string;
  category?: string;
  date?: string;
  width?: number | null;
  height?: number | null;
}

export interface LightboxModalProps {
  image: LightboxImageItem;
  locale?: string;
  currentIndex?: number;
  totalCount?: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function toBengaliNumber(num: number): string {
  const digits = "০১২৩৪৫৬৭৮৯";
  return num
    .toString()
    .replace(/\d/g, (d) => digits[parseInt(d, 10)]);
}

export function LightboxModal({
  image,
  locale = "bn",
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  const [zoom, setZoom] = React.useState<number>(1);
  const [activeImageId, setActiveImageId] = React.useState<string>(image.id);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const isBn = locale === "bn";

  // Reset zoom when image changes
  if (image.id !== activeImageId) {
    setActiveImageId(image.id);
    setZoom(1);
  }

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
    onPrev();
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
    onNext();
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" || event.key === "d") {
        setZoom(1);
        onNext();
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        setZoom(1);
        onPrev();
      } else if (event.key === "+" || event.key === "=") {
        setZoom((prev) => Math.min(prev + 0.5, 3));
      } else if (event.key === "-" || event.key === "_") {
        setZoom((prev) => Math.max(prev - 0.5, 1));
      } else if (event.key === "0") {
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Touch gesture swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) return; // Disable swipe when zoomed
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (zoom > 1 || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => (prev > 1 ? 1 : 2));
  };

  const imageSrc = image.url || image.src || "";
  const titleText = isBn
    ? image.title_bn || image.title || image.captionBn || image.caption || image.altBn || image.alt || ""
    : image.title || image.title_bn || image.caption || image.captionBn || image.alt || image.altBn || "";

  const descText = isBn
    ? image.description_bn || image.description || image.date || ""
    : image.description || image.description_bn || image.date || "";

  const counterText =
    typeof currentIndex === "number" && typeof totalCount === "number" && totalCount > 0
      ? isBn
        ? `${toBengaliNumber(currentIndex + 1)} / ${toBengaliNumber(totalCount)}`
        : `${currentIndex + 1} / ${totalCount}`
      : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      data-testid="lightbox-modal"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/90 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Toolbar: Close button & Zoom Controls */}
      <div
        className="flex w-full max-w-7xl items-center justify-between px-2 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 p-1.5 backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-white hover:bg-white/20"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            aria-label={isBn ? "জুম আউট" : "Zoom out"}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[42px] text-center text-xs font-semibold text-white">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-white hover:bg-white/20"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            aria-label={isBn ? "জুম ইন" : "Zoom in"}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-white hover:bg-white/20"
            onClick={handleResetZoom}
            disabled={zoom === 1}
            aria-label={isBn ? "জুম রিসেট" : "Reset zoom"}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
          aria-label={isBn ? "বন্ধ করুন" : "Close"}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Center Content: Navigation arrows & Zoomable Image */}
      <div className="relative flex w-full max-w-7xl flex-1 items-center justify-center overflow-hidden my-4">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 z-10 h-11 w-11 rounded-full border border-white/10 bg-black/50 text-white hover:bg-white/20 sm:left-4"
          onClick={handlePrev}
          aria-label={isBn ? "আগের ছবি" : "Previous image"}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 z-10 h-11 w-11 rounded-full border border-white/10 bg-black/50 text-white hover:bg-white/20 sm:right-4"
          onClick={handleNext}
          aria-label={isBn ? "পরের ছবি" : "Next image"}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Image Display */}
        <div
          className="relative flex h-full max-h-[75vh] w-full max-w-5xl items-center justify-center select-none"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={handleDoubleClick}
        >
          {imageSrc ? (
            <div
              className="relative transition-transform duration-300 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoom})`,
                cursor: zoom > 1 ? "grab" : "zoom-in",
              }}
            >
              <Image
                src={imageSrc}
                alt={titleText || "Gallery Image"}
                width={image.width || 1200}
                height={image.height || 800}
                className="max-h-[72vh] max-w-full rounded-lg object-contain select-none"
                priority
                unoptimized={imageSrc.startsWith("http") ? false : undefined}
              />
            </div>
          ) : (
            <div className="flex h-72 w-96 flex-col items-center justify-center rounded-xl border border-white/10 bg-card/50 p-8 text-center text-white">
              <Camera className="mb-4 h-16 w-16 text-primary/60" />
              <p className="text-lg font-medium">{titleText}</p>
              {descText && (
                <p className="mt-2 text-sm text-white/70">{descText}</p>
              )}
              <Badge variant="glow" className="mt-4">
                {isBn ? "ছবি শীঘ্রই আসছে" : "Image coming soon"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glass Caption Overlay */}
      <div
        className="glass-interactive w-full max-w-3xl rounded-2xl border border-white/20 bg-black/70 p-4 text-white shadow-2xl backdrop-blur-md transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            {image.category && (
              <Badge variant="glow" className="capitalize">
                {image.category}
              </Badge>
            )}
          </div>
          {counterText && (
            <span className="text-xs font-medium text-white/80">
              {counterText}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
            {titleText || (isBn ? "মুহূর্ত" : "Gallery Moment")}
          </h3>
          {descText && (
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {descText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
