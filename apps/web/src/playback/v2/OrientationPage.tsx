import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";

export function OrientationPage(): ReactNode {
  const { copy, locale, selectedModule, tModuleTitle, tRole, level } = usePlayback();

  const modeLabel =
    level === "novice"
      ? copy.modes.guided.name
      : level === "intermediate"
        ? copy.modes.simulation.name
        : copy.modes.evaluation.name;

  return (
    <main className="playback-orientation" data-testid="playback-orientation">
      <p className="playback-eyebrow">TEC.ERP · Equinoxe</p>
      <h1>{copy.orientation.title}</h1>
      <p className="playback-note">
        {locale === "fr" ? "Pont d’orientation — Wave 3 à venir" : "Orientation bridge — Wave 3 upcoming"}
      </p>

      <div className="playback-orientation-grid">
        <article className="playback-orientation-card">
          <h3>{copy.orientation.where}</h3>
          <p>
            {locale === "fr"
              ? "Portail TEC.ERP → orientation Equinoxe"
              : "TEC.ERP portal → Equinoxe orientation"}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.who}</h3>
          <p>
            {locale === "fr" ? "Camille Tremblay" : "Camille Tremblay"} · {tRole(selectedModule.role)}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.mandate}</h3>
          <p>
            {selectedModule.code} — {locale === "fr" ? selectedModule.mandateFr : selectedModule.mandateEn}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.company}</h3>
          <p>{copy.orientation.pulse}: OTIF 91% · {locale === "fr" ? "stock tendu sur famille A" : "tight stock on family A"}</p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.next}</h3>
          <p>
            {locale === "fr"
              ? `Ouvrir le mandat ${selectedModule.code} (${tModuleTitle(selectedModule)}) — Mission 1 enquête`
              : `Open mandate ${selectedModule.code} (${tModuleTitle(selectedModule)}) — Mission 1 investigation`}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.mode}</h3>
          <p>{modeLabel}</p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.evidence}</h3>
          <p>
            {locale === "fr"
              ? "0 / 3 preuves de mandat · dossier ouvert"
              : "0 / 3 mandate evidence items · dossier open"}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.message}</h3>
          <p>
            {locale === "fr"
              ? "Superviseur: préparez le cadrage avant le comité de 10 h."
              : "Supervisor: prepare framing before the 10:00 committee."}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{copy.orientation.professor}</h3>
          <p>
            {locale === "fr"
              ? "Classe en cours · Professor disponible pour débrief"
              : "Class in session · Professor available for debrief"}
          </p>
        </article>
        <article className="playback-orientation-card">
          <h3>{locale === "fr" ? "Position M1–M10" : "M1–M10 position"}</h3>
          <p>
            {selectedModule.code} / M10 · Capstone {locale === "fr" ? "séparé" : "separate"}
          </p>
        </article>
      </div>

      <div className="playback-hero-actions" style={{ marginTop: "1.25rem" }}>
        <Link className="playback-btn playback-btn--primary" to="/playback/v2/portal#parcours">
          {copy.orientation.continue}
        </Link>
        <Link className="playback-btn" to="/playback/v2/portal">
          {copy.orientation.backPortal}
        </Link>
      </div>
    </main>
  );
}
