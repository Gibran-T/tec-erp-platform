import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { saveStoredTokens } from "../api/auth.js";
import {
  formatUnreadCountMessage,
  MESSAGE_READ_SUCCESS_FEEDBACK,
  TASK_COMPLETE_SUCCESS_FEEDBACK,
} from "../first-day/firstDayCopy.js";

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

const managerMessage = {
  messageKey: "premier-message-gestionnaire",
  fromName: "Claire Fontaine",
  subject: "Bienvenue chez NordHabitat — votre première journée",
  preview:
    "Bonjour, bienvenue au Centre d'excellence ERP de NordHabitat. Je suis Claire Fontaine, votre gestionnaire.",
  body:
    "Bonjour, bienvenue au Centre d'excellence ERP de NordHabitat. Je suis Claire Fontaine, votre gestionnaire.\n\nVotre poste de travail numérique est prêt.",
  readAt: null as string | null,
};

const firstTask = {
  taskKey: "decouvrir-nordhabitat",
  title: "Découvrir NordHabitat",
  description:
    "Observez votre environnement de travail : repérez les applications actives, celles en préparation, et la façon dont une responsabilité vous est transmise après un message de votre gestionnaire.",
  status: "a_faire" as const,
};

function buildTestTokens() {
  return {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
  };
}

function seedAuthTokens(): void {
  saveStoredTokens(buildTestTokens());
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

interface MockOptions {
  readonly readAt?: string | null;
  readonly includeTask?: boolean;
  readonly taskStatus?: "a_faire" | "terminee";
  readonly markReadStatus?: number;
  readonly completeStatus?: number;
  readonly inboxGetStatus?: number;
  readonly tasksGetStatus?: number;
  readonly delayMs?: number;
}

function mockFirstDayFetch(options: MockOptions = {}): ReturnType<typeof vi.fn> {
  let messageRead = options.readAt != null;
  let taskStatus = options.taskStatus ?? "a_faire";
  const includeTaskInitially = options.includeTask ?? messageRead;

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();

    if (options.delayMs) {
      await new Promise((resolve) => {
        setTimeout(resolve, options.delayMs);
      });
    }

    if (url.endsWith("/api/v1/me/inbox") && method === "GET") {
      if (options.inboxGetStatus && options.inboxGetStatus >= 400) {
        return apiError(
          options.inboxGetStatus,
          options.inboxGetStatus === 401 ? "UNAUTHORIZED" : "INTERNAL",
          options.inboxGetStatus === 401
            ? "Authentification requise."
            : "Impossible de charger la boîte de réception. Veuillez réessayer.",
        );
      }

      const readAt = messageRead ? (options.readAt ?? "2026-07-09T12:00:00.000Z") : null;
      return jsonResponse({
        messages: [{ ...managerMessage, readAt }],
        unreadCount: readAt ? 0 : 1,
      });
    }

    if (url.includes("/api/v1/me/inbox/") && url.endsWith("/read") && method === "POST") {
      if (options.markReadStatus && options.markReadStatus >= 400) {
        const code =
          options.markReadStatus === 401
            ? "UNAUTHORIZED"
            : options.markReadStatus === 404
              ? "NOT_FOUND"
              : "INTERNAL";
        return apiError(
          options.markReadStatus,
          code,
          "Impossible de marquer le message comme lu. Veuillez réessayer.",
        );
      }

      messageRead = true;
      return jsonResponse({
        messageKey: managerMessage.messageKey,
        readAt: "2026-07-09T12:00:00.000Z",
      });
    }

    if (url.endsWith("/api/v1/me/tasks") && method === "GET") {
      if (options.tasksGetStatus && options.tasksGetStatus >= 400) {
        return apiError(
          options.tasksGetStatus,
          options.tasksGetStatus === 401 ? "UNAUTHORIZED" : "INTERNAL",
          "Impossible de charger les tâches. Veuillez réessayer.",
        );
      }

      const tasks =
        messageRead || includeTaskInitially ? [{ ...firstTask, status: taskStatus }] : [];
      return jsonResponse({ tasks });
    }

    if (url.includes("/api/v1/me/tasks/") && url.endsWith("/complete") && method === "POST") {
      if (options.completeStatus && options.completeStatus >= 400) {
        const code =
          options.completeStatus === 401
            ? "UNAUTHORIZED"
            : options.completeStatus === 404
              ? "NOT_FOUND"
              : options.completeStatus === 409
                ? "CONFLICT"
                : "INTERNAL";
        const message =
          options.completeStatus === 409
            ? "Complete the manager welcome message before finishing tasks."
            : "Impossible de terminer la tâche. Veuillez réessayer.";
        return apiError(options.completeStatus, code, message);
      }

      taskStatus = "terminee";
      return jsonResponse({
        taskKey: firstTask.taskKey,
        completedAt: "2026-07-09T13:00:00.000Z",
      });
    }

    if (url.endsWith("/api/v1/me/missions") && method === "GET") {
      const unlocked = messageRead && taskStatus === "terminee";
      return jsonResponse({
        missions: [
          {
            missionKey: "m1-m01-decouvrir-entreprise",
            title: "Découvrir l’entreprise",
            status: unlocked ? "available" : "locked",
            preview:
              "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
            unlockExplanation: unlocked
              ? null
              : "Terminez d’abord votre première journée : lisez le message de Claire Fontaine et complétez votre première responsabilité opérationnelle.",
          },
        ],
      });
    }

    if (
      url.includes("/api/v1/me/missions/") &&
      method === "GET" &&
      !url.endsWith("/start") &&
      !url.endsWith("/submit")
    ) {
      const unlocked = messageRead && taskStatus === "terminee";
      if (!unlocked) {
        return jsonResponse({
          missionKey: "m1-m01-decouvrir-entreprise",
          title: "Découvrir l’entreprise",
          status: "locked",
          preview:
            "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
          unlockExplanation:
            "Terminez d’abord votre première journée : lisez le message de Claire Fontaine et complétez votre première responsabilité opérationnelle.",
          briefing: null,
          contextItems: null,
          departments: null,
          problems: null,
          attempt: null,
        });
      }

      return jsonResponse({
        missionKey: "m1-m01-decouvrir-entreprise",
        title: "Découvrir l’entreprise",
        status: "available",
        preview:
          "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
        unlockExplanation: null,
        briefing: "Briefing Claire",
        contextItems: [
          {
            key: "ctx-nordhabitat-overview",
            title: "NordHabitat",
            body: "Vue d’ensemble",
            required: true,
          },
          {
            key: "ctx-tom-40-36",
            title: "Signal Tom",
            body: "Système 40, observation 36.",
            required: true,
          },
        ],
        departments: [
          {
            key: "dept-entrepot",
            label: "Entrepôt",
            description: "Stocks physiques",
          },
          {
            key: "dept-ti",
            label: "TI",
            description: "Données",
          },
        ],
        problems: [
          {
            key: "prob-inventaire-divergent",
            label: "Inventaire divergent",
            description: "Écart stock",
          },
          {
            key: "prob-coherence-donnees",
            label: "Cohérence des données",
            description: "Données fragmentées",
          },
        ],
        attempt: null,
      });
    }

    throw new Error(`Unexpected request: ${method} ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderWorkspace(initialEntry: string): void {
  seedAuthTokens();
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

describe("unread count French copy", () => {
  it("formats 0, 1, and N unread messages correctly", () => {
    expect(formatUnreadCountMessage(0)).toBe(
      "Aucun message professionnel en attente de lecture.",
    );
    expect(formatUnreadCountMessage(1)).toBe("1 message professionnel en attente de lecture.");
    expect(formatUnreadCountMessage(3)).toBe("3 messages professionnels en attente de lecture.");
  });
});

describe("first-day inbox experience", () => {
  it("shows initial loading then the unread Claire message", async () => {
    mockFirstDayFetch({ delayMs: 20 });

    renderWorkspace("/workspace/apps/boite-reception");

    expect(screen.getByTestId("inbox-initial-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("inbox-message-premier-message-gestionnaire")).toBeInTheDocument();
    });

    expect(screen.getByTestId("inbox-unread-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("inbox-unread-summary")).toHaveTextContent(
      "1 message professionnel en attente de lecture.",
    );
  });

  it("marks the manager message as read and updates shared context", async () => {
    mockFirstDayFetch();

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    expect(screen.getByTestId("workspace-context-checklist")).toHaveTextContent(
      "En attente : premier message de Claire Fontaine",
    );

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    await waitFor(() => {
      expect(screen.getByTestId("inbox-read-confirmation")).toHaveTextContent(
        MESSAGE_READ_SUCCESS_FEEDBACK,
      );
    });

    expect(screen.getByTestId("workspace-context-checklist")).toHaveTextContent(
      "Premier message de Claire Fontaine consulté",
    );
    expect(screen.getByTestId("workspace-context-checklist")).toHaveTextContent(
      "Première responsabilité opérationnelle assignée",
    );
    expect(screen.getByTestId("inbox-unread-summary")).toHaveTextContent(
      "Aucun message professionnel en attente de lecture.",
    );
    expect(screen.queryByTestId("inbox-initial-loading")).not.toBeInTheDocument();
  });

  it("keeps inbox content visible during quiet refresh", async () => {
    mockFirstDayFetch({ delayMs: 30 });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    expect(screen.getByTestId("inbox-message-detail")).toBeInTheDocument();
    expect(screen.queryByTestId("inbox-initial-loading")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("inbox-read-confirmation")).toBeInTheDocument();
    });
  });

  it("shows French alert when mark-read fails and preserves unread state", async () => {
    mockFirstDayFetch({ markReadStatus: 500 });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-error")).toHaveTextContent(
        "Impossible de marquer le message comme lu. Veuillez réessayer.",
      );
    });

    expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    expect(screen.getByTestId("inbox-unread-indicator")).toBeInTheDocument();
  });

  it("shows French GET failure for inbox", async () => {
    mockFirstDayFetch({ inboxGetStatus: 500 });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-load-error")).toHaveTextContent(
        "Impossible de charger la boîte de réception. Veuillez réessayer.",
      );
    });
  });

  it("handles 401 on mark-read", async () => {
    mockFirstDayFetch({ markReadStatus: 401 });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-error")).toBeInTheDocument();
    });
  });

  it("handles 404 on mark-read", async () => {
    mockFirstDayFetch({ markReadStatus: 404 });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-error")).toBeInTheDocument();
    });
  });

  it("shows already-read state without success feedback when remounted", async () => {
    mockFirstDayFetch({ readAt: "2026-07-09T12:00:00.000Z", includeTask: true });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-read-confirmation")).toHaveTextContent("Message lu.");
    });

    expect(screen.getByTestId("inbox-read-confirmation")).not.toHaveTextContent(
      "Une première responsabilité vous a été assignée",
    );
  });
});

describe("first-day tasks experience", () => {
  it("shows an honest empty state before the manager message is read", async () => {
    mockFirstDayFetch({ readAt: null, includeTask: false });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-empty-state")).toHaveTextContent(
        "Consultez d'abord le message de votre gestionnaire",
      );
    });
  });

  it("shows the first operational task after the manager message is read", async () => {
    mockFirstDayFetch({ readAt: "2026-07-09T12:00:00.000Z", includeTask: true });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-card-decouvrir-nordhabitat")).toBeInTheDocument();
    });

    expect(screen.getByTestId("task-card-decouvrir-nordhabitat")).toHaveTextContent(
      "Découvrir NordHabitat",
    );
    expect(screen.getByTestId("task-status-decouvrir-nordhabitat")).toHaveTextContent("À faire");
    expect(screen.getByTestId("task-card-decouvrir-nordhabitat")).toHaveTextContent(
      "Observez votre environnement de travail",
    );
  });

  it("completes the first task and updates shared context", async () => {
    mockFirstDayFetch({ readAt: "2026-07-09T12:00:00.000Z", includeTask: true });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-button-decouvrir-nordhabitat")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("task-complete-button-decouvrir-nordhabitat"));

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-note-decouvrir-nordhabitat")).toHaveTextContent(
        TASK_COMPLETE_SUCCESS_FEEDBACK,
      );
    });

    expect(screen.getByTestId("workspace-context-checklist")).toHaveTextContent(
      "Première responsabilité opérationnelle complétée",
    );
    expect(screen.queryByTestId("tasks-initial-loading")).not.toBeInTheDocument();
  });

  it("shows French alert when task completion fails", async () => {
    mockFirstDayFetch({
      readAt: "2026-07-09T12:00:00.000Z",
      includeTask: true,
      completeStatus: 500,
    });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-button-decouvrir-nordhabitat")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("task-complete-button-decouvrir-nordhabitat"));

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-error-decouvrir-nordhabitat")).toHaveTextContent(
        "Impossible de terminer la tâche. Veuillez réessayer.",
      );
    });

    expect(screen.getByTestId("task-complete-button-decouvrir-nordhabitat")).toBeInTheDocument();
    expect(screen.getByTestId("task-status-decouvrir-nordhabitat")).toHaveTextContent("À faire");
  });

  it("handles 409 prerequisite conflict on task completion", async () => {
    mockFirstDayFetch({
      readAt: "2026-07-09T12:00:00.000Z",
      includeTask: true,
      completeStatus: 409,
    });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-button-decouvrir-nordhabitat")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("task-complete-button-decouvrir-nordhabitat"));

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-error-decouvrir-nordhabitat")).toBeInTheDocument();
    });
  });

  it("handles 404 on task completion", async () => {
    mockFirstDayFetch({
      readAt: "2026-07-09T12:00:00.000Z",
      includeTask: true,
      completeStatus: 404,
    });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-button-decouvrir-nordhabitat")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("task-complete-button-decouvrir-nordhabitat"));

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-error-decouvrir-nordhabitat")).toBeInTheDocument();
    });
  });

  it("shows already-completed state on remount without success feedback", async () => {
    mockFirstDayFetch({
      readAt: "2026-07-09T12:00:00.000Z",
      includeTask: true,
      taskStatus: "terminee",
    });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("task-complete-note-decouvrir-nordhabitat")).toHaveTextContent(
        "Responsabilité enregistrée.",
      );
    });

    expect(screen.getByTestId("task-complete-note-decouvrir-nordhabitat")).not.toHaveTextContent(
      "repérage opérationnel",
    );
  });

  it("shows French GET failure for tasks", async () => {
    mockFirstDayFetch({ tasksGetStatus: 500 });

    renderWorkspace("/workspace/apps/taches");

    await waitFor(() => {
      expect(screen.getByTestId("tasks-load-error")).toHaveTextContent(
        "Impossible de charger les tâches. Veuillez réessayer.",
      );
    });
  });
});

describe("first-day shared state and vocabulary", () => {
  it("unlocks tasks in shared state after reading Claire's message", async () => {
    mockFirstDayFetch();

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-mark-read-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("inbox-mark-read-button"));

    await waitFor(() => {
      expect(screen.getByTestId("workspace-context-checklist")).toHaveTextContent(
        "Première responsabilité opérationnelle assignée",
      );
    });

    fireEvent.click(screen.getByTestId("workspace-sidebar-link-taches"));

    await waitFor(() => {
      expect(screen.getByTestId("task-card-decouvrir-nordhabitat")).toBeInTheDocument();
    });
  });

  it("keeps the first-day UI free of forbidden academic vocabulary", async () => {
    mockFirstDayFetch({ readAt: "2026-07-09T12:00:00.000Z", includeTask: true });

    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("inbox-app-page")).toBeInTheDocument();
    });

    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });
});
