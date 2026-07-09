import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { WORKSPACE_APPS } from "../workspace/appRegistry.js";

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

describe("employee identity from session", () => {
  it("renders employee identity from session data in the badge", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("employee-identity")).toHaveTextContent("Analyste Démo");
    });

    expect(screen.getByTestId("employee-identity")).toHaveTextContent("#NHE-DEMO");
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
  it("renders expected apps in the sidebar and app launcher", async () => {
    renderWorkspace("/workspace");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-app-launcher")).toBeInTheDocument();
    });

    for (const app of WORKSPACE_APPS) {
      expect(screen.getByTestId(`workspace-sidebar-link-${app.id}`)).toHaveTextContent(app.label);
    }

    const launcherApps = WORKSPACE_APPS.filter((app) => app.id !== "accueil");
    for (const app of launcherApps) {
      expect(screen.getByTestId(`workspace-app-tile-${app.id}`)).toBeInTheDocument();
    }
  });

  it("renders honest empty states on placeholder app pages", async () => {
    renderWorkspace("/workspace/apps/boite-reception");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-empty-state")).toBeInTheDocument();
    });

    expect(screen.getByTestId("workspace-empty-state")).toHaveTextContent(
      "Votre boîte de réception est vide",
    );
  });

  it("shows preparing access badge for restricted apps", async () => {
    renderWorkspace("/workspace/apps/erp");

    await waitFor(() => {
      expect(screen.getByTestId("workspace-empty-state-badge")).toHaveTextContent(
        "Accès en préparation",
      );
    });
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
