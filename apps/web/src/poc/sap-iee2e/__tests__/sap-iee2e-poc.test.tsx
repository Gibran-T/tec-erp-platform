import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { SapIee2ePocApp } from "../SapIee2ePocApp.js";
import {
  OFFICIAL_TOTAL_DURATION_LABEL,
  OFFICIAL_UNIT_COUNT,
  SAP_IEE2E_OFFICIAL_FR_URL,
  SAP_IEE2E_OFFICIAL_TITLE,
  SAP_OFFICIAL_LAUNCH_LABEL,
} from "../officialCourse.js";

const SAP_UNIT1_LESSON_TITLES = [
  "Identification des processus de gestion à l’aide de l’exemple d’une société Bike Company",
  "Mappage des solutions SAP aux processus de gestion",
  "Alignement des processus de gestion avec SAP Best Practices",
] as const;

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
    expect(screen.getAllByText(/Progression déclarée/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("poc-sap-launchpad")).toBeInTheDocument();
    expect(screen.queryByTestId("poc-semaine-zero")).not.toBeInTheDocument();
  });

  it("expose les étapes institutionnelles S1–S10 sans promettre une certification SAP", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Mon parcours SAP" }));
    const stages = screen.getByTestId("sap-suite-stages");
    expect(stages).toHaveTextContent("S1");
    expect(stages).toHaveTextContent("S10");
    expect(stages).toHaveTextContent(/Description de SAP Business Suite/i);
    expect(stages).toHaveTextContent(/focalisation sur le service/i);
    expect(stages).toHaveTextContent(/pas une dixième unité SAP/i);
    expect(screen.getByTestId("sap-suite-evidence")).toHaveTextContent(/Aucun mot de passe/i);
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
    expect(screen.getByTestId("sap-sofa-orientation")).toHaveTextContent(/Trois preuves/i);
    expect(screen.getByTestId("sap-sofa-orientation")).toHaveTextContent(/Deux tentatives/i);
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
    fireEvent.click(screen.getByRole("button", { name: "Tableau de bord professeur" }));
    expect(screen.getByTestId("poc-kpi-strip")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("poc-filter-support"));
    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Camille Tremblay").length).toBeGreaterThan(0);
    expect(within(table).queryAllByText("Émile Gagnon")).toHaveLength(0);
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
    fireEvent.click(screen.getByRole("button", { name: "Tableau de bord professeur" }));
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
    expect(screen.queryByRole("button", { name: "Tableau de bord professeur" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Préparation de séance" })).not.toBeInTheDocument();
  });

  it("en mode professeur intégré avec cohorte vide, affiche l’état institutionnel", () => {
    render(
      <MemoryRouter initialEntries={["/workspace/apps/parcours-sap-iee2e"]}>
        <Routes>
          <Route
            path="/workspace/apps/parcours-sap-iee2e"
            element={
              <SapIee2ePocApp
                embedded
                audience="professor"
                initialView="professeur"
                liveCohort
                cohortRows={[]}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("sap-professor-empty-cohort")).toHaveTextContent(
      /Aucune personne inscrite/i,
    );
    expect(screen.queryByText(/NordHabitat|M1–M10|30 missions/i)).not.toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: /Suivi de la cohorte/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Préparation de séance" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Espace de travail" })).not.toBeInTheDocument();
    expect(screen.getByTestId("poc-semaine-zero")).toBeInTheDocument();
    expect(screen.getByTestId("poc-session1-date")).toBeInTheDocument();
    expect(screen.getByTestId("poc-semaine-zero-pending")).toHaveTextContent("Sofia Benali");
  });

  it("affiche la grille S1–S10 et le filtre accès non confirmé", () => {
    renderPoc();
    fireEvent.click(screen.getByRole("button", { name: "Tableau de bord professeur" }));
    expect(screen.getByTestId("sap-professor-stage-grid")).toHaveTextContent("S1");
    expect(screen.getByTestId("sap-professor-stage-grid")).toHaveTextContent("S10");
    fireEvent.click(screen.getByTestId("poc-filter-no-access"));
    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Sofia Benali").length).toBeGreaterThan(0);
    expect(within(table).queryAllByText("Camille Tremblay")).toHaveLength(0);
  });

  it("permet au professeur de basculer vers l’aperçu du parcours", () => {
    const onPreview = vi.fn();
    render(
      <MemoryRouter initialEntries={["/workspace/apps/parcours-sap-iee2e"]}>
        <Routes>
          <Route
            path="/workspace/apps/parcours-sap-iee2e"
            element={
              <SapIee2ePocApp
                embedded
                audience="professor"
                initialView="professeur"
                allowStudentPreview
                onPreviewStudent={onPreview}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("sap-professor-preview-student"));
    expect(onPreview).toHaveBeenCalledTimes(1);
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

  it("n’ouvre que l’URL officielle SAP Learning, y compris depuis S1 et l’unité 1", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    render(
      <MemoryRouter initialEntries={["/workspace/apps/parcours-sap-iee2e"]}>
        <Routes>
          <Route
            path="/workspace/apps/parcours-sap-iee2e"
            element={
              <SapIee2ePocApp
                embedded
                audience="student"
                initialView="parcours"
                officialUrl={`${SAP_IEE2E_OFFICIAL_FR_URL}/${null as unknown as string}`}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const launches = screen.getAllByRole("link").filter((node) =>
      node.getAttribute("data-sap-official-launch"),
    );
    expect(launches.length).toBeGreaterThan(10);
    for (const link of launches) {
      expect(link).toHaveAttribute("href", SAP_IEE2E_OFFICIAL_FR_URL);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link.getAttribute("href")).not.toMatch(/\/null/);
    }

    const s1Launch = screen.getByTestId("sap-stage-s1-official-launch");
    expect(s1Launch).toHaveTextContent(SAP_OFFICIAL_LAUNCH_LABEL);
    expect(s1Launch).toHaveAttribute("href", SAP_IEE2E_OFFICIAL_FR_URL);

    const unit1 = screen.getByTestId("sap-official-unit-1");
    expect(unit1).toHaveTextContent(/Unité 1/i);
    expect(screen.getByTestId("sap-unit-1-official-launch")).toHaveAttribute(
      "href",
      SAP_IEE2E_OFFICIAL_FR_URL,
    );

    for (const title of SAP_UNIT1_LESSON_TITLES) {
      const hits = screen.queryAllByText(title);
      for (const hit of hits) {
        const anchor = hit.closest("a");
        if (anchor) {
          expect(anchor).toHaveAttribute("href", SAP_IEE2E_OFFICIAL_FR_URL);
          expect(anchor.getAttribute("href")).not.toMatch(/\/null/);
        }
      }
    }

    const sapHrefs = [...screen.getAllByRole("link")]
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.includes("learning.sap.com"));
    expect(sapHrefs.every((href) => href === SAP_IEE2E_OFFICIAL_FR_URL)).toBe(true);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
