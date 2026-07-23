import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../auth/AuthContext.js";
import { LocaleProvider } from "../i18n/LocaleProvider.js";
import { CapstonePage } from "../pages/workspace/CapstonePage.js";
import {
  EMPTY_PROFESSOR_COMPETENCIES,
  EMPTY_PROFESSOR_HEATMAP,
  type ProfessorCompetencyResponse,
  type ProfessorHeatmapResponse,
} from "../api/analytics.js";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

function seedAuthTokens(): void {
  window.localStorage.setItem(
    "tec.erp.auth.tokens",
    JSON.stringify({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    }),
  );
}

describe("Command Center analytics DTO contract", () => {
  it("exposes required heatmap and competency fields without invented intensity/score keys", () => {
    const heatmap: ProfessorHeatmapResponse = {
      mode: "OFFICIAL_COHORT_RESULT",
      enrolledStudentCount: 1,
      curriculumVersionsPresent: ["V1"],
      rows: [
        {
          studentId: "stu_1",
          employeeNumber: "E1",
          displayName: "Apprenant A",
          completedMissions: 30,
          moduleCounts: { M1: 3, M2: 3 },
          curriculumVersion: "V1",
          officialRunCode: "RUN-1",
          runCount: 1,
          note: "Curriculum V1 historique",
        },
      ],
    };
    const competencies: ProfessorCompetencyResponse = {
      enrolledStudentCount: 1,
      competencies: [
        { moduleCode: "M1", title: "Fondations", missionCount: 3, coveragePercent: 100 },
      ],
    };
    expect(heatmap.rows[0]?.displayName).toBe("Apprenant A");
    expect(heatmap.rows[0]?.completedMissions).toBe(30);
    expect(heatmap.rows[0]?.moduleCounts.M1).toBe(3);
    expect(competencies.competencies[0]?.coveragePercent).toBe(100);
    expect(EMPTY_PROFESSOR_HEATMAP).toMatchObject({
      enrolledStudentCount: 0,
      curriculumVersionsPresent: [],
      rows: [],
    });
    expect(EMPTY_PROFESSOR_COMPETENCIES).toMatchObject({
      enrolledStudentCount: 0,
      competencies: [],
    });
  });
});

describe("Historical Capstone James-style presentation", () => {
  it("hides submit CTA and shows localized Gold pending issuance for historical approved Capstone", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/pedagogical-course-runs")) {
          return jsonResponse([
            {
              id: "run_hist",
              runSequence: 1,
              runCode: "RUN-1",
              runLabel: "James Timothy — Run 1 — Autonomous Zero1 Validation",
              runType: "AUTONOMOUS",
              status: "COMPLETED",
              isHistorical: true,
              isWritable: false,
              curriculumVersion: "V1",
              curriculumVersionLabel: "Curriculum V1",
              completionPercent: 100,
            },
          ]);
        }
        if (url.includes("/capstone/submission")) {
          return jsonResponse({
            id: "cap_hist",
            status: "submitted",
            diagnose: "Diagnostic historique",
            prioritize: "Priorité",
            execute: "Exécution",
            analyze: "Analyse",
            recommend: "Recommandation",
            executiveSummary: "Résumé exécutif historique suffisamment long pour lecture.",
            submittedAt: "2026-01-01T00:00:00.000Z",
            reviewStatus: "approved",
            professorNotes: null,
            lifecycleStatus: "APPROVED",
            lifecycleStatusLabel: "Approuvé",
            currentStage: "S7",
          });
        }
        if (url.includes("/gold-eligibility")) {
          return jsonResponse({
            eligibleForProfessorIssue: false,
            awaitingProfessorIssuance: true,
            studentReadyChecklist: {
              missionsComplete: true,
              goldAssessmentPassed: true,
              hcmAssessmentPassed: true,
              capstoneSubmitted: true,
              capstoneProfessorApproved: true,
            },
            reasons: [],
            nextStepHint:
              "Capstone approuvé — certificat Or en attente d’émission par le professeur.",
          });
        }
        if (url.includes("/me/certificates")) {
          return jsonResponse({ certificates: [] });
        }
        return jsonResponse({});
      }),
    );

    render(
      <AuthProvider skipRestore>
        <LocaleProvider>
          <MemoryRouter>
            <CapstonePage />
          </MemoryRouter>
        </LocaleProvider>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("capstone-run-context")).toHaveTextContent(/Run 1/);
      expect(screen.getByTestId("capstone-run-context")).toHaveTextContent(/Parcours autonome|Curriculum V1/);
      expect(screen.getByTestId("capstone-run-context")).not.toHaveTextContent(
        "Autonomous Zero1 Validation",
      );
      expect(screen.queryByTestId("capstone-submit")).not.toBeInTheDocument();
      expect(screen.getByTestId("capstone-submit-unavailable")).toBeInTheDocument();
      expect(screen.getByTestId("capstone-gold-pending-issue")).toHaveTextContent(
        "Capstone approuvé — certificat Or en attente d’émission par le professeur.",
      );
      expect(screen.getByTestId("capstone-submission-status")).not.toHaveTextContent(
        /\bsubmitted\b|\bapproved\b/,
      );
    });
  });
});
