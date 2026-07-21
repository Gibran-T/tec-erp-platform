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
const missionKeyM02 = "m1-m02-connecter-departements";
const missionKeyM03 = "m1-m03-diagnostiquer-preparation";

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

function courseOverview(missions: Array<{
  missionKey: string;
  title: string;
  status: "locked" | "available" | "in_progress" | "completed";
  unlockExplanation: string | null;
  sequence: number;
  missionCode: string;
}>) {
  const completedCount = missions.filter((mission) => mission.status === "completed").length;
  const percentComplete = Math.round((completedCount / Math.max(missions.length, 1)) * 100);

  return {
    courseCode: "TEC_ERP_V1",
    title: "TEC.ERP — Analyste ERP et processus d’affaires",
    version: "1.0.0",
    status: percentComplete === 100 ? "completed" : "available",
    percentComplete,
    modules: [
      {
        moduleCode: "M1",
        title: "Découverte organisationnelle",
        sequence: 1,
        status: percentComplete === 100 ? "completed" : "available",
        percentComplete,
        missions: missions.map((mission) => ({
          missionKey: mission.missionKey,
          missionCode: mission.missionCode,
          title: mission.title,
          sequence: mission.sequence,
          status: mission.status,
          unlockExplanation: mission.unlockExplanation,
        })),
      },
    ],
  };
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
    interactions: null,
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

    if (url.endsWith("/api/v1/me/course") && method === "GET") {
      return jsonResponse(
        courseOverview([
          {
            missionKey,
            title: "Découvrir l’entreprise",
            status,
            unlockExplanation:
              status === "locked" ? "Terminez d’abord votre première journée." : null,
            sequence: 1,
            missionCode: "M1-M01",
          },
          {
            missionKey: missionKeyM02,
            title: "Connecter les départements",
            status: status === "completed" ? "available" : "locked",
            unlockExplanation: "Complétez d’abord la mission précédente.",
            sequence: 2,
            missionCode: "M1-M02",
          },
          {
            missionKey: missionKeyM03,
            title: "Diagnostiquer la préparation",
            status: "locked",
            unlockExplanation: "Complétez d’abord la mission précédente.",
            sequence: 3,
            missionCode: "M1-M03",
          },
        ]),
      );
    }

    if (url.includes("/api/v1/me/modules/") && method === "GET") {
      return jsonResponse({
        ...courseOverview([
          {
            missionKey,
            title: "Découvrir l’entreprise",
            status,
            unlockExplanation:
              status === "locked" ? "Terminez d’abord votre première journée." : null,
            sequence: 1,
            missionCode: "M1-M01",
          },
        ]).modules[0],
        courseCode: "TEC_ERP_V1",
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
          {
            missionKey: missionKeyM02,
            title: "Connecter les départements",
            status: status === "completed" ? "available" : "locked",
            preview: "Reliez les flux d’information entre départements.",
            unlockExplanation:
              status === "completed" ? null : "Complétez d’abord la mission précédente.",
          },
          {
            missionKey: missionKeyM03,
            title: "Diagnostiquer la préparation",
            status: "locked",
            preview: "Évaluez la préparation organisationnelle.",
            unlockExplanation: "Complétez d’abord la mission précédente.",
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
          interactions: null,
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

function mockGenericMissionWorkspace(mission: "m02" | "m03"): ReturnType<typeof vi.fn> {
  const key = mission === "m02" ? missionKeyM02 : missionKeyM03;
  let status: "available" | "in_progress" | "completed" = "available";
  let startedAt: string | null = null;

  const detailBase =
    mission === "m02"
      ? {
          missionKey: key,
          title: "Connecter les départements",
          preview: "Reliez les flux d’information entre départements.",
          unlockExplanation: null,
          briefing:
            "Claire vous demande de reconnecter le signal terrain aux décisions partagées.",
          contextItems: [
            {
              key: "ctx-flow-overview",
              title: "Chaîne d’information NordHabitat",
              body: "Le signal terrain doit rejoindre le système.",
              required: true,
            },
          ],
          departments: [],
          problems: [],
          interactions: [
            {
              id: "primary-owner",
              type: "SINGLE_CHOICE",
              prompt: "Quel département détient en premier le signal physique ?",
              options: [
                { key: "dept-entrepot", label: "Entrepôt" },
                { key: "dept-ventes", label: "Ventes" },
              ],
            },
            {
              id: "impacted-units",
              type: "MULTI_CHOICE",
              prompt: "Quels départements sont directement touchés ?",
              options: [
                { key: "dept-ti", label: "TI" },
                { key: "dept-operations", label: "Opérations" },
                { key: "dept-ventes", label: "Ventes" },
              ],
            },
            {
              id: "process-order",
              type: "ORDERING",
              prompt: "Ordonnez les étapes d’une réponse cohérente.",
              options: [
                { key: "step-observe", label: "Observer le signal terrain" },
                { key: "step-verify", label: "Vérifier la donnée système" },
                { key: "step-alert-ops", label: "Alerter les opérations" },
              ],
            },
            {
              id: "gap-size",
              type: "NUMERIC_INPUT",
              prompt: "Quel est l’écart d’unités signalé ?",
            },
            {
              id: "connection-rationale",
              type: "TEXT_ANALYSIS",
              prompt: "Expliquez pourquoi connecter les départements réduit le risque.",
            },
          ],
        }
      : {
          missionKey: key,
          title: "Diagnostiquer la préparation",
          preview: "Évaluez la préparation organisationnelle.",
          unlockExplanation: null,
          briefing: "Formulez un diagnostic et une recommandation prioritaire.",
          contextItems: [
            {
              key: "ctx-readiness-rubric",
              title: "Grille de préparation",
              body: "Signal visible, donnée vérifiable, propriétaire identifiable.",
              required: true,
            },
          ],
          departments: [],
          problems: [],
          interactions: [
            {
              id: "readiness-level",
              type: "SINGLE_CHOICE",
              prompt: "Quel niveau de préparation attribuez-vous ?",
              options: [
                { key: "partial", label: "Partiellement prête" },
                { key: "unready", label: "Non prête" },
              ],
            },
            {
              id: "blockers",
              type: "MULTI_CHOICE",
              prompt: "Quels freins limitent la préparation ?",
              options: [
                { key: "data-fragmentation", label: "Fragmentation des données" },
                { key: "unclear-ownership", label: "Propriété floue" },
              ],
            },
            {
              id: "priority-order",
              type: "ORDERING",
              prompt: "Priorisez les actions.",
              options: [
                { key: "clarify-owner", label: "Clarifier le propriétaire" },
                { key: "align-data", label: "Aligner la lecture" },
              ],
            },
            {
              id: "diagnosis",
              type: "DIAGNOSIS_RECOMMENDATION",
              prompt: "Associez chaque symptôme à la recommandation.",
              options: [
                { key: "sym-gap", label: "Écart 40/36" },
                { key: "sym-silo", label: "Décisions en silo" },
                { key: "rec-verify", label: "Vérifier avant d’ajuster" },
                { key: "rec-coordinate", label: "Coordonner inter-départements" },
              ],
            },
            {
              id: "closing-note",
              type: "TEXT_ANALYSIS",
              prompt: "Synthétisez votre diagnostic.",
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
            readAt: "2026-07-10T10:00:00.000Z",
          },
        ],
        unreadCount: 0,
      });
    }

    if (url.endsWith("/api/v1/me/tasks") && method === "GET") {
      return jsonResponse({
        tasks: [
          {
            taskKey: "decouvrir-nordhabitat",
            title: "Découvrir NordHabitat",
            description: "Orientation",
            status: "terminee",
          },
        ],
      });
    }

    if (url.endsWith("/api/v1/me/course") && method === "GET") {
      return jsonResponse(
        courseOverview([
          {
            missionKey,
            title: "Découvrir l’entreprise",
            status: "completed",
            unlockExplanation: null,
            sequence: 1,
            missionCode: "M1-M01",
          },
          {
            missionKey: missionKeyM02,
            title: "Connecter les départements",
            status: mission === "m02" ? status : "completed",
            unlockExplanation: null,
            sequence: 2,
            missionCode: "M1-M02",
          },
          {
            missionKey: missionKeyM03,
            title: "Diagnostiquer la préparation",
            status: mission === "m03" ? status : "locked",
            unlockExplanation: mission === "m03" ? null : "Prérequis requis.",
            sequence: 3,
            missionCode: "M1-M03",
          },
        ]),
      );
    }

    if (url.endsWith("/api/v1/me/missions") && method === "GET") {
      return jsonResponse({
        missions: [
          {
            missionKey,
            title: "Découvrir l’entreprise",
            status: "completed",
            preview: "Observer la fragmentation.",
            unlockExplanation: null,
          },
          {
            missionKey: missionKeyM02,
            title: "Connecter les départements",
            status: mission === "m02" ? status : "completed",
            preview: detailBase.preview,
            unlockExplanation: null,
          },
          {
            missionKey: missionKeyM03,
            title: "Diagnostiquer la préparation",
            status: mission === "m03" ? status : "locked",
            preview: "Évaluez la préparation organisationnelle.",
            unlockExplanation: mission === "m03" ? null : "Prérequis requis.",
          },
        ],
      });
    }

    if (url.includes(`/api/v1/me/missions/${key}/start`) && method === "POST") {
      status = "in_progress";
      startedAt = startedAt ?? "2026-07-13T12:00:00.000Z";
      return jsonResponse(
        {
          missionKey: key,
          created: true,
          attempt: {
            status: "in_progress",
            startedAt,
            completedAt: null,
            acknowledgedInputKeys: [],
            departmentProblemMappings: [],
            justification: null,
            feedbackKey: null,
            feedbackBody: null,
          },
        },
        201,
      );
    }

    if (url.includes(`/api/v1/me/missions/${key}/submit`) && method === "POST") {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (!Array.isArray(body.responses)) {
        return apiError(400, "VALIDATION", "Soumission invalide.");
      }

      status = "completed";
      return jsonResponse({
        missionKey: key,
        attempt: {
          status: "completed",
          startedAt: startedAt ?? "2026-07-13T12:00:00.000Z",
          completedAt: "2026-07-13T13:00:00.000Z",
          acknowledgedInputKeys: [],
          departmentProblemMappings: [],
          justification: null,
          feedbackKey: null,
          feedbackBody: "Retour enregistré. Claire Fontaine",
        },
        score: {
          scorePercent: 85,
          earnedPoints: 85,
          maxPoints: 100,
          passed: true,
          feedback: "Retour enregistré. Claire Fontaine",
        },
      });
    }

    if (url.includes(`/api/v1/me/missions/${key}`) && method === "GET") {
      return jsonResponse({
        ...detailBase,
        status,
        attempt:
          status === "available"
            ? null
            : {
                status: status === "completed" ? "completed" : "in_progress",
                startedAt: startedAt ?? "2026-07-13T12:00:00.000Z",
                completedAt: status === "completed" ? "2026-07-13T13:00:00.000Z" : null,
                acknowledgedInputKeys: [],
                departmentProblemMappings: [],
                justification: null,
                feedbackKey: null,
                feedbackBody: status === "completed" ? "Retour enregistré. Claire Fontaine" : null,
              },
      });
    }

    if (url.includes("/api/v1/me/") && method === "GET") {
      return jsonResponse({});
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

    const firstMission = screen.getByTestId(`mission-summary-${missionKey}`);
    expect(within(firstMission).getByTestId("mission-status-badge")).toHaveTextContent(
      "Verrouillée",
    );
    expect(within(firstMission).getByTestId("mission-unlock-explanation")).toBeInTheDocument();
    expect(screen.queryByTestId("mission-open-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mission-briefing")).not.toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });

  it("runs the available start-map-submit journey with feedback", async () => {
    mockMissionWorkspace({ unlocked: true, status: "available" });
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getAllByTestId("mission-open-button").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByTestId("mission-open-button")[0]!);

    await waitFor(() => {
      expect(screen.getByTestId("mission-start-button")).toBeInTheDocument();
    });

    expect(screen.getByTestId("mission-briefing")).toHaveTextContent("40 versus 36");
    expect(screen.getByTestId("mission-objective")).toBeInTheDocument();
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

    const feedback = await screen.findByTestId(
      "mission-feedback",
      undefined,
      { timeout: 10_000 },
    );
    expect(feedback).toHaveTextContent("Claire Fontaine");

    expect(screen.getByTestId("mission-mapping-list").textContent).toContain("Entrepôt");
    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  }, 20_000);

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
      expect(screen.getAllByTestId("mission-open-button").length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getAllByTestId("mission-open-button")[0]!);
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

    const submitError = await screen.findByTestId(
      "mission-submit-error",
      undefined,
      { timeout: 10_000 },
    );
    expect(submitError).toHaveTextContent("Soumission invalide.");
  }, 20_000);

  it("renders M02 generic interaction types", async () => {
    mockGenericMissionWorkspace("m02");
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getByTestId(`mission-summary-${missionKeyM02}`)).toBeInTheDocument();
    });

    fireEvent.click(
      within(screen.getByTestId(`mission-summary-${missionKeyM02}`)).getByTestId(
        "mission-open-button",
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId("mission-start-button")).toBeInTheDocument();
    });

    expect(screen.getByTestId("mission-objective")).toHaveTextContent("flux d’information");
    fireEvent.click(screen.getByTestId("mission-start-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-interaction-primary-owner")).toBeInTheDocument();
    });

    expect(screen.getByTestId("mission-interaction-impacted-units")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-process-order")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-gap-size")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-connection-rationale")).toBeInTheDocument();
    expect(screen.getByTestId("mission-submit-button")).toBeInTheDocument();
  });

  it("renders M03 diagnosis pairing interaction", async () => {
    mockGenericMissionWorkspace("m03");
    renderWorkspace("/workspace/apps/centre-mission");

    await waitFor(() => {
      expect(screen.getByTestId(`mission-summary-${missionKeyM03}`)).toBeInTheDocument();
    });

    fireEvent.click(
      within(screen.getByTestId(`mission-summary-${missionKeyM03}`)).getByTestId(
        "mission-open-button",
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId("mission-start-button")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("mission-start-button"));

    await waitFor(() => {
      expect(screen.getByTestId("mission-interaction-diagnosis")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("mission-diag-left-diagnosis"), {
      target: { value: "sym-gap" },
    });
    fireEvent.change(screen.getByTestId("mission-diag-right-diagnosis"), {
      target: { value: "rec-verify" },
    });
    fireEvent.click(screen.getByTestId("mission-diag-add-diagnosis"));

    expect(screen.getByTestId("mission-interaction-readiness-level")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-blockers")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-priority-order")).toBeInTheDocument();
    expect(screen.getByTestId("mission-interaction-closing-note")).toBeInTheDocument();
    expect(screen.getByTestId("mission-diag-list-diagnosis").textContent).toContain("Écart 40/36");
  });
});
