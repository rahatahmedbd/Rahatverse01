import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import { LighthouseScoreBadge } from "@/components/seo/LighthouseScoreBadge";
import { PerformanceReport } from "@/components/sections/PerformanceReport";

describe("Phase J — Final Polish, QA & Lighthouse Performance System", () => {
  describe("LighthouseScoreBadge component", () => {
    it("renders full audit badge with 100/100 scores across all 4 pillars", () => {
      render(<LighthouseScoreBadge locale="en" />);

      expect(
        screen.getByTestId("lighthouse-score-badge")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Lighthouse Performance & QA Audit")
      ).toBeInTheDocument();
      expect(screen.getByText("100/100")).toBeInTheDocument();

      expect(screen.getByText("Performance")).toBeInTheDocument();
      expect(screen.getByText("Accessibility")).toBeInTheDocument();
      expect(screen.getByText("Best Practices")).toBeInTheDocument();
      expect(screen.getByText("SEO")).toBeInTheDocument();

      // Ensure all four 100 score badges render
      const scoreElements = screen.getAllByText("100");
      expect(scoreElements.length).toBeGreaterThanOrEqual(4);
    });

    it("renders compact footer badge with 100/100 score text in Bengali", () => {
      render(<LighthouseScoreBadge compact locale="bn" />);

      expect(
        screen.getByTestId("lighthouse-score-badge-compact")
      ).toBeInTheDocument();
      expect(screen.getByText("লাইটহাউস স্কোর: ১০০/১০০")).toBeInTheDocument();
    });

    it("renders compact footer badge in English when locale is en", () => {
      render(<LighthouseScoreBadge compact locale="en" />);

      expect(
        screen.getByText("Lighthouse Score: 100/100")
      ).toBeInTheDocument();
    });
  });

  describe("PerformanceReport section showcase", () => {
    it("renders 100/100 scores for Performance and Accessibility & SEO", () => {
      render(<PerformanceReport locale="en" />);

      expect(screen.getByText("Lighthouse & Web Vitals QA")).toBeInTheDocument();
      expect(screen.getByText("Performance Score")).toBeInTheDocument();
      expect(screen.getByText("Accessibility & SEO")).toBeInTheDocument();

      const passBadges = screen.getAllByText("Pass");
      expect(passBadges.length).toBeGreaterThanOrEqual(4);
    });
  });
});
