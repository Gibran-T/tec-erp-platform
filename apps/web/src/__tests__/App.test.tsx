import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { ErrorBoundary } from "../components/ErrorBoundary.js";

function renderApp(initialEntry: string): void {
  render(
    <ErrorBoundary>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AppRoutes />
      </MemoryRouter>
    </ErrorBoundary>,
  );
}

describe("App routing", () => {
  it("renders the home page at the root route", async () => {
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

    renderApp("/");

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId("tec-app-shell")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("api-health-status")).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });

  it("renders the not found page for unknown routes", () => {
    renderApp("/missing-route");

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });
});
