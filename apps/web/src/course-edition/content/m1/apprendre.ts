import type { VisualFrameContent } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_LEARNING_OBJECTIVES = [
  "Comprendre ce qu’est une entreprise intégrée et pourquoi l’information partagée est critique.",
  "Identifier le rôle de l’analyste ERP face à un signal transversal (sans transaction prématurée).",
  "Relier les sept départements NordHabitat aux responsabilités et processus.",
  "Interpréter l’écart 40 versus 36 comme fragmentation d’information, non comme simple correction de stock.",
] as const;

export const M1_GLOSSARY = [
  {
    term: "ERP",
    definition:
      "Système intégré qui relie processus, données et décisions entre départements sur une lecture partagée.",
  },
  {
    term: "Processus d’affaires",
    definition:
      "Enchaînement d’activités transversales (besoin → décision → exécution → contrôle) qui traverse plusieurs départements.",
  },
  {
    term: "Département",
    definition:
      "Unité organisationnelle avec responsabilités propres ; dépend des autres pour une décision fiable.",
  },
  {
    term: "Donnée",
    definition:
      "Représentation structurée d’un fait d’entreprise (stock, client, fournisseur) utilisée par plusieurs processus.",
  },
  {
    term: "Fragmentation",
    definition:
      "Situation où système et terrain (ou départements) ne partagent plus la même réalité opérationnelle.",
  },
  {
    term: "Inventaire système vs physique",
    definition: `Quantité enregistrée dans le système (${M1_SPINE.inventorySystemQty}) versus quantité observée sur le terrain (${M1_SPINE.inventoryPhysicalQty}).`,
  },
  {
    term: "Master Data (aperçu)",
    definition:
      "Données de référence stables (article, partenaire, site) consommées par plusieurs processus transactionnels.",
  },
] as const;

/**
 * Final M1 visual set (8 frames). Native HTML/CSS frames are the professional runtime
 * assets; optional imageSrc remains a replacement-ready PNG/WebP slot (no Canva runtime).
 */
export const M1_VISUAL_FRAMES: readonly VisualFrameContent[] = [
  {
    id: "frame-01-enterprise-integrated",
    title: "Vue d’ensemble — entreprise et processus intégrés",
    description:
      "NordHabitat comme système : signal → processus → décision → impact, piloté depuis une lecture partagée.",
    professorNote:
      "Ouvrir la séance avec cette vue systémique. Ne pas commencer par l’écran de stock.",
    imageAlt: "Vue d’ensemble entreprise intégrée NordHabitat",
    // imageSrc: "/course-edition/m1/frame-01-enterprise-integrated.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-01-enterprise-integrated">
        <div class="ce-visual-scene__hero">
          <p class="ce-visual-kicker">NordHabitat · entreprise pédagogique</p>
          <h3>Processus intégrés, décision partagée</h3>
          <p>Matériaux et solutions pour l’habitat · ${M1_SPINE.currency} · ${M1_SPINE.sites.join(" · ")}</p>
        </div>
        <ol class="ce-visual-pipeline" aria-label="Chaîne décisionnelle intégrée">
          <li><span>1</span><strong>Signal</strong><em>Terrain / système</em></li>
          <li><span>2</span><strong>Processus</strong><em>Chaîne transversale</em></li>
          <li><span>3</span><strong>Décision</strong><em>Lecture partagée</em></li>
          <li><span>4</span><strong>Impact</strong><em>KPI &amp; départements</em></li>
        </ol>
        <p class="ce-visual-caption">Sans intégration, chaque département décide sur une réalité locale.</p>
      </div>
    `,
  },
  {
    id: "frame-02-erp-analyst-role",
    title: "Rôle de l’analyste ERP",
    description:
      "Observer, relier et diagnostiquer avant toute transaction — posture d’Observateur-Analyste.",
    professorNote: `Relier explicitement à ${M1_SPINE.manager} et au mandat d’observation (pas d’ajustement de stock).`,
    imageAlt: "Rôle de l’analyste ERP",
    // imageSrc: "/course-edition/m1/frame-02-erp-analyst-role.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-02-erp-analyst-role">
        <div class="ce-visual-role">
          <div class="ce-visual-role__badge">Observateur-Analyste</div>
          <h3>Ce que fait l’analyste ERP au Module 1</h3>
          <ol class="ce-visual-steps">
            <li><strong>Observer</strong> le signal et ses preuves documentaires</li>
            <li><strong>Relier</strong> départements, processus et données touchés</li>
            <li><strong>Diagnostiquer</strong> la fragmentation avant d’agir</li>
          </ol>
          <p class="ce-visual-callout">Interdit pédagogique M1 : ajuster le stock ou enregistrer une transaction.</p>
        </div>
      </div>
    `,
  },
  {
    id: "frame-03-seven-departments",
    title: "Modèle à sept départements — NordHabitat",
    description:
      "Direction, Opérations, Finance, Ventes, Approvisionnement, Entrepôt et TI forment le modèle organisationnel.",
    professorNote: "Faire nommer à voix haute qui produit / consomme / contrôle l’information d’inventaire.",
    imageAlt: "Sept départements NordHabitat",
    // imageSrc: "/course-edition/m1/frame-03-seven-departments.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-03-seven-departments">
        <p class="ce-visual-kicker">Organisation NordHabitat</p>
        <h3>Sept départements, une réalité d’entreprise</h3>
        <ul class="ce-dept-orbit" aria-label="Départements NordHabitat">
          ${M1_SPINE.departments
            .map(
              (dept, index) =>
                `<li class="ce-dept-orbit__item ce-dept-orbit__item--${index + 1}"><strong>${dept.label}</strong></li>`,
            )
            .join("")}
        </ul>
        <p class="ce-visual-caption">Le même écart inventaire touche disponibilité, réapprovisionnement, valorisation et gouvernance.</p>
      </div>
    `,
  },
  {
    id: "frame-04-e2e-process-map",
    title: "Carte de processus de bout en bout",
    description:
      "Du signal entrepôt à l’impact finance : chaîne d’information que l’analyste doit tracer.",
    professorNote: "Demander où la chaîne se rompt dans le scénario 40 vs 36.",
    imageAlt: "Carte processus bout en bout inventaire",
    // imageSrc: "/course-edition/m1/frame-04-e2e-process-map.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-04-e2e-process-map">
        <p class="ce-visual-kicker">Processus · inventaire &amp; décision</p>
        <h3>Carte de bout en bout</h3>
        <div class="ce-process-map" role="list">
          <div class="ce-process-map__node" role="listitem"><strong>Entrepôt</strong><span>Constat terrain ${M1_SPINE.inventoryPhysicalQty}</span></div>
          <div class="ce-process-map__arrow" aria-hidden="true">→</div>
          <div class="ce-process-map__node" role="listitem"><strong>TI / ERP</strong><span>Lecture système ${M1_SPINE.inventorySystemQty}</span></div>
          <div class="ce-process-map__arrow" aria-hidden="true">→</div>
          <div class="ce-process-map__node" role="listitem"><strong>Opérations</strong><span>Disponibilité &amp; planification</span></div>
          <div class="ce-process-map__arrow" aria-hidden="true">→</div>
          <div class="ce-process-map__node" role="listitem"><strong>Ventes</strong><span>Promesse client</span></div>
          <div class="ce-process-map__arrow" aria-hidden="true">→</div>
          <div class="ce-process-map__node" role="listitem"><strong>Finance</strong><span>Valorisation &amp; risque</span></div>
        </div>
        <p class="ce-visual-caption">Toute rupture crée une décision sur information incomplète.</p>
      </div>
    `,
  },
  {
    id: "frame-05-master-data",
    title: "Relations master data",
    description: `Article ${M1_SPINE.materialSku}, fournisseur ${M1_SPINE.supplier}, client ${M1_SPINE.customer} et site DC-MTL.`,
    professorNote: "Souligner que la master data est consommée par plusieurs processus — elle n’est pas « un écran article » isolé.",
    imageAlt: "Relations master data SKU-HVAC-4421",
    // imageSrc: "/course-edition/m1/frame-05-master-data.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-05-master-data">
        <p class="ce-visual-kicker">Master data · aperçu M1</p>
        <h3>Données de référence partagées</h3>
        <div class="ce-md-map">
          <div class="ce-md-map__hub"><strong>${M1_SPINE.materialSku}</strong><span>Article HVAC</span></div>
          <ul class="ce-md-map__links">
            <li><span>Fournisseur</span><strong>${M1_SPINE.supplier}</strong></li>
            <li><span>Client</span><strong>${M1_SPINE.customer}</strong></li>
            <li><span>Site</span><strong>DC-MTL</strong></li>
            <li><span>Document</span><strong>${M1_SPINE.documentRefs.masterDataExample}</strong></li>
          </ul>
        </div>
        <p class="ce-visual-caption">Une erreur de référence se propage dans inventaire, approvisionnement, ventes et finance.</p>
      </div>
    `,
  },
  {
    id: "frame-06-business-documents",
    title: "Relations entre documents d’affaires",
    description:
      "Profil entreprise, structure départementale, signal inventaire, master data et synthèse KPI forment un dossier cohérent.",
    professorNote: "Montrer que les documents ne sont pas des annexes décoratives : ils prouvent la lecture systémique.",
    imageAlt: "Relations documents d’affaires NordHabitat",
    // imageSrc: "/course-edition/m1/frame-06-business-documents.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-06-business-documents">
        <p class="ce-visual-kicker">Dossier documentaire M1</p>
        <h3>Documents reliés, même spine</h3>
        <div class="ce-doc-map">
          <article><strong>${M1_SPINE.documentRefs.companyProfile}</strong><span>Profil d’entreprise</span></article>
          <article><strong>${M1_SPINE.documentRefs.departmentStructure}</strong><span>Structure départementale</span></article>
          <article class="ce-doc-map__focus"><strong>${M1_SPINE.documentRefs.inventorySignal}</strong><span>Signal ${M1_SPINE.inventorySystemQty} vs ${M1_SPINE.inventoryPhysicalQty}</span></article>
          <article><strong>${M1_SPINE.documentRefs.masterDataExample}</strong><span>Master data article</span></article>
          <article><strong>${M1_SPINE.documentRefs.kpiImpact}</strong><span>Impact KPI inventaire</span></article>
        </div>
        <p class="ce-visual-caption">Identifiants stables : NordHabitat · DC-MTL · ${M1_SPINE.materialSku} · ${M1_SPINE.signalOwner}.</p>
      </div>
    `,
  },
  {
    id: "frame-07-erp-screen",
    title: "Démonstration écran ERP",
    description:
      "Lecture organisationnelle dans TEC.ERP : départements, signaux et contexte — sans moteur de présentation externe.",
    professorNote:
      "Utiliser le lien ERP organisationnel dans Surface A. L’écran réel remplace toute diapositive isolée.",
    imageAlt: "Démonstration écran ERP organisationnel",
    // imageSrc: "/course-edition/m1/frame-07-erp-screen.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-07-erp-screen">
        <div class="ce-erp-chrome" aria-hidden="true">
          <div class="ce-erp-chrome__bar">
            <span></span><span></span><span></span>
            <strong>TEC.ERP · Organisation NordHabitat</strong>
          </div>
          <div class="ce-erp-chrome__body">
            <aside>
              <p>Modules</p>
              <ul>
                <li class="is-active">Organisation</li>
                <li>Inventaire</li>
                <li>Master data</li>
                <li>KPI</li>
              </ul>
            </aside>
            <section>
              <header>
                <h3>Signal inventaire · ${M1_SPINE.materialSku}</h3>
                <p>Site DC-MTL · Signalé par ${M1_SPINE.signalOwner}</p>
              </header>
              <div class="ce-erp-metrics">
                <div><span>Système</span><strong>${M1_SPINE.inventorySystemQty}</strong></div>
                <div><span>Terrain</span><strong>${M1_SPINE.inventoryPhysicalQty}</strong></div>
                <div class="is-alert"><span>Écart</span><strong>${M1_SPINE.inventoryVariance}</strong></div>
              </div>
              <p class="ce-visual-caption">Runtime dans TEC.ERP — aucun moteur Canva / PDF requis pour enseigner.</p>
            </section>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "frame-08-kpi-systemic",
    title: "Impact KPI et lecture systémique",
    description:
      "L’exactitude d’inventaire relie l’écart local à un risque transversal de décision et de promesse client.",
    professorNote:
      "Préparer le pont vers le Bilan : KPI expliqué (90 % vs ≥ 98 %), pas un score décoratif.",
    imageAlt: "Impact KPI exactitude inventaire",
    // imageSrc: "/course-edition/m1/frame-08-kpi-systemic.webp",
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="frame-08-kpi-systemic">
        <p class="ce-visual-kicker">KPI · exactitude d’inventaire</p>
        <h3>De l’écart local à l’impact systémique</h3>
        <div class="ce-kpi-board">
          <div class="ce-kpi-board__gauge">
            <p class="ce-visual-kicker">Actuel</p>
            <strong>90 %</strong>
            <span>cible ≥ 98 %</span>
          </div>
          <ul class="ce-kpi-board__effects">
            <li><strong>Opérations</strong> — disponibilité douteuse</li>
            <li><strong>Ventes</strong> — promesse client risquée</li>
            <li><strong>Finance</strong> — valorisation incertaine</li>
            <li><strong>Gouvernance</strong> — décision sur données fragmentées</li>
          </ul>
        </div>
        <p class="ce-visual-caption">Document ${M1_SPINE.documentRefs.kpiImpact} · écart ${M1_SPINE.inventoryVariance} unités (${M1_SPINE.inventorySystemQty} vs ${M1_SPINE.inventoryPhysicalQty}).</p>
      </div>
    `,
  },
];

export const M1_ANALYST_ROLE = {
  title: "Rôle de l’analyste ERP",
  paragraphs: [
    "L’analyste ERP observe d’abord : qui produit l’information, qui la consomme, qui la contrôle.",
    "Dans le Module 1, vous n’ajustez pas le stock et vous n’enregistrez aucune transaction. Vous construisez une lecture professionnelle de la fragmentation.",
    `${M1_SPINE.manager} confie ce rôle d’Observateur-Analyste pour préparer les modules transactionnels suivants.`,
  ],
} as const;
