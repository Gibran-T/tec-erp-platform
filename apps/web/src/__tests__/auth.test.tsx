import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppRoutes } from "../App.js";
import { AuthProvider } from "../auth/AuthContext.js";

const FORBIDDEN_VOCABULARY = /\b(course|lms|simulation|learner|student)\b/i;

const demoEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Démo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

const healthPayload = {
  status: "ok",
  timestamp: new Date().toISOString(),
  version: "0.1.0",
  apiVersion: "v1",
  platformVersion: "0.1.0",
};

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe("sign-in experience", () => {
  it("renders the employee sign-in page", () => {
    render(
      <AuthProvider skipRestore initialEmployee={null}>
        <MemoryRouter initialEntries={["/login"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByLabelText("Courriel professionnel")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("signs the employee in and lands on the first-day workspace", async () => {
    const loginResponse = {
      employee: demoEmployee,
      tokens: {
        accessToken: "access.token.value",
        refreshToken: "refresh.token.value",
        accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
        refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/v1/auth/login")) {
          return { ok: true, json: async () => loginResponse } as Response;
        }
        return { ok: true, json: async () => healthPayload } as Response;
      }),
    );

    render(
      <AuthProvider skipRestore initialEmployee={null}>
        <MemoryRouter initialEntries={["/login"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText("Courriel professionnel"), {
      target: { value: demoEmployee.email },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "Bienvenue2025!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(screen.getByTestId("first-day-welcome-message")).toHaveTextContent(
        "Bienvenue chez NordHabitat. Aujourd'hui est votre premier jour.",
      );
    });

    expect(screen.getByTestId("employee-identity")).toHaveTextContent("#NHE-DEMO");
  });
});

describe("employee-facing vocabulary", () => {
  it("keeps the sign-in page free of academic / LMS vocabulary", () => {
    render(
      <AuthProvider skipRestore initialEmployee={null}>
        <MemoryRouter initialEntries={["/login"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });

  it("keeps the authenticated workspace free of academic / LMS vocabulary", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => healthPayload }) as Response),
    );

    render(
      <AuthProvider skipRestore initialEmployee={demoEmployee}>
        <MemoryRouter initialEntries={["/"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    expect(document.body.textContent ?? "").not.toMatch(FORBIDDEN_VOCABULARY);
  });
});
