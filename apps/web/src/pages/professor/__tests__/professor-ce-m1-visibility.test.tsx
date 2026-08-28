import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../../../api/auth.js";
import { AuthProvider } from "../../../auth/AuthContext.js";
import { LocaleProvider } from "../../../i18n/LocaleProvider.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";
import { ProfessorCommandCenterPage } from "../ProfessorCommandCenterPage.js";

const professorEmployee: AuthenticatedEmployee = {
  id: "emp_prof",
  employeeNumber: "#NHE-PROF",
  email: "professor.qa@nordhabitat.ca",
  displayName: "Professeur QA",
  role: "PROFESSOR",
  companyName: "NordHabitat",
};

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("Professor CE M1 visibility", () => {
  beforeEach(() => {
    saveStoredTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/v1/professor/students")) {
          return jsonResponse({
            students: [
              {
                employeeId: "emp_stu",
                displayName: "Étudiant QA",
                employeeNumber: "#NHE-STU",
                email: "student.a.qa@nordhabitat.ca",
                courseEditionM1: {
                  moduleCode: "M1",
                  studentName: "Étudiant QA",
                  employeeId: "emp_stu",
                  courseEditionStatus: "in_progress",
                  surfaceApprendre: "completed",
                  connectionLabStatus: "passed",
                  connectionLabScorePercent: 85,
                  missions: [
                    {
                      missionCode: "M1-M01",
                      missionKey: "m1-m01-decouvrir-entreprise",
                      status: "completed",
                      scorePercent: 92,
                      needsReview: false,
                    },
                    {
                      missionCode: "M1-M02",
                      missionKey: "m1-m02-connecter-departements",
                      status: "needs_review",
                      scorePercent: null,
                      needsReview: true,
                    },
                    {
                      missionCode: "M1-M03",
                      missionKey: "m1-m03-diagnostiquer-preparation",
                      status: "not_started",
                      scorePercent: null,
                      needsReview: false,
                    },
                  ],
                  missionsComplete: false,
                  bilanStatus: "viewed",
                  quizStatus: "passed",
                  quizPercent: 100,
                  openResponsesNeedingReview: 1,
                  overallComplete: false,
                  progressPercent: 75,
                  updatedAt: "2026-07-24T18:00:00.000Z",
                  pedagogicalCourseRunId: "run_1",
                },
              },
            ],
          });
        }
        if (url.includes("/api/v1/professor/cohorts")) {
          return jsonResponse({ cohorts: [] });
        }
        if (url.includes("/pedagogical-course-runs/metrics/unique-students")) {
          return jsonResponse({ mode: "OFFICIAL_COHORT_RESULT", studentCount: 1 });
        }
        if (url.includes("/pedagogical-course-runs")) {
          return jsonResponse([]);
        }
        if (url.includes("/heatmap")) {
          return jsonResponse({ students: [], enrolled: 0, versions: [] });
        }
        if (url.includes("/competenc")) {
          return jsonResponse({ competencies: [] });
        }
        if (url.includes("/ai-coach") || url.includes("/ai")) {
          return jsonResponse({ interactions: [] });
        }
        if (url.includes("/capstone")) {
          return jsonResponse({ queue: [] });
        }
        if (url.includes("/certificates")) {
          return jsonResponse({ certificates: [] });
        }
        if (url.includes("/audit")) {
          return jsonResponse({ events: [] });
        }
        if (url.includes("/predictions")) {
          return jsonResponse({ predictions: [] });
        }
        return jsonResponse({});
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders Course Edition M1 visibility table with open-response review signal", async () => {
    render(
      <ThemeProvider>
        <AuthProvider skipRestore initialEmployee={professorEmployee}>
          <LocaleProvider>
            <MemoryRouter>
              <ProfessorCommandCenterPage />
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    const table = await screen.findByTestId("professor-ce-m1-visibility");
    expect(table).toBeInTheDocument();
    expect(table).toHaveTextContent("Étudiant QA");
    expect(table).toHaveTextContent("Connection Lab");
    expect(screen.getByTestId("professor-ce-m1-open-review-emp_stu")).toHaveTextContent(
      "1 à revoir",
    );
    expect(table).toHaveTextContent("85 %");
    expect(table).toHaveTextContent("Réussi");
  });
});
