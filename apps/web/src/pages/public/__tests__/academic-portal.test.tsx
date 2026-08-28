import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../../../auth/AuthContext.js";
import { LocaleProvider } from "../../../i18n/LocaleProvider.js";
import { AcademicPortalPage } from "../AcademicPortalPage.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";

function renderPortal(): void {
  render(
    <ThemeProvider>
      <AuthProvider skipRestore initialEmployee={null}>
        <LocaleProvider>
          <MemoryRouter>
            <AcademicPortalPage />
          </MemoryRouter>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>,
  );
}

describe("AcademicPortalPage", () => {
  it("renders dual doors for SAP Hub and TEC.ERP lab", () => {
    renderPortal();

    expect(screen.getByTestId("academic-portal")).toBeInTheDocument();
    expect(screen.getByTestId("portal-dual-doors")).toBeInTheDocument();
    expect(screen.getByTestId("portal-door-sap")).toBeInTheDocument();
    expect(screen.getByTestId("portal-door-tec")).toBeInTheDocument();
    expect(screen.getByTestId("portal-door-sap")).toHaveTextContent(/Cours SAP \(Learning Hub\)/);
    expect(screen.getByTestId("portal-door-tec")).toHaveTextContent(/Laboratoire TEC\.ERP \(sofa\)/);
  });

  it("states TEC.ERP is not an SAP clone", () => {
    renderPortal();

    const notice = screen.getByTestId("portal-not-sap-clone");
    expect(notice).toHaveTextContent(/n'est pas un clone SAP/i);
    expect(notice).toHaveTextContent(/NordHabitat/i);
  });

  it("links to TEC.ERP login without calling production APIs", () => {
    renderPortal();

    const loginLink = screen.getByTestId("portal-login-link");
    expect(loginLink).toHaveAttribute("href", "/login");

    const sapLink = screen.getByTestId("portal-sap-hub-link");
    expect(sapLink).toHaveAttribute("href", "https://learning.sap.com/students");
    expect(sapLink).toHaveAttribute("target", "_blank");
    expect(sapLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("labels playback portal as visual prototype only", () => {
    renderPortal();

    const prototypeLink = screen.getByTestId("portal-prototype-link");
    expect(prototypeLink).toHaveAttribute("href", "/playback/v2/portal");
    expect(prototypeLink).toHaveTextContent(/Prototype visuel uniquement/i);
  });
});
