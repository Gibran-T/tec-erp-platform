import type { BusinessDocumentContent } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_DOCUMENTS: readonly BusinessDocumentContent[] = [
  {
    id: "doc-company-profile",
    title: "Profil d’entreprise — NordHabitat",
    docType: "Fiche organisationnelle",
    reference: M1_SPINE.documentRefs.companyProfile,
    status: "Publié",
    issuedAt: M1_SPINE.issuedAt,
    companyName: M1_SPINE.companyName,
    sections: [
      {
        heading: "Identité",
        paragraphs: [
          "NordHabitat est une entreprise québécoise de matériaux et solutions pour l’habitat. Elle opère depuis HQ-MTL et dessert ses clients via les centres de distribution DC-MTL et DC-TRT.",
        ],
        rows: [
          { label: "Code entreprise", value: M1_SPINE.companyCode },
          { label: "Devise", value: M1_SPINE.currency },
          { label: "Sites", value: M1_SPINE.sites.join(" · ") },
          { label: "Gestionnaire pédagogique", value: M1_SPINE.manager },
        ],
      },
      {
        heading: "Enjeu pédagogique du Module 1",
        paragraphs: [
          "Les décisions d’entreprise dépendent d’une lecture partagée de la réalité. Lorsque le système et le terrain divergent, chaque département risque d’agir sur une information différente.",
        ],
      },
    ],
    footerNote: "Document pédagogique Course Edition — usage interne TEC.ERP / NordHabitat.",
  },
  {
    id: "doc-department-structure",
    title: "Structure départementale et responsabilités",
    docType: "Structure organisationnelle",
    reference: M1_SPINE.documentRefs.departmentStructure,
    status: "Publié",
    issuedAt: M1_SPINE.issuedAt,
    companyName: M1_SPINE.companyName,
    sections: [
      {
        heading: "Sept départements NordHabitat",
        paragraphs: [
          "Chaque département produit, consomme ou contrôle une portion de l’information d’entreprise. L’analyste ERP observe ces dépendances avant toute transaction.",
        ],
        rows: M1_SPINE.departments.map((dept) => ({
          label: dept.label,
          value:
            dept.key === "dept-entrepot"
              ? "Observe et signale les quantités physiques."
              : dept.key === "dept-ti"
                ? "Assure la cohérence des données système."
                : dept.key === "dept-operations"
                  ? "Coordonne l’exécution inter-processus."
                  : dept.key === "dept-finance"
                    ? "Suit valorisation et fiabilité des chiffres."
                    : dept.key === "dept-ventes"
                      ? "Engage le client sur la disponibilité réelle."
                      : dept.key === "dept-approvisionnement"
                        ? "Planifie les réapprovisionnements."
                        : "Arbitre priorités et alignement inter-unités.",
        })),
      },
    ],
    footerNote: `Référence croisée : signal inventaire ${M1_SPINE.documentRefs.inventorySignal}.`,
  },
  {
    id: "doc-inventory-signal",
    title: "Signal d’écart d’inventaire — Tom (40 vs 36)",
    docType: "Mémo opérationnel",
    reference: M1_SPINE.documentRefs.inventorySignal,
    status: "Ouvert — analyse requise",
    issuedAt: M1_SPINE.issuedAt,
    companyName: M1_SPINE.companyName,
    sections: [
      {
        heading: "Contexte",
        paragraphs: [
          `${M1_SPINE.signalOwner} (Entrepôt, DC-MTL) signale un écart sur l’article ${M1_SPINE.materialSku}. Ce mémo n’autorise aucun ajustement de stock. Il constitue un signal de fragmentation d’information.`,
        ],
        rows: [
          { label: "Article", value: M1_SPINE.materialSku },
          { label: "Quantité système", value: String(M1_SPINE.inventorySystemQty) },
          { label: "Quantité physique", value: String(M1_SPINE.inventoryPhysicalQty) },
          { label: "Écart", value: String(M1_SPINE.inventoryVariance) },
          { label: "Site", value: "DC-MTL" },
          { label: "Destinataire", value: M1_SPINE.manager },
        ],
      },
      {
        heading: "Question analytique",
        paragraphs: [
          "Quels départements sont touchés, quelles responsabilités se croisent, et quelle lecture partagée doit être établie avant toute décision isolée ?",
        ],
      },
    ],
    footerNote: `Document utilisé en APPRENDRE, Connection Lab et missions M1-M01 à M1-M03.`,
  },
  {
    id: "doc-master-data-example",
    title: "Fiche donnée de référence — article",
    docType: "Master data (extrait)",
    reference: M1_SPINE.documentRefs.masterDataExample,
    status: "Actif",
    issuedAt: M1_SPINE.issuedAt,
    companyName: M1_SPINE.companyName,
    sections: [
      {
        heading: "Article consommateur de processus",
        paragraphs: [
          "Cette fiche illustre une donnée de référence consommée par inventaire, approvisionnement, ventes et finance. Une quantité erronée dans le système altère plusieurs processus simultanément.",
        ],
        rows: [
          { label: "SKU", value: M1_SPINE.materialSku },
          { label: "Description", value: "Unité HVAC — composant habitat" },
          { label: "Site principal", value: "DC-MTL" },
          { label: "Fournisseur de référence", value: M1_SPINE.supplier },
          { label: "Client sensible", value: M1_SPINE.customer },
          { label: "Processus consommateurs", value: "Inventaire · Approvisionnement · Ventes · Finance" },
        ],
      },
    ],
    footerNote: "Utilisé dans le Connection Lab (master data ↔ processus consommateur).",
  },
  {
    id: "doc-kpi-impact",
    title: "Synthèse d’impact — exactitude d’inventaire",
    docType: "Synthèse KPI / impact",
    reference: M1_SPINE.documentRefs.kpiImpact,
    status: "Pour bilan M1",
    issuedAt: M1_SPINE.issuedAt,
    companyName: M1_SPINE.companyName,
    sections: [
      {
        heading: "Lecture managériale",
        paragraphs: [
          `Avec ${M1_SPINE.inventorySystemQty} unités système et ${M1_SPINE.inventoryPhysicalQty} unités physiques, l’exactitude d’inventaire locale est de 90 % (${M1_SPINE.inventoryPhysicalQty}/${M1_SPINE.inventorySystemQty}). L’écart de ${M1_SPINE.inventoryVariance} unités fragilise promesse client, réapprovisionnement et valorisation.`,
        ],
        rows: [
          { label: "KPI", value: "Exactitude d’inventaire" },
          { label: "Valeur observée", value: "90 %" },
          { label: "Cible pédagogique", value: "≥ 98 %" },
          { label: "Tendance", value: "À risque" },
          { label: "Processus touché", value: "Inventaire / coordination inter-départements" },
          { label: "Départements", value: "Entrepôt · TI · Opérations · Ventes · Finance" },
        ],
      },
      {
        heading: "Action recommandée",
        paragraphs: [
          "Clarifier le propriétaire du processus inventaire, aligner lecture système/terrain, puis partager l’impact ventes/finance avant tout ajustement isolé.",
        ],
      },
    ],
    footerNote: "Alimente la surface BILAN ET CONSOLIDATION — contenu déterministe authored.",
  },
];
