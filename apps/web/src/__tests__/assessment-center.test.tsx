import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../api/auth.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { AssessmentCenterPage } from "../pages/workspace/AssessmentCenterPage.js";

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("assessment center interactive selection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    saveStoredTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
    });
  });

  it("lets the student select a shuffled option key and review before submit", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/api/v1/auth/session")) {
        return jsonResponse({ employee: demoEmployee });
      }
      if (url.endsWith("/api/v1/me/assessments") && (!init || init.method === "GET" || !init.method)) {
        return jsonResponse({
          assessments: [
            {
              code: "SILVER_M1_M2",
              title: "Silver",
              moduleScope: "M1-M2",
              passThresholdPercent: 70,
              maxAttempts: 2,
              timeLimitSeconds: 2700,
              status: "available",
              bestScorePercent: null,
              attemptsUsed: 0,
            },
          ],
        });
      }
      if (url.endsWith("/api/v1/me/assessments/certificates")) {
        return jsonResponse({ certificates: [] });
      }
      if (url.endsWith("/api/v1/me/assessments/SILVER_M1_M2/attempt")) {
        return jsonResponse({ error: { message: "Aucune tentative en cours." } }, 404);
      }
      if (url.endsWith("/api/v1/me/assessments/SILVER_M1_M2/start")) {
        return jsonResponse(
          {
            attemptId: "att-1",
            assessmentCode: "SILVER_M1_M2",
            attemptNumber: 1,
            status: "in_progress",
            startedAt: new Date().toISOString(),
            timeLimitSeconds: 2700,
            questions: [
              {
                questionKey: "silver-q1",
                type: "SINGLE_CHOICE",
                prompt: "Role des donnees ?",
                options: [
                  { key: "decoration", label: "Decorer" },
                  { key: "foundation", label: "Fonder" },
                ],
              },
            ],
            draftResponses: [],
          },
          201,
        );
      }
      if (url.endsWith("/api/v1/me/assessments/SILVER_M1_M2/draft")) {
        return jsonResponse({ ok: true });
      }
      if (url.endsWith("/api/v1/me/assessments/SILVER_M1_M2/submit")) {
        const body = JSON.parse(String(init?.body ?? "{}")) as {
          responses: Array<{ questionKey: string; value: string }>;
          confirmFinalSubmission?: boolean;
        };
        expect(body.confirmFinalSubmission).toBe(true);
        expect(body.responses[0]?.value).toBe("foundation");
        return jsonResponse({ scorePercent: 100, passed: true, feedback: "Evaluation reussie." });
      }
      return jsonResponse({ error: { message: `Unhandled ${url}` } }, 500);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter>
        <AuthProvider>
          <AssessmentCenterPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByTestId("assessment-start-SILVER_M1_M2")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("assessment-start-SILVER_M1_M2"));

    await waitFor(() => expect(screen.getByTestId("assessment-question-panel")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("assessment-option-silver-q1-foundation"));
    fireEvent.click(screen.getByTestId("assessment-go-review"));
    fireEvent.click(screen.getByTestId("assessment-go-confirm"));
    fireEvent.click(screen.getByTestId("assessment-confirm-submit"));

    await waitFor(() => expect(screen.getByTestId("assessment-result-panel")).toHaveTextContent("100%"));
  });
});
