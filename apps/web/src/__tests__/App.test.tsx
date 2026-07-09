import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { ErrorBoundary } from "../components/ErrorBoundary.js";

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

function renderApp(
  initialEntry: string,
  initialEmployee: AuthenticatedEmployee | null,
): void {
  render(
    <ErrorBoundary>
      <AuthProvider skipRestore initialEmployee={initialEmployee}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    </ErrorBoundary>,
  );
}

describe("App routing", () => {
  it("renders the workspace home inside the enterprise shell when authenticated", async () => {
    renderApp("/workspace", demoEmployee);

    expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-shell")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-context-panel")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("workspace-welcome-message")).toBeInTheDocument();
    });
  });

  it("redirects root to workspace for authenticated employees", async () => {
    renderApp("/", demoEmployee);

    await waitFor(() => {
      expect(screen.getByTestId("workspace-home-page")).toBeInTheDocument();
    });
  });

  it("redirects to the sign-in page when unauthenticated", () => {
    renderApp("/workspace", null);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders the not found page for unknown routes when authenticated", () => {
    renderApp("/missing-route", demoEmployee);

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });
});
