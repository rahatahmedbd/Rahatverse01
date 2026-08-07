import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "@/components/sections/SectionTitle";

describe("Phase C typography primitives", () => {
  it("renders the fluid type scale on the section heading", () => {
    render(
      <SectionTitle
        badge="Portfolio"
        title="My Work"
        titleBn="আমার কাজ"
        subtitle="Selected projects"
        subtitleBn="নির্বাচিত প্রজেক্ট"
        locale="bn"
      />
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-heading-lg", "text-gradient", "bn");
    expect(heading).toHaveTextContent("আমার কাজ");

    const subtitle = screen.getByText("নির্বাচিত প্রজেক্ট");
    expect(subtitle).toHaveClass("text-lead");
  });

  it("renders the gradient kicker and the accent underline", () => {
    const { container } = render(
      <SectionTitle badge="Services" title="What I Offer" />
    );

    const kicker = screen.getByText("Services");
    expect(kicker).toHaveClass("heading-kicker", "gradient-badge", "gradient-border");

    const underline = container.querySelector(".heading-underline");
    expect(underline).not.toBeNull();
    expect(underline).toHaveAttribute("aria-hidden", "true");
  });

  it("aligns the underline with the heading alignment", () => {
    const { container: leftAlign } = render(
      <SectionTitle title="Education" align="left" />
    );
    const { container: rightAlign } = render(
      <SectionTitle title="Experience" align="right" />
    );

    expect(leftAlign.querySelector(".heading-underline")).toHaveClass("mr-auto");
    expect(rightAlign.querySelector(".heading-underline")).toHaveClass("ml-auto");
  });
});
