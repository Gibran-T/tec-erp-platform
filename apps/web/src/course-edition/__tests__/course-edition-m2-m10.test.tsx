import { describe, expect, it } from "vitest";

import {
  COURSE_EDITION_MODULE_CODES,
  getCourseEditionPack,
  listCourseEditionPacks,
} from "../content/index.js";

const EXPECTED_V2_MISSION_KEYS: Readonly<Record<string, readonly string[]>> = {
  M1: [
    "m1-m01-decouvrir-entreprise",
    "m1-m02-connecter-departements",
    "m1-m03-diagnostiquer-preparation",
  ],
  M2: [
    "m2-m01-structurer-organisation",
    "m2-m02-creer-donnees-reference",
    "m2-m03-corriger-qualite-donnees",
  ],
  M3: [
    "m3-m01-identifier-besoin-achat",
    "m3-m02-creer-traiter-commande-achat",
    "m3-m03-receptionner-analyser-fournisseur",
  ],
  M4: [
    "m4-m01-saisir-commande-institutionnelle",
    "m4-m02-allocation-inter-entrepots",
    "m4-m03-confirmer-livraison-cloture",
  ],
  M5: [
    "m5-m01-analyser-stock-reappro",
    "m5-m02-decision-transfert-inter-dc",
    "m5-m03-presentation-sop",
  ],
  M6: [
    "m6-m01-reception-facture",
    "m6-m02-exception-rapprochement-trois-voies",
    "m6-m03-expliquer-ecart-finance",
  ],
  M7: [
    "m7-m01-ouvrir-dossier-client",
    "m7-m02-coordonner-escalade",
    "m7-m03-cloturer-cas-nps",
  ],
  M8: [
    "m8-m01-integrer-nouvel-employe",
    "m8-m02-gerer-temps-absences",
    "m8-m03-evaluer-competences-evolution",
  ],
  M9: [
    "m8-m01-matrice-approbation-pression",
    "m8-m02-revue-acces-sod",
    "m8-m03-autoevaluation-probation",
  ],
  M10: [
    "m9-m01-atelier-definition-kpi",
    "m9-m02-tableau-bord-comite",
    "m9-m03-analyse-concurrentielle-ia",
  ],
};

const SURFACE_IDS = ["apprendre", "connecter", "missions", "bilan"] as const;

describe("Course Edition M2–M10 packs", () => {
  it("exposes ten packs via registry (M1–M10)", () => {
    const packs = listCourseEditionPacks();
    expect(packs).toHaveLength(10);
    expect(COURSE_EDITION_MODULE_CODES).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
    ]);
    for (const code of COURSE_EDITION_MODULE_CODES) {
      expect(getCourseEditionPack(code)?.moduleCode).toBe(code);
    }
  });

  it.each(COURSE_EDITION_MODULE_CODES.filter((code) => code !== "M1"))(
    "%s pack has four surfaces, missions, lab, quiz and professor notes",
    (moduleCode) => {
      const pack = getCourseEditionPack(moduleCode)!;
      expect(pack).not.toBeNull();

      expect(pack.surfaces.map((surface) => surface.id)).toEqual([...SURFACE_IDS]);
      expect(pack.visualFrames.length).toBeGreaterThanOrEqual(4);
      expect(pack.glossary.length).toBeGreaterThanOrEqual(3);
      expect(pack.documents.length).toBeGreaterThanOrEqual(1);
      expect(pack.quiz.length).toBeGreaterThanOrEqual(3);
      expect(pack.professorNotes.length).toBeGreaterThanOrEqual(3);

      const notesText = pack.professorNotes.join(" ").toLowerCase();
      expect(notesText).toContain("sap");
      expect(notesText).toContain("tec.erp");
      expect(notesText).toContain("nordhabitat");

      expect(pack.connectionLab.activities).toHaveLength(2);
      expect(pack.connectionLab.activities.some((a) => a.interaction.type === "ORDERING")).toBe(
        true,
      );
      expect(
        pack.connectionLab.activities.some(
          (a) =>
            a.interaction.type === "SINGLE_CHOICE" || a.interaction.type === "MULTI_CHOICE",
        ),
      ).toBe(true);
    },
  );

  it.each(COURSE_EDITION_MODULE_CODES.filter((code) => code !== "M1"))(
    "%s has three missions with distinct roles and V2 keys",
    (moduleCode) => {
      const pack = getCourseEditionPack(moduleCode)!;
      expect(pack.missions).toHaveLength(3);

      const roles = pack.missions.map((mission) => mission.role);
      expect(new Set(roles).size).toBe(3);
      expect(roles[0]?.toLowerCase()).toContain("comprendre");
      expect(roles[1]?.toLowerCase()).toContain("exécuter");
      expect(roles[2]?.toLowerCase()).toContain("décider");

      const keys = pack.missions.map((mission) => mission.missionKey);
      expect(keys).toEqual(EXPECTED_V2_MISSION_KEYS[moduleCode]);

      for (let index = 0; index < 3; index += 1) {
        expect(pack.missions[index]?.missionCode).toBe(`${moduleCode}-M0${index + 1}`);
      }
    },
  );

  it("returns null for unknown module codes", () => {
    expect(getCourseEditionPack("M11")).toBeNull();
    expect(getCourseEditionPack("")).toBeNull();
  });
});
