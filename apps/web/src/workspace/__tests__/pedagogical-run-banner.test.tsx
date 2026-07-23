import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../i18n/LocaleProvider.js";

vi.mock("../../api/pedagogical-runs.js", () => ({
  listMyPedagogicalRuns: vi.fn(async () => [
    {
      id: "run1",
      runCode: "COHORT-STU-RUN1",
      runSequence: 1,
      runLabel: "James Timothy — Run 1 — Autonomous Zero1 Validation",
      status: "COMPLETED",
      statusLabel: "Terminé",
      runType: "AUTONOMOUS",
      runTypeLabel: "Parcours autonome",
      curriculumVersion: "V1",
      curriculumVersionLabel: "Curriculum V1",
      completionPercent: 100,
      isHistorical: true,
      isWritable: false,
    },
    {
      id: "run2",
      runCode: "COHORT-STU-RUN2",
      runSequence: 2,
      runLabel: "Étudiant — Run 2 — Instructor-Led",
      status: "ACTIVE",
      statusLabel: "En cours",
      runType: "INSTRUCTOR_LED",
      runTypeLabel: "Parcours accompagné par le professeur",
      curriculumVersion: "V2",
      curriculumVersionLabel: "Curriculum V2",
      completionPercent: 0,
      isHistorical: false,
      isWritable: true,
    },
  ]),
}));

import { PedagogicalRunBanner } from "../../components/workspace/PedagogicalRunBanner.js";

describe("PedagogicalRunBanner", () => {
  it("localizes autonomous path and omits English Zero1 runLabel", async () => {
    render(
      <LocaleProvider>
        <PedagogicalRunBanner />
      </LocaleProvider>,
    );
    expect(await screen.findByTestId("pedagogical-run-banner")).toBeInTheDocument();
    expect(screen.getByTestId("pedagogical-run-selector")).toBeInTheDocument();
    expect(screen.getByTestId("pedagogical-run-heading")).not.toHaveTextContent(
      "Autonomous Zero1 Validation",
    );
    expect(screen.getByTestId("pedagogical-run-selector")).toHaveTextContent("Parcours autonome");
    expect(screen.getByTestId("pedagogical-run-selector")).toHaveTextContent(
      "Parcours accompagné par le professeur",
    );
  });
});
