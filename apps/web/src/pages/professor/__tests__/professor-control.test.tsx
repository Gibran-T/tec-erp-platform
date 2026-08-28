import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("Professor pedagogical control", () => {
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
        if (url.includes("/api/v1/professor/cohorts")) {
          return jsonResponse({
            cohorts: [
              { id: "coh_a", name: "Cohorte A", studentCount: 12 },
              { id: "coh_b", name: "Cohorte B", studentCount: 10 },
            ],
          });
        }
        if (url.includes("/api/v1/professor/students")) {
          return jsonResponse({ students: [] });
        }
        if (url.includes("/api/v1/professor/")) {
          return jsonResponse({});
        }
        if (url.includes("/api/v1/pedagogical-runs")) {
          return jsonResponse({ runs: [] });
        }
        if (url.includes("/api/v1/analytics/")) {
          return jsonResponse({ students: [], meta: { enrolled: 0, versions: [] } });
        }
        return jsonResponse({});
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders freeze simulation control", async () => {
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

    await waitFor(() => {
      expect(screen.getByTestId("professor-pedagogical-control")).toBeInTheDocument();
    });

    const freeze = screen.getByTestId("professor-freeze-simulation") as HTMLInputElement;
    expect(freeze.checked).toBe(false);

    fireEvent.click(freeze);
    expect(freeze.checked).toBe(true);
    expect(localStorage.getItem("tec-erp.professor.simulation-freeze")).toBe("true");
  });

  it("lists teaching deck links for Collège sessions S1–S10", async () => {
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

    await waitFor(() => {
      expect(screen.getByTestId("professor-teaching-deck-link-S1")).toBeInTheDocument();
    });
    expect(screen.getByTestId("professor-teaching-deck-link-S10")).toBeInTheDocument();
  });
});
