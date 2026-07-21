import { describe, expect, it } from "vitest";

import { evaluateGoldEligibility } from "../certification.service.js";

describe("gold eligibility gate", () => {
  it("requires all missions, gold assessment, capstone approval and professor flag", () => {
    const allKeys = new Set([
      "m1-m01-decouvrir-entreprise",
      "m1-m02-connecter-departements",
      "m1-m03-diagnostiquer-preparation",
      "m2-m01-structurer-organisation",
      "m2-m02-creer-donnees-reference",
      "m2-m03-corriger-qualite-donnees",
      "m3-m01-identifier-besoin-achat",
      "m3-m02-creer-traiter-commande-achat",
      "m3-m03-receptionner-analyser-fournisseur",
      "m4-m01-saisir-commande-institutionnelle",
      "m4-m02-allocation-inter-entrepots",
      "m4-m03-confirmer-livraison-cloture",
      "m5-m01-analyser-stock-reappro",
      "m5-m02-decision-transfert-inter-dc",
      "m5-m03-presentation-sop",
      "m6-m01-reception-facture",
      "m6-m02-exception-rapprochement-trois-voies",
      "m6-m03-expliquer-ecart-finance",
      "m7-m01-ouvrir-dossier-client",
      "m7-m02-coordonner-escalade",
      "m7-m03-cloturer-cas-nps",
      "m8-m01-matrice-approbation-pression",
      "m8-m02-revue-acces-sod",
      "m8-m03-autoevaluation-probation",
      "m9-m01-atelier-definition-kpi",
      "m9-m02-tableau-bord-comite",
      "m9-m03-analyse-concurrentielle-ia",
      "m10-m01-diapositive-conseil",
      "m10-m02-defi-final-equinoxe",
      "m10-m03-presentation-capstone-or",
    ]);

    const eligible = evaluateGoldEligibility({
      completedMissionKeys: allKeys,
      goldAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
    });
    expect(eligible.eligible).toBe(true);

    const blocked = evaluateGoldEligibility({
      completedMissionKeys: allKeys,
      goldAssessmentPassed: false,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
    });
    expect(blocked.eligible).toBe(false);
    expect(blocked.reasons.some((reason) => reason.includes("GOLD_M7_M10"))).toBe(true);
  });
});
