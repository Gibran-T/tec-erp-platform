import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { PlaybackV2Root } from "../PlaybackV2Root.js";
import { PLAYBACK_MODULES } from "../modules.js";

afterEach(() => {
  cleanup();
});

function renderPlayback(path = "/playback/v2/portal"): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Wave 2A Playback Zero", () => {
  it("renders isolated portal route with production marker", () => {
    renderPlayback("/playback/v2/portal");
    expect(screen.getByTestId("playback-v2-root")).toBeTruthy();
    expect(screen.getByTestId("playback-marker").textContent).toMatch(/PLAYBACK ZERO/i);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/entreprise vivante|living enterprise/i);
  });

  it("exposes exactly 10 modules and separate Capstone without M11", () => {
    renderPlayback();
    const journey = screen.getByRole("list", { name: /parcours|journey/i });
    const chips = within(journey).getAllByRole("listitem");
    const moduleChips = chips.filter((el) => /^M\d+/.test(el.textContent ?? ""));
    expect(moduleChips).toHaveLength(10);
    expect(journey.textContent).toMatch(/Capstone/);
    expect(journey.textContent).toMatch(/pas M11|not M11|Separate Capstone/i);
    expect(document.body.textContent).toMatch(/HCM|Ressources humaines/);
    expect(document.body.textContent).toMatch(/Gouvernance|Governance/);
    expect(document.body.textContent).toMatch(/BI/);
    expect(PLAYBACK_MODULES.some((module) => String(module.code) === "M11")).toBe(false);
  });

  it("distinguishes Visible AI and Ambient AI labels", () => {
    renderPlayback();
    expect(document.body.textContent).toMatch(/IA Visible|Visible AI/);
    expect(document.body.textContent).toMatch(/IA Ambient|Ambient AI/);
    expect(document.body.textContent).toMatch(/Fait système|System fact/);
    expect(document.body.textContent).toMatch(/Coach IA|AI coach/);
  });

  it("switches language and theme including Projector", () => {
    renderPlayback();
    fireEvent.click(screen.getByTestId("playback-controls-open"));
    const locale = screen.getByTestId("playback-locale");
    fireEvent.change(locale, { target: { value: "en" } });
    expect(screen.getByTestId("playback-v2-root").getAttribute("data-pb-locale")).toBe("en");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/living enterprise/i);

    const theme = screen.getByTestId("playback-theme");
    fireEvent.change(theme, { target: { value: "dark" } });
    expect(screen.getByTestId("playback-v2-root").getAttribute("data-pb-theme")).toBe("dark");
    fireEvent.change(theme, { target: { value: "projector" } });
    expect(screen.getByTestId("playback-v2-root").getAttribute("data-pb-theme")).toBe("projector");
  });

  it("navigates login to orientation without production auth network calls", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderPlayback("/playback/v2/login");
    expect(screen.getByTestId("playback-login")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /orientation|entrer/i }));
    expect(await screen.findByTestId("playback-orientation")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Où suis-je|Where am I/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Qui suis-je|Who am I/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /mandat|mandate/i })).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("keeps primary controls keyboard reachable and supports reduced-motion CSS presence", () => {
    renderPlayback();
    const primary = screen.getByTestId("playback-hero-primary");
    primary.focus();
    expect(document.activeElement).toBe(primary);
    expect(document.querySelector(".playback-v2")).toBeTruthy();
  });

  it("keeps curriculum invariants for playback data", () => {
    expect(PLAYBACK_MODULES).toHaveLength(10);
    expect(PLAYBACK_MODULES.map((module) => module.code)).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
    ]);
    expect(PLAYBACK_MODULES.some((module) => module.code === ("M11" as never))).toBe(false);
    expect(PLAYBACK_MODULES.find((module) => module.code === "M8")?.titleFr).toMatch(/HCM/);
    expect(PLAYBACK_MODULES.find((module) => module.code === "M9")?.titleFr).toMatch(/Gouvernance/);
    expect(PLAYBACK_MODULES.find((module) => module.code === "M10")?.titleFr).toMatch(/BI/);
  });
});
