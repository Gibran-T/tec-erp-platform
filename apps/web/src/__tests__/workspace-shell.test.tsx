import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { saveStoredTokens } from "../api/auth.js";
import { getLauncherApps } from "../workspace/appRegistry.js";

function buildTestTokens() {
  return {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
  };
}

const FORBIDDEN_VOCABULARY =
  /\b(course|cours|lms|simulation|learner|apprenant|student|étudiant|leçon|module)\b/i;

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

function renderWorkspace(
  initialEntry: string,
  employee: AuthenticatedEmployee | null = demoEmployee,
): void {
  if (employee) {
    saveStoredTokens(buildTestTokens());

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url.endsWith("/api/v1/me/inbox") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
              messages: [
                {
                  messageKey: "premier-message-gestionnaire",
                  fromName: "Claire Fontaine",
                  subject: "Bienvenue chez NordHabitat — votre première journée",
                  preview: "Bonjour et bienvenue au sein du Centre d'excellence ERP.",
                  body: "Bonjour et bienvenue au sein du Centre d'excellence ERP.",
                  readAt: null,
                },
              ],
              unreadCount: 1,
            }),
          } as Response;
        }

        if (url.endsWith("/api/v1/me/tasks") && method === "GET") {
          return {
            ok: true,
            json: async () => ({ tasks: [] }),
          } as Response;
        }

        if (url.endsWith("/api/v1/me/missions") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
              missions: [
                {
                  missionKey: "m1-m01-decouvrir-entreprise",
                  title: "Découvrir l’entreprise",
                  status: "locked",
                  preview:
                    "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
                  unlockExplanation:
                    "Terminez d’abord votre première journée : lisez le message de Claire Fontaine et complétez votre première responsabilité opérationnelle.",
                },
              ],
            }),
          } as Response;
        }

        if (url.endsWith("/api/v1/me/organization") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
              access: "locked",
              unlockExplanation: {
                code: "premiere-journee-requise",
                title: "Première journée requise",
                description:
                  "Terminez votre première journée avant de consulter l’organisation de l’entreprise.",
              },
              organization: null,
            }),
          } as Response;
        }

        if (url.endsWith("/api/v1/me/course") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
              courseCode: "TEC_ERP_V1",
              title: "TEC.ERP",
              version: "1.0.0",
              curriculumVersion: "V1",
              curriculumVersionLabel: "Curriculum V1",
              status: "available",
              percentComplete: 0,
              modules: [
                {
                  moduleCode: "M1",
                  title: "Bloc 1 — Découverte organisationnelle",
                  sequence: 1,
                  status: "available",
                  percentComplete: 0,
                  competencySummary: "Comprendre l'entreprise intégrée",
                  missions: [
                    {
                      missionKey: "m1-m01-decouvrir-entreprise",
                      missionCode: "M1-M01",
                      title: "Découvrir l’entreprise",
                      sequence: 1,
                      status: "available",
                      unlockExplanation: null,
                    },
                  ],
                },
              ],
            }),
          } as Response;
        }

        if (url.includes("/api/v1/me/pedagogical-course-runs") && method === "GET") {
          return {
            ok: true,
            json: async () => [
              {
                id: "run_active",
                runCode: "RUN-1",
                runLabel: "Parcours actif",
                status: "ACTIVE",
                statusLabel: "Actif",
                runTypeLabel: "Autonome",
                completionPercent: 10,
                isHistorical: false,
                isWritable: true,
                curriculumVersion: "V1",
                curriculumVersionLabel: "Curriculum V1",
              },
            ],
          } as Response;
        }

        if (url.includes("/api/v1/me/capstone/submission") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
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
            }),
          } as Response;
        }

        if (url.includes("/api/v1/me/analytics/exceptions") && method === "GET") {
          return {
            ok: true,
            json: async () => ({ exceptions: [] }),
          } as Response;
        }

        if (url.includes("/gold-eligibility") && method === "GET") {
          return {
            ok: true,
            json: async () => ({
              eligibleForProfessorIssue: false,
              awaitingProfessorIssuance: false,
              studentReadyChecklist: {
                missionsComplete: false,
                goldAssessmentPassed: false,
                hcmAssessmentPassed: false,
                capstoneSubmitted: false,
                capstoneProfessorApproved: false,
              },
              reasons: [],
              nextStepHint: "",
            }),
          } as Response;
        }

        if (url.includes("/me/certificates") && method === "GET") {
          return {
            ok: true,
            json: async () => ({ certificates: [] }),
          } as Response;
        }

        throw new Error(`Unexpected request in workspace-shell test: ${method} ${url}`);
      }),
    );
  }

  render(
    <AuthProvider skipRestore initialEmployee={employee}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe("workspace shell access", () => {
  it("redirects unauthenticated access to /workspace to the login page", () => {
    renderWorkspace("/workspace", null);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders the enterprise workspace shell for an authenticated employee", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-shell")).toBeInTheDocument();
    });

    expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    expect(screen.getByTestId("workplace-topbar")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-context-panel")).toBeInTheDocument();
  });
});

describe("workspace shell accessibility", () => {
  it("exposes a skip link that targets the main content region", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-shell")).toBeInTheDocument();
    });

    const skipLink = screen.getByTestId("skip-to-content-link");
    expect(skipLink).toHaveTextContent("Passer au contenu principal");
    expect(skipLink).toHaveAttribute("href", "#contenu-principal");

    const mainTarget = document.getElementById("contenu-principal");
    expect(mainTarget).not.toBeNull();
    expect(mainTarget).toHaveAttribute("tabindex", "-1");
  });

  it("renders the core banner, navigation and main landmarks", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    });

    expect(screen.getAllByRole("banner").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigation du poste de travail" }),
    ).toBeInTheDocument();
  });

  it("keeps a single top-level heading on the workspace home view", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    });

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});

describe("employee identity from session", () => {
  it("renders employee identity from session data in the shell", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("shell-learner-identity")).toHaveTextContent("Analyste Démo");
    });

    expect(screen.getByTestId("shell-learner-identity")).toHaveTextContent("#NHE-DEMO");
    expect(screen.getByTestId("shell-unified-context")).toBeInTheDocument();
    const unified = screen.getByTestId("shell-unified-context");
    const occurrences = (unified.textContent?.match(/Analyste Démo/g) ?? []).length;
    expect(occurrences).toBe(1);
    expect(screen.queryByText("MCapstone")).not.toBeInTheDocument();
    expect(screen.getByTestId("workspace-sidebar-link-capstone")).toHaveTextContent("Capstone");
  });

  it("renders session data on the employee profile page", async () => {
    renderWorkspace("/workspace/apps/profil");

    await waitFor(() => {
      expect(screen.getByTestId("employee-profile-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("profile-field-nom")).toHaveTextContent("Analyste Démo");
    expect(screen.getByTestId("profile-field-matricule")).toHaveTextContent("#NHE-DEMO");
    expect(screen.getByTestId("profile-field-entreprise")).toHaveTextContent("NordHabitat");
    expect(screen.getByTestId("profile-field-courriel")).toHaveTextContent(
      "demo.analyste@nordhabitat.ca",
    );
  });
});

describe("navigation and placeholders", () => {
  it("renders expected apps in the grouped sidebar and compact launcher", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-app-launcher")).toBeInTheDocument();
    });

    expect(screen.getByTestId("workspace-nav-parcours")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-nav-operations")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-nav-results")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-nav-account")).toBeInTheDocument();
    expect(screen.queryByTestId("workspace-sidebar-link-administration")).not.toBeInTheDocument();
    expect(screen.queryByTestId("workspace-sidebar-link-portail-professeur")).not.toBeInTheDocument();
    expect(screen.queryByText("Accès actif")).not.toBeInTheDocument();
    expect(screen.queryByText("Accès en préparation")).not.toBeInTheDocument();

    const launcherApps = getLauncherApps("JR_BUSINESS_ANALYST").filter((app) => app.id !== "accueil");
    for (const app of launcherApps) {
      expect(screen.getByTestId(`workspace-app-tile-${app.id}`)).toBeInTheDocument();
    }
  });

  it("renders the manager inbox on the boîte de réception app page", async () => {
    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-app-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("inbox-message-premier-message-gestionnaire")).toHaveTextContent(
      "Claire Fontaine",
    );
  });

  it("shows preparing access badge for restricted apps", async () => {
    renderWorkspace("/workspace/apps/calendrier");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-empty-state-badge")).toHaveTextContent(
        "Accès en préparation",
      );
    });
  });

  it("routes the Day-1-gated ERP app to the organizational ERP page, not the preparing fallback", async () => {
    renderWorkspace("/workspace/apps/erp");

    await waitFor(() => {
      expect(screen.getByTestId("organization-erp-page")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("workspace-empty-state-badge")).not.toBeInTheDocument();
  });
});

describe("workspace session controls", () => {
  it("logs the employee out from the badge menu", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({}) }) as Response),
    );

    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("employee-badge-trigger")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("employee-badge-trigger"));
    fireEvent.click(screen.getByTestId("logout-button"));

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});

describe("workspace vocabulary", () => {
  it("keeps the workspace UI free of forbidden academic vocabulary", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    });

    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });
});
