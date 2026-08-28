import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../../../auth/AuthContext.js";
import { AiDecisionWorkspacePage } from "../AiDecisionWorkspacePage.js";

vi.mock("../../../api/aiCoach.js", () => ({
  askAiCoach: vi.fn(async () => ({
    answer: "Réponse coach test.",
    disclaimer: "IA pédagogique.",
    interactionId: "coach-test-1",
    createdAt: "2026-08-28T12:00:00Z",
  })),
}));

const studentEmployee: AuthenticatedEmployee = {
  id: "emp_demo",
  employeeNumber: "#NHE-DEMO",
  email: "demo.analyste@nordhabitat.ca",
  displayName: "Analyste Demo",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

describe("AiDecisionWorkspacePage", () => {
  it("shows visible AI no-score banner", () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <AiDecisionWorkspacePage />
      </AuthProvider>,
    );

    expect(screen.getByTestId("ai-decision-visible-banner")).toHaveTextContent(
      "n'altère pas les scores",
    );
    expect(screen.getByTestId("ai-decision-visible-banner")).toHaveTextContent("certificats");
  });

  it("requires learner synthesis before closing reflection", () => {
    render(
      <AuthProvider skipRestore initialEmployee={studentEmployee}>
        <AiDecisionWorkspacePage />
      </AuthProvider>,
    );

    const closeButton = screen.getByTestId("ai-decision-close-reflection");
    expect(closeButton).toBeDisabled();
    expect(screen.getByTestId("ai-decision-synthesis-required")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("ai-decision-synthesis"), {
      target: { value: "Synthèse suffisante pour clore." },
    });
    expect(closeButton).toBeEnabled();

    fireEvent.click(closeButton);
    expect(screen.getByTestId("ai-decision-reflection-complete")).toHaveTextContent(
      "aucun impact sur score",
    );
  });
});
