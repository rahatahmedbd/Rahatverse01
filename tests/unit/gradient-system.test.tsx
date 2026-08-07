import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { Button } from "@/components/ui/button";

describe("Phase B gradient primitives", () => {
  it("applies the animated CTA treatment to gradient buttons", () => {
    render(<Button variant="gradient">Start a project</Button>);

    expect(screen.getByRole("button", { name: "Start a project" })).toHaveClass(
      "gradient-cta"
    );
  });

  it("renders aurora dividers as decorative and supports spacing", () => {
    render(<AuroraDivider data-testid="divider" spacing="sm" />);

    const divider = screen.getByTestId("divider");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveClass("aurora-divider", "my-4", "sm:my-6");
  });
});
