import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { SapIee2ePocApp } from "../SapIee2ePocApp.js";
import {
  OFFICIAL_TOTAL_DURATION_LABEL,
  OFFICIAL_UNIT_COUNT,
  SAP_IEE2E_OFFICIAL_FR_URL,
  SAP_IEE2E_OFFICIAL_TITLE,
} from "../officialCourse.js";

function renderPoc(): void {
  render(
    <MemoryRouter initialEntries={["/poc/sap-iee2e"]}>
      <Routes>
        <Route path="/poc/sap-iee2e" element={<SapIee2ePocApp />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PoC SAP IEE2E (Étape A)", () => {
  it("affiche le workspace étudiant avec le card parcours SAP", () => {
    renderPoc();
    expect(screen.getByTestId("sap-iee2e-poc-root")).toBeInTheDocument();
    expect(screen.getByTestId("poc-discovery-card")).toHaveTextContent("Réception SAP");
    expect(screen.getByText(SAP_IEE2E_OFFICIAL_TITLE)).toBeInTheDocument();
    expect(screen.getByText(/Progression déclarée par l’étudiant/i)).toBeInTheDocument();
    expect(screen.getByTestId("poc-sap-launchpad")).toBeInTheDocument();
    expect(screen.queryByTestId("poc-semaine-zero")).not.toBeInTheDocument();
  });

  it("ouvre le parcours avec lien officiel FR et disclaimer", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Continuer mon parcours" }));
    const link = screen.getByTestId("poc-official-sap-link");
    expect(link).toHaveAttribute("href", SAP_IEE2E_OFFICIAL_FR_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getAllByText(new RegExp(OFFICIAL_TOTAL_DURATION_LABEL)).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByTestId("poc-unit-timeline").querySelectorAll("li")).toHaveLength(
      OFFICIAL_UNIT_COUNT,
    );
    expect(
      screen.getByText(/gérés par SAP Learning/i),
    ).toBeInTheDocument();
  });

  it("permet de déclarer l’Achievement sans validation TEC.ERP", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Mon parcours SAP" }));
    const milestone = screen.getByTestId("poc-achievement-milestone");
    fireEvent.click(within(milestone).getByRole("button", { name: "Obtenu — déclaré" }));
    expect(milestone).toHaveAttribute("data-state", "obtenu_declare");
    expect(milestone).toHaveTextContent(/n’émet pas/i);
  });

  it("expose le Comfort Pack professeur avec filtre À accompagner", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Suivi professeur" }));
    expect(screen.getByTestId("poc-kpi-strip")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("poc-filter-support"));
    expect(screen.getAllByText("Camille Tremblay").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Émile Gagnon")).toHaveLength(0);
  });

  it("affiche la préparation de séance modèle complète", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Préparation de séance" }));
    expect(screen.getByTestId("poc-session-prep")).toHaveTextContent("Préparation de séance 3");
    expect(screen.getByTestId("poc-teach-guide")).toHaveTextContent(
      "Si les structures sont fausses, tous les processus mentent.",
    );
    expect(screen.getByText(/Checklist de clôture/i)).toBeInTheDocument();
    expect(screen.getByText(/Séquence recommandée/i)).toBeInTheDocument();
  });

  it("permet de parcourir les dix séances du Comfort Pack", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Préparation de séance" }));
    fireEvent.click(screen.getByTestId("poc-session-tab-1"));
    expect(screen.getByTestId("poc-session-prep")).toHaveTextContent("Préparation de séance 1");
    expect(screen.getByText(/Voir l’entreprise comme un système intégré/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("poc-session-tab-10"));
    expect(screen.getByTestId("poc-session-prep")).toHaveTextContent("Préparation de séance 10");
    expect(
      screen.getByText(/Servir le client et consolider la vision transversale/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("poc-teach-guide")).toHaveTextContent(
      "Deux preuves, deux émetteurs",
    );
  });

  it("expose les règles d’or pour enseigner le parcours SAP", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Suivi professeur" }));
    expect(screen.getByTestId("poc-golden-rules")).toHaveTextContent(
      "SAP enseigne (contenu, quiz, Achievement). Vous médiez la cohorte.",
    );
  });

  it("bascule Clair / Sombre sans erreur", () => {
    renderPoc();
    const root = screen.getByTestId("sap-iee2e-poc-root");
    fireEvent.click(screen.getByTestId("poc-theme-dark"));
    expect(root).toHaveAttribute("data-poc-theme", "dark");
    fireEvent.click(screen.getByTestId("poc-theme-light"));
    expect(root).toHaveAttribute("data-poc-theme", "light");
  });

  it("en mode intégré, ouvre le parcours sans l’accueil fictif", () => {
    render(
      <MemoryRouter initialEntries={["/workspace/apps/parcours-sap-iee2e"]}>
        <Routes>
          <Route
            path="/workspace/apps/parcours-sap-iee2e"
            element={<SapIee2ePocApp embedded audience="student" initialView="parcours" />}
          />
        </Routes>
      </MemoryRouter>,
    );
    const root = screen.getByTestId("sap-iee2e-poc-root");
    expect(root).toHaveAttribute("data-embedded", "true");
    expect(screen.queryByRole("button", { name: "Espace de travail" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: SAP_IEE2E_OFFICIAL_TITLE })).toBeInTheDocument();
    expect(screen.getByTestId("poc-sap-reception")).toBeInTheDocument();
    expect(screen.getAllByText(/vérité officielle sur SAP Learning/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Suivi professeur" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Préparation de séance" })).not.toBeInTheDocument();
  });

  it("en mode professeur intégré, ouvre le suivi de cohorte", () => {
    render(
      <MemoryRouter initialEntries={["/workspace/apps/parcours-sap-iee2e"]}>
        <Routes>
          <Route
            path="/workspace/apps/parcours-sap-iee2e"
            element={<SapIee2ePocApp embedded audience="professor" initialView="professeur" />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Suivi SAP IEE2E" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Préparation de séance" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Espace de travail" })).not.toBeInTheDocument();
    expect(screen.getByTestId("poc-semaine-zero")).toBeInTheDocument();
    expect(screen.getByTestId("poc-session1-date")).toBeInTheDocument();
    expect(screen.getByTestId("poc-semaine-zero-pending")).toHaveTextContent("Sofia Benali");
  });

  it("affiche la Semaine Zéro dans le parcours étudiant", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Mon parcours SAP" }));
    const panel = screen.getByTestId("poc-semaine-zero");
    expect(panel).toHaveTextContent(/Préparer l’accès SAP individuel/i);
    expect(panel).toHaveAttribute("data-urgent", "false");
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /Je m’engage à ne jamais utiliser le compte d’un camarade/i,
      }),
    );
    expect(panel).toHaveAttribute("data-urgent", "true");
    expect(panel).toHaveTextContent(/Semaine Zéro incomplète/i);
  });
});
