import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavUtilityMenu } from "@/components/layout/nav-utility-menu";
import { useAppStore } from "@/store";
import { useAiChatStore } from "@/components/ai/ai-chat-store";
import { isSoundEnabled, setSoundEnabled } from "@/lib/audio/ui-sounds";

vi.mock("next/navigation", () => ({
  usePathname: () => "/bn/about",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// The panel lazy-loads the search dialog; stub it so assertions stay synchronous.
vi.mock("@/components/interactive/SearchDialog", () => ({
  SearchDialog: ({ locale }: { locale?: string }) => (
    <button type="button">{locale === "bn" ? "খুঁজুন..." : "Search..."}</button>
  ),
}));

function openPanel() {
  render(<NavUtilityMenu locale="en" />);
  fireEvent.click(screen.getByTestId("nav-utility-trigger"));
  return screen.getByRole("menu", { name: "Additional options" });
}

describe("Nav utility menu — command center", () => {
  beforeEach(() => {
    useAppStore.setState({ accent: "emerald" });
    useAiChatStore.setState({ isOpen: false });
    setSoundEnabled(false);
    vi.clearAllMocks();
  });

  it("keeps the panel closed until the trigger is pressed", () => {
    render(<NavUtilityMenu locale="en" />);
    const trigger = screen.getByTestId("nav-utility-trigger");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Additional options" })).toBeInTheDocument();
  });

  it("exposes the primary conversion actions", () => {
    const panel = openPanel();
    const actions = within(panel).getByRole("group", { name: "Quick actions" });

    expect(within(actions).getByRole("menuitem", { name: /Ask Nuva/ })).toBeInTheDocument();
    expect(within(actions).getByRole("menuitem", { name: /Order/ })).toHaveAttribute(
      "href",
      "/en/order#order-checkout"
    );
    expect(within(actions).getByRole("menuitem", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me")
    );
    expect(within(actions).getByRole("menuitem", { name: /Contact/ })).toHaveAttribute(
      "href",
      "/en/contact"
    );
  });

  it("renders every site page in the compact grid", () => {
    const panel = openPanel();
    const grid = within(panel).getByRole("group", { name: "Pages" });

    const links = within(grid).getAllByRole("menuitem");
    expect(links).toHaveLength(10);
    expect(within(grid).getByRole("menuitem", { name: /Gallery/ })).toHaveAttribute(
      "href",
      "/en/gallery"
    );
  });

  it("opens the Nuva assistant and closes the panel", async () => {
    const panel = openPanel();

    fireEvent.click(
      within(within(panel).getByRole("group", { name: "Quick actions" })).getByRole("menuitem", {
        name: /Ask Nuva/,
      })
    );

    expect(useAiChatStore.getState().isOpen).toBe(true);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("switches the accent colour from the inline swatches", () => {
    const panel = openPanel();
    const swatches = within(panel).getByRole("group", { name: "Accent color" });

    fireEvent.click(within(swatches).getByRole("menuitemradio", { name: "Sapphire Blue" }));

    expect(useAppStore.getState().accent).toBe("sapphire");
    expect(
      within(swatches).getByRole("menuitemradio", { name: "Sapphire Blue" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("copies the current URL and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const panel = openPanel();
    fireEvent.click(within(panel).getByRole("menuitem", { name: "Copy link" }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("scrolls back to top and closes the panel", async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });

    const panel = openPanel();
    fireEvent.click(within(panel).getByRole("menuitem", { name: "Back to top" }));

    expect(scrollTo).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    render(<NavUtilityMenu locale="en" />);
    const trigger = screen.getByTestId("nav-utility-trigger");
    fireEvent.click(trigger);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
  });

  it("opens with Ctrl+K from anywhere on the page", () => {
    render(<NavUtilityMenu locale="en" />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });

    expect(screen.getByRole("menu", { name: "Additional options" })).toBeInTheDocument();
  });

  it("renders Bengali labels for the bn locale", () => {
    render(<NavUtilityMenu locale="bn" />);
    fireEvent.click(screen.getByTestId("nav-utility-trigger"));

    expect(screen.getByText("কুইক মেনু")).toBeInTheDocument();
    expect(screen.getByText("লিংক কপি")).toBeInTheDocument();
  });

  it("exposes a sound toggle that is off by default and persists the opt-in", () => {
    const panel = openPanel();
    const soundToggle = within(panel).getByTestId("nav-sound-toggle");

    expect(soundToggle).toHaveAttribute("aria-checked", "false");
    expect(soundToggle).toHaveAttribute("aria-label", "Turn sound on");

    fireEvent.click(soundToggle);

    expect(isSoundEnabled()).toBe(true);
    expect(soundToggle).toHaveAttribute("aria-checked", "true");
    expect(soundToggle).toHaveAttribute("aria-label", "Turn sound off");
    expect(localStorage.getItem("rahatverse_sound_enabled")).toBe("1");

    fireEvent.click(soundToggle);
    expect(isSoundEnabled()).toBe(false);
  });

  it("never plays audio before the visitor opts in", () => {
    const createOscillator = vi.fn();
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: class {
        state = "running";
        currentTime = 0;
        destination = {};
        resume = vi.fn();
        createGain = () => ({
          gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
          disconnect: vi.fn(),
        });
        createOscillator = createOscillator;
      },
    });

    const panel = openPanel();
    fireEvent.click(within(panel).getByRole("menuitem", { name: "Back to top" }));

    expect(createOscillator).not.toHaveBeenCalled();
  });
});
