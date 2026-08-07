import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import {
  ParallaxOrb,
  Parallax3DContainer,
  ScrollStoryline,
  FlipCard3D,
  OrbitingRings,
} from "@/components/interactive";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

describe("Phase I — Section Signature Effects System", () => {
  describe("ParallaxOrb component", () => {
    it("renders orb element as decorative (aria-hidden=true)", () => {
      render(<ParallaxOrb size="lg" color="primary" />);

      const orb = screen.getByTestId("parallax-orb");
      expect(orb).toBeInTheDocument();
      expect(orb).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Parallax3DContainer component", () => {
    it("renders container and children without errors", () => {
      render(
        <Parallax3DContainer intensity={10}>
          <div data-testid="child-content">Hero Card</div>
        </Parallax3DContainer>
      );

      expect(screen.getByTestId("parallax-3d-container")).toBeInTheDocument();
      expect(screen.getByTestId("child-content")).toHaveTextContent("Hero Card");
    });

    it("updates transform style on mouse move and resets on leave", () => {
      render(
        <Parallax3DContainer intensity={10}>
          <span>3D Content</span>
        </Parallax3DContainer>
      );

      const container = screen.getByTestId("parallax-3d-container");
      vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      fireEvent.mouseMove(container, {
        clientX: 100,
        clientY: 100,
      });

      expect(container.style.transform).toContain("perspective(1000px)");

      fireEvent.mouseLeave(container);
      expect(container.style.transform).toContain("rotateX(0deg)");
    });
  });

  describe("ScrollStoryline component", () => {
    const mockItems = [
      {
        year: "2025",
        title: "SSC Golden A+",
        subtitle: "Sunamganj Jubilee High School",
        description: "Achieved GPA 5.00 in Science.",
        badge: "GPA 5.00",
      },
    ];

    it("renders timeline item with year badge, title, subtitle, and description", () => {
      render(<ScrollStoryline items={mockItems} locale="en" />);

      expect(screen.getByTestId("scroll-storyline")).toBeInTheDocument();
      expect(screen.getByText("SSC Golden A+")).toBeInTheDocument();
      expect(
        screen.getByText("Sunamganj Jubilee High School")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Achieved GPA 5.00 in Science.")
      ).toBeInTheDocument();
      expect(screen.getByText("2025")).toBeInTheDocument();
      expect(screen.getByText("GPA 5.00")).toBeInTheDocument();
    });
  });

  describe("FlipCard3D component", () => {
    it("renders front face and flips to back face on click", () => {
      const handleAction = vi.fn();
      render(
        <FlipCard3D
          frontTitle="Portfolio Package"
          frontSubtitle="Custom Next.js Portfolio"
          backTitle="Features List"
          backContent="Fast static rendering & SEO"
          backActionLabel="Order Package"
          onBackAction={handleAction}
          locale="en"
        />
      );

      const card = screen.getByTestId("flip-card-3d");
      expect(screen.getByText("Portfolio Package")).toBeInTheDocument();
      expect(screen.getByText("Custom Next.js Portfolio")).toBeInTheDocument();

      // Click card to toggle flip
      fireEvent.click(card);
      expect(screen.getByText("Features List")).toBeInTheDocument();
      expect(screen.getByText("Fast static rendering & SEO")).toBeInTheDocument();

      // Test back action CTA
      const orderBtn = screen.getByRole("button", { name: "Order Package" });
      fireEvent.click(orderBtn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("OrbitingRings component", () => {
    it("renders orbiting rings element as decorative (aria-hidden=true)", () => {
      render(<OrbitingRings size="md" />);

      const rings = screen.getByTestId("orbiting-rings");
      expect(rings).toBeInTheDocument();
      expect(rings).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("TestimonialsSection carousel upgrade", () => {
    it("renders carousel controls and pagination buttons", async () => {
      render(<TestimonialsSection locale="en" />);

      // Wait for fallback testimonials to render
      const carousel = await screen.findByTestId("testimonials-carousel");
      expect(carousel).toBeInTheDocument();

      const pauseBtn = screen.getByRole("button", { name: "Pause carousel" });
      expect(pauseBtn).toBeInTheDocument();

      const nextBtn = screen.getByRole("button", { name: "Next testimonial" });
      const prevBtn = screen.getByRole("button", {
        name: "Previous testimonial",
      });
      expect(nextBtn).toBeInTheDocument();
      expect(prevBtn).toBeInTheDocument();
    });
  });
});
