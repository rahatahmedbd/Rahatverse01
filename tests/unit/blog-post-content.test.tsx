import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import React from "react";
import BlogPostContent from "@/components/blog/BlogPostContent";

// Phase 4D/4G: every article carries an entity-bound author card, a linked
// byline, and natural internal links; markdown-style links inside post bodies
// render as real anchors.
describe("BlogPostContent — author identity & internal linking", () => {
  const baseProps = {
    title: "Test Article",
    author: "Rahat Ahmed",
    publishedAt: "2026-08-09T00:00:00.000Z",
    readingTime: 5,
    locale: "en",
  };

  it("links the byline author name to the locale-scoped about page", () => {
    render(<BlogPostContent {...baseProps} content="Hello world." />);
    const byline = screen.getAllByRole("link", { name: "Rahat Ahmed" })[0];
    expect(byline).toHaveAttribute("href", "/en/about");
  });

  it("renders the factual author bio card with portfolio/services links", () => {
    render(<BlogPostContent {...baseProps} content="Hello world." />);
    expect(
      screen.getByText(/student, teacher and web developer from Sunamganj/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Portfolio & case studies/i })
    ).toHaveAttribute("href", "/en/portfolio");
    expect(
      screen.getByRole("link", { name: /Web development services/i })
    ).toHaveAttribute("href", "/en/services");
  });

  it("uses Bengali bio text on the bn locale", () => {
    render(<BlogPostContent {...baseProps} locale="bn" content="স্বাগতম।" />);
    expect(screen.getByText(/রাহাতভার্সের স্রষ্টা/)).toBeInTheDocument();
    expect(screen.getByText(/লেখক সম্পর্কে/)).toBeInTheDocument();
  });

  it("renders [label](internal) markdown links inside the body as anchors", () => {
    render(
      <BlogPostContent
        {...baseProps}
        content={"See the [portfolio case studies](/en/portfolio) for details."}
      />
    );
    const link = screen.getByRole("link", { name: "portfolio case studies" });
    expect(link).toHaveAttribute("href", "/en/portfolio");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders [label](external) links with safe target/rel", () => {
    render(
      <BlogPostContent
        {...baseProps}
        content={"Read the code on [GitHub](https://github.com/rahatahmedbd)."}
      />
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com/rahatahmedbd");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("keeps h1 reserved for the title and demotes body '# ' headings to h2", () => {
    render(
      <BlogPostContent {...baseProps} content={"# Section Heading\n\nBody text."} />
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Test Article" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Section Heading" })
    ).toBeInTheDocument();
  });
});
