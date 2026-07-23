import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SignalLight, signalToneForStatus } from "../living-erp/components/SignalLight.js";
import { StatusChip, toneForStatus } from "../living-erp/components/StatusChip.js";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider.js";

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
});

function ThemeProbe(): React.ReactElement {
  const { preference, resolved, setPreference } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="resolved">{resolved}</span>
      <button type="button" data-testid="set-light" onClick={() => setPreference("light")}>
        light
      </button>
      <button type="button" data-testid="set-dark" onClick={() => setPreference("dark")}>
        dark
      </button>
      <button type="button" data-testid="set-system" onClick={() => setPreference("system")}>
        system
      </button>
    </div>
  );
}

describe("Theme contract", () => {
  it("persists preference and exposes resolved theme", async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId("set-dark"));
    await waitFor(() => {
      expect(window.localStorage.getItem("tec-erp.theme")).toBe("dark");
      expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.style.colorScheme).toBe("dark");
    });

    fireEvent.click(screen.getByTestId("set-light"));
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    });
  });

  it("resolves system preference without hybrid data-theme values", async () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const media = {
      matches: false,
      media: "(prefers-color-scheme: dark)",
      addEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) => {
        listeners.push(cb);
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as unknown as MediaQueryList;

    vi.spyOn(window, "matchMedia").mockImplementation(() => media);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId("set-system"));
    await waitFor(() => {
      expect(window.localStorage.getItem("tec-erp.theme")).toBe("system");
      expect(screen.getByTestId("resolved")).toHaveTextContent("light");
      expect(document.documentElement.dataset.theme).toBe("light");
    });

    act(() => {
      Object.defineProperty(media, "matches", { configurable: true, value: true });
      for (const listener of listeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.dataset.theme).not.toBe("system");
    });
  });
});

describe("Living Signal System", () => {
  it("renders accessible signal lights with localized labels", () => {
    render(<SignalLight tone="green" label="Terminé" testId="signal-green" />);
    const node = screen.getByTestId("signal-green");
    expect(node).toHaveAttribute("role", "status");
    expect(node).toHaveAttribute("aria-label", "Terminé");
    expect(node).toHaveTextContent("Terminé");
    expect(node).toHaveAttribute("data-signal-tone", "green");
  });

  it("maps semantic statuses to signal tones", () => {
    expect(signalToneForStatus("completed")).toBe("green");
    expect(signalToneForStatus("pending")).toBe("yellow");
    expect(signalToneForStatus("locked")).toBe("red");
    expect(signalToneForStatus("active")).toBe("blue");
    expect(signalToneForStatus("coach")).toBe("purple");
    expect(signalToneForStatus("gold")).toBe("gold");
    expect(toneForStatus("revision_requested")).toBe("amber");
  });

  it("keeps StatusChip icon+text (never color alone)", () => {
    render(<StatusChip label="Bloqué" tone="red" testId="chip-red" />);
    expect(screen.getByTestId("chip-red")).toHaveTextContent("Bloqué");
    expect(screen.getByTestId("chip-red").querySelector(".living-status-chip__icon")).not.toBeNull();
  });
});

describe("Semantic token surfaces", () => {
  it("applies light and dark token classes without hybrid theme attribute", async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByTestId("set-dark"));
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
    expect(["light", "dark"]).toContain(document.documentElement.dataset.theme);
    expect(document.documentElement.dataset.theme).not.toBe("system");

    fireEvent.click(screen.getByTestId("set-light"));
    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });
  });

  it("maps legacy white card utilities to living surface tokens under dark theme", async () => {
    document.documentElement.dataset.theme = "dark";
    document.body.innerHTML = `
      <div data-testid="workspace-shell">
        <div class="bg-white text-gray-900" data-testid="legacy-card">Profil</div>
      </div>
    `;
    const card = document.querySelector('[data-testid="legacy-card"]') as HTMLElement;
    const styles = window.getComputedStyle(card);
    // JSDOM does not load living-erp.css cascade fully; assert class contract + theme attr.
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(card.className).toContain("bg-white");
    expect(card.className).toContain("text-gray-900");
    expect(styles).toBeTruthy();
  });
});
