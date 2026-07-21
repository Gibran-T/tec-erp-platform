/**
 * RC01 Slice E — NordHabitat organizational catalog (Domain-owned, read-only).
 * Department keys and labels must stay in exact parity with Slice D MISSION_DEPARTMENT_CATALOG.
 */

export interface OrganizationCompanyProfileCatalog {
  readonly name: string;
  readonly industry: string;
  readonly operatingContext: string;
  readonly organizationalSummary: string;
  readonly erpLearningContext: string;
}

export interface OrganizationDepartmentCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly shortDescription: string;
  readonly responsibilities: readonly string[];
  readonly processContributions: readonly string[];
  readonly informationNeeds: readonly string[];
  readonly fragmentationSignals: readonly string[];
}

export interface OrganizationRelationshipCatalogItem {
  readonly key: string;
  readonly fromDepartmentKey: string;
  readonly toDepartmentKey: string;
  readonly label: string;
  readonly description: string;
  readonly exchangedInformation: readonly string[];
  readonly coordinationRisk: string;
}

export interface OrganizationProcessAwarenessCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly participatingDepartmentKeys: readonly string[];
  readonly sourceInformation: string;
  readonly expectedControl: string;
  readonly analyticalQuestion: string;
}

export interface OrganizationFragmentationSignalCatalogItem {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly affectedDepartmentKeys: readonly string[];
  readonly businessImpact: string;
  readonly evidence: string;
  readonly analyticalPrompt: string;
}

export interface OrganizationNarrativeContextCatalog {
  readonly title: string;
  readonly observation: string;
  readonly expected: 40;
  readonly actual: 36;
  readonly unit: string;
  readonly analyticalQuestion: string;
  readonly interpretationConstraint: string;
}

export interface OrganizationCatalogPayload {
  readonly companyProfile: OrganizationCompanyProfileCatalog;
  readonly departments: readonly OrganizationDepartmentCatalogItem[];
  readonly relationships: readonly OrganizationRelationshipCatalogItem[];
  readonly processAwareness: readonly OrganizationProcessAwarenessCatalogItem[];
  readonly fragmentationSignals: readonly OrganizationFragmentationSignalCatalogItem[];
  readonly narrativeContext: OrganizationNarrativeContextCatalog;
}

export const ORGANIZATION_CATALOG: OrganizationCatalogPayload = {
  companyProfile: {
    name: "NordHabitat",
    industry: "Matériaux et solutions pour l'habitat",
    operatingContext:
      "Entreprise québécoise de distribution et de solutions pour l'habitat, où plusieurs départements partagent la responsabilité de servir les clients avec une information fiable.",
    organizationalSummary:
      "NordHabitat s'organise autour de sept départements : Direction, Opérations, Finance, Ventes, Approvisionnement, Entrepôt et TI. La qualité des décisions dépend de la cohérence des informations qui circulent entre ces unités.",
    erpLearningContext:
      "Dans TEC.ERP, la consultation organisationnelle précède toute transaction. Observer qui produit, qui consomme et qui contrôle l'information est le point de départ de la compréhension des processus.",
  },
  departments: [
    {
      key: "dept-direction",
      label: "Direction",
      shortDescription: "Gouverne les priorités et l’alignement entre unités.",
      responsibilities: [
        "Arbitrer les priorités inter-départements et les engagements stratégiques.",
        "Exiger une lecture partagée de la réalité opérationnelle avant de décider.",
        "Clarifier la propriété des processus lorsque plusieurs unités sont touchées.",
      ],
      processContributions: [
        "Fixe le cadre de gouvernance et de coordination.",
        "Relie les signaux terrain aux arbitrages de pilotage.",
      ],
      informationNeeds: [
        "Synthèses fiables sur stocks, service client et risques de coordination.",
        "Alertes lorsqu'une même donnée diverge selon la source.",
      ],
      fragmentationSignals: [
        "Décisions prises sur des chiffres non réconciliés.",
        "Responsabilités floues lorsqu'un écart touche plusieurs unités.",
      ],
    },
    {
      key: "dept-operations",
      label: "Opérations",
      shortDescription: "Coordonne l’exécution quotidienne des processus.",
      responsibilities: [
        "Orchestrer le déroulement quotidien des flux entre départements.",
        "Repérer les ruptures de coordination avant qu'elles n'affectent le client.",
        "Maintenir une vue d'ensemble des engagements opérationnels.",
      ],
      processContributions: [
        "Relie la demande, l'approvisionnement et la disponibilité terrain.",
        "Fait remonter les blocages de processus à la Direction.",
      ],
      informationNeeds: [
        "État réel des stocks et des commandes en cours.",
        "Visibilité sur les délais d'approvisionnement et les écarts signalés.",
      ],
      fragmentationSignals: [
        "Mises à jour tardives entre unités.",
        "Tableaux locaux qui remplacent une source unique de vérité.",
      ],
    },
    {
      key: "dept-finance",
      label: "Finance",
      shortDescription: "Suit la valorisation et la fiabilité des chiffres.",
      responsibilities: [
        "Suivre la valorisation des stocks et la cohérence des reporting.",
        "Signaler les écarts qui fragilisent la lecture financière.",
        "Exiger une traçabilité minimale des quantités utilisées au contrôle.",
      ],
      processContributions: [
        "Transforme les données opérationnelles en lecture de contrôle.",
        "Alimente le pilotage avec des indicateurs dépendants de données fiables.",
      ],
      informationNeeds: [
        "Quantités et valorisations alignées entre système et terrain.",
        "Explications d'écarts avant clôture ou reporting.",
      ],
      fragmentationSignals: [
        "Chiffres divergents entre fichiers locaux et système.",
        "Réconciliations manuelles répétées sans propriétaire clair.",
      ],
    },
    {
      key: "dept-ventes",
      label: "Ventes",
      shortDescription: "S’appuie sur la disponibilité réelle pour servir les clients.",
      responsibilities: [
        "Promettre des délais et des disponibilités fondés sur une information partagée.",
        "Remonter les plaintes liées à des écarts de service.",
        "Coordonner avec l'entrepôt et l'approvisionnement avant engagement ferme.",
      ],
      processContributions: [
        "Traduit la demande client en besoins visibles pour les autres unités.",
        "Expose l'impact client d'une disponibilité incorrecte.",
      ],
      informationNeeds: [
        "Disponibilité réelle et non seulement affichée.",
        "Statut des réapprovisionnements susceptibles d'affecter la promesse client.",
      ],
      fragmentationSignals: [
        "Promesses fondées sur un stock système non confirmé.",
        "Informations client déconnectées des observations terrain.",
      ],
    },
    {
      key: "dept-approvisionnement",
      label: "Approvisionnement",
      shortDescription: "Planifie les réapprovisionnements selon la demande et les stocks.",
      responsibilities: [
        "Planifier les achats et réapprovisionnements selon la demande et les niveaux de stock.",
        "Coordonner avec fournisseurs et entrepôt sur les réceptions attendues.",
        "Ajuster les plans lorsque la réalité stock diverge du système.",
      ],
      processContributions: [
        "Relie besoin commercial, niveau de stock et engagement fournisseur.",
        "Réduit le risque de rupture lorsque l'information est partagée à temps.",
      ],
      informationNeeds: [
        "Niveaux de stock fiables et signaux d'écart inventaire.",
        "Prévisions de demande et délais fournisseurs.",
      ],
      fragmentationSignals: [
        "Réapprovisionnements pilotés sur des soldes obsolètes.",
        "Double saisie entre fichiers acheteurs et système central.",
      ],
    },
    {
      key: "dept-entrepot",
      label: "Entrepôt",
      shortDescription: "Gère les stocks physiques et les observations terrain.",
      responsibilities: [
        "Compter, localiser et sécuriser les stocks physiques.",
        "Signaler les écarts entre observation terrain et solde système.",
        "Documenter les mouvements entrants et sortants de manière traçable.",
      ],
      processContributions: [
        "Fournit la vérité physique indispensable aux autres départements.",
        "Déclenche les signaux de fragmentation lorsque le terrain diverge.",
      ],
      informationNeeds: [
        "Ordres de réception, de sortie et de transfert clairs.",
        "Retour sur les corrections attendues sans improvisation locale.",
      ],
      fragmentationSignals: [
        "Comptages locaux non répercutés dans le système.",
        "Propriété floue de la correction d'écart inventaire.",
      ],
    },
    {
      key: "dept-ti",
      label: "TI",
      shortDescription: "Assure la cohérence des données dans les systèmes.",
      responsibilities: [
        "Maintenir l'intégrité des données dans les systèmes partagés.",
        "Réduire les doublons et les exportations non gouvernées.",
        "Soutenir une source de vérité identifiable pour les processus critiques.",
      ],
      processContributions: [
        "Rend visibles les écarts entre systèmes et usages locaux.",
        "Soutient la traçabilité des mises à jour inter-départements.",
      ],
      informationNeeds: [
        "Règles claires de propriété des données métier.",
        "Signalements d'incohérences provenant des unités opérationnelles.",
      ],
      fragmentationSignals: [
        "Copies tableur qui deviennent de facto la référence.",
        "Mises à jour manuelles sans piste d'audit partagée.",
      ],
    },
  ],
  relationships: [
    {
      key: "rel-ventes-entrepot",
      fromDepartmentKey: "dept-ventes",
      toDepartmentKey: "dept-entrepot",
      label: "Demande client et disponibilité",
      description:
        "Les Ventes s'appuient sur la disponibilité confirmée par l'Entrepôt pour engager le client.",
      exchangedInformation: ["Disponibilité demandée", "Confirmation ou réserve de stock"],
      coordinationRisk:
        "Une disponibilité système non confirmée peut générer une promesse client incorrecte.",
    },
    {
      key: "rel-ventes-approvisionnement",
      fromDepartmentKey: "dept-ventes",
      toDepartmentKey: "dept-approvisionnement",
      label: "Signal de demande commerciale",
      description:
        "Les besoins clients visibles côté Ventes orientent les priorités de réapprovisionnement.",
      exchangedInformation: ["Besoins clients urgents", "Prévisions de commande"],
      coordinationRisk:
        "Sans partage rapide, l'Approvisionnement planifie sur une demande incomplète.",
    },
    {
      key: "rel-approvisionnement-entrepot",
      fromDepartmentKey: "dept-approvisionnement",
      toDepartmentKey: "dept-entrepot",
      label: "Réceptions et niveaux de stock",
      description:
        "L'Approvisionnement et l'Entrepôt doivent aligner réceptions attendues et stocks physiques.",
      exchangedInformation: ["Réceptions prévues", "Écarts à la réception"],
      coordinationRisk:
        "Un stock théorique non reçu fragilise à la fois le réapprovisionnement et le service.",
    },
    {
      key: "rel-entrepot-finance",
      fromDepartmentKey: "dept-entrepot",
      toDepartmentKey: "dept-finance",
      label: "Valorisation et contrôle des stocks",
      description:
        "Les observations d'Entrepôt alimentent la valorisation et le contrôle financier.",
      exchangedInformation: ["Quantités physiques", "Écarts d'inventaire signalés"],
      coordinationRisk: "Des quantités non réconciliées dégradent la fiabilité du reporting.",
    },
    {
      key: "rel-entrepot-ti",
      fromDepartmentKey: "dept-entrepot",
      toDepartmentKey: "dept-ti",
      label: "Cohérence système versus terrain",
      description:
        "L'Entrepôt et les TI confrontent observation physique et solde système pour détecter la fragmentation.",
      exchangedInformation: ["Soldes système", "Comptages physiques"],
      coordinationRisk: "Sans rapprochement, chaque unité conserve sa propre vérité du stock.",
    },
    {
      key: "rel-operations-direction",
      fromDepartmentKey: "dept-operations",
      toDepartmentKey: "dept-direction",
      label: "Coordination et arbitrage",
      description:
        "Les Opérations remontent les blocages transverses à la Direction pour arbitrage.",
      exchangedInformation: ["Blocages de processus", "Impacts multi-départements"],
      coordinationRisk:
        "Un signal non escaladé laisse persister une propriété de processus floue.",
    },
    {
      key: "rel-finance-direction",
      fromDepartmentKey: "dept-finance",
      toDepartmentKey: "dept-direction",
      label: "Contrôle et pilotage",
      description:
        "La Finance fournit à la Direction une lecture de contrôle fondée sur des données cohérentes.",
      exchangedInformation: ["Écarts de valorisation", "Alertes de reporting"],
      coordinationRisk:
        "Piloter sans réconciliation expose la Direction à des décisions sur chiffres divergents.",
    },
  ],
  processAwareness: [
    {
      key: "proc-promesse-client",
      label: "Promesse client et disponibilité",
      description:
        "La promesse de service dépend d'une disponibilité partagée entre Ventes, Entrepôt et Approvisionnement.",
      participatingDepartmentKeys: ["dept-ventes", "dept-entrepot", "dept-approvisionnement"],
      sourceInformation: "Demande client, solde stock et réceptions prévues",
      expectedControl: "Confirmation de disponibilité avant engagement ferme",
      analyticalQuestion:
        "Sur quelle source la promesse client repose-t-elle réellement aujourd'hui ?",
    },
    {
      key: "proc-reapprovisionnement",
      label: "Réapprovisionnement",
      description:
        "Le réapprovisionnement relie besoin commercial, niveau de stock et engagement fournisseur.",
      participatingDepartmentKeys: [
        "dept-approvisionnement",
        "dept-entrepot",
        "dept-ventes",
        "dept-operations",
      ],
      sourceInformation: "Niveaux de stock, délais fournisseurs et signaux de demande",
      expectedControl: "Décision d'achat fondée sur une lecture unique du besoin",
      analyticalQuestion:
        "Qui décide lorsqu'un solde système et un comptage terrain divergent avant achat ?",
    },
    {
      key: "proc-controle-inventaire",
      label: "Contrôle d'inventaire",
      description:
        "Le contrôle d'inventaire confronte observation physique, solde système et impact financier.",
      participatingDepartmentKeys: [
        "dept-entrepot",
        "dept-ti",
        "dept-finance",
        "dept-operations",
      ],
      sourceInformation: "Comptage physique, solde système et valorisation",
      expectedControl: "Réconciliation documentée avant toute lecture de contrôle",
      analyticalQuestion:
        "Quelle unité détient la vérité du stock, et comment l'écart est-il traité sans improvisation ?",
    },
    {
      key: "proc-pilotage-transverse",
      label: "Pilotage transverse",
      description:
        "Le pilotage de Direction s'appuie sur des signaux consolidés provenant des opérations et de la finance.",
      participatingDepartmentKeys: [
        "dept-direction",
        "dept-operations",
        "dept-finance",
        "dept-ti",
      ],
      sourceInformation: "Alertes d'écart, synthèses opérationnelles et reporting",
      expectedControl: "Arbitrage sur des données réconciliées et une propriété claire",
      analyticalQuestion:
        "Les arbitrages de Direction reposent-ils sur une source unique ou sur des versions locales ?",
    },
  ],
  fragmentationSignals: [
    {
      key: "frag-duplication-tableurs",
      title: "Duplication dans des tableurs",
      description:
        "Plusieurs départements maintiennent des copies locales des mêmes quantités hors du système partagé.",
      affectedDepartmentKeys: [
        "dept-entrepot",
        "dept-approvisionnement",
        "dept-finance",
        "dept-ti",
      ],
      businessImpact: "Chaque unité décide à partir d'une version différente de la réalité.",
      evidence: "Fichiers locaux utilisés comme référence opérationnelle parallèle.",
      analyticalPrompt: "Quelle copie fait autorité lorsque deux tableurs divergent ?",
    },
    {
      key: "frag-propriete-incoherente",
      title: "Propriété incohérente du processus",
      description:
        "Lorsqu'un écart apparaît, aucune unité n'est clairement responsable de la correction et de la communication.",
      affectedDepartmentKeys: [
        "dept-operations",
        "dept-entrepot",
        "dept-ti",
        "dept-direction",
      ],
      businessImpact: "Le signal stagne et les décisions continuent sur une base ambiguë.",
      evidence: "Escalades multiples sans propriétaire unique du rapprochement.",
      analyticalPrompt: "Qui doit initier, valider et communiquer la réconciliation ?",
    },
    {
      key: "frag-information-deconnectee",
      title: "Information déconnectée",
      description:
        "Les Ventes, l'Entrepôt et l'Approvisionnement ne consultent pas la même lecture de disponibilité au même moment.",
      affectedDepartmentKeys: ["dept-ventes", "dept-entrepot", "dept-approvisionnement"],
      businessImpact: "Promesses client et plans d'achat se désynchronisent.",
      evidence: "Décisions concurrentes fondées sur des instantanés non partagés.",
      analyticalPrompt: "Comment la disponibilité est-elle synchronisée entre ces trois unités ?",
    },
    {
      key: "frag-mises-a-jour-differees",
      title: "Mises à jour différées",
      description:
        "Les corrections terrain mettent du temps à atteindre le système et les autres départements.",
      affectedDepartmentKeys: ["dept-entrepot", "dept-operations", "dept-ti", "dept-ventes"],
      businessImpact: "Les décisions restent fondées sur un état déjà obsolète.",
      evidence: "Délai observable entre comptage et mise à jour partagée.",
      analyticalPrompt:
        "Quel délai sépare l'observation terrain de sa visibilité organisationnelle ?",
    },
    {
      key: "frag-chiffres-divergents",
      title: "Chiffres divergents",
      description:
        "Finance et opérations reçoivent des quantités ou valorisations qui ne concordent pas.",
      affectedDepartmentKeys: ["dept-finance", "dept-entrepot", "dept-operations"],
      businessImpact: "Le reporting et le pilotage perdent en crédibilité.",
      evidence: "Écarts répétés entre lecture opérationnelle et lecture de contrôle.",
      analyticalPrompt: "D'où provient chaque chiffre avant consolidation ?",
    },
    {
      key: "frag-reconciliation-manuelle",
      title: "Réconciliation manuelle",
      description:
        "Les écarts sont corrigés ponctuellement dans des fichiers ou échanges informels plutôt que dans un processus partagé.",
      affectedDepartmentKeys: ["dept-finance", "dept-entrepot", "dept-ti", "dept-operations"],
      businessImpact: "La correction reste locale, non traçable et difficile à répéter.",
      evidence: "Ajustements hors processus sans piste d'audit commune.",
      analyticalPrompt:
        "La réconciliation laisse-t-elle une trace utilisable par toute l'organisation ?",
    },
    {
      key: "frag-source-de-verite-floue",
      title: "Source de vérité floue",
      description:
        "Il n'est pas clair si le système, le comptage terrain ou un fichier local constitue la référence officielle.",
      affectedDepartmentKeys: ["dept-ti", "dept-entrepot", "dept-direction", "dept-finance"],
      businessImpact:
        "Chaque département peut justifier une décision différente avec sa propre source.",
      evidence: "Absence de règle explicite de référence pour le stock critique.",
      analyticalPrompt: "Quelle source est déclarée officielle, et qui la maintient ?",
    },
  ],
  narrativeContext: {
    title: "Signal de Tom — 40 versus 36",
    observation:
      "Tom signale un écart d'inventaire : le système indique 40 unités, alors que le comptage physique en observe 36. Ce signal illustre une fragmentation d'information et de propriété de processus entre départements.",
    expected: 40,
    actual: 36,
    unit: "unités",
    analyticalQuestion:
      "Que révèle l'écart 40 versus 36 sur la circulation de l'information et la propriété du processus d'inventaire ?",
    interpretationConstraint:
      "Contexte analytique d'observation uniquement. Aucun ajustement de stock, aucune transaction, aucun score et aucune validation transactionnelle ne sont attendus dans Slice E.",
  },
};

export function getOrganizationCatalog(): OrganizationCatalogPayload {
  return ORGANIZATION_CATALOG;
}
