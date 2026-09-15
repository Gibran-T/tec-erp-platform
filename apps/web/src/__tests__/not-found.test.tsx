import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NotFoundPage } from "../pages/NotFoundPage.js";

describe("NotFoundPage", () => {
  it("renders a safe French not-found view with a single top-level heading", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const page = screen.getByTestId("not-found-page");
    expect(page).toHaveTextContent("Page introuvable");
    expect(page).toHaveTextContent("n’existe pas dans l’espace institutionnel");
    expect(page.textContent ?? "").not.toMatch(/page not found|does not exist|return home/i);
    expect(page.textContent ?? "").not.toMatch(/The learning content has been updated/i);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Retour au parcours" })).toHaveAttribute(
      "href",
      "/workspace/apps/parcours-sap-iee2e",
    );
    expect(screen.getByRole("link", { name: "Retour à l’accueil" })).toHaveAttribute(
      "href",
      "/workspace",
    );
  });
});
