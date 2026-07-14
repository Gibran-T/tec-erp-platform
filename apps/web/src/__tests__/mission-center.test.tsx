import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { saveStoredTokens } from "../api/auth.js";

const FORBIDDEN_VOCABULARY =
  /\b(course|cours|lms|simulation|learner|apprenant|student|étudiant|leçon|module|quiz|score|certification|points)\b/i;

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

const missionKey = "m1-m01-decouvrir-entreprise";

function buildTestTokens() {
  return {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function apiError(status: number, code: string, message: string): Response {
  return jsonResponse(
    {
      error: {
        code,
        message,
        requestId: "req_test",
      },
    },
    status,
  );
}

interface MissionMockOptions {
  readonly unlocked?: boolean;
  readonly status?: "locked" | "available" | "in_progress" | "completed";
  readonly submitStatus?: number;
}

function mockMissionWorkspace(options: MissionMockOptions = {}): ReturnType<typeof vi.fn> {
  let status =
    options.status ??
    (options.unlocked === false ? "locked" : options.unlocked === true ? "available" : "locked");
  let startedAt: string | null = null;
  let completedAt: string | null = null;
  let justification: string | null = null;
  let acknowledgedInputKeys: string[] = [];
  let departmentProblemMappings: Array<{ departmentKey: string; problemKey: string }> = [];
  let feedbackBody: string | null = null;

  const unlockedDetailBase = {
    missionKey,
    title: "Découvrir l’entreprise",
    preview: "Observer la fragmentation d’information chez NordHabitat.",
    unlockExplanation: null as string | null,
    briefing:
      "Claire vous confie Découvrir l’entreprise. Tom signale 40 versus 36. Observateur-Analyste seulement.",
    contextItems: [
      {
        key: "ctx-nordhabitat-overview",
        title: "NordHabitat — vue d’ensemble",
        body: "Entreprise multi-départements.",
        required: true,
      },
      {
        key: "ctx-tom-40-36",
        title: "Signal de Tom — 40 versus 36",
        body: "Système 40, observation 36. Fragmentation, pas un ajustement de stock.",
        required: true,
      },
    ],
    departments: [
      { key: "dept-entrepot", label: "Entrepôt", description: "Stocks physiques" },
      { key: "dept-ti", label: "TI", description: "Données" },
    ],
    problems: [
      {
        key: "prob-inventaire-divergent",
        label: "Inventaire divergent",
        description: "Écart système / réalité",
      },
      {
        key: "prob-coherence-donnees",
        label: "Cohérence des données TI",
        description: "Données fragmentées",
      },
    ],
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();

    if (url.endsWith("/api/v1/me/inbox") && method === "GET") {
      return jsonResponse({
        messages: [
          {
            messageKey: "premier-message-gestionnaire",
            fromName: "Claire Fontaine",
            subject: "Bienvenue",
            preview: "Bienvenue",
            body: "Bienvenue",
            readAt: options.unlocked === false ? null : "2026-07-10T10:00:00.000Z",
          },
        ],
        unreadCount: options.unlocked === false ? 1 : 0,
      });
    }

    if (url.endsWith("/api/v1/me/tasks") && method === "GET") {
      return jsonResponse({
        tasks:
          options.unlocked === false
            ? []
            : [
                {
                  taskKey: "decouvrir-nordhabitat",
                  title: "Découvrir NordHabitat",
                  description: "Orientation",
                  status: "terminee",
                },
              ],
      });
    }

    if (url.endsWith("/api/v1/me/missions") && method === "GET") {
      return jsonResponse({
        missions: [
          {
            missionKey,
            title: "Découvrir l’entreprise",
            status,
            preview: unlockedDetailBase.preview,
            unlockExplanation:
              status === "locked"
                ? "Terminez d’abord votre première journée."
                : null,
          },
        ],
      });
    }

    if (url.includes(`/api/v1/me/missions/${missionKey}/start`) && method === "POST") {
      if (status === "locked") {
        return apiError(409, "CONFLICT", "Terminez d’abord votre première journée.");
      }

      status = status === "completed" ? "completed" : "in_progress";
      startedAt = startedAt ?? "2026-07-13T12:00:00.000Z";
      return jsonResponse(
        {
          missionKey,
          created: true,
          attempt: {
            status: status === "completed" ? "completed" : "in_progress",
            startedAt,
            completedAt,
            acknowledgedInputKeys,
            departmentProblemMappings,
            justification,
            feedbackKey: null,
            feedbackBody: null,
          },
        },
        201,
      );
    }

    if (url.includes(`/api/v1/me/missions/${missionKey}/submit`) && method === "POST") {
      if (options.submitStatus && options.submitStatus >= 400) {
        return apiError(options.submitStatus, "VALIDATION", "Soumission invalide.");
      }

      if (status === "available" || status === "locked") {
        return apiError(409, "CONFLICT", "Démarrez la mission avant de soumettre.");
      }

      const body = init?.body ? JSON.parse(String(init.body)) : {};
      status = "completed";
      completedAt = "2026-07-13T13:00:00.000Z";
      acknowledgedInputKeys = body.acknowledgedInputKeys ?? [];
      departmentProblemMappings = body.departmentProblemMappings ?? [];
      justification = body.justification ?? null;
      feedbackBody =
        "Merci. Votre observation est enregistrée. Claire Fontaine";

      return jsonResponse({
        missionKey,
        attempt: {
          status: "completed",
          startedAt: startedAt ?? "2026-07-13T12:00:00.000Z",
          completedAt,
          acknowledgedInputKeys,
          departmentProblemMappings,
          justification,
          feedbackKey: "fb-discovery-complete",
          feedbackBody,
        },
      });
    }

    if (url.includes(`/api/v1/me/missions/${missionKey}`) && method === "GET") {
      if (status === "locked") {
        return jsonResponse({
          missionKey,
          title: "Découvrir l’entreprise",
          status: "locked",
          preview: unlockedDetailBase.preview,
          unlockExplanation: "Terminez d’abord votre première journée.",
          briefing: null,
          contextItems: null,
          departments: null,
          problems: null,
          attempt: null,
        });
      }

      return jsonResponse({
        ...unlockedDetailBase,
        status,
        attempt:
          status === "available"
            ? null
            : {
                status: status === "completed" ? "completed" : "in_progress",
                startedAt: startedAt ?? "2026-07-13T12:00:00.000Z",
                completedAt,
                acknowledgedInputKeys,
                departmentProblemMappings,
                justification,
                feedbackKey: status === "completed" ? "fb-discovery-complete" : null,
                feedbackBody,
              },
      });
    }

    throw new Error(`Unexpected request: ${method} ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderWorkspace(initialEntry: string): void {
  saveStoredTokens(buildTestTokens());
  render(
    <AuthProvider skipRestore initialEmployee={demoEmployee}>
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

describe("mission center experience", () => {
  it("shows a locked summary without briefing tools", async () => {
    mockMissionWorkspace({ unlocked: false, status: "locked" });
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getByTestId("mission-center-page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("mission-status-badge")).toHaveTextContent("Verrouillée");
    expect(screen.getByTestId("mission-unlock-explanation")).toBeInTheDocument();
    expect(screen.queryByTestId("mission-open-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mission-briefing")).not.toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });

  it("runs the available start-map-submit journey with feedback", async () => {
    mockMissionWorkspace({ unlocked: true, status: "available" });
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getByTestId("mission-open-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("mission-open-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-start-button")).toBeInTheDocument();
    });

    expect(screen.getByTestId("mission-briefing")).toHaveTextContent("40 versus 36");
    fireEvent.click(screen.getByTestId("mission-start-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-submit-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("mission-ack-ctx-nordhabitat-overview"));
    fireEvent.click(screen.getByTestId("mission-ack-ctx-tom-40-36"));
    fireEvent.change(screen.getByTestId("mission-department-select"), {
      target: { value: "dept-entrepot" },
    });
    fireEvent.change(screen.getByTestId("mission-problem-select"), {
      target: { value: "prob-inventaire-divergent" },
    });
    fireEvent.click(screen.getByTestId("mission-add-mapping"));
    fireEvent.change(screen.getByTestId("mission-department-select"), {
      target: { value: "dept-ti" },
    });
    fireEvent.change(screen.getByTestId("mission-problem-select"), {
      target: { value: "prob-coherence-donnees" },
    });
    fireEvent.click(screen.getByTestId("mission-add-mapping"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-mapping-list").textContent).toContain("TI");
    });

    fireEvent.change(screen.getByTestId("mission-justification"), {
      target: {
        value:
          "L’écart 40 versus 36 montre une fragmentation entre l’entrepôt et les systèmes TI.",
      },
    });

    fireEvent.click(screen.getByTestId("mission-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-feedback")).toHaveTextContent("Claire Fontaine");
    });

    expect(screen.getByTestId("mission-mapping-list").textContent).toContain("Entrepôt");
    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });

  it("keeps Mission actuelle separate from the Day-1 checklist", async () => {
    mockMissionWorkspace({ unlocked: true, status: "available" });
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-context-mission")).toBeInTheDocument();
    });

    const checklist = screen.getByTestId("workspace-context-checklist");
    expect(checklist.textContent).not.toContain("Mission disponible");
    expect(within(screen.getByTestId("workspace-context-mission")).getByText("Mission disponible")).toBeInTheDocument();
  });

  it("shows backend validation errors on submit", async () => {
    mockMissionWorkspace({ unlocked: true, status: "available", submitStatus: 400 });
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getByTestId("mission-open-button")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("mission-open-button"));
    await waitFor(() => expect(screen.getByTestId("mission-start-button")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("mission-start-button"));
    await waitFor(() => expect(screen.getByTestId("mission-submit-button")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("mission-ack-ctx-nordhabitat-overview"));
    fireEvent.click(screen.getByTestId("mission-ack-ctx-tom-40-36"));
    fireEvent.change(screen.getByTestId("mission-department-select"), {
      target: { value: "dept-entrepot" },
    });
    fireEvent.change(screen.getByTestId("mission-problem-select"), {
      target: { value: "prob-inventaire-divergent" },
    });
    fireEvent.click(screen.getByTestId("mission-add-mapping"));
    fireEvent.change(screen.getByTestId("mission-department-select"), {
      target: { value: "dept-ti" },
    });
    fireEvent.change(screen.getByTestId("mission-problem-select"), {
      target: { value: "prob-coherence-donnees" },
    });
    fireEvent.click(screen.getByTestId("mission-add-mapping"));
    fireEvent.change(screen.getByTestId("mission-justification"), {
      target: {
        value:
          "L’écart 40 versus 36 montre une fragmentation entre l’entrepôt et les systèmes TI.",
      },
    });
    fireEvent.click(screen.getByTestId("mission-submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-submit-error")).toHaveTextContent("Soumission invalide.");
    });
  });
});
