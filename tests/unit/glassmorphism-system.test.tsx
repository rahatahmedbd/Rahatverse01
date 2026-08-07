import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GlassCard } from "@/components/ui/card";
import { QuickActions } from "@/components/interactive/QuickActions";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Phase A glassmorphism primitives", () => {
  it("renders GlassCard with premium glass classes", () => {
    render(<GlassCard data-testid="glass-card">Premium Glass Content</GlassCard>);

    const card = screen.getByTestId("glass-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("glass");
    expect(card).toHaveClass("glass-interactive");
  });

  it("renders QuickActions FAB trigger button", () => {
    render(<QuickActions />);

    const button = screen.getByRole("button", { name: "Toggle Quick Actions Menu" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("glass");
    expect(button).toHaveClass("glass-interactive");
  });
});
