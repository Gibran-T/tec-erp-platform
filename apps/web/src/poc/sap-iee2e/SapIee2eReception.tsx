import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { AchievementDeclared } from "./fixtures.js";
import { ACHIEVEMENT_LABEL } from "./fixtures.js";
import {
  OFFICIAL_TOTAL_DURATION_LABEL,
  OFFICIAL_UNIT_COUNT,
  SAP_ACHIEVEMENT_LABEL_FR,
  SAP_IEE2E_OFFICIAL_FR_URL,
  SAP_IEE2E_OFFICIAL_TITLE,
} from "./officialCourse.js";

export interface SapIee2eReceptionProps {
  readonly compact?: boolean;
  readonly displayName?: string;
  readonly currentUnit?: number;
  readonly sessionNumber?: number;
  readonly progressionLabel?: string;
  readonly achievement?: AchievementDeclared;
  readonly onOpenParcours?: () => void;
  readonly parcoursTo?: string;
}

export function SapIee2eReception({
  compact = false,
  displayName,
  currentUnit,
  sessionNumber,
  progressionLabel,
  achievement = "non_declare",
  onOpenParcours,
  parcoursTo,
}: SapIee2eReceptionProps): ReactNode {
  const accueilSafe = Boolean(parcoursTo);
  const greeting = displayName
    ? `Bienvenue, ${displayName}.`
    : "Bienvenue dans votre parcours SAP.";
  const officialTileTitle = accueilSafe ? "Parcours officiel SAP" : "Cours officiel SAP";
  const progressNote = accueilSafe
    ? "Progression déclarée — vérité officielle sur SAP Learning"
    : "Progression déclarée par l’étudiant — vérité officielle sur SAP Learning";
  const achievementTitle = accueilSafe ? "SAP Achievement" : SAP_ACHIEVEMENT_LABEL_FR;

  return (
    <article
      className={
        compact
          ? "sap-iee2e-poc__card sap-iee2e-poc__discovery sap-iee2e-poc__reception sap-iee2e-poc__reception--compact"
          : "sap-iee2e-poc__card sap-iee2e-poc__discovery sap-iee2e-poc__reception"
      }
      data-testid={compact ? "poc-discovery-card" : "poc-sap-reception"}
    >
      <div className="sap-iee2e-poc__ribbon">Réception SAP · TEC.ERP</div>
      <p className="sap-iee2e-poc__reception-kicker">{greeting}</p>
      {compact ? (
        <h2 id="learner-home-sap-iee2e-title" className="sap-iee2e-poc__h2">
          {SAP_IEE2E_OFFICIAL_TITLE}
        </h2>
      ) : (
        <h1 id="poc-parcours-title" className="sap-iee2e-poc__h1">
          {SAP_IEE2E_OFFICIAL_TITLE}
        </h1>
      )}
      <p className="sap-iee2e-poc__muted">
        Vous entrez dans le parcours officiel SAP Business Suite. TEC.ERP organise la
        cohorte. SAP Learning enseigne.
      </p>

      <div className="sap-iee2e-poc__meta-row">
        <span className="sap-iee2e-poc__pill">{OFFICIAL_UNIT_COUNT} unités officielles</span>
        <span className="sap-iee2e-poc__pill">Durée SAP : {OFFICIAL_TOTAL_DURATION_LABEL}</span>
        {sessionNumber ? (
          <span className="sap-iee2e-poc__pill">Séance Collège {sessionNumber}</span>
        ) : null}
        {currentUnit ? (
          <span className="sap-iee2e-poc__pill">Unité déclarée {currentUnit}</span>
        ) : null}
        {progressionLabel ? (
          <span className="sap-iee2e-poc__pill">{progressionLabel}</span>
        ) : null}
        <span className="sap-iee2e-poc__pill sap-iee2e-poc__pill--accent">
          Achievement : {ACHIEVEMENT_LABEL[achievement]}
        </span>
      </div>

      <p className="sap-iee2e-poc__pill" role="note">
        {progressNote}
      </p>

      <div className="sap-iee2e-poc__launchpad" data-testid="poc-sap-launchpad">
        <a
          className="sap-iee2e-poc__tile sap-iee2e-poc__tile--primary"
          href={SAP_IEE2E_OFFICIAL_FR_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={parcoursTo ? "learner-home-sap-iee2e-official" : "poc-official-sap-link"}
        >
          <span className="sap-iee2e-poc__tile-kicker">Continuer</span>
          <span className="sap-iee2e-poc__tile-title">{officialTileTitle}</span>
          <span className="sap-iee2e-poc__tile-meta">learning.sap.com · FR</span>
        </a>

        {parcoursTo ? (
          <Link className="sap-iee2e-poc__tile" to={parcoursTo} data-testid="learner-home-sap-iee2e-open">
            <span className="sap-iee2e-poc__tile-kicker">Ouvrir</span>
            <span className="sap-iee2e-poc__tile-title">Mon parcours TEC.ERP</span>
            <span className="sap-iee2e-poc__tile-meta">Organisation de la cohorte</span>
          </Link>
        ) : null}

        {onOpenParcours ? (
          <button
            type="button"
            className="sap-iee2e-poc__tile"
            onClick={onOpenParcours}
            aria-label="Continuer mon parcours"
          >
            <span className="sap-iee2e-poc__tile-kicker">Continuer</span>
            <span className="sap-iee2e-poc__tile-title">Mon parcours SAP</span>
            <span className="sap-iee2e-poc__tile-meta">Déclaration et séances Collège</span>
          </button>
        ) : null}

        {!compact ? (
          <a className="sap-iee2e-poc__tile" href="#poc-student-progression">
            <span className="sap-iee2e-poc__tile-kicker">Suivi</span>
            <span className="sap-iee2e-poc__tile-title">Ma progression</span>
            <span className="sap-iee2e-poc__tile-meta">
              {currentUnit ? `Unité ${currentUnit} déclarée` : "Déclaration étudiante"}
            </span>
          </a>
        ) : null}

        <div
          className="sap-iee2e-poc__tile sap-iee2e-poc__tile--achievement"
          data-testid="poc-achievement-seal"
        >
          <span className="sap-iee2e-poc__tile-kicker">Destination SAP</span>
          <span className="sap-iee2e-poc__tile-title">{achievementTitle}</span>
          <span className="sap-iee2e-poc__tile-meta">Émis par SAP Learning — pas par TEC.ERP</span>
        </div>
      </div>

      <aside className="sap-iee2e-poc__disclaimer" role="note">
        <strong>
          Le contenu, les évaluations, la progression officielle et le SAP Achievement sont gérés
          par SAP Learning. TEC.ERP assure l’organisation et l’accompagnement pédagogique de la
          cohorte.
        </strong>
      </aside>
    </article>
  );
}
