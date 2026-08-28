import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";
import {
  EVIDENCE_CATALOG,
  PRIMARY_THREAT_DECISION,
  evaluateConsequence,
  type MissionLedgerEvent,
  type MissionSessionEnvelopeV1,
} from "./mission-entry/index.js";
import { useMissionEntrySession } from "./mission-entry/useMissionEntrySession.js";

function consequencePayload(event: MissionLedgerEvent): Record<string, unknown> | null {
  if (event.type !== "CONSEQUENCE_APPLIED") return null;
  return event.payload;
}

export function MissionEntryPage(): ReactNode {
  const { locale } = usePlayback();
  const fr = locale === "fr";
  const {
    ready,
    snapshot,
    recoveryNotice,
    startMission,
    collectEvidence,
    recordDecision,
    applyConsequence,
    acknowledgeDebrief,
    completeMission,
    abandonMission,
    resumeMission,
    resetSession,
    clearRecoveryNotice,
  } = useMissionEntrySession();

  if (!ready || !snapshot) {
    return (
      <main className="playback-shell" data-testid="mission-entry-loading">
        <p>{fr ? "Chargement de la session…" : "Loading session…"}</p>
      </main>
    );
  }

  const consequenceEvent = snapshot.ledger.find((e) => e.type === "CONSEQUENCE_APPLIED");
  const consequenceView =
    snapshot.decisionId !== null ? evaluateConsequence(snapshot.decisionId) : null;
  const storedConsequence = consequenceEvent ? consequencePayload(consequenceEvent) : null;

  return (
    <main className="playback-shell" data-testid="mission-entry">
      <div className="playback-topnav">
        <div>
          <span className="playback-chip">SO-1048 · Mission 1</span>
          <h1 style={{ margin: "0.35rem 0 0", fontSize: "1.45rem" }}>
            {fr ? "Enquête et diagnostic" : "Inquiry and diagnosis"}
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "var(--pb-muted)" }}>
            {fr
              ? "Playback isolé — sessionStorage uniquement, sans API production."
              : "Isolated playback — sessionStorage only, no production API."}
          </p>
        </div>
        <Link
          className="playback-btn playback-btn--ghost playback-btn--small"
          to="/playback/v2/orientation"
          data-testid="mission-entry-back"
        >
          {fr ? "Retour au cockpit" : "Back to cockpit"}
        </Link>
      </div>

      {recoveryNotice?.active ? (
        <div className="pb-mission-recovery" role="alert" data-testid="mission-recovery-notice">
          <strong>{fr ? "Reprise sécurisée" : "Safe recovery"}</strong>
          <p>{recoveryNotice.message}</p>
          <button type="button" className="playback-btn playback-btn--small" onClick={clearRecoveryNotice}>
            {fr ? "Compris" : "Dismiss"}
          </button>
        </div>
      ) : null}

      <div className="pb-mission-entry-grid">
        <section className="pb-panel" aria-labelledby="mission-status-title" data-testid="mission-entry-status">
          <h2 id="mission-status-title">{fr ? "État de session" : "Session status"}</h2>
          <p>
            <strong>{fr ? "Statut" : "Status"}:</strong>{" "}
            <span data-testid="mission-entry-status-value">{snapshot.status}</span>
          </p>
          <p>
            <strong>{fr ? "Preuves" : "Evidence"}:</strong>{" "}
            <span data-testid="mission-entry-evidence-count">{snapshot.evidenceIds.length}</span>
          </p>
          <SessionActions
            fr={fr}
            snapshot={snapshot}
            onStart={() => startMission()}
            onAbandon={() => abandonMission()}
            onResume={() => resumeMission()}
            onReset={() => resetSession()}
          />
        </section>

        <section className="pb-panel" aria-labelledby="evidence-title" data-testid="mission-entry-evidence">
          <h2 id="evidence-title">{fr ? "Preuves à collecter" : "Evidence to collect"}</h2>
          <ul className="pb-mission-evidence-list">
            {EVIDENCE_CATALOG.map((item) => {
              const collected = snapshot.evidenceIds.includes(item.id);
              return (
                <li key={item.id}>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <button
                    type="button"
                    className="playback-btn playback-btn--small"
                    data-testid={`collect-${item.id}`}
                    disabled={collected || snapshot.status !== "IN_PROGRESS"}
                    onClick={() => collectEvidence(item.id)}
                  >
                    {collected ? (fr ? "Collectée" : "Collected") : fr ? "Collecter" : "Collect"}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="pb-panel" aria-labelledby="decision-title" data-testid="mission-entry-decision">
          <h2 id="decision-title">{PRIMARY_THREAT_DECISION.question}</h2>
          <div className="pb-mission-decision-grid">
            {PRIMARY_THREAT_DECISION.options.map((option) => {
              const selected = snapshot.decisionId === option.id;
              const locked =
                snapshot.decisionId !== null ||
                snapshot.status !== "IN_PROGRESS" ||
                snapshot.evidenceIds.length < 1;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`playback-btn playback-btn--ghost pb-decision-option${selected ? " pb-decision-option--selected" : ""}`}
                  data-testid={`decision-${option.id}`}
                  disabled={locked}
                  onClick={() => recordDecision(option.id)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.meaning}</span>
                </button>
              );
            })}
          </div>
          {snapshot.status === "DECISION_RECORDED" ? (
            <button
              type="button"
              className="playback-btn"
              data-testid="apply-consequence"
              onClick={() => applyConsequence()}
            >
              {fr ? "Appliquer la conséquence" : "Apply consequence"}
            </button>
          ) : null}
        </section>

        {snapshot.status === "CONSEQUENCE_APPLIED" || snapshot.status === "COMPLETED" ? (
          <section className="pb-panel" aria-labelledby="consequence-title" data-testid="mission-entry-consequence">
            <h2 id="consequence-title">{fr ? "Conséquence" : "Consequence"}</h2>
            {consequenceView ? (
              <>
                <p>
                  <strong>{fr ? "Pouls entreprise" : "Enterprise pulse"}:</strong>{" "}
                  {String(storedConsequence?.enterprisePulse ?? consequenceView.enterprisePulse)}
                </p>
                <p>
                  <strong>{fr ? "Boîte de réception" : "Inbox"}:</strong>{" "}
                  {String(storedConsequence?.stakeholderInbox ?? consequenceView.stakeholderInbox)}
                </p>
                <p>
                  <strong>KPI:</strong>{" "}
                  {String(storedConsequence?.kpiPreview ?? consequenceView.kpiPreview)}
                </p>
                <p>
                  <strong>{fr ? "Débrief" : "Debrief"}:</strong>{" "}
                  {String(storedConsequence?.debriefPrompt ?? consequenceView.debriefPrompt)}
                </p>
              </>
            ) : null}
            {snapshot.status === "CONSEQUENCE_APPLIED" ? (
              <div className="pb-mission-debrief-actions">
                <button
                  type="button"
                  className="playback-btn playback-btn--ghost"
                  data-testid="ack-debrief"
                  disabled={snapshot.debriefAcknowledged}
                  onClick={() => acknowledgeDebrief()}
                >
                  {snapshot.debriefAcknowledged
                    ? fr
                      ? "Débrief reconnu"
                      : "Debrief acknowledged"
                    : fr
                      ? "Reconnaître le débrief"
                      : "Acknowledge debrief"}
                </button>
                <button
                  type="button"
                  className="playback-btn"
                  data-testid="complete-mission"
                  disabled={!snapshot.debriefAcknowledged}
                  onClick={() => completeMission()}
                >
                  {fr ? "Terminer la mission" : "Complete mission"}
                </button>
              </div>
            ) : null}
            {snapshot.status === "COMPLETED" ? (
              <p data-testid="mission-completed-banner">
                {fr ? "Mission 1 terminée (playback)." : "Mission 1 completed (playback)."}
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="pb-panel pb-mission-ledger" aria-labelledby="ledger-title" data-testid="mission-entry-ledger">
          <h2 id="ledger-title">{fr ? "Registre (aperçu QA)" : "Ledger (QA preview)"}</h2>
          <ol className="pb-mission-ledger-list">
            {snapshot.ledger.map((event) => (
              <li key={event.id} data-testid={`ledger-${event.type}`}>
                <code>{event.type}</code>
                <span>{event.actor}</span>
                <time dateTime={event.timestamp}>{event.timestamp}</time>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

function SessionActions({
  fr,
  snapshot,
  onStart,
  onAbandon,
  onResume,
  onReset,
}: {
  fr: boolean;
  snapshot: MissionSessionEnvelopeV1;
  onStart: () => void;
  onAbandon: () => void;
  onResume: () => void;
  onReset: () => void;
}): ReactNode {
  return (
    <div className="pb-mission-session-actions">
      {snapshot.status === "NOT_STARTED" ? (
        <button type="button" className="playback-btn" data-testid="start-mission" onClick={onStart}>
          {fr ? "Démarrer la mission" : "Start mission"}
        </button>
      ) : null}
      {snapshot.status === "ABANDONED" ? (
        <button type="button" className="playback-btn" data-testid="resume-mission" onClick={onResume}>
          {fr ? "Reprendre la session" : "Resume session"}
        </button>
      ) : null}
      {snapshot.status === "IN_PROGRESS" ||
      snapshot.status === "DECISION_RECORDED" ||
      snapshot.status === "CONSEQUENCE_APPLIED" ? (
        <button type="button" className="playback-btn playback-btn--ghost" data-testid="abandon-mission" onClick={onAbandon}>
          {fr ? "Abandonner" : "Abandon"}
        </button>
      ) : null}
      <button type="button" className="playback-btn playback-btn--ghost playback-btn--small" data-testid="reset-mission" onClick={onReset}>
        {fr ? "Réinitialiser" : "Reset"}
      </button>
    </div>
  );
}
