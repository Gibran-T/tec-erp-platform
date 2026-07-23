import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { PlaybackV2Root } from "../PlaybackV2Root.js";
import { PLAYBACK_MODULES } from "../modules.js";

function renderPlayback(path = "/playback/v2/portal"): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
        <Route path="/login" element={<div data-testid="production-login">production-login</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Wave 2A Playback Zero — Revision 2", () => {
  it("renders playback routes without replacing production login", () => {
    renderPlayback("/playback/v2/portal");
    expect(screen.getByTestId("playback-v2-root")).toBeInTheDocument();
    expect(screen.getByTestId("playback-marker")).toHaveTextContent("PLAYBACK ZERO · NOT PRODUCTION");
    expect(screen.getByTestId("playback-portal")).toBeInTheDocument();
    expect(screen.queryByTestId("production-login")).not.toBeInTheDocument();
  });

  it("preserves owner light-blue canvas token", async () => {
    const { OWNER_CANVAS_TOKEN } = await import("../branding.js");
    expect(OWNER_CANVAS_TOKEN).toBe("#eef4f8");
    renderPlayback();
    expect(screen.getByTestId("playback-v2-root")).toHaveAttribute(
      "data-pb-owner-canvas",
      OWNER_CANVAS_TOKEN,
    );
  });

  it("shows live hero enterprise preview and French promise", () => {
    renderPlayback();
    expect(screen.getByTestId("hero-live-preview")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/entreprise vivante/i);
    expect(screen.getByTestId("playback-portal").textContent).not.toMatch(/Investigatez/);
  });

  it("renders Enterprise Pulse Map with selectable nodes and detail panel", () => {
    renderPlayback();
    expect(screen.getByTestId("enterprise-pulse-map")).toBeInTheDocument();
    expect(screen.getByTestId("pulse-active-path")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("pulse-node-sales"));
    fireEvent.click(screen.getByTestId("pulse-node-finance"));
    fireEvent.click(screen.getByTestId("pulse-node-bi"));
    expect(screen.getByTestId("pulse-node-detail")).toHaveTextContent(/Amira|Studio BI|Marc/i);
  });

  it("shows mission transformation and mode continuum", () => {
    renderPlayback();
    expect(screen.getByTestId("mission-transformation")).toBeInTheDocument();
    expect(screen.getByTestId("mission-output-chain")).toHaveTextContent(/Hypothèse/);
    expect(screen.getByTestId("mode-continuum")).toBeInTheDocument();
  });

  it("renders exactly 10 modules in chapter journey without M11 and with Capstone separate", () => {
    renderPlayback();
    expect(screen.getByTestId("chapter-journey")).toBeInTheDocument();
    expect(screen.getByTestId("module-count")).toHaveTextContent("10");
    expect(PLAYBACK_MODULES).toHaveLength(10);
    expect(PLAYBACK_MODULES.some((m) => (m.code as string) === "M11")).toBe(false);
    expect(screen.getByTestId("capstone-culmination")).toHaveTextContent(/pas M11|not M11/i);
    expect(screen.getByTestId("dual-journey")).toBeInTheDocument();
    const journey = screen.getByTestId("chapter-journey");
    expect(journey.querySelector(".pb-module-rail")).toBeNull();
  });

  it("distinguishes Visible AI and IA ambiante and shows timeline", () => {
    renderPlayback();
    expect(screen.getByTestId("visible-ai")).toHaveTextContent(/IA visible|Visible AI/i);
    expect(screen.getByTestId("ambient-ai")).toHaveTextContent(/IA ambiante|Ambient AI/i);
    expect(screen.getByTestId("ai-timeline")).toBeInTheDocument();
    const portalText = screen.getByTestId("playback-portal").textContent ?? "";
    expect(portalText).not.toMatch(/IA Ambient/);
    expect(portalText).not.toMatch(/Coach Visible/);
    expect(portalText).not.toMatch(/Ambient gouverné/);
  });

  it("shows Professor orchestration preview and executive BI panel", () => {
    renderPlayback();
    expect(screen.getByTestId("professor-orchestration")).toHaveTextContent(/APERÇU|PREVIEW/);
    expect(screen.getByTestId("executive-impact-bi")).toBeInTheDocument();
    expect(screen.getByTestId("signal-Trésorerie")).toBeInTheDocument();
    const impact = screen.getByTestId("executive-impact-bi").textContent ?? "";
    expect(impact).not.toMatch(/PO qty/);
    expect(impact).not.toMatch(/Cause:.*Horizon:.*Partie prenante/);
  });

  it("has no learner-facing Wave terminology or English learner token in FR", () => {
    renderPlayback();
    const text = screen.getByTestId("playback-portal").textContent ?? "";
    expect(text).not.toMatch(/Wave 2A|Wave 2B|Wave 3|future wave|implementation phase/i);
    expect(text).not.toMatch(/\blearner\b/);
  });

  it("login has no learner-facing role selector and continues to mission cockpit", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    renderPlayback("/playback/v2/login");
    expect(screen.getByTestId("playback-login-form")).toBeInTheDocument();
    expect(screen.queryByLabelText(/apprenant|professor|professeur/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("playback-role-select")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("playback-login-submit"));
    expect(screen.getByTestId("mission-cockpit")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("mission cockpit has one primary CTA opening safe mission preview", () => {
    renderPlayback("/playback/v2/orientation");
    const cta = screen.getByTestId("cockpit-primary-cta");
    expect(cta).toBeInTheDocument();
    fireEvent.click(cta);
    expect(screen.getByTestId("mission-preview")).toBeInTheDocument();
    expect(screen.getByTestId("mission-preview").textContent).not.toMatch(/Wave 3/i);
  });

  it("can switch institutional branding between College and independent", () => {
    renderPlayback();
    fireEvent.click(screen.getByTestId("playback-controls-open"));
    const branding = screen.getByTestId("playback-branding");
    expect(screen.getByTestId("playback-institution-endorsement")).toBeInTheDocument();
    fireEvent.change(branding, { target: { value: "independent" } });
    expect(screen.queryByTestId("playback-institution-endorsement")).not.toBeInTheDocument();
    expect(screen.getByTestId("playback-product-name")).toHaveTextContent("TEC.ERP");
    expect(document.querySelector("[data-testid='college-logo']")).toBeNull();
  });

  it("supports Light / Dark / Projector and FR / EN", () => {
    renderPlayback();
    const root = screen.getByTestId("playback-v2-root");
    fireEvent.click(screen.getByTestId("playback-controls-open"));
    fireEvent.change(screen.getByTestId("playback-theme"), { target: { value: "dark" } });
    expect(root).toHaveAttribute("data-pb-theme", "dark");
    fireEvent.change(screen.getByTestId("playback-theme"), { target: { value: "projector" } });
    expect(root).toHaveAttribute("data-pb-theme", "projector");
    fireEvent.change(screen.getByTestId("playback-locale"), { target: { value: "en" } });
    expect(root).toHaveAttribute("data-pb-locale", "en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/living enterprise/i);
  });

  it("mobile viewport control updates shell attribute", () => {
    renderPlayback();
    fireEvent.click(screen.getByTestId("playback-controls-open"));
    fireEvent.change(screen.getByTestId("playback-viewport"), { target: { value: "mobile" } });
    expect(screen.getByTestId("playback-v2-root")).toHaveAttribute("data-pb-viewport", "mobile");
  });

  it("does not call mutation APIs from portal interactions", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    renderPlayback();
    fireEvent.click(screen.getByTestId("pulse-node-sales"));
    fireEvent.click(screen.getByTestId("module-M8"));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("module detail panel updates when selecting M1, M3, M8, M10", () => {
    renderPlayback();
    fireEvent.click(screen.getByTestId("module-M1"));
    expect(screen.getByTestId("module-detail-panel")).toHaveTextContent(/Observateur|Observer/);
    fireEvent.click(screen.getByTestId("module-M3"));
    expect(screen.getByTestId("module-detail-panel")).toHaveTextContent(/Procure-to-Pay/);
    fireEvent.click(screen.getByTestId("module-M8"));
    expect(screen.getByTestId("module-detail-panel")).toHaveTextContent(/HCM|Hire-to-Retire/);
    fireEvent.click(screen.getByTestId("module-M10"));
    expect(screen.getByTestId("module-detail-panel")).toHaveTextContent(/Data-to-Decision|KPI/);
  });
});
