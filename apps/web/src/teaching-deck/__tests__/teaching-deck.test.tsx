import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../../auth/AuthContext.js";
import { LocaleProvider } from "../../i18n/LocaleProvider.js";
import { TEACHING_SESSION_CODES } from "../../sofa/sapCollegeCalendar.js";
import {
  SLIDES_PER_MODULE,
  TEACHING_DECK_CATALOG,
  getTeachingDeck,
} from "../deckCatalog.js";
import { TeachingDeckPage } from "../TeachingDeckPage.js";

const learner: AuthenticatedEmployee = {
  id: "emp_learner",
  employeeNumber: "#NHE-STU",
  email: "student.a.qa@nordhabitat.ca",
  displayName: "Étudiant QA",
  role: "JR_BUSINESS_ANALYST",
  companyName: "NordHabitat",
};

function renderDeck(path: string) {
  return render(
    <AuthProvider skipRestore initialEmployee={learner}>
      <LocaleProvider>
        <MemoryRouter initialEntries={[path]}>
          <TeachingDeckPage />
        </MemoryRouter>
      </LocaleProvider>
    </AuthProvider>,
  );
}

describe("Teaching Deck catalog", () => {
  it("defines 10 SAP Collège sessions with 17 slides each", () => {
    expect(TEACHING_SESSION_CODES).toHaveLength(10);
    expect(SLIDES_PER_MODULE).toBe(17);
    expect(TEACHING_DECK_CATALOG).toHaveLength(10);
    for (const deck of TEACHING_DECK_CATALOG) {
      expect(deck.slides).toHaveLength(17);
      expect(deck.slides.every((slide) => slide.speakerNotes.trim().length > 0)).toBe(true);
    }
    expect(getTeachingDeck("S7")?.sapUnitLabel).toMatch(/Approvisionnement/i);
    expect(getTeachingDeck("S4")?.sapUnitLabel).toMatch(/enregistrement au reporting/i);
  });
});

describe("TeachingDeckPage learner-safe mode", () => {
  it("hides speaker notes unless professor=1", () => {
    renderDeck("/workspace/teaching-deck/S1");
    expect(screen.getByTestId("teaching-deck-page")).toHaveAttribute("data-professor-mode", "false");
    expect(screen.queryByTestId("teaching-deck-speaker-notes")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("teaching-deck-professor-toggle"));
    expect(screen.getByTestId("teaching-deck-speaker-notes")).toBeInTheDocument();
  });

  it("supports keyboard navigation between slides", () => {
    renderDeck("/workspace/teaching-deck/S2");
    expect(screen.getByTestId("teaching-deck-progress")).toHaveTextContent("1 / 17");

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("teaching-deck-progress")).toHaveTextContent("2 / 17");

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByTestId("teaching-deck-progress")).toHaveTextContent("1 / 17");
  });

  it("opens professor notes when query professor=1 is set", () => {
    renderDeck("/workspace/teaching-deck/S3?professor=1");
    expect(screen.getByTestId("teaching-deck-page")).toHaveAttribute("data-professor-mode", "true");
    expect(screen.getByTestId("teaching-deck-speaker-notes")).toBeInTheDocument();
  });
});
