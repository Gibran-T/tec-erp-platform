import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";
import { ErrorBoundary } from "../components/ErrorBoundary.js";
import { LocaleProvider } from "../i18n/LocaleProvider.js";
import { ThemeProvider } from "../theme/ThemeProvider.js";

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
      <ThemeProvider>
        <AuthProvider skipRestore initialEmployee={initialEmployee}>
          <LocaleProvider>
            <MemoryRouter initialEntries={[initialEntry]}>
              <AppRoutes />
            </MemoryRouter>
          </LocaleProvider>
        </AuthProvider>
      </ThemeProvider>
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

  it("renders the academic portal at root for authenticated employees", async () => {
    renderApp("/", demoEmployee);

    await waitFor(() => {
      expect(screen.getByTestId("academic-portal")).toBeInTheDocument();
    });

    expect(screen.getByTestId("portal-authenticated-banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Aller au poste de travail" })).toHaveAttribute(
      "href",
      "/workspace",
    );
  });

  it("renders the academic portal at root when unauthenticated", () => {
    renderApp("/", null);

    expect(screen.getByTestId("academic-portal")).toBeInTheDocument();
    expect(screen.queryByTestId("portal-authenticated-banner")).not.toBeInTheDocument();
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
