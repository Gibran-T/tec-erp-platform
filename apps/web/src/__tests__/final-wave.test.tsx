import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../auth/AuthContext.js";
import { AdminPortalPage } from "../pages/admin/AdminPortalPage.js";
import { AiCoachPage } from "../pages/workspace/AiCoachPage.js";

const studentEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Demo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

describe("Final Wave workspace pages", () => {
  it("shows forbidden state on admin portal for non-admin users", () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <AdminPortalPage />
      </AuthProvider>,
    );

    expect(screen.getByTestId("admin-forbidden")).toHaveTextContent(
      "Acces reserve aux comptes administrateur.",
    );
  });

  it("renders the AI coach disclaimer", () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <AiCoachPage />
      </AuthProvider>,
    );

    expect(screen.getByTestId("ai-coach-disclaimer")).toHaveTextContent(
      "Assistance pedagogique IA",
    );
    expect(screen.getByTestId("ai-coach-disclaimer")).toHaveTextContent(
      "ne modifie jamais vos scores",
    );
  });
});

describe("Certificate verify page", () => {
  it("shows not-found state for unknown tokens", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({ error: { message: "Certificat introuvable." } }),
      })) as typeof fetch,
    );

    const { CertificateVerifyPage } = await import("../pages/public/CertificateVerifyPage.js");

    render(
      <MemoryRouter initialEntries={["/verify/unknown-token"]}>
        <Routes>
          <Route path="/verify/:token" element={<CertificateVerifyPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("certificate-verify-not-found")).toHaveTextContent(
      "Certificat introuvable.",
    );

    vi.unstubAllGlobals();
  });
});
