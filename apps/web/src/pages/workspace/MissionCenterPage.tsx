import type {
  DepartmentProblemMapping,
  DiscoveryContextItem,
  MissionDetail,
} from "@tec-platform/contracts";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  buildGenericResponses,
  MissionInteractionRenderer,
  type InteractionResponses,
} from "../../mission/MissionInteractions.js";
import { useMissionData } from "../../mission/MissionDataContext.js";
import {
  ACKNOWLEDGE_INPUTS_LEGEND,
  COMPETENCIES_LABEL,
  JUSTIFICATION_HINT,
  MAPPING_LEGEND,
  MISSION_CENTER_TITLE,
  MISSION_STATUS_LABELS,
  OBJECTIVE_LABEL,
  PROGRESS_LABEL,
  RESULT_PASSED_LABEL,
  RESULT_RETRY_LABEL,
  RETRY_MISSION_LABEL,
  START_MISSION_LABEL,
  SUBMIT_MISSION_LABEL,
  SUBMIT_RESPONSES_LABEL,
} from "../../mission/missionCopy.js";

const JUSTIFICATION_MIN = 40;
const JUSTIFICATION_MAX = 1000;
const MINIMUM_MAPPINGS = 2;

function pairKey(departmentKey: string, problemKey: string): string {
  return `${departmentKey}::${problemKey}`;
}

function usesLegacyProcessMap(detail: MissionDetail): boolean {
  return Boolean(
    detail.contextItems?.length &&
      detail.departments?.length &&
      detail.problems?.length,
  );
}

function MissionSummaryCard({
  detail,
  onOpen,
}: {
  detail: {
    missionKey: string;
    title: string;
    status: keyof typeof MISSION_STATUS_LABELS;
    preview: string;
    unlockExplanation: string | null;
  };
  onOpen: () => void;
}): ReactNode {
  return (
    <article className="workspace-mission__card" data-testid={`mission-summary-${detail.missionKey}`}>
      <header className="workspace-mission__card-header">
        <h2>{detail.title}</h2>
        <span className="workspace-mission__status" data-testid="mission-status-badge">
          {MISSION_STATUS_LABELS[detail.status]}
        </span>
      </header>
      <p>{detail.preview}</p>
      {detail.status === "locked" && detail.unlockExplanation ? (
        <p className="workspace-mission__unlock" data-testid="mission-unlock-explanation">
          {detail.unlockExplanation}
        </p>
      ) : (
        <button
          type="button"
          className="workspace-mission__button"
          data-testid="mission-open-button"
          onClick={onOpen}
        >
          Ouvrir la mission
        </button>
      )}
    </article>
  );
}

function ContextItems({
  items,
  acknowledged,
  onToggle,
  disabled,
}: {
  items: readonly DiscoveryContextItem[];
  acknowledged: ReadonlySet<string>;
  onToggle: (key: string) => void;
  disabled: boolean;
}): ReactNode {
  return (
    <fieldset className="workspace-mission__fieldset" disabled={disabled}>
      <legend>{ACKNOWLEDGE_INPUTS_LEGEND}</legend>
      <ul className="workspace-mission__context-list">
        {items.map((item) => (
          <li key={item.key}>
            <article
              className="workspace-mission__context-item"
              data-testid={`mission-context-${item.key}`}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <label className="workspace-mission__checkbox">
                <input
                  type="checkbox"
                  checked={acknowledged.has(item.key)}
                  onChange={() => onToggle(item.key)}
                  data-testid={`mission-ack-${item.key}`}
                />
                <span>
                  Je reconnais ce contexte
                  {item.required ? " (requis)" : ""}
                </span>
              </label>
            </article>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function MappingEditor({
  departments,
  problems,
  mappings,
  onChange,
  disabled,
}: {
  departments: NonNullable<MissionDetail["departments"]>;
  problems: NonNullable<MissionDetail["problems"]>;
  mappings: DepartmentProblemMapping[];
  onChange: (next: DepartmentProblemMapping[]) => void;
  disabled: boolean;
}): ReactNode {
  const [departmentKey, setDepartmentKey] = useState(departments[0]?.key ?? "");
  const [problemKey, setProblemKey] = useState(problems[0]?.key ?? "");

  useEffect(() => {
    if (!departmentKey && departments[0]) {
      setDepartmentKey(departments[0].key);
    }
    if (!problemKey && problems[0]) {
      setProblemKey(problems[0].key);
    }
  }, [departmentKey, departments, problemKey, problems]);

  return (
    <fieldset className="workspace-mission__fieldset" disabled={disabled}>
      <legend>{MAPPING_LEGEND}</legend>
      <div className="workspace-mission__mapping-controls">
        <label>
          Département
          <select
            value={departmentKey}
            onChange={(event) => setDepartmentKey(event.target.value)}
            data-testid="mission-department-select"
          >
            {departments.map((department) => (
              <option key={department.key} value={department.key}>
                {department.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Problème d’affaires
          <select
            value={problemKey}
            onChange={(event) => setProblemKey(event.target.value)}
            data-testid="mission-problem-select"
          >
            {problems.map((problem) => (
              <option key={problem.key} value={problem.key}>
                {problem.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="workspace-mission__button workspace-mission__button--secondary"
          data-testid="mission-add-mapping"
          onClick={() => {
            if (!departmentKey || !problemKey) {
              return;
            }

            const key = pairKey(departmentKey, problemKey);
            if (mappings.some((mapping) => pairKey(mapping.departmentKey, mapping.problemKey) === key)) {
              return;
            }

            onChange([...mappings, { departmentKey, problemKey }]);
          }}
        >
          Ajouter l’association
        </button>
      </div>
      <ul className="workspace-mission__mapping-list" data-testid="mission-mapping-list">
        {mappings.map((mapping) => {
          const departmentLabel =
            departments.find((item) => item.key === mapping.departmentKey)?.label ??
            mapping.departmentKey;
          const problemLabel =
            problems.find((item) => item.key === mapping.problemKey)?.label ?? mapping.problemKey;
          const key = pairKey(mapping.departmentKey, mapping.problemKey);

          return (
            <li key={key}>
              <span>
                {departmentLabel} → {problemLabel}
              </span>
              <button
                type="button"
                className="workspace-mission__link-button"
                data-testid={`mission-remove-mapping-${key}`}
                onClick={() =>
                  onChange(
                    mappings.filter(
                      (item) =>
                        pairKey(item.departmentKey, item.problemKey) !== key,
                    ),
                  )
                }
              >
                Retirer
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function MissionMeta({ detail }: { detail: MissionDetail }): ReactNode {
  const competencyCodes =
    "competencyCodes" in detail && Array.isArray(detail.competencyCodes)
      ? detail.competencyCodes.filter((item): item is string => typeof item === "string")
      : [];

  return (
    <>
      {detail.preview ? (
        <article className="workspace-mission__briefing" data-testid="mission-objective">
          <h3>{OBJECTIVE_LABEL}</h3>
          <p>{detail.preview}</p>
        </article>
      ) : null}
      {competencyCodes.length > 0 ? (
        <article className="workspace-mission__briefing" data-testid="mission-competencies">
          <h3>{COMPETENCIES_LABEL}</h3>
          <ul className="workspace-mission__competency-list">
            {competencyCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </article>
      ) : null}
      {detail.briefing ? (
        <article className="workspace-mission__briefing" data-testid="mission-briefing">
          <h3>Briefing de Claire Fontaine</h3>
          <pre className="workspace-mission__briefing-body">{detail.briefing}</pre>
        </article>
      ) : null}
    </>
  );
}

function MissionDetailView({
  detail,
}: {
  detail: MissionDetail;
}): ReactNode {
  const {
    startMission,
    submitMission,
    starting,
    submitting,
    startError,
    submitError,
    lastScore,
    clearSelectedMission,
  } = useMissionData();

  const completed = detail.status === "completed";
  const inProgress = detail.status === "in_progress";
  const available = detail.status === "available";
  const legacyMode = usesLegacyProcessMap(detail);
  const interactions = detail.interactions ?? [];
  const genericMode = !legacyMode && interactions.length > 0;

  const [acknowledged, setAcknowledged] = useState<Set<string>>(
    () => new Set(detail.attempt?.acknowledgedInputKeys ?? []),
  );
  const [mappings, setMappings] = useState<DepartmentProblemMapping[]>(
    () => [...(detail.attempt?.departmentProblemMappings ?? [])],
  );
  const [justification, setJustification] = useState(detail.attempt?.justification ?? "");
  const [responses, setResponses] = useState<InteractionResponses>({});
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    setAcknowledged(new Set(detail.attempt?.acknowledgedInputKeys ?? []));
    setMappings([...(detail.attempt?.departmentProblemMappings ?? [])]);
    setJustification(detail.attempt?.justification ?? "");
    setResponses({});
    setClientError(null);
  }, [detail]);

  const requiredKeys = useMemo(
    () => (detail.contextItems ?? []).filter((item) => item.required).map((item) => item.key),
    [detail.contextItems],
  );

  if (detail.status === "locked") {
    return (
      <section className="workspace-mission__detail" data-testid="mission-detail-locked">
        <button
          type="button"
          className="workspace-mission__link-button"
          onClick={clearSelectedMission}
        >
          Retour
        </button>
        <h2>{detail.title}</h2>
        <p data-testid="mission-unlock-explanation">{detail.unlockExplanation}</p>
      </section>
    );
  }

  const canEdit = inProgress && !completed;
  const showRetry = Boolean(lastScore && !lastScore.passed && canEdit);

  return (
    <section className="workspace-mission__detail" data-testid="mission-detail">
      <button
        type="button"
        className="workspace-mission__link-button"
        data-testid="mission-back-button"
        onClick={clearSelectedMission}
      >
        Retour à la liste
      </button>
      <header className="workspace-mission__detail-header">
        <h2>{detail.title}</h2>
        <span className="workspace-mission__status">{MISSION_STATUS_LABELS[detail.status]}</span>
      </header>

      <MissionMeta detail={detail} />

      {available ? (
        <div className="workspace-mission__actions">
          <button
            type="button"
            className="workspace-mission__button"
            data-testid="mission-start-button"
            disabled={starting}
            aria-busy={starting}
            onClick={() => {
              void startMission(detail.missionKey);
            }}
          >
            {starting ? "Démarrage…" : START_MISSION_LABEL}
          </button>
          {startError ? (
            <p className="workspace-first-day__error" role="alert" data-testid="mission-start-error">
              {startError}
            </p>
          ) : null}
        </div>
      ) : null}

      {legacyMode && detail.contextItems ? (
        <ContextItems
          items={detail.contextItems}
          acknowledged={acknowledged}
          disabled={!canEdit}
          onToggle={(key) => {
            setAcknowledged((current) => {
              const next = new Set(current);
              if (next.has(key)) {
                next.delete(key);
              } else {
                next.add(key);
              }
              return next;
            });
          }}
        />
      ) : null}

      {legacyMode && detail.departments && detail.problems ? (
        <MappingEditor
          departments={detail.departments}
          problems={detail.problems}
          mappings={mappings}
          onChange={setMappings}
          disabled={!canEdit}
        />
      ) : null}

      {legacyMode && (inProgress || completed) ? (
        <label className="workspace-mission__justification">
          Justification
          <textarea
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
            disabled={!canEdit}
            rows={5}
            maxLength={JUSTIFICATION_MAX}
            data-testid="mission-justification"
            aria-describedby="mission-justification-hint"
          />
          <span id="mission-justification-hint">{JUSTIFICATION_HINT}</span>
        </label>
      ) : null}

      {genericMode
        ? interactions.map((interaction) => (
            <MissionInteractionRenderer
              key={interaction.id}
              interaction={interaction}
              contextItems={detail.contextItems}
              value={responses[interaction.id]}
              disabled={!canEdit}
              onChange={(next) => {
                setResponses((current) => ({
                  ...current,
                  [interaction.id]: next,
                }));
              }}
            />
          ))
        : null}

      {/* When legacy fields and generic interactions coexist, still render interactions. */}
      {legacyMode && interactions.length > 0
        ? interactions.map((interaction) => (
            <MissionInteractionRenderer
              key={interaction.id}
              interaction={interaction}
              contextItems={detail.contextItems}
              value={responses[interaction.id]}
              disabled={!canEdit}
              onChange={(next) => {
                setResponses((current) => ({
                  ...current,
                  [interaction.id]: next,
                }));
              }}
            />
          ))
        : null}

      {canEdit ? (
        <div className="workspace-mission__actions">
          <button
            type="button"
            className="workspace-mission__button"
            data-testid="mission-submit-button"
            disabled={submitting}
            aria-busy={submitting}
            onClick={() => {
              setClientError(null);

              if (legacyMode) {
                for (const requiredKey of requiredKeys) {
                  if (!acknowledged.has(requiredKey)) {
                    setClientError(
                      "Reconnaissez tous les contextes requis avant de soumettre.",
                    );
                    return;
                  }
                }

                if (mappings.length < MINIMUM_MAPPINGS) {
                  setClientError(
                    `Ajoutez au moins ${MINIMUM_MAPPINGS} associations département/problème.`,
                  );
                  return;
                }

                const trimmed = justification.trim();
                if (trimmed.length < JUSTIFICATION_MIN || trimmed.length > JUSTIFICATION_MAX) {
                  setClientError(
                    `La justification doit contenir entre ${JUSTIFICATION_MIN} et ${JUSTIFICATION_MAX} caractères.`,
                  );
                  return;
                }

                void submitMission(detail.missionKey, {
                  acknowledgedInputKeys: [...acknowledged],
                  departmentProblemMappings: mappings,
                  justification: trimmed,
                });
                return;
              }

              for (const interaction of interactions) {
                const current = responses[interaction.id];
                if (interaction.type === "SINGLE_CHOICE" && typeof current !== "string") {
                  setClientError("Complétez toutes les questions avant de soumettre.");
                  return;
                }
                if (
                  interaction.type === "NUMERIC_INPUT" &&
                  (typeof current !== "number" || !Number.isFinite(current))
                ) {
                  setClientError("Indiquez une valeur numérique valide avant de soumettre.");
                  return;
                }
                if (
                  interaction.type === "TEXT_ANALYSIS" &&
                  (typeof current !== "string" || current.trim().length < 20)
                ) {
                  setClientError("Rédigez une analyse textuelle avant de soumettre.");
                  return;
                }
                if (
                  (interaction.type === "MULTI_CHOICE" ||
                    interaction.type === "PROCESS_MAP_ACKNOWLEDGEMENT") &&
                  (!Array.isArray(current) ||
                    !current.every((item) => typeof item === "string") ||
                    current.length === 0)
                ) {
                  setClientError("Sélectionnez au moins une option avant de soumettre.");
                  return;
                }
                if (
                  interaction.type === "DIAGNOSIS_RECOMMENDATION" &&
                  (!Array.isArray(current) || current.length === 0)
                ) {
                  setClientError("Ajoutez au moins une association avant de soumettre.");
                  return;
                }
              }

              void submitMission(detail.missionKey, {
                responses: buildGenericResponses(interactions, responses),
              });
            }}
          >
            {submitting
              ? "Soumission…"
              : showRetry
                ? RETRY_MISSION_LABEL
                : genericMode
                  ? SUBMIT_RESPONSES_LABEL
                  : SUBMIT_MISSION_LABEL}
          </button>
        </div>
      ) : null}

      {clientError ? (
        <p className="workspace-first-day__error" role="alert" data-testid="mission-client-error">
          {clientError}
        </p>
      ) : null}
      {submitError ? (
        <p className="workspace-first-day__error" role="alert" data-testid="mission-submit-error">
          {submitError}
        </p>
      ) : null}

      {lastScore ? (
        <article className="workspace-mission__feedback" data-testid="mission-result">
          <h3>{lastScore.passed ? RESULT_PASSED_LABEL : RESULT_RETRY_LABEL}</h3>
          <p data-testid="mission-result-percent">
            {lastScore.scorePercent} % — {lastScore.earnedPoints} / {lastScore.maxPoints} points
          </p>
          <pre className="workspace-mission__briefing-body">{lastScore.feedback}</pre>
          {lastScore.gapExplanation ? (
            <p data-testid="mission-result-gap">{lastScore.gapExplanation}</p>
          ) : null}
          {lastScore.retryGuidance ? (
            <p data-testid="mission-result-retry">{lastScore.retryGuidance}</p>
          ) : null}
          {lastScore.criteria && lastScore.criteria.length > 0 ? (
            <ul data-testid="mission-result-criteria">
              {lastScore.criteria.map((criterion) => (
                <li key={criterion.interactionId}>
                  Critère {criterion.interactionId} : {criterion.earnedPoints}/
                  {criterion.maxPoints}
                  {criterion.feedback ? ` — ${criterion.feedback}` : ""}
                  {criterion.earnedPoints < criterion.maxPoints
                    ? " (déduction pédagogique)"
                    : ""}
                </li>
              ))}
            </ul>
          ) : null}
          <p data-testid="mission-result-validation-note">
            Les erreurs de validation (champs incomplets / format invalide) bloquent la soumission
            et ne sont pas des déductions de score.
          </p>
        </article>
      ) : null}

      {detail.attempt?.feedbackBody ? (
        <article className="workspace-mission__feedback" data-testid="mission-feedback">
          <h3>Retour de Claire Fontaine</h3>
          <pre className="workspace-mission__briefing-body">{detail.attempt.feedbackBody}</pre>
        </article>
      ) : null}
    </section>
  );
}

export function MissionCenterPage(): ReactNode {
  const {
    course,
    missions,
    selectedMission,
    initialLoading,
    refreshing,
    loadError,
    selectMission,
  } = useMissionData();

  if (initialLoading && missions === null) {
    return (
      <section className="workspace-mission" data-testid="mission-center-loading">
        <h1>{MISSION_CENTER_TITLE}</h1>
        <p className="workspace-first-day__status" role="status">
          Chargement du Centre de mission…
        </p>
      </section>
    );
  }

  if (loadError && missions === null) {
    return (
      <section className="workspace-mission" data-testid="mission-center-error">
        <h1>{MISSION_CENTER_TITLE}</h1>
        <p className="workspace-first-day__error" role="alert">
          {loadError}
        </p>
      </section>
    );
  }

  if (selectedMission) {
    return (
      <section className="workspace-mission" data-testid="mission-center-page">
        <h1>{MISSION_CENTER_TITLE}</h1>
        {refreshing ? (
          <p className="workspace-first-day__status" role="status" data-testid="mission-refreshing">
            Actualisation…
          </p>
        ) : null}
        <MissionDetailView detail={selectedMission} />
      </section>
    );
  }

  const summaries = missions?.missions ?? [];
  const primaryModule = course?.modules[0] ?? null;

  return (
    <section className="workspace-mission" data-testid="mission-center-page">
      <header className="workspace-mission__header">
        <h1>{MISSION_CENTER_TITLE}</h1>
        <p>
          Consultez les responsabilités confiées par votre gestionnaire après votre première journée.
        </p>
      </header>
      {primaryModule ? (
        <p className="workspace-mission__progress" data-testid="mission-course-progress">
          {PROGRESS_LABEL} : {Math.round(primaryModule.percentComplete)} %
        </p>
      ) : null}
      {refreshing ? (
        <p className="workspace-first-day__status" role="status" data-testid="mission-refreshing">
          Actualisation…
        </p>
      ) : null}
      {loadError ? (
        <p className="workspace-first-day__error" role="alert">
          {loadError}
        </p>
      ) : null}
      {summaries.length === 0 ? (
        <p data-testid="mission-center-empty">Aucune mission n’est disponible pour le moment.</p>
      ) : (
        <div className="workspace-mission__list">
          {summaries.map((summary) => (
            <MissionSummaryCard
              key={summary.missionKey}
              detail={summary}
              onOpen={() => {
                void selectMission(summary.missionKey);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
