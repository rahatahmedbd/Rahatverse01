import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { BlurImage } from "@/components/ui/blur-image";
import { LightboxModal, LightboxImageItem } from "@/components/gallery/LightboxModal";
import { getMosaicSpanClass } from "@/components/gallery/mosaic-utils";

describe("Phase F — Image & Visual Enhancements", () => {
  describe("BlurImage & ImageSkeleton", () => {
    it("renders fallback when src is empty", () => {
      render(
        <BlurImage
          src=""
          alt="Test fallback image"
          fallbackText="Custom fallback"
        />
      );

      expect(screen.getByTestId("blur-image-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    });

    it("renders skeleton placeholder while loading valid image", () => {
      render(
        <BlurImage
          src="https://example.com/test.jpg"
          alt="Valid image"
          width={400}
          height={300}
          showSkeleton={true}
        />
      );

      expect(screen.getByTestId("blur-image-container")).toBeInTheDocument();
      expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();
    });
  });

  describe("LightboxModal upgrade (zoom, swipe, caption)", () => {
    const mockImage: LightboxImageItem = {
      id: "img-1",
      url: "https://example.com/photo.jpg",
      title: "Science Fair 1st Prize",
      title_bn: "বিজ্ঞান মেলায় ১ম পুরস্কার",
      description: "National Science Exhibition winner",
      category: "achievements",
      date: "2025",
    };

    it("renders image title, category badge, and counter in glass caption overlay", () => {
      const onClose = vi.fn();
      const onPrev = vi.fn();
      const onNext = vi.fn();

      render(
        <LightboxModal
          image={mockImage}
          locale="en"
          currentIndex={0}
          totalCount={5}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      );

      expect(screen.getByTestId("lightbox-modal")).toBeInTheDocument();
      expect(screen.getByText("Science Fair 1st Prize")).toBeInTheDocument();
      expect(screen.getByText("National Science Exhibition winner")).toBeInTheDocument();
      expect(screen.getByText("1 / 5")).toBeInTheDocument();
      expect(screen.getByText("achievements")).toBeInTheDocument();
    });

    it("formats counter in Bengali digits when locale is bn", () => {
      const onClose = vi.fn();
      const onPrev = vi.fn();
      const onNext = vi.fn();

      render(
        <LightboxModal
          image={mockImage}
          locale="bn"
          currentIndex={0}
          totalCount={5}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      );

      expect(screen.getByText("১ / ৫")).toBeInTheDocument();
      expect(screen.getByText("বিজ্ঞান মেলায় ১ম পুরস্কার")).toBeInTheDocument();
    });

    it("handles zoom in, zoom out, and reset buttons correctly", () => {
      const onClose = vi.fn();
      const onPrev = vi.fn();
      const onNext = vi.fn();

      render(
        <LightboxModal
          image={mockImage}
          locale="en"
          currentIndex={0}
          totalCount={5}
          onClose={onClose}
          onPrev={onPrev}
          onNext={onNext}
        />
      );

      const zoomInBtn = screen.getByRole("button", { name: "Zoom in" });
      const zoomOutBtn = screen.getByRole("button", { name: "Zoom out" });
      const resetBtn = screen.getByRole("button", { name: "Reset zoom" });

      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(zoomOutBtn).toBeDisabled();

      fireEvent.click(zoomInBtn);
      expect(screen.getByText("150%")).toBeInTheDocument();
      expect(zoomOutBtn).not.toBeDisabled();

      fireEvent.click(resetBtn);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
  });

  describe("Mosaic / Bento-grid helper", () => {
    it("returns 2x2 bento span for index 0 in mosaic mode", () => {
      const className = getMosaicSpanClass(0, "mosaic");
      expect(className).toContain("sm:col-span-2");
      expect(className).toContain("sm:row-span-2");
    });

    it("returns 2x1 horizontal bento span for index 3 in mosaic mode", () => {
      const className = getMosaicSpanClass(3, "mosaic");
      expect(className).toContain("sm:col-span-2");
      expect(className).toContain("aspect-[2/1]");
    });

    it("returns standard aspect-square col-span-1 in grid mode", () => {
      const className0 = getMosaicSpanClass(0, "grid");
      const className3 = getMosaicSpanClass(3, "grid");
      expect(className0).toBe("col-span-1 aspect-square");
      expect(className3).toBe("col-span-1 aspect-square");
    });
  });
});
