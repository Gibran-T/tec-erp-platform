import type { ReactNode } from "react";
import type { SapIee2eCalendarView, SapIee2eSemaineZeroChecklist } from "@tec-platform/contracts";

export const SEMAINE_ZERO_STEPS: ReadonlyArray<{
  readonly key: keyof SapIee2eSemaineZeroChecklist;
  readonly label: string;
}> = [
  {
    key: "universalId",
    label: "Identifiant SAP Universal ID créé (compte individuel — jamais partagé)",
  },
  {
    key: "learningHub",
    label: "Accès à SAP Learning confirmé (learning.sap.com s’ouvre)",
  },
  {
    key: "iee2eOpened",
    label: "Parcours IEE2E ouvert au moins une fois sur SAP Learning",
  },
  {
    key: "noSharedAccount",
    label: "Je m’engage à ne jamais utiliser le compte d’un camarade",
  },
  {
    key: "contingencyAck",
    label:
      "Si l’accès n’est pas prêt pour la séance 1 : je préviens le professeur — plan B, jamais un compte partagé",
  },
];

export interface SapIee2eSemaineZeroPanelProps {
  readonly checklist: SapIee2eSemaineZeroChecklist;
  readonly ready: boolean;
  readonly calendar: SapIee2eCalendarView;
  readonly editable: boolean;
  readonly onToggle?: (key: keyof SapIee2eSemaineZeroChecklist) => void;
  readonly session1Date?: string;
  readonly onSession1DateChange?: (value: string) => void;
  readonly pendingCount?: number;
  readonly readyCount?: number;
  readonly totalCount?: number;
  readonly pendingNames?: readonly string[];
  readonly urgent?: boolean;
}

export function SapIee2eSemaineZeroPanel({
  checklist,
  ready,
  calendar,
  editable,
  onToggle,
  session1Date,
  onSession1DateChange,
  pendingCount,
  readyCount,
  totalCount,
  pendingNames,
  urgent = false,
}: SapIee2eSemaineZeroPanelProps): ReactNode {
  return (
    <article
      className="sap-iee2e-poc__card sap-iee2e-poc__teach"
      data-testid="poc-semaine-zero"
      data-urgent={urgent ? "true" : "false"}
    >
      <div className="sap-iee2e-poc__ribbon">Semaine Zéro · avant la séance 1</div>
      <h2 className="sap-iee2e-poc__h2">Préparer l’accès SAP individuel</h2>
      <p className="sap-iee2e-poc__muted">{calendar.windowLabel}</p>
      {typeof pendingCount === "number" && typeof readyCount === "number" ? (
        <p>
          <strong>
            {readyCount}/{totalCount ?? readyCount + pendingCount} prêts
          </strong>
          {pendingCount > 0 ? ` · ${pendingCount} encore sans accès confirmé` : " · cohorte prête"}
        </p>
      ) : null}
      {onSession1DateChange ? (
        <div className="sap-iee2e-poc__field">
          <label htmlFor="poc-session1-date">Date de la séance 1 (Collège)</label>
          <input
            id="poc-session1-date"
            type="date"
            value={session1Date ?? calendar.session1Date ?? ""}
            onChange={(event) => onSession1DateChange(event.target.value)}
            data-testid="poc-session1-date"
          />
        </div>
      ) : null}
      <p className="sap-iee2e-poc__pill sap-iee2e-poc__pill--warn" role="note">
        Compte individuel obligatoire. Un accès en retard se rattrape — il ne se prête jamais.
      </p>
      {pendingNames && pendingNames.length > 0 ? (
        <ul className="sap-iee2e-poc__checklist" data-testid="poc-semaine-zero-pending">
          {pendingNames.map((name) => (
            <li key={name}>{name} — Semaine Zéro non déclarée complète</li>
          ))}
        </ul>
      ) : null}
      {onSession1DateChange ? null : (
        <>
          <ul className="sap-iee2e-poc__checklist">
            {SEMAINE_ZERO_STEPS.map((step) => (
              <li key={step.key}>
                <input
                  type="checkbox"
                  checked={checklist[step.key]}
                  disabled={!editable}
                  aria-label={step.label}
                  onChange={() => onToggle?.(step.key)}
                />
                {step.label}
              </li>
            ))}
          </ul>
          <p className={ready ? "sap-iee2e-poc__pill sap-iee2e-poc__pill--ok" : "sap-iee2e-poc__pill"}>
            {ready
              ? "Semaine Zéro déclarée complète — vous pouvez entrer en séance 1."
              : "Semaine Zéro incomplète — à clôturer avant la séance 1."}
          </p>
        </>
      )}
    </article>
  );
}
