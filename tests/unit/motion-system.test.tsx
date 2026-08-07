import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageTransition } from "@/components/animations/PageTransition";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { Button } from "@/components/ui/button";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/services",
}));

describe("Phase E motion primitives", () => {
  it("enrols shared buttons in magnetic interaction and starts a positioned ripple", () => {
    render(<Button>Start a project</Button>);

    const button = screen.getByRole("button", { name: "Start a project" });
    Object.defineProperty(button, "getBoundingClientRect", {
      value: () => ({ left: 10, top: 15, width: 120, height: 40 }),
    });

    fireEvent.pointerDown(button, { clientX: 36, clientY: 42 });

    expect(button).toHaveClass("button-ripple", "magnetic-target");
    expect(button).toHaveAttribute("data-magnetic", "true");
    expect(button).toHaveAttribute("data-rippling", "true");
    expect(button).toHaveStyle({ "--ripple-x": "26px", "--ripple-y": "27px" });
  });

  it("allows a button to opt out of the pointer magnet", () => {
    render(<Button magnetic={false}>Static action</Button>);

    expect(screen.getByRole("button", { name: "Static action" })).not.toHaveAttribute(
      "data-magnetic"
    );
  });

  it("wraps a route in the shared page-transition boundary", () => {
    const { container } = render(
      <MotionProvider>
        <PageTransition>
          <p>Route content</p>
        </PageTransition>
      </MotionProvider>
    );

    expect(container.querySelector(".page-transition")).toHaveTextContent("Route content");
  });
});
