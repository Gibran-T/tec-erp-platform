import { describe, expect, it } from "vitest";

import {
  ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE,
  OrganizationAccessSchema,
  OrganizationPayloadSchema,
  OrganizationResponseSchema,
} from "../organization.js";

const sampleDepartment = {
  key: "dept-entrepot",
  label: "Entrepôt",
  shortDescription: "Gère les stocks physiques et les observations terrain.",
  responsibilities: ["Compter et localiser les stocks physiques."],
  processContributions: ["Fournit l’observation terrain de disponibilité."],
  informationNeeds: ["Mouvements entrants et sortants."],
  fragmentationSignals: ["Écart entre système et comptage physique."],
};

const samplePayload = {
  companyProfile: {
    name: "NordHabitat",
    industry: "Matériaux et solutions pour l’habitat",
    operatingContext: "Distribution et service B2B au Québec.",
    organizationalSummary:
      "Sept départements coordonnent la promesse client, les stocks et le contrôle.",
    erpLearningContext:
      "La consultation organisationnelle précède toute transaction dans l’ERP.",
  },
  departments: [
    {
      key: "dept-direction",
      label: "Direction",
      shortDescription: "Gouverne les priorités et l’alignement entre unités.",
      responsibilities: ["Arbitrer les priorités inter-départements."],
      processContributions: ["Fixe le cadre de coordination."],
      informationNeeds: ["Synthèses fiables et alertes transverses."],
      fragmentationSignals: ["Décisions sur des chiffres non réconciliés."],
    },
    sampleDepartment,
  ],
  relationships: [
    {
      key: "rel-entrepot-direction",
      fromDepartmentKey: "dept-entrepot",
      toDepartmentKey: "dept-direction",
      label: "Signal terrain vers pilotage",
      description: "L’entrepôt remonte les écarts observés à la direction.",
      exchangedInformation: ["Écarts de comptage"],
      coordinationRisk: "Signal ignoré si la propriété du processus est floue.",
    },
  ],
  processAwareness: [
    {
      key: "proc-disponibilite",
      label: "Disponibilité stock",
      description: "La disponibilité affichée dépend d’une lecture partagée.",
      participatingDepartmentKeys: ["dept-entrepot", "dept-direction"],
      sourceInformation: "Comptage physique et solde système",
      expectedControl: "Réconciliation avant engagement client",
      analyticalQuestion: "Qui détient la vérité du stock ?",
    },
  ],
  fragmentationSignals: [
    {
      key: "frag-ecart-inventaire",
      title: "Écart d’inventaire",
      description: "Le système et le terrain ne convergent pas.",
      affectedDepartmentKeys: ["dept-entrepot", "dept-direction"],
      businessImpact: "Promesses client et valorisation fragilisées.",
      evidence: "Signal observé sans ajustement transactionnel.",
      analyticalPrompt: "Quels départements portent ce signal ?",
    },
  ],
  narrativeContext: {
    title: "Signal de Tom — 40 versus 36",
    observation:
      "Tom signale un écart entre la quantité système et le comptage physique.",
    expected: 40,
    actual: 36,
    unit: "unités",
    analyticalQuestion:
      "Que révèle l’écart 40 versus 36 sur la propriété de l’information ?",
    interpretationConstraint:
      "Contexte analytique uniquement — aucun ajustement de stock ni scoring.",
  },
};

describe("organization contracts", () => {
  it("accepts only locked and available access values", () => {
    expect(OrganizationAccessSchema.safeParse("locked").success).toBe(true);
    expect(OrganizationAccessSchema.safeParse("available").success).toBe(true);
    expect(OrganizationAccessSchema.safeParse("in_progress").success).toBe(false);
    expect(OrganizationAccessSchema.safeParse("completed").success).toBe(false);
  });

  it("accepts locked response with organization null", () => {
    const parsed = OrganizationResponseSchema.safeParse({
      access: "locked",
      unlockExplanation: {
        code: ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE,
        title: "Première journée requise",
        description:
          "Terminez d’abord votre première journée pour consulter l’organisation NordHabitat.",
      },
      organization: null,
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects locked response with populated organization", () => {
    const parsed = OrganizationResponseSchema.safeParse({
      access: "locked",
      unlockExplanation: {
        code: ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE,
        title: "Première journée requise",
        description: "Terminez d’abord votre première journée.",
      },
      organization: samplePayload,
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts available response with full payload", () => {
    const parsed = OrganizationResponseSchema.safeParse({
      access: "available",
      unlockExplanation: null,
      organization: samplePayload,
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.organization?.narrativeContext.expected).toBe(40);
      expect(parsed.data.organization?.narrativeContext.actual).toBe(36);
      expect("attempt" in parsed.data).toBe(false);
      expect("score" in parsed.data).toBe(false);
      expect("status" in parsed.data).toBe(false);
    }
  });

  it("rejects available response with null organization", () => {
    const parsed = OrganizationResponseSchema.safeParse({
      access: "available",
      unlockExplanation: null,
      organization: null,
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects invalid access values on the response envelope", () => {
    expect(
      OrganizationResponseSchema.safeParse({
        access: "completed",
        unlockExplanation: null,
        organization: samplePayload,
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate department keys in payload", () => {
    const parsed = OrganizationPayloadSchema.safeParse({
      ...samplePayload,
      departments: [sampleDepartment, { ...sampleDepartment }],
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects relationships that reference unknown departments", () => {
    const parsed = OrganizationPayloadSchema.safeParse({
      ...samplePayload,
      relationships: [
        {
          key: "rel-invalid",
          fromDepartmentKey: "dept-unknown",
          toDepartmentKey: "dept-entrepot",
          label: "Lien invalide",
          description: "Référence un département absent.",
          exchangedInformation: ["Donnée fictive"],
          coordinationRisk: "Référence orpheline.",
        },
      ],
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects malformed empty keys", () => {
    expect(
      OrganizationPayloadSchema.safeParse({
        ...samplePayload,
        departments: [{ ...sampleDepartment, key: "" }],
      }).success,
    ).toBe(false);
  });
});
