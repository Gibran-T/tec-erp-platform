import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../api/pedagogical-runs.js", () => ({
  listMyPedagogicalRuns: vi.fn(async () => [
    {
      id: "run1",
      runCode: "COHORT-STU-RUN1",
      runLabel: "Étudiant — Run 1 — Autonomous",
      status: "COMPLETED",
      statusLabel: "Terminé",
      runType: "AUTONOMOUS",
      runTypeLabel: "Parcours autonome",
      completionPercent: 100,
      isHistorical: true,
      isWritable: false,
    },
    {
      id: "run2",
      runCode: "COHORT-STU-RUN2",
      runLabel: "Étudiant — Run 2 — Instructor-Led",
      status: "ACTIVE",
      statusLabel: "En cours",
      runType: "INSTRUCTOR_LED",
      runTypeLabel: "Parcours accompagné par le professeur",
      completionPercent: 0,
      isHistorical: false,
      isWritable: true,
    },
  ]),
}));

import { PedagogicalRunBanner } from "../../components/workspace/PedagogicalRunBanner.js";

describe("PedagogicalRunBanner", () => {
  it("renders French status labels and run selector", async () => {
    render(<PedagogicalRunBanner />);
    expect(await screen.findByTestId("pedagogical-run-banner")).toBeInTheDocument();
    expect(screen.getByTestId("pedagogical-run-selector")).toBeInTheDocument();
    expect(screen.getByText(/Parcours accompagné par le professeur|Parcours autonome/)).toBeTruthy();
  });
});
