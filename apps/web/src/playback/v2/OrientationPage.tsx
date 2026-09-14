import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";

/**
 * Mission Cockpit (route may remain /orientation during Wave 2A).
 * First post-login destination: active mandate, not generic curriculum.
 * Future route recommendation: /playback/v2/mission-cockpit
 */
export function OrientationPage(): ReactNode {
  const { copy, branding, endorsement, locale, missionPreviewOpen, setMissionPreviewOpen } = usePlayback();
  const c = copy.cockpit;
  const fr = locale === "fr";

  return (
    <main className="playback-shell" data-testid="mission-cockpit">
      <div className="pb-cockpit-top">
        <div>
          <strong data-testid="cockpit-greeting">{c.greeting}</strong>
          <div className="pb-cockpit-meta">
            <span>{c.role}</span>
            <span>{c.module}</span>
            <span>{c.classContext}</span>
            <span>{c.professor}</span>
          </div>
          <div className="playback-brand" style={{ marginTop: "0.55rem", fontSize: "1rem" }}>
            {branding.productName}
            {branding.showInstitution && endorsement ? (
              <span className="playback-endorsement" style={{ marginLeft: "0.65rem" }}>
                {endorsement}
              </span>
            ) : null}
          </div>
        </div>
        <Link className="playback-btn playback-btn--ghost playback-btn--small" to="/playback/v2/portal">
          {copy.login.back}
        </Link>
      </div>

      <div className="pb-cockpit-grid">
        <section className="pb-mission-primary" aria-labelledby="mandate-title" data-testid="cockpit-primary">
          <span className="playback-chip">{c.mandateTitle}</span>
          <h1 id="mandate-title" style={{ margin: "0.35rem 0 0.65rem", fontSize: "1.55rem" }}>
            {fr ? "SO-1048 · promesse client sous tension" : "SO-1048 · customer promise under tension"}
          </h1>
          <p>{c.situation}</p>
          <p>
            <strong>{c.decision}</strong>
          </p>
          <div className="pb-mission-support">
            <div>
              <strong>{fr ? "Preuve attendue" : "Expected evidence"}</strong>
              {c.nextEvidence}
            </div>
            <div>
              <strong>{fr ? "Signal processus" : "Process signal"}</strong>
              {fr
                ? "Order-to-Cash (commande à encaissement) · SO-1048"
                : "Order-to-Cash · SO-1048"}
            </div>
            <div>
              <strong>{fr ? "Contexte d’apprentissage" : "Learning context"}</strong>
              {c.mode}
            </div>
            <div>
              <strong>{fr ? "Partie prenante active" : "Active stakeholder"}</strong>
              {fr ? "Marc Tremblay · Directeur commercial" : "Marc Tremblay · Sales director"}
            </div>
          </div>
          <button
            type="button"
            className="playback-btn"
            data-testid="cockpit-primary-cta"
            onClick={() => setMissionPreviewOpen(true)}
          >
            {c.cta}
          </button>
        </section>

        <aside className="pb-cockpit-side">
          <section className="pb-panel" data-testid="cockpit-enterprise-pulse" aria-labelledby="pulse-mini-title">
            <h3 id="pulse-mini-title">{c.pulseTitle}</h3>
            <ul className="pb-pulse-mini">
              <li>OTIF 91 %</li>
              <li>{fr ? "Stocks famille A sous tension" : "Family A inventory under tension"}</li>
              <li>{fr ? "Demande client active · 140 unités" : "Active customer demand · 140 units"}</li>
              <li>{fr ? "Dépendance fournisseur · +4 jours" : "Supplier dependency · +4 days"}</li>
              <li>{fr ? "Risque opérationnel : promesse vendredi" : "Operational risk: Friday promise"}</li>
            </ul>
          </section>

          <section className="pb-panel" data-testid="cockpit-inbox" aria-labelledby="inbox-title">
            <h3 id="inbox-title">{c.inboxTitle}</h3>
            <div className="pb-inbox-item">
              <strong>{fr ? "Marc Tremblay · Directeur commercial" : "Marc Tremblay · Sales director"}</strong>
              <span className="pb-urgency">{fr ? "Urgent" : "Urgent"}</span>
              <span>{fr ? "Confirmation demandée avant 15 h" : "Confirmation requested before 3 p.m."}</span>
              <span>{fr ? "Action : établir les preuves de risque" : "Action: establish risk evidence"}</span>
            </div>
            <div className="pb-inbox-item">
              <strong>{fr ? "NordLog Parts · Fournisseur" : "NordLog Parts · Supplier"}</strong>
              <span>{fr ? "+4 jours si quantité > 120" : "+4 days if quantity > 120"}</span>
              <span>{fr ? "Action : intégrer au diagnostic" : "Action: include in diagnosis"}</span>
            </div>
          </section>

          <section className="pb-panel" data-testid="cockpit-evidence" aria-labelledby="evidence-title">
            <h3 id="evidence-title">{c.evidenceTitle}</h3>
            <p>{c.evidenceStatus}</p>
            <p>{c.nextEvidence}</p>
            <p style={{ color: "var(--pb-muted)", fontSize: "0.86rem" }}>
              {fr
                ? "Types : carte processus · message partie prenante · indicateur clé de performance (KPI)"
                : "Types: process map · stakeholder message · key performance indicator (KPI)"}
            </p>
          </section>

          <section className="pb-panel" data-testid="cockpit-learning" aria-labelledby="learning-title">
            <h3 id="learning-title">{c.learningTitle}</h3>
            <p>{c.mode}</p>
            <p>{c.professor}</p>
            <p>{c.progress}</p>
            <p>{c.capstoneNote}</p>
          </section>
        </aside>
      </div>

      {missionPreviewOpen ? (
        <div className="pb-modal-backdrop" role="presentation">
          <div
            className="pb-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mission-preview-title"
            data-testid="mission-preview"
          >
            <span className="pb-preview-badge">{copy.previewBadge}</span>
            <h2 id="mission-preview-title">{c.previewTitle}</h2>
            <p>{c.previewLead}</p>
            <p>
              <strong>M1 → Mandat actif → Mission 1 — Enquête et diagnostic</strong>
            </p>
            <button
              type="button"
              className="playback-btn"
              data-testid="mission-preview-close"
              onClick={() => setMissionPreviewOpen(false)}
            >
              {c.previewClose}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
