import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../../App.js";
import { saveStoredTokens } from "../../api/auth.js";
import { AuthProvider } from "../../auth/AuthContext.js";
import { M1_DOCUMENTS } from "../content/m1/documents.js";
import { emptyProgress, loadCourseEditionProgress, saveCourseEditionProgress } from "../progress.js";

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

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

function renderCourseEdition(path: string) {
  saveStoredTokens(buildTestTokens());
  return render(
    <AuthProvider skipRestore initialEmployee={demoEmployee}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("Course Edition M1 golden path", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/v1/me/course-edition/")) {
          return jsonResponse({ progress: null });
        }
        if (url.includes("/pedagogical-course-runs")) {
          return jsonResponse([]);
        }
        if (url.includes("/api/v1/me/first-day") || url.includes("/inbox") || url.includes("/tasks")) {
          return jsonResponse({ items: [], messages: [], tasks: [] });
        }
        if (url.includes("/api/v1/me/missions")) {
          return jsonResponse({ missions: [] });
        }
        return jsonResponse({ employee: demoEmployee });
      }),
    );
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("navigates CourseLearningSurface across the four surfaces", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/apprendre");

    expect(await screen.findByTestId("course-learning-surface")).toBeInTheDocument();
    expect(screen.getByTestId("course-surface-apprendre")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("course-surface-nav-connecter"));
    expect(await screen.findByTestId("course-surface-connecter")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("course-surface-nav-missions"));
    expect(await screen.findByTestId("course-surface-missions")).toBeInTheDocument();
    expect(screen.getByTestId("course-mission-M1-M01")).toBeInTheDocument();
    expect(screen.getByTestId("course-mission-M1-M02")).toBeInTheDocument();
    expect(screen.getByTestId("course-mission-M1-M03")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("course-surface-nav-bilan"));
    expect(await screen.findByTestId("course-surface-bilan")).toBeInTheDocument();
    expect(screen.getByTestId("mission-bilan")).toBeInTheDocument();
    expect(screen.getByTestId("module-consolidation")).toBeInTheDocument();
  });

  it("renders eight professional visual frames without gray placeholders", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/apprendre");
    await screen.findByTestId("course-surface-apprendre");
    expect(screen.getByTestId("visual-learning-frame")).toBeInTheDocument();
    expect(screen.getByTestId("visual-learning-frame-progress")).toHaveTextContent("1 / 8");
    expect(screen.getByTestId("visual-learning-frame-html")).toBeInTheDocument();
    expect(screen.queryByTestId("visual-learning-frame-placeholder")).not.toBeInTheDocument();
    expect(screen.getByTestId("visual-learning-frame-asset-slot")).toBeInTheDocument();
  });

  it("renders BusinessDocumentView with NordHabitat coherent references", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/apprendre");
    await screen.findByTestId("course-surface-apprendre");

    fireEvent.click(screen.getByTestId("apprendre-open-doc-doc-inventory-signal"));
    const doc = await screen.findByTestId("business-document-view");
    expect(within(doc).getByTestId("business-document-title")).toHaveTextContent(
      "Signal d’écart d’inventaire",
    );
    expect(within(doc).getByTestId("business-document-reference")).toHaveTextContent(
      M1_DOCUMENTS.find((item) => item.id === "doc-inventory-signal")!.reference,
    );
    expect(doc).toHaveTextContent("NordHabitat");
    expect(doc).toHaveTextContent("40");
    expect(doc).toHaveTextContent("36");
  });

  it("scores Connection Lab and shows authored summary feedback", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/connecter");
    await screen.findByTestId("connection-lab");

    const pairs: Array<[string, string]> = [
      ["obj-erp", "def-lecture-partagee"],
      ["dept-entrepot", "resp-signal-terrain"],
      ["err-4036", "cons-fragmentation"],
      ["kpi-inv-acc", "interp-risque-service"],
    ];
    for (const [left, right] of pairs) {
      fireEvent.change(screen.getByTestId("mission-diag-left-lab-matching"), {
        target: { value: left },
      });
      fireEvent.change(screen.getByTestId("mission-diag-right-lab-matching"), {
        target: { value: right },
      });
      fireEvent.click(screen.getByTestId("mission-diag-add-lab-matching"));
    }

    fireEvent.change(screen.getByTestId("mission-numeric-lab-numeric"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByTestId("mission-text-lab-justification"), {
      target: {
        value:
          "La fragmentation d’inventaire entre départements empêche une lecture partagée fiable.",
      },
    });

    fireEvent.click(screen.getByTestId("connection-lab-submit"));
    const feedback = await screen.findByTestId("connection-lab-feedback");
    expect(feedback).toHaveTextContent("Seuil atteint");
    expect(feedback).toHaveTextContent("Relations correctes");
    expect(feedback).toHaveTextContent("Implication systémique");
    expect(feedback).toHaveTextContent("Amélioration");
  });

  it("preserves Course Edition progress in local storage", () => {
    const initial = emptyProgress("M1");
    saveCourseEditionProgress({
      ...initial,
      completedSurfaces: ["apprendre", "connecter"],
      connectionLabPassed: true,
      connectionLabScorePercent: 85,
    });
    const loaded = loadCourseEditionProgress("M1");
    expect(loaded.completedSurfaces).toEqual(["apprendre", "connecter"]);
    expect(loaded.connectionLabPassed).toBe(true);
    expect(loaded.connectionLabScorePercent).toBe(85);
  });

  it("renders Bilan KPI card via existing KpiExplainedCard", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/bilan");
    expect(await screen.findByTestId("mission-bilan-kpi-card")).toBeInTheDocument();
    expect(screen.getByTestId("mission-bilan-consequence")).toHaveTextContent("fragmentation");
    expect(screen.getByTestId("module-consolidation")).toBeInTheDocument();
  });

  it("completes consolidation quiz and records progress", async () => {
    renderCourseEdition("/workspace/modules/M1/course-edition/bilan");
    await screen.findByTestId("module-consolidation");

    for (const id of ["q1", "q2", "q3", "q4", "q5", "q6", "q7"]) {
      const correct =
        id === "q1"
          ? "b"
          : id === "q2"
            ? "c"
            : id === "q3"
              ? "b"
              : id === "q4"
                ? "c"
                : id === "q5"
                  ? "b"
                  : id === "q6"
                    ? "b"
                    : "b";
      fireEvent.click(screen.getByTestId(`module-consolidation-choice-${id}-${correct}`));
    }

    fireEvent.click(screen.getByTestId("module-consolidation-submit"));
    expect(await screen.findByTestId("module-consolidation-result")).toHaveTextContent("Réussi");
    expect(loadCourseEditionProgress("M1").quizPassed).toBe(true);
  });
});
