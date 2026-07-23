import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../auth/AuthContext.js";
import { LocaleProvider } from "../i18n/LocaleProvider.js";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout.js";
import { CapstonePage } from "../pages/workspace/CapstonePage.js";
import { LoginPage } from "../pages/LoginPage.js";
import { ThemeProvider } from "../theme/ThemeProvider.js";

const employee: AuthenticatedEmployee = {
  id: "emp_living",
  employeeNumber: "#NHE-LIV",
  email: "living@nordhabitat.ca",
  displayName: "Apprenant Living",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

function stubWorkspaceFetches(): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/pedagogical-course-runs")) {
        return jsonResponse([
          {
            id: "run_1",
            runCode: "RUN-1",
            runLabel: "Parcours",
            status: "ACTIVE",
            isWritable: true,
            isHistorical: false,
            curriculumVersionLabel: "Curriculum V1",
          },
        ]);
      }
      if (url.includes("/inbox") || url.includes("/tasks") || url.includes("/missions")) {
        return jsonResponse({ messages: [], unreadCount: 0, tasks: [], missions: [] });
      }
      return jsonResponse({});
    }),
  );
}

describe("Living ERP shell and preferences", () => {
  it("defaults locale to French and persists English switch", async () => {
    stubWorkspaceFetches();
    render(
      <ThemeProvider>
        <AuthProvider skipRestore initialEmployee={employee}>
          <LocaleProvider>
            <MemoryRouter initialEntries={["/workspace"]}>
              <Routes>
                <Route element={<WorkspaceLayout />}>
                  <Route index element={<div>home</div>} />
                  <Route path="workspace" element={<div>home</div>} />
                </Route>
              </Routes>
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("locale-switch")).toHaveValue("fr");
    fireEvent.change(screen.getByTestId("locale-switch"), { target: { value: "en" } });
    await waitFor(() => {
      expect(window.localStorage.getItem("tec-erp.locale")).toBe("en");
      expect(screen.getByTestId("locale-switch")).toHaveValue("en");
    });
  });

  it("persists theme preference and resolves dark mode", async () => {
    stubWorkspaceFetches();
    render(
      <ThemeProvider>
        <AuthProvider skipRestore initialEmployee={employee}>
          <LocaleProvider>
            <MemoryRouter initialEntries={["/workspace"]}>
              <Routes>
                <Route element={<WorkspaceLayout />}>
                  <Route path="workspace" element={<div>home</div>} />
                </Route>
              </Routes>
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByTestId("theme-switch"), { target: { value: "dark" } });
    await waitFor(() => {
      expect(window.localStorage.getItem("tec-erp.theme")).toBe("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
  });

  it("defaults the context panel collapsed and expands from the top bar", async () => {
    stubWorkspaceFetches();
    render(
      <ThemeProvider>
        <AuthProvider skipRestore initialEmployee={employee}>
          <LocaleProvider>
            <MemoryRouter initialEntries={["/workspace"]}>
              <Routes>
                <Route element={<WorkspaceLayout />}>
                  <Route path="workspace" element={<div>home</div>} />
                </Route>
              </Routes>
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("tec-app-shell")).toHaveClass("tec-app-shell--context-collapsed");
    });
    fireEvent.click(screen.getByTestId("toggle-context-panel"));
    await waitFor(() => {
      expect(screen.getByTestId("tec-app-shell")).not.toHaveClass("tec-app-shell--context-collapsed");
      expect(screen.getByTestId("tec-app-shell-right-panel")).toBeVisible();
    });
  });

  it("localizes English login credential errors to French by default", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          { error: { code: "UNAUTHORIZED", message: "Invalid email or password." } },
          401,
        ),
      ),
    );

    render(
      <ThemeProvider>
        <AuthProvider skipRestore>
          <LocaleProvider>
            <MemoryRouter initialEntries={["/login"]}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    fireEvent.change(screen.getByLabelText("Courriel professionnel"), {
      target: { value: "demo@nordhabitat.ca" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "bad-password" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Se connecter" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Courriel ou mot de passe invalide.",
      );
    });
  });
});

describe("Capstone locked CTA closure", () => {
  it("hides submit CTA while Capstone is locked", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        if (url.includes("/capstone/submission")) {
          return jsonResponse({
            id: "cap_1",
            status: "draft",
            diagnose: "",
            prioritize: "",
            execute: "",
            analyze: "",
            recommend: "",
            executiveSummary: null,
            submittedAt: null,
            reviewStatus: null,
            lifecycleStatus: "LOCKED",
            lifecycleStatusLabel: "Verrouillé",
            currentStage: null,
          });
        }
        if (url.includes("/gold-eligibility")) {
          return jsonResponse({
            eligibleForProfessorIssue: false,
            studentReadyChecklist: {
              missionsComplete: false,
              goldAssessmentPassed: false,
              hcmAssessmentPassed: false,
              capstoneSubmitted: false,
              capstoneProfessorApproved: false,
            },
            reasons: ["Missions régulières incomplètes"],
            nextStepHint: "Complétez les 30 missions.",
          });
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
      expect(screen.getByTestId("capstone-locked-hint")).toBeInTheDocument();
      expect(screen.getByTestId("capstone-stage-stepper")).toBeInTheDocument();
      expect(screen.queryByTestId("capstone-submit")).not.toBeInTheDocument();
      expect(screen.getByTestId("capstone-submit-unavailable")).toBeInTheDocument();
    });
  });
});
