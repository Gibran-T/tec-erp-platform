import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../../../auth/AuthContext.js";
import { BiStudioPage } from "../BiStudioPage.js";

vi.mock("../../../api/analytics.js", () => ({
  getAnalyticsDashboards: vi.fn(async () => ({
    dashboards: [{ id: "main", title: "Tableau opérationnel", description: "" }],
    summaryText: "Résumé test BI Studio.",
    generatedAt: "2026-08-28T12:00:00Z",
  })),
  getAnalyticsKpis: vi.fn(async () => ({
    kpis: [
      {
        key: "fill-rate",
        label: "Taux de service",
        value: 72,
        unit: "%",
        trend: "down" as const,
        stale: false,
        formattedValue: "72 %",
      },
    ],
  })),
  getAnalyticsExceptions: vi.fn(async () => ({ exceptions: [] })),
}));

const studentEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Demo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

describe("BiStudioPage", () => {
  it("renders the interpretation path steps", async () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <BiStudioPage />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("bi-studio-page")).toBeInTheDocument();
    expect(screen.getByTestId("bi-studio-path-steps")).toBeInTheDocument();
    expect(screen.getByText("Observer")).toBeInTheDocument();
    expect(screen.getByText("Filtrer")).toBeInTheDocument();
    expect(screen.getByText("Comparer")).toBeInTheDocument();
    expect(screen.getByText("Expliquer")).toBeInTheDocument();
    expect(screen.getByText("Diagnostiquer")).toBeInTheDocument();
    expect(screen.getByText("Recommander")).toBeInTheDocument();
  });

  it("labels forecast points as forecast, not fact", async () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <BiStudioPage />
      </AuthProvider>,
    );

    await screen.findByTestId("bi-studio-forecast");
    expect(screen.getByTestId("bi-studio-forecast-badge")).toHaveTextContent("Prévision — pas un fait");
    expect(screen.getByTestId("bi-studio-forecast-disclaimer")).toHaveTextContent("prévisions pédagogiques");
    expect(screen.getAllByText(/Prévision — pas un fait/)).not.toHaveLength(0);
  });

  it("distinguishes NordHabitat lab from SAP course sources", async () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <BiStudioPage />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("bi-studio-source-lab")).toHaveTextContent("Lab NordHabitat");
    });
    expect(screen.getByTestId("bi-studio-source-sap")).toHaveTextContent("Parcours SAP");
  });
});
