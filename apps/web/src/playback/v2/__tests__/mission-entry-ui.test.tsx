import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlaybackV2Root } from "../PlaybackV2Root.js";
import { SESSION_STORAGE_KEY } from "../mission-entry/index.js";

function renderMissionEntry(): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={["/playback/v2/mission-entry"]}>
      <Routes>
        <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Wave 2B — SO-1048 mission entry UI", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders isolated mission entry without fetch", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    renderMissionEntry();

    expect(await screen.findByTestId("mission-entry")).toBeInTheDocument();
    expect(screen.getByTestId("playback-marker")).toHaveTextContent("PLAYBACK ZERO · NOT PRODUCTION");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("runs evidence → decision → consequence → complete loop", async () => {
    renderMissionEntry();
    await screen.findByTestId("mission-entry");

    fireEvent.click(screen.getByTestId("start-mission"));
    expect(screen.getByTestId("mission-entry-status-value")).toHaveTextContent("IN_PROGRESS");
    expect(screen.getByTestId("ledger-MISSION_1_STARTED")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("collect-ev-otc-process-map"));
    expect(screen.getByTestId("mission-entry-evidence-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByTestId("decision-SUPPLIER_DELAY"));
    expect(screen.getByTestId("mission-entry-status-value")).toHaveTextContent("DECISION_RECORDED");

    fireEvent.click(screen.getByTestId("apply-consequence"));
    await waitFor(() => {
      expect(screen.getByTestId("mission-entry-status-value")).toHaveTextContent("CONSEQUENCE_APPLIED");
    });
    expect(screen.getByTestId("mission-entry-consequence")).toBeInTheDocument();
    expect(screen.getByTestId("ledger-CONSEQUENCE_APPLIED")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("ack-debrief"));
    fireEvent.click(screen.getByTestId("complete-mission"));
    await waitFor(() => {
      expect(screen.getByTestId("mission-entry-status-value")).toHaveTextContent("COMPLETED");
    });
    expect(screen.getByTestId("mission-completed-banner")).toBeInTheDocument();
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toMatch(/COMPLETED/);
  });

  it("reset clears sessionStorage key", async () => {
    renderMissionEntry();
    await screen.findByTestId("mission-entry");
    fireEvent.click(screen.getByTestId("start-mission"));
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeTruthy();

    fireEvent.click(screen.getByTestId("reset-mission"));
    await waitFor(() => {
      expect(screen.getByTestId("mission-entry-status-value")).toHaveTextContent("NOT_STARTED");
    });
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("cockpit CTA navigates to mission entry", async () => {
    render(
      <MemoryRouter initialEntries={["/playback/v2/orientation"]}>
        <Routes>
          <Route path="/playback/v2/*" element={<PlaybackV2Root />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("cockpit-primary-cta"));
    expect(await screen.findByTestId("mission-entry")).toBeInTheDocument();
  });
});
