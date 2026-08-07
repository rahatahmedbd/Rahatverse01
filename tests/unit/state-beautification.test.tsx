import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import {
  EmptyState,
  LoadingSpinner,
  SectionLoader,
  TableSkeleton,
  ListSkeleton,
  FeedbackAlert,
} from "@/components/ui";
import { Inbox } from "lucide-react";

describe("Phase G — State Beautification System", () => {
  describe("EmptyState component", () => {
    it("renders title, description, and icon correctly", () => {
      render(
        <EmptyState
          title="No items found"
          description="Your list is currently empty."
          icon={Inbox}
        />
      );

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No items found")).toBeInTheDocument();
      expect(screen.getByText("Your list is currently empty.")).toBeInTheDocument();
    });

    it("renders CTA action button and handles clicks", () => {
      const handleClick = vi.fn();
      render(
        <EmptyState
          title="No results"
          action={{
            label: "Clear filters",
            onClick: handleClick,
          }}
        />
      );

      const button = screen.getByRole("button", { name: "Clear filters" });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports size variants without breaking layout", () => {
      const { rerender } = render(<EmptyState title="Small state" size="sm" />);
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();

      rerender(<EmptyState title="Large state" size="lg" />);
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
  });

  describe("LoadingState components & Skeletons", () => {
    it("renders LoadingSpinner with accessible status role and label", () => {
      render(<LoadingSpinner label="Fetching data..." size="md" />);

      const spinner = screen.getByRole("status", { name: "Fetching data..." });
      expect(spinner).toBeInTheDocument();
    });

    it("renders SectionLoader with custom label and height", () => {
      render(<SectionLoader label="Loading section content..." />);

      expect(
        screen.getByRole("status", { name: "Loading section content..." })
      ).toBeInTheDocument();
      expect(screen.getByText("Loading section content...")).toBeInTheDocument();
    });

    it("renders TableSkeleton with specified rows and columns", () => {
      render(<TableSkeleton rows={4} columns={3} />);

      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
    });

    it("renders ListSkeleton with specified count", () => {
      render(<ListSkeleton count={3} />);

      expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
    });
  });

  describe("FeedbackAlert component", () => {
    it("renders success variant with role status", () => {
      render(
        <FeedbackAlert
          variant="success"
          title="Operation successful"
          description="Your changes have been saved."
        />
      );

      const alert = screen.getByRole("status");
      expect(alert).toBeInTheDocument();
      expect(screen.getByText("Operation successful")).toBeInTheDocument();
      expect(screen.getByText("Your changes have been saved.")).toBeInTheDocument();
    });

    it("renders error variant with role alert", () => {
      render(
        <FeedbackAlert
          variant="error"
          title="Error occurred"
          description="Could not save changes."
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(screen.getByText("Error occurred")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      const handleClose = vi.fn();
      render(
        <FeedbackAlert
          variant="warning"
          title="Warning"
          onClose={handleClose}
        />
      );

      const closeBtn = screen.getByRole("button", { name: "Dismiss alert" });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
