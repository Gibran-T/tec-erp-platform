import type { ConnectionLabDefinition } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_CONNECTION_LAB: ConnectionLabDefinition = {
  id: "m1-connection-lab",
  title: "Laboratoire de connexion ERP — Module 1",
  objective:
    "Relier objets ERP, départements, processus, master data, erreurs et KPI pour lire l’écart 40 versus 36 comme un problème systémique.",
  passThresholdPercent: 70,
  activities: [
    {
      id: "lab-matching",
      title: "Associations multi-dimensions",
      instruction:
        "Associez au moins quatre relations valides parmi : objet ERP ↔ définition, département ↔ responsabilité, processus ↔ département, master data ↔ processus, erreur ↔ conséquence, KPI ↔ interprétation.",
      interaction: {
        id: "lab-matching",
        type: "DIAGNOSIS_RECOMMENDATION",
        prompt:
          "Sélectionnez des paires pertinentes pour cartographier le signal NordHabitat (minimum 4 associations).",
        options: [
          { key: "obj-erp", label: "Objet ERP", description: "Système intégré de processus et données" },
          { key: "obj-processus", label: "Processus d’affaires", description: "Chaîne transversale multi-départements" },
          { key: "obj-masterdata", label: "Master data", description: "Donnée de référence consommée par plusieurs flux" },
          { key: "def-lecture-partagee", label: "Lecture partagée", description: "Réalité commune pour décider" },
          { key: "def-chaine-transversale", label: "Chaîne transversale", description: "Activités qui traversent plusieurs unités" },
          { key: "def-donnee-reference", label: "Donnée de référence", description: "Article, site, partenaire stables" },
          { key: "dept-entrepot", label: "Entrepôt", description: "Observe le stock physique" },
          { key: "dept-ti", label: "TI", description: "Maintient la cohérence système" },
          { key: "dept-ventes", label: "Ventes", description: "Engage le client" },
          { key: "resp-signal-terrain", label: "Signaler l’écart terrain", description: "Responsabilité d’observation physique" },
          { key: "resp-coherence-systeme", label: "Assurer la cohérence des données", description: "Responsabilité système" },
          { key: "resp-promesse-client", label: "Promettre sur disponibilité réelle", description: "Responsabilité commerciale" },
          { key: "proc-inventaire", label: "Processus inventaire", description: "Contrôle stock système/terrain" },
          { key: "md-sku", label: M1_SPINE.materialSku, description: "Article HVAC de référence" },
          { key: "err-4036", label: "Erreur 40 vs 36", description: "Écart système/terrain" },
          {
            key: "cons-fragmentation",
            label: "Fragmentation d’information",
            description: "Décisions sur réalités divergentes",
          },
          { key: "kpi-inv-acc", label: "Exactitude d’inventaire", description: "KPI de fiabilité stock" },
          {
            key: "interp-risque-service",
            label: "Risque de service et de valorisation",
            description: "Interprétation managériale",
          },
        ],
        scoring: {
          maxPoints: 40,
          minimumSelections: 4,
          allowedPairs: [
            { leftKey: "obj-erp", rightKey: "def-lecture-partagee" },
            { leftKey: "obj-processus", rightKey: "def-chaine-transversale" },
            { leftKey: "obj-masterdata", rightKey: "def-donnee-reference" },
            { leftKey: "dept-entrepot", rightKey: "resp-signal-terrain" },
            { leftKey: "dept-ti", rightKey: "resp-coherence-systeme" },
            { leftKey: "dept-ventes", rightKey: "resp-promesse-client" },
            { leftKey: "proc-inventaire", rightKey: "dept-entrepot" },
            { leftKey: "proc-inventaire", rightKey: "dept-ti" },
            { leftKey: "md-sku", rightKey: "proc-inventaire" },
            { leftKey: "err-4036", rightKey: "cons-fragmentation" },
            { leftKey: "kpi-inv-acc", rightKey: "interp-risque-service" },
          ],
        },
      },
    },
    {
      id: "lab-ordering",
      title: "Ordre de la chaîne d’information",
      instruction:
        "Ordonnez la réponse organisationnelle cohérente face au signal d’écart.",
      interaction: {
        id: "lab-ordering",
        type: "ORDERING",
        prompt: "Classez les étapes de la plus immédiate à la consolidation financière.",
        options: [
          { key: "step-observe", label: "Observer le signal terrain (Tom)" },
          { key: "step-verify", label: "Vérifier la donnée système (TI)" },
          { key: "step-alert-ops", label: "Alerter les opérations" },
          { key: "step-inform-sales", label: "Informer les ventes" },
          { key: "step-finance", label: "Documenter l’impact financier" },
        ],
        scoring: {
          maxPoints: 25,
          correctOrder: [
            "step-observe",
            "step-verify",
            "step-alert-ops",
            "step-inform-sales",
            "step-finance",
          ],
        },
      },
    },
    {
      id: "lab-numeric",
      title: "Écart numérique",
      instruction: `Calculez l’écart entre quantité système (${M1_SPINE.inventorySystemQty}) et quantité physique (${M1_SPINE.inventoryPhysicalQty}).`,
      interaction: {
        id: "lab-numeric",
        type: "NUMERIC_INPUT",
        prompt: "Quelle est la variance d’inventaire (unités) ?",
        scoring: {
          maxPoints: 15,
          numericTarget: M1_SPINE.inventoryVariance,
          numericTolerance: 0,
        },
      },
    },
    {
      id: "lab-justification",
      title: "Justification courte",
      instruction:
        "Expliquez pourquoi cet écart est une fragmentation d’information plutôt qu’un simple problème d’entrepôt.",
      interaction: {
        id: "lab-justification",
        type: "TEXT_ANALYSIS",
        prompt:
          "Rédigez une justification courte (concepts attendus : fragmentation, départements, inventaire).",
        scoring: {
          maxPoints: 20,
          requiredConcepts: ["fragmentation", "départements", "inventaire"],
        },
      },
    },
  ],
  feedback: {
    correctRelationships:
      "Relations valides : ERP ↔ lecture partagée ; processus ↔ chaîne transversale ; master data ↔ donnée de référence ; Entrepôt ↔ signal terrain ; TI ↔ cohérence système ; Ventes ↔ promesse client ; inventaire ↔ Entrepôt/TI ; SKU ↔ processus inventaire ; 40/36 ↔ fragmentation ; exactitude d’inventaire ↔ risque de service/valorisation.",
    missingRelationships:
      "Si des associations manquent, revoyez surtout master data ↔ processus consommateur et KPI ↔ interprétation managériale — ce sont les ponts vers M2 et le bilan.",
    systemicImplication:
      "Un écart local (4 unités) devient un risque d’entreprise dès que ventes, approvisionnement et finance décident sans lecture partagée.",
    improvement:
      "Amélioration professionnelle : clarifier le propriétaire du processus inventaire, aligner système/terrain, puis partager l’impact avant toute action isolée.",
  },
};
