import type { OrganizationPayload } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../../../../api/auth.js";
import { OrganizationalErpPage } from "../../OrganizationalErpPage.js";

const FORBIDDEN_VOCABULARY =
  /\b(course|cours|lms|simulation|learner|apprenant|student|étudiant|leçon|module|quiz|score|certification|points|badge-récompense|recommencer)\b/i;

const DEPARTMENT_KEYS = [
  "dept-direction",
  "dept-operations",
  "dept-finance",
  "dept-ventes",
  "dept-approvisionnement",
  "dept-entrepot",
  "dept-ti",
] as const;

const DEPARTMENT_LABELS: Record<string, string> = {
  "dept-direction": "Direction",
  "dept-operations": "Opérations",
  "dept-finance": "Finance",
  "dept-ventes": "Ventes",
  "dept-approvisionnement": "Approvisionnement",
  "dept-entrepot": "Entrepôt",
  "dept-ti": "TI",
};

function buildOrganizationPayload(): OrganizationPayload {
  return {
    companyProfile: {
      name: "NordHabitat",
      industry: "Matériaux et solutions pour l'habitat",
      operatingContext: "Contexte de test.",
      organizationalSummary: "Synthèse de test.",
      erpLearningContext: "Contexte de test ERP.",
    },
    departments: DEPARTMENT_KEYS.map((key) => ({
      key,
      label: DEPARTMENT_LABELS[key] ?? key,
      shortDescription: `Description courte de ${DEPARTMENT_LABELS[key]}.`,
      responsibilities: [`Responsabilité de ${DEPARTMENT_LABELS[key]}.`],
      processContributions: [`Contribution de ${DEPARTMENT_LABELS[key]}.`],
      informationNeeds: [`Besoin d'information de ${DEPARTMENT_LABELS[key]}.`],
      fragmentationSignals: [`Signal de fragmentation de ${DEPARTMENT_LABELS[key]}.`],
    })),
    relationships: [
      {
        key: "rel-ventes-entrepot",
        fromDepartmentKey: "dept-ventes",
        toDepartmentKey: "dept-entrepot",
        label: "Demande client et disponibilité",
        description: "Les Ventes s'appuient sur l'Entrepôt.",
        exchangedInformation: ["Disponibilité demandée"],
        coordinationRisk: "Promesse client incorrecte possible.",
      },
    ],
    processAwareness: [
      {
        key: "proc-promesse-client",
        label: "Promesse client et disponibilité",
        description: "La promesse dépend d'une disponibilité partagée.",
        participatingDepartmentKeys: ["dept-ventes", "dept-entrepot"],
        sourceInformation: "Demande client et solde stock",
        expectedControl: "Confirmation avant engagement",
        analyticalQuestion: "Sur quelle source repose la promesse client ?",
      },
    ],
    fragmentationSignals: [
      {
        key: "frag-duplication-tableurs",
        title: "Duplication dans des tableurs",
        description: "Copies locales hors du système partagé.",
        affectedDepartmentKeys: ["dept-entrepot", "dept-finance"],
        businessImpact: "Décisions sur des versions différentes.",
        evidence: "Fichiers locaux utilisés en parallèle.",
        analyticalPrompt: "Quelle copie fait autorité ?",
      },
    ],
    narrativeContext: {
      title: "Signal de Tom — 40 versus 36",
      observation: "Le système indique 40 unités, le comptage physique en observe 36.",
      expected: 40,
      actual: 36,
      unit: "unités",
      analyticalQuestion: "Que révèle l'écart 40 versus 36 ?",
      interpretationConstraint: "Contexte analytique d'observation uniquement.",
    },
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function seedAuthTokens(): void {
  saveStoredTokens({
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
  });
}

function mockOrganizationFetch(
  responder: () => Response | Promise<never>,
): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method ?? "GET").toUpperCase();

    if (url.endsWith("/api/v1/me/organization") && method === "GET") {
      return responder();
    }

    throw new Error(`Unexpected request: ${method} ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderPage(): void {
  render(
    <MemoryRouter initialEntries={["/workspace/apps/erp"]}>
      <OrganizationalErpPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe("organizational ERP page — loading", () => {
  it("shows an accessible loading status before data arrives", async () => {
    seedAuthTokens();
    let resolveFetch: (() => void) | null = null;
    mockOrganizationFetch(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve(
              jsonResponse({
                access: "available",
                unlockExplanation: null,
                organization: buildOrganizationPayload(),
              }),
            );
        }) as unknown as Promise<never>,
    );

    renderPage();

    const status = screen.getByTestId("organization-loading");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("role", "status");
    expect(screen.queryByTestId("organization-company-profile")).not.toBeInTheDocument();

    resolveFetch?.();
    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });
  });
});

describe("organizational ERP page — locked", () => {
  it("shows the unlock explanation without any catalog content or completion UI", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "locked",
        unlockExplanation: {
          code: "premiere-journee-requise",
          title: "Terminez votre première journée",
          description: "Lisez le message de votre gestionnaire et complétez votre tâche.",
        },
        organization: null,
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-locked-state")).toBeInTheDocument();
    });

    expect(screen.getByTestId("organization-unlock-explanation")).toHaveTextContent(
      "Lisez le message de votre gestionnaire",
    );
    expect(screen.queryByTestId("organization-department-directory")).not.toBeInTheDocument();
    expect(screen.queryByTestId("organization-company-profile")).not.toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });
});

describe("organizational ERP page — available", () => {
  it("shows the full read-only organizational experience", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    expect(screen.getByTestId("organization-company-name")).toHaveTextContent("NordHabitat");

    for (const key of DEPARTMENT_KEYS) {
      expect(screen.getByTestId(`organization-department-tab-${key}`)).toHaveTextContent(
        DEPARTMENT_LABELS[key] ?? key,
      );
    }

    expect(
      within(screen.getByTestId("organization-department-detail-dept-direction")).getByText(
        /Responsabilité de Direction/,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("organization-department-tab-dept-ti"));
    await waitFor(() => {
      expect(screen.getByTestId("organization-department-detail-dept-ti")).toBeInTheDocument();
    });

    expect(screen.getByTestId("organization-relationships")).toBeInTheDocument();
    expect(
      screen.getByTestId("organization-relationship-endpoints-rel-ventes-entrepot"),
    ).toHaveTextContent("Ventes → Entrepôt");

    expect(screen.getByTestId("organization-process-awareness")).toBeInTheDocument();
    expect(screen.getByTestId("organization-process-proc-promesse-client")).toBeInTheDocument();

    expect(screen.getByTestId("organization-fragmentation-signals")).toBeInTheDocument();
    expect(
      screen.getByTestId("organization-fragmentation-frag-duplication-tableurs"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("organization-narrative-expected")).toHaveTextContent("40");
    expect(screen.getByTestId("organization-narrative-actual")).toHaveTextContent("36");

    const missionLink = screen.getByTestId("organization-mission-link-cta");
    expect(missionLink).toBeInTheDocument();
    expect(missionLink).toHaveAttribute("href", "/workspace/apps/centre-mission");

    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });

  it("supports keyboard-usable department selection", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-department-tab-dept-finance")).toBeInTheDocument();
    });

    const tab = screen.getByTestId("organization-department-tab-dept-finance");
    tab.focus();
    expect(document.activeElement).toBe(tab);

    fireEvent.click(tab);

    await waitFor(() => {
      expect(screen.getByTestId("organization-department-detail-dept-finance")).toBeInTheDocument();
    });
    expect(tab).toHaveAttribute("aria-pressed", "true");
  });
});

describe("organizational ERP page — empty", () => {
  it("shows a defensive empty state when meaningful collections are unexpectedly empty", async () => {
    seedAuthTokens();
    const payload = buildOrganizationPayload();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: {
          ...payload,
          relationships: [],
          processAwareness: [],
          fragmentationSignals: [],
        },
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("workspace-empty-state")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("organization-company-profile")).not.toBeInTheDocument();
  });
});

const SAFE_SERVER_ERROR_MESSAGE = "Impossible de charger l’organisation NordHabitat. Veuillez réessayer.";
const SAFE_NETWORK_ERROR_MESSAGE =
  "Impossible de charger les informations organisationnelles. Veuillez réessayer.";
const SAFE_MALFORMED_ERROR_MESSAGE =
  "La réponse de l’organisation est invalide. Veuillez réessayer.";

describe("organizational ERP page — error and retry", () => {
  it("shows a French error message with a working retry action", async () => {
    seedAuthTokens();
    let callCount = 0;
    mockOrganizationFetch(() => {
      callCount += 1;
      if (callCount === 1) {
        return jsonResponse(
          { error: { code: "INTERNAL", message: "Erreur serveur.", requestId: "req_test" } },
          500,
        );
      }
      return jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });

    expect(screen.getByTestId("organization-error-message")).toHaveAttribute("role", "alert");
    expect(screen.queryByTestId("organization-error-message")?.textContent).not.toMatch(/stack|trace|at\s+\w+\.\w+/i);

    fireEvent.click(screen.getByTestId("organization-retry-button"));

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    expect(callCount).toBe(2);
  });

  it("shows a safe French message when fetch itself rejects, never the raw exception text", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() => {
      throw new TypeError("Failed to fetch");
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });

    const message = screen.getByTestId("organization-error-message");
    expect(message).toHaveTextContent(SAFE_NETWORK_ERROR_MESSAGE);
    expect(message.textContent ?? "").not.toMatch(/failed to fetch/i);
    expect(screen.getByTestId("organization-retry-button")).toBeInTheDocument();
  });

  it("shows a safe French message on a canonical 500 response, never the English server message", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse(
        {
          error: {
            code: "INTERNAL",
            message: "An unexpected error occurred.",
            requestId: "req_test",
          },
        },
        500,
      ),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });

    const message = screen.getByTestId("organization-error-message");
    expect(message).toHaveTextContent(SAFE_SERVER_ERROR_MESSAGE);
    expect(message.textContent ?? "").not.toMatch(/an unexpected error occurred/i);
  });

  it("shows a safe French message on an arbitrary internal-looking 5xx message", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse(
        {
          error: {
            code: "INTERNAL",
            message: "database connection refused",
            requestId: "req_test",
          },
        },
        503,
      ),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });

    const message = screen.getByTestId("organization-error-message");
    expect(message).toHaveTextContent(SAFE_SERVER_ERROR_MESSAGE);
    expect(message.textContent ?? "").not.toMatch(/database connection refused/i);
  });

  it("shows a safe French message on a malformed response, never parser/schema details", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() => jsonResponse({ access: "unexpected" }));

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });

    const message = screen.getByTestId("organization-error-message");
    expect(message).toHaveTextContent(SAFE_MALFORMED_ERROR_MESSAGE);
    expect(message.textContent ?? "").not.toMatch(/zod|schema|parse|invalid_/i);
  });

  it("performs a new GET and renders the available state after retry following a safe error", async () => {
    seedAuthTokens();
    let callCount = 0;
    const fetchMock = mockOrganizationFetch(() => {
      callCount += 1;
      if (callCount === 1) {
        throw new TypeError("Failed to fetch");
      }
      return jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-error-state")).toBeInTheDocument();
    });
    expect(screen.getByTestId("organization-error-message")).toHaveTextContent(
      SAFE_NETWORK_ERROR_MESSAGE,
    );

    fireEvent.click(screen.getByTestId("organization-retry-button"));

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    expect(callCount).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("organizational ERP page — revisit", () => {
  it("remains evergreen across remounts with no completion or restart semantics", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      }),
    );

    const { unmount } = render(
      <MemoryRouter initialEntries={["/workspace/apps/erp"]}>
        <OrganizationalErpPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    expect(document.body.textContent ?? "").not.toMatch(
      /terminé|complété|félicitations|recommencer|redémarrer/i,
    );

    unmount();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    expect(document.body.textContent ?? "").not.toMatch(
      /terminé|complété|félicitations|recommencer|redémarrer/i,
    );
  });
});

describe("organizational ERP page — accessibility", () => {
  it("uses a single top-level heading and section headings", async () => {
    seedAuthTokens();
    mockOrganizationFetch(() =>
      jsonResponse({
        access: "available",
        unlockExplanation: null,
        organization: buildOrganizationPayload(),
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("organization-company-profile")).toBeInTheDocument();
    });

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(6);

    expect(
      screen.getByRole("link", { name: /Consulter le Centre de mission/i }),
    ).toBeInTheDocument();
  });
});
