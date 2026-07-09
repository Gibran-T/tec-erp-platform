import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

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
  it("renders the home page inside the workplace shell when authenticated", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          timestamp: new Date().toISOString(),
          version: "0.1.0",
          apiVersion: "v1",
          platformVersion: "0.1.0",
        }),
      }),
    );

    renderApp("/", demoEmployee);

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId("tec-app-shell")).toBeInTheDocument();
    expect(screen.getByTestId("first-day-welcome")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("api-health-status")).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });

  it("redirects to the sign-in page when unauthenticated", () => {
    renderApp("/", null);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders the not found page for unknown routes when authenticated", () => {
    renderApp("/missing-route", demoEmployee);

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });
});
