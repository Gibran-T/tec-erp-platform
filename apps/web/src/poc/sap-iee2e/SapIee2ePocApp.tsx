import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type {
  SapIee2eCalendarView,
  SapIee2eSemaineZeroChecklist,
  SapSuiteE2eStageCode,
  SapSuiteProgramAssignment,
} from "@tec-platform/contracts";
import {
  INSTITUTIONAL_STATUS_LABEL_FR,
  SAP_SUITE_E2E_STAGES,
  SAP_SUITE_E2E_TITLE,
  STUDENT_WRITABLE_INSTITUTIONAL_STATUSES,
} from "@tec-platform/contracts";

import {
  ACHIEVEMENT_LABEL,
  ACCESS_LABEL,
  COLLEGE_SESSIONS,
  MOCK_CALENDAR,
  MOCK_COHORT,
  MOCK_STUDENT_REPORT,
  UNIT_STATUS_LABEL,
  buildLocalCalendarView,
  deriveSapAccessFromSemaineZero,
  isSemaineZeroReady,
  type AchievementDeclared,
  type CohortStudentRow,
  type DeclaredUnitStatus,
  type StudentSelfReport,
} from "./fixtures.js";
import {
  OFFICIAL_TOTAL_DURATION_LABEL,
  OFFICIAL_UNITS_FR,
  SAP_ACHIEVEMENT_LABEL_FR,
  SAP_OFFICIAL_LAUNCH_HINT,
  officialSapLearningLaunchHref,
  sanitizeOfficialSapLearningHref,
} from "./officialCourse.js";
import { SapOfficialLaunchLink } from "./SapOfficialLaunchLink.js";
import { getSessionTeachingGuide, TEACHING_GOLDEN_RULES } from "./professorCoaching.js";
import { SapIee2eOrientation } from "./SapIee2eOrientation.js";
import { SapIee2eReception } from "./SapIee2eReception.js";
import { SapIee2eSemaineZeroPanel } from "./SapIee2eSemaineZero.js";
import { getSessionPlan, SESSION_PLANS } from "./sessionPlans.js";
import "./sap-iee2e-poc.css";

export type SapIee2ePocView = "workspace" | "parcours" | "professeur" | "preparation";
export type SapIee2eAudience = "demo" | "student" | "professor";
type CohortFilter =
  | "tous"
  | "a_accompagner"
  | "sans_maj"
  | "non_commence"
  | "acces_non_confirme"
  | "achievement";
type PocTheme = "light" | "dark";

export interface SapIee2ePocAppProps {
  readonly embedded?: boolean;
  readonly initialView?: SapIee2ePocView;
  readonly audience?: SapIee2eAudience;
  readonly displayName?: string;
  readonly initialReport?: StudentSelfReport;
  readonly initialCalendar?: SapIee2eCalendarView;
  readonly cohortRows?: readonly CohortStudentRow[];
  readonly assignments?: readonly SapSuiteProgramAssignment[];
  readonly officialUrl?: string;
  readonly onPersistReport?: (report: StudentSelfReport) => Promise<void>;
  readonly onPersistCalendar?: (session1Date: string) => Promise<void>;
  readonly onPersistNote?: (
    studentId: string,
    note: string,
    stageCode: SapSuiteE2eStageCode | null,
  ) => Promise<void>;
  readonly onPersistStageReview?: (
    studentId: string,
    stageCode: SapSuiteE2eStageCode,
    status: "institutional_review" | "accompaniment_completed",
  ) => Promise<void>;
  readonly onPersistAssignment?: (input: {
    cohortId: string;
    language: string;
    institutionalStatus: SapSuiteProgramAssignment["institutionalStatus"];
    assigned: boolean;
  }) => Promise<void>;
  readonly liveCohort?: boolean;
  readonly allowStudentPreview?: boolean;
  readonly onPreviewStudent?: () => void;
  readonly onReturnProfessor?: () => void;
}

function shortUnitTitle(title: string): string {
  return title.length > 88 ? `${title.slice(0, 85)}…` : title;
}

function KpiButton(props: {
  readonly label: string;
  readonly value: number;
  readonly pressed: boolean;
  readonly onClick: () => void;
  readonly title: string;
}): ReactNode {
  return (
    <button
      type="button"
      className="sap-iee2e-poc__kpi"
      aria-pressed={props.pressed}
      title={props.title}
      onClick={props.onClick}
    >
      <strong>{props.value}</strong>
      <span>{props.label}</span>
    </button>
  );
}

export function SapIee2ePocApp({
  embedded = false,
  initialView = "workspace",
  audience = "demo",
  displayName,
  initialReport,
  initialCalendar,
  cohortRows,
  assignments = [],
  officialUrl = officialSapLearningLaunchHref(),
  onPersistReport,
  onPersistCalendar,
  onPersistNote,
  onPersistStageReview,
  onPersistAssignment,
  liveCohort = false,
  allowStudentPreview = false,
  onPreviewStudent,
  onReturnProfessor,
}: SapIee2ePocAppProps = {}): ReactNode {
  const [view, setView] = useState<SapIee2ePocView>(initialView);
  const [theme, setTheme] = useState<PocTheme>("light");

  useEffect(() => {
    setView(initialView);
  }, [initialView]);
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(
    initialReport?.sessionNumber ?? 3,
  );
  const showProfessorTools = audience !== "student";
  const showWorkspaceTab = !embedded;
  const persistEnabled = Boolean(onPersistReport);
  const skipPersist = useRef(true);
  const skipCalendarPersist = useRef(true);
  const cohortSource = cohortRows ?? MOCK_COHORT;
  const [report, setReport] = useState<StudentSelfReport>(initialReport ?? MOCK_STUDENT_REPORT);
  const [calendar, setCalendar] = useState<SapIee2eCalendarView>(
    initialCalendar ?? MOCK_CALENDAR,
  );
  const stamp = persistEnabled ? "À l’instant" : "À l’instant (démonstration)";
  sanitizeOfficialSapLearningHref(officialUrl);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [professorNoteDraft, setProfessorNoteDraft] = useState("");
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  useEffect(() => {
    if (!initialReport) {
      return;
    }
    skipPersist.current = true;
    setReport(initialReport);
  }, [initialReport]);

  useEffect(() => {
    if (!initialCalendar) {
      return;
    }
    skipCalendarPersist.current = true;
    setCalendar(initialCalendar);
  }, [initialCalendar]);

  useEffect(() => {
    if (!onPersistReport) {
      return;
    }
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      void onPersistReport(report);
    }, 450);
    return () => window.clearTimeout(handle);
  }, [onPersistReport, report]);

  useEffect(() => {
    if (!onPersistCalendar) {
      return;
    }
    if (skipCalendarPersist.current) {
      skipCalendarPersist.current = false;
      return;
    }
    const session1Date = calendar.session1Date;
    if (!session1Date) {
      return;
    }
    const handle = window.setTimeout(() => {
      void onPersistCalendar(session1Date);
    }, 450);
    return () => window.clearTimeout(handle);
  }, [calendar, onPersistCalendar]);
  const [filter, setFilter] = useState<CohortFilter>("tous");
  const [search, setSearch] = useState("");
  const [prepChecks, setPrepChecks] = useState({
    acces: false,
    glossaire: false,
    cas: false,
    liste: false,
  });
  const [closeChecks, setCloseChecks] = useState({
    checkpoint: false,
    relance: false,
    prochain: false,
  });

  const cohortStats = useMemo(() => {
    const rows = cohortSource;
    return {
      accesNonConfirme: rows.filter((r) => r.access === "non_confirme").length,
      commence: rows.filter((r) => r.access === "commence").length,
      retard: rows.filter((r) => r.staleUpdate).length,
      aAccompagner: rows.filter((r) => r.needsSupport).length,
      achievement: rows.filter((r) => r.achievement === "obtenu_declare").length,
      semaineZeroReady: rows.filter((r) => r.semaineZeroReady).length,
      semaineZeroPending: rows.filter((r) => !r.semaineZeroReady).length,
    };
  }, [cohortSource]);

  const filteredCohort = useMemo(() => {
    return cohortSource.filter((row) => {
      if (filter === "a_accompagner" && !row.needsSupport) return false;
      if (filter === "sans_maj" && !row.staleUpdate) return false;
      if (filter === "non_commence" && !row.notStarted) return false;
      if (filter === "acces_non_confirme" && row.access !== "non_confirme") return false;
      if (filter === "achievement" && row.achievement !== "obtenu_declare") return false;
      if (search.trim() && !row.name.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filter, search, cohortSource]);

  const selectedPlan = getSessionPlan(selectedSessionNumber);
  const teachingGuide = getSessionTeachingGuide(selectedSessionNumber);
  const selectedUnit =
    OFFICIAL_UNITS_FR.find((unit) => unit.unitNumber === selectedPlan.relatedUnit) ??
    OFFICIAL_UNITS_FR[0];
  if (!selectedUnit) {
    throw new Error("PoC: unité officielle liée à la séance introuvable.");
  }

  function openSession(sessionNumber: number): void {
    setSelectedSessionNumber(sessionNumber);
    setView("preparation");
  }

  function updateUnitStatus(unitNumber: number, status: DeclaredUnitStatus): void {
    setReport((prev) => ({
      ...prev,
      currentUnit: unitNumber,
      lastUpdateLabel: stamp,
      units: prev.units.map((u) =>
        u.unitNumber === unitNumber
          ? { ...u, status, lastUpdateLabel: stamp }
          : u,
      ),
    }));
  }

  function toggleSemaineZero(key: keyof SapIee2eSemaineZeroChecklist): void {
    setReport((prev) => {
      const semaineZero = { ...prev.semaineZero, [key]: !prev.semaineZero[key] };
      return {
        ...prev,
        semaineZero,
        semaineZeroReady: isSemaineZeroReady(semaineZero),
        sapAccess: deriveSapAccessFromSemaineZero(semaineZero),
        lastUpdateLabel: stamp,
      };
    });
  }

  function handleSession1DateChange(value: string): void {
    setCalendar(buildLocalCalendarView(value || null));
  }

  return (
    <div
      className={embedded ? "sap-iee2e-poc sap-iee2e-poc--embedded" : "sap-iee2e-poc"}
      data-poc-theme={theme}
      data-embedded={embedded ? "true" : "false"}
      data-testid="sap-iee2e-poc-root"
    >
      <div className="sap-iee2e-poc__shell">
        <header className="sap-iee2e-poc__topbar">
          <div className="sap-iee2e-poc__brand">
            <strong>
              {embedded
                ? `Analyste ERP SAP · ${SAP_SUITE_E2E_TITLE}`
                : "TEC.ERP · PoC visuelle"}
            </strong>
            <span>Accompagnement institutionnel — le contenu officiel demeure sur SAP Learning</span>
          </div>
          <nav className="sap-iee2e-poc__nav" aria-label="Navigation du parcours SAP">
            {showWorkspaceTab ? (
              <button
                type="button"
                aria-current={view === "workspace" ? "page" : undefined}
                onClick={() => setView("workspace")}
              >
                Espace de travail
              </button>
            ) : null}
            <button
              type="button"
              aria-current={view === "parcours" ? "page" : undefined}
              onClick={() => setView("parcours")}
            >
              Mon parcours SAP
            </button>
            {onReturnProfessor ? (
              <button type="button" data-testid="sap-return-professor" onClick={onReturnProfessor}>
                Retour au suivi professeur
              </button>
            ) : null}
            {showProfessorTools ? (
              <>
                <button
                  type="button"
                  aria-current={view === "professeur" ? "page" : undefined}
                  onClick={() => setView("professeur")}
                >
                  Suivi professeur
                </button>
                <button
                  type="button"
                  aria-current={view === "preparation" ? "page" : undefined}
                  onClick={() => setView("preparation")}
                >
                  Préparation de séance
                </button>
                {allowStudentPreview && onPreviewStudent ? (
                  <button
                    type="button"
                    data-testid="sap-professor-preview-student"
                    onClick={onPreviewStudent}
                  >
                    Voir comme l’étudiant
                  </button>
                ) : null}
              </>
            ) : null}
          </nav>
          <div className="sap-iee2e-poc__theme" aria-label="Thème">
            <button
              type="button"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
              data-testid="poc-theme-light"
            >
              Clair
            </button>
            <button
              type="button"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
              data-testid="poc-theme-dark"
            >
              Sombre
            </button>
          </div>
        </header>

        <p className="sap-iee2e-poc__badge-poc" role="status">
          {embedded
            ? "Accompagnement institutionnel · progression déclarée · vérité officielle sur SAP Learning"
            : "Démonstration visuelle · sans persistance · sans intégration SAP"}
        </p>

        {view === "workspace" ? (
          <section
            className="sap-iee2e-poc__workspace-mock"
            data-testid="poc-student-workspace"
            aria-labelledby="poc-workspace-title"
          >
            <h1 id="poc-workspace-title" className="sap-iee2e-poc__h1">
              Accueil de l’espace de travail
            </h1>
            <p className="sap-iee2e-poc__muted">
              Accueil institutionnel — Analyste ERP SAP · Parcours SAP Suite End to End.
            </p>

            <SapIee2eReception
              compact
              displayName={displayName}
              currentUnit={report.currentUnit}
              sessionNumber={report.sessionNumber}
              progressionLabel={report.progressionLabel}
              achievement={report.achievement}
              onOpenParcours={() => setView("parcours")}
            />
          </section>
        ) : null}

        {view === "parcours" ? (
          <section data-testid="poc-student-parcours" aria-labelledby="poc-parcours-title">
            <SapIee2eReception
              displayName={displayName}
              currentUnit={report.currentUnit}
              sessionNumber={report.sessionNumber}
              progressionLabel={report.progressionLabel}
              achievement={report.achievement}
            />

            <div style={{ marginTop: "1rem" }}>
              <SapIee2eSemaineZeroPanel
                checklist={report.semaineZero}
                ready={report.semaineZeroReady}
                calendar={calendar}
                editable
                urgent={!report.semaineZeroReady}
                onToggle={toggleSemaineZero}
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <SapIee2eOrientation />
            </div>

            <div className="sap-iee2e-poc__grid-2" style={{ marginTop: "1rem" }}>
              <article className="sap-iee2e-poc__card" id="poc-student-progression">
                <div className="sap-iee2e-poc__card" data-testid="sap-suite-stages" style={{ marginBottom: "1rem" }}>
                  <h2 className="sap-iee2e-poc__h2">Étapes institutionnelles S1–S10</h2>
                  <p className="sap-iee2e-poc__muted">
                    Dix séances Collège S1–S10. Neuf unités publiques SAP Learning (identification
                    uniquement). S4 et S5 partagent l’unité 4 ; S10 correspond à l’unité 9. Le
                    contenu officiel n’est pas copié. Statut actuel :{" "}
                    <strong>{INSTITUTIONAL_STATUS_LABEL_FR[report.institutionalStatus]}</strong>
                    . Ce n’est pas un résultat officiellement validé par SAP.
                  </p>
                  <ol className="sap-iee2e-poc__timeline">
                    {SAP_SUITE_E2E_STAGES.map((stage) => {
                      const declared = report.stages.find((item) => item.stageCode === stage.code);
                      const status = declared?.status ?? "not_started";
                      return (
                        <li key={stage.code} className="sap-iee2e-poc__unit" data-status={status}>
                          <div className="sap-iee2e-poc__unit-head">
                            <strong>
                              {stage.code} · {stage.title}
                            </strong>
                            <span className="sap-iee2e-poc__pill">
                              {INSTITUTIONAL_STATUS_LABEL_FR[status]}
                            </span>
                          </div>
                          <p className="sap-iee2e-poc__muted">{stage.shortDescription}</p>
                          <p className="sap-iee2e-poc__muted">{SAP_OFFICIAL_LAUNCH_HINT}</p>
                          <div className="sap-iee2e-poc__actions">
                            <SapOfficialLaunchLink
                              className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                              testId={`sap-stage-${stage.code.toLowerCase()}-official-launch`}
                            />
                            {STUDENT_WRITABLE_INSTITUTIONAL_STATUSES.map((nextStatus) => (
                              <button
                                key={nextStatus}
                                type="button"
                                className="sap-iee2e-poc__btn sap-iee2e-poc__btn--ghost"
                                aria-pressed={status === nextStatus}
                                onClick={() =>
                                  setReport((prev) => ({
                                    ...prev,
                                    currentStageCode: stage.code,
                                    sessionNumber: stage.sortOrder,
                                    institutionalStatus: nextStatus,
                                    lastUpdateLabel: stamp,
                                    stages: prev.stages.map((item) =>
                                      item.stageCode === stage.code
                                        ? { ...item, status: nextStatus }
                                        : item,
                                    ),
                                  }))
                                }
                              >
                                {INSTITUTIONAL_STATUS_LABEL_FR[nextStatus]}
                              </button>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <h2 className="sap-iee2e-poc__h2">Identification du parcours officiel SAP</h2>
                <p className="sap-iee2e-poc__muted">
                  Titres publics d’identification uniquement. États = déclaration étudiante, jamais
                  un résultat officiel SAP.
                </p>
                <ol className="sap-iee2e-poc__timeline" data-testid="poc-unit-timeline">
                  {OFFICIAL_UNITS_FR.map((unit) => {
                    const progress = report.units.find((u) => u.unitNumber === unit.unitNumber);
                    const status = progress?.status ?? "a_decouvrir";
                    const session = COLLEGE_SESSIONS.find((s) => s.relatedUnit === unit.unitNumber);
                    return (
                      <li
                        key={unit.unitNumber}
                        className="sap-iee2e-poc__unit"
                        data-status={status}
                        data-testid={
                          unit.unitNumber === 1 ? "sap-official-unit-1" : undefined
                        }
                      >
                        <div className="sap-iee2e-poc__unit-head">
                          <strong>
                            Unité {unit.unitNumber} · {shortUnitTitle(unit.titleFr)}
                          </strong>
                          <span className="sap-iee2e-poc__pill">{UNIT_STATUS_LABEL[status]}</span>
                        </div>
                        <div className="sap-iee2e-poc__meta-row">
                          <span>
                            {unit.lessonCount} leçons · {unit.durationLabel}
                          </span>
                          <span>
                            Séance Collège {session?.sessionNumber ?? "—"}
                            {session?.status === "provisoire" ? " (mapping provisoire)" : ""}
                          </span>
                          <span>MAJ : {progress?.lastUpdateLabel ?? "—"}</span>
                        </div>
                        <p className="sap-iee2e-poc__muted">{progress?.professorHint}</p>
                        <p className="sap-iee2e-poc__muted">{SAP_OFFICIAL_LAUNCH_HINT}</p>
                        <div className="sap-iee2e-poc__actions">
                          <SapOfficialLaunchLink
                            className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                            testId={`sap-unit-${unit.unitNumber}-official-launch`}
                          />
                          <button
                            type="button"
                            className="sap-iee2e-poc__btn sap-iee2e-poc__btn--ghost"
                            onClick={() => updateUnitStatus(unit.unitNumber, "en_cours")}
                          >
                            Marquer en cours (démo)
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div
                  className="sap-iee2e-poc__achievement-milestone"
                  data-state={report.achievement}
                  data-testid="poc-achievement-milestone"
                >
                  <div className="sap-iee2e-poc__ribbon">Étape finale</div>
                  <h3 className="sap-iee2e-poc__h3">{SAP_ACHIEVEMENT_LABEL_FR}</h3>
                  <p className="sap-iee2e-poc__muted">
                    État : <strong>{ACHIEVEMENT_LABEL[report.achievement]}</strong>
                  </p>
                  <p className="sap-iee2e-poc__demo-tag">
                    TEC.ERP n’émet pas et ne valide pas automatiquement le SAP Achievement. Émis
                    selon les conditions de SAP.
                  </p>
                  <div className="sap-iee2e-poc__actions">
                    {(
                      [
                        ["non_declare", "Non déclaré"],
                        ["en_cours", "En cours"],
                        ["obtenu_declare", "Obtenu — déclaré"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                        aria-pressed={report.achievement === value}
                        onClick={() =>
                          setReport((prev) => ({
                            ...prev,
                            achievement: value,
                            lastUpdateLabel: stamp,
                          }))
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>

              <div>
                <article className="sap-iee2e-poc__card" data-testid="poc-next-step">
                  <h2 className="sap-iee2e-poc__h2">Ma prochaine étape</h2>
                  <p>
                    Poursuivre l’unité {report.currentUnit} sur SAP Learning, puis mettre à jour
                    votre déclaration après la séance {report.sessionNumber}.
                  </p>
                  <ul className="sap-iee2e-poc__muted">
                    <li>Continuer l’unité en cours</li>
                    <li>Réviser les affectations de structures</li>
                    <li>Participer à la prochaine séance Collège</li>
                    <li>Signaler une difficulté si nécessaire</li>
                  </ul>
                </article>

                <article
                  className="sap-iee2e-poc__card"
                  style={{ marginTop: "1rem" }}
                  data-testid="poc-self-report"
                >
                  <h2 className="sap-iee2e-poc__h2">Mise à jour autodeclarée</h2>
                  <p className="sap-iee2e-poc__demo-tag">
                    Données {persistEnabled ? "enregistrées dans TEC.ERP" : "en mémoire uniquement — aucune persistance"}.
                  </p>
                  <div className="sap-iee2e-poc__form">
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="poc-unit">Unité actuelle</label>
                      <select
                        id="poc-unit"
                        value={report.currentUnit}
                        onChange={(e) => {
                          const unitNumber = Number(e.target.value);
                          setReport((prev) => ({
                            ...prev,
                            currentUnit: unitNumber,
                            lastUpdateLabel: stamp,
                          }));
                          updateUnitStatus(unitNumber, "en_cours");
                        }}
                      >
                        {OFFICIAL_UNITS_FR.map((u) => (
                          <option key={u.unitNumber} value={u.unitNumber}>
                            Unité {u.unitNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="poc-difficulty">Difficulté rencontrée</label>
                      <input
                        id="poc-difficulty"
                        value={report.difficulty}
                        onChange={(e) =>
                          setReport((prev) => ({ ...prev, difficulty: e.target.value }))
                        }
                      />
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="poc-support">
                        <input
                          id="poc-support"
                          type="checkbox"
                          checked={report.needsSupport}
                          onChange={(e) =>
                            setReport((prev) => ({ ...prev, needsSupport: e.target.checked }))
                          }
                        />{" "}
                        Besoin d’accompagnement
                      </label>
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="poc-note">Remarque facultative</label>
                      <textarea
                        id="poc-note"
                        value={report.note}
                        onChange={(e) => setReport((prev) => ({ ...prev, note: e.target.value }))}
                      />
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <span>Accès SAP Learning (issu de la Semaine Zéro)</span>
                      <p className="sap-iee2e-poc__muted">{ACCESS_LABEL[report.sapAccess]}</p>
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="poc-ach">État du SAP Achievement</label>
                      <select
                        id="poc-ach"
                        value={report.achievement}
                        onChange={(e) =>
                          setReport((prev) => ({
                            ...prev,
                            achievement: e.target.value as AchievementDeclared,
                          }))
                        }
                      >
                        <option value="non_declare">Non déclaré</option>
                        <option value="en_cours">En cours</option>
                        <option value="obtenu_declare">Obtenu — déclaré par l’étudiant</option>
                      </select>
                    </div>
                    <p className="sap-iee2e-poc__muted">
                      Date de mise à jour : {report.lastUpdateLabel}
                    </p>
                    <p className="sap-iee2e-poc__demo-tag">
                      Achievement SAP informé par l’étudiant · Certification SAP non vérifiée
                    </p>
                  </div>
                </article>
                <article
                  className="sap-iee2e-poc__card"
                  style={{ marginTop: "1rem" }}
                  data-testid="sap-suite-evidence"
                >
                  <h2 className="sap-iee2e-poc__h2">Évidence institutionnelle</h2>
                  <p className="sap-iee2e-poc__muted">
                    Métadonnées minimales seulement. Aucun mot de passe, jeton, cookie ou session
                    SAP n’est enregistré.
                  </p>
                  <div className="sap-iee2e-poc__form">
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="sap-evidence-label">Libellé de l’évidence</label>
                      <input
                        id="sap-evidence-label"
                        value={evidenceLabel}
                        onChange={(event) => setEvidenceLabel(event.target.value)}
                      />
                    </div>
                    <div className="sap-iee2e-poc__field">
                      <label htmlFor="sap-evidence-url">Référence https (facultatif)</label>
                      <input
                        id="sap-evidence-url"
                        value={evidenceUrl}
                        onChange={(event) => setEvidenceUrl(event.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <button
                      type="button"
                      className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                      onClick={() => {
                        const label = evidenceLabel.trim();
                        if (!label) {
                          return;
                        }
                        const referenceUrl = evidenceUrl.trim().length > 0 ? evidenceUrl.trim() : null;
                        setReport((prev) => ({
                          ...prev,
                          institutionalStatus: "evidence_submitted",
                          lastUpdateLabel: stamp,
                          evidence: [
                            ...prev.evidence,
                            {
                              id: `ev-${prev.evidence.length + 1}`,
                              stageCode: prev.currentStageCode,
                              kind: referenceUrl ? "external_reference" : "student_declaration",
                              label,
                              referenceUrl,
                              declaredAt: new Date().toISOString(),
                            },
                          ],
                        }));
                        setEvidenceLabel("");
                        setEvidenceUrl("");
                      }}
                    >
                      Enregistrer l’évidence déclarée
                    </button>
                    <ul className="sap-iee2e-poc__muted">
                      {report.evidence.map((item) => (
                        <li key={item.id}>
                          {item.label}
                          {item.referenceUrl ? ` · ${item.referenceUrl}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                <article
                  className="sap-iee2e-poc__card"
                  style={{ marginTop: "1rem" }}
                  data-testid="poc-pedagogical-support"
                >
                  <h2 className="sap-iee2e-poc__h2">Appui pédagogique</h2>
                  <p>
                    <strong>Prochaine séance :</strong> {selectedPlan.titleFr}
                  </p>
                  <p className="sap-iee2e-poc__muted">
                    Objectif : {selectedPlan.objective} Unité SAP liée : {selectedUnit.titleFr}.
                    Temps accompagné prévu : 180 min.
                  </p>
                  <p>
                    <strong>Conseil du professeur :</strong> préparer l’unité avant la séance ;
                    le temps en classe médiatise, il ne remplace pas le parcours SAP.
                  </p>
                </article>
              </div>
            </div>

            <article className="sap-iee2e-poc__card" style={{ marginTop: "1rem" }}>
              <h2 className="sap-iee2e-poc__h2">Organisation des dix séances Collège</h2>
              <p className="sap-iee2e-poc__muted">
                Dix séances de 180 minutes pour médier le parcours SAP. La durée officielle SAP (
                {OFFICIAL_TOTAL_DURATION_LABEL}) n’équivaut pas au temps en salle. Distinguer temps
                accompagné et travail individuel.
              </p>
              <div className="sap-iee2e-poc__sessions" data-testid="poc-ten-sessions">
                {SESSION_PLANS.map((session) => (
                  <button
                    key={session.sessionNumber}
                    type="button"
                    className="sap-iee2e-poc__session-chip"
                    data-selected={session.sessionNumber === selectedSessionNumber ? "true" : "false"}
                    onClick={() => {
                      if (showProfessorTools) {
                        openSession(session.sessionNumber);
                      }
                    }}
                  >
                    <strong>
                      Séance {session.sessionNumber} · {session.titleFr}
                    </strong>
                    <span>Unité SAP liée : {session.relatedUnit} · Comfort Pack complet</span>
                    <span className="sap-iee2e-poc__muted">{session.individualWork}</span>
                  </button>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {view === "professeur" && showProfessorTools ? (
          <section data-testid="poc-professor-pack" aria-labelledby="poc-prof-title">
            <h1 id="poc-prof-title" className="sap-iee2e-poc__h1">
              Suivi de la cohorte — Analyste ERP SAP
            </h1>
            <p className="sap-iee2e-poc__muted">
              {liveCohort || cohortRows
                ? "Suivi institutionnel à partir des déclarations. TEC.ERP n’importe pas la progression officielle SAP."
                : "Comfort Pack professeur — données de démonstration (MOCK)."}
            </p>

            {liveCohort && cohortSource.length === 0 ? (
              <article
                className="sap-iee2e-poc__card sap-iee2e-poc__empty-cohort"
                data-testid="sap-professor-empty-cohort"
              >
                <h2 className="sap-iee2e-poc__h2">Aucune personne inscrite pour le moment</h2>
                <p>
                  Le suivi institutionnel est prêt. Les accès SAP déclarés, la progression
                  déclarée, les besoins d’accompagnement et la dernière activité enregistrée
                  apparaîtront ici dès qu’une personne sera associée à votre cohorte.
                </p>
                <p className="sap-iee2e-poc__muted">
                  Une cohorte vide est un état institutionnel normal avant l’inscription.
                </p>
              </article>
            ) : null}

            <article className="sap-iee2e-poc__card sap-iee2e-poc__teach" data-testid="poc-golden-rules">
              <div className="sap-iee2e-poc__ribbon">Comment enseigner ce parcours</div>
              <h2 className="sap-iee2e-poc__h2">Règles d’or</h2>
              <ol className="sap-iee2e-poc__gold-rules">
                {TEACHING_GOLDEN_RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </article>

            <SapIee2eSemaineZeroPanel
              checklist={report.semaineZero}
              ready={cohortStats.semaineZeroPending === 0}
              calendar={calendar}
              editable={false}
              urgent={cohortStats.semaineZeroPending > 0}
              session1Date={calendar.session1Date ?? ""}
              onSession1DateChange={handleSession1DateChange}
              readyCount={cohortStats.semaineZeroReady}
              pendingCount={cohortStats.semaineZeroPending}
              totalCount={cohortSource.length}
              pendingNames={cohortSource
                .filter((row) => !row.semaineZeroReady)
                .map((row) => row.name)}
            />

            <div
              className="sap-iee2e-poc__kpi-strip"
              data-testid="poc-kpi-strip"
              style={{ margin: "1rem 0" }}
            >
              <KpiButton
                label="Sans accès SAP déclaré"
                value={cohortStats.accesNonConfirme}
                pressed={filter === "acces_non_confirme"}
                title="Aucun accès SAP Learning déclaré dans TEC.ERP"
                onClick={() => setFilter("acces_non_confirme")}
              />
              <KpiButton
                label="Semaine Zéro prête"
                value={cohortStats.semaineZeroReady}
                pressed={filter === "tous"}
                title="Semaine Zéro déclarée complète"
                onClick={() => setFilter("tous")}
              />
              <KpiButton
                label="Parcours commencé"
                value={cohortStats.commence}
                pressed={filter === "tous"}
                title="Étudiants ayant commencé le parcours déclaré"
                onClick={() => setFilter("tous")}
              />
              <KpiButton
                label="Mise à jour en retard"
                value={cohortStats.retard}
                pressed={filter === "sans_maj"}
                title="Retard estimé selon la dernière déclaration de l’étudiant."
                onClick={() => setFilter("sans_maj")}
              />
              <KpiButton
                label="Besoin d’accompagnement"
                value={cohortStats.aAccompagner}
                pressed={filter === "a_accompagner"}
                title="Besoin d’accompagnement déclaré"
                onClick={() => setFilter("a_accompagner")}
              />
              <KpiButton
                label="Achievement déclaré"
                value={cohortStats.achievement}
                pressed={filter === "achievement"}
                title="SAP Achievement déclaré par l’étudiant"
                onClick={() => setFilter("achievement")}
              />
            </div>
            <p className="sap-iee2e-poc__demo-tag">
              Retard estimé selon la dernière activité enregistrée.
            </p>

            <article className="sap-iee2e-poc__card" data-testid="sap-professor-stage-grid">
              <h2 className="sap-iee2e-poc__h2">Où en est la cohorte (S1–S10)</h2>
              <p className="sap-iee2e-poc__muted">
                Étape institutionnelle déclarée — ce n’est pas le résultat officiel SAP.
              </p>
              <div className="sap-iee2e-poc__heat">
                {SAP_SUITE_E2E_STAGES.map((stage) => {
                  const count = cohortSource.filter((row) => row.currentStageCode === stage.code)
                    .length;
                  return (
                    <div key={stage.code} className="sap-iee2e-poc__heat-cell">
                      <strong>{stage.code}</strong>
                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="sap-iee2e-poc__card" data-testid="poc-priorities">
              <h2 className="sap-iee2e-poc__h2">Priorités du professeur</h2>
              <ul className="sap-iee2e-poc__priority-list">
                <li>
                  <div>
                    <strong>
                      {cohortStats.aAccompagner} étudiants demandent un accompagnement
                    </strong>
                    <p className="sap-iee2e-poc__muted">
                      Difficulté fréquente : structures organisationnelles et accès SAP.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="sap-iee2e-poc__btn sap-iee2e-poc__btn--primary"
                    onClick={() => setFilter("a_accompagner")}
                  >
                    Voir les étudiants
                  </button>
                </li>
                <li>
                  <div>
                    <strong>Préparer la séance {selectedPlan.sessionNumber}</strong>
                    <p className="sap-iee2e-poc__muted">
                      Unité SAP {selectedPlan.relatedUnit} — {selectedPlan.titleFr}.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                    onClick={() => openSession(selectedPlan.sessionNumber)}
                  >
                    Préparer la séance
                  </button>
                </li>
                <li>
                  <div>
                    <strong>
                      {cohortStats.semaineZeroPending} sans Semaine Zéro complète
                    </strong>
                    <p className="sap-iee2e-poc__muted">
                      Compte individuel obligatoire — jamais un compte de camarade.
                      {liveCohort
                        ? " La relance se fait hors de TEC.ERP, sur le canal institutionnel."
                        : ""}
                    </p>
                  </div>
                </li>
                {liveCohort ? null : (
                  <li>
                    <div>
                      <strong>Relancer les accès non confirmés</strong>
                      <p className="sap-iee2e-poc__muted">Action démonstrative — sans envoi réel.</p>
                    </div>
                    <button type="button" className="sap-iee2e-poc__btn sap-iee2e-poc__btn--ghost">
                      Relancer (démo)
                    </button>
                  </li>
                )}
              </ul>
            </article>

            <article className="sap-iee2e-poc__card" style={{ marginTop: "1rem" }}>
              <h2 className="sap-iee2e-poc__h2">Vue de la cohorte</h2>
              <div className="sap-iee2e-poc__field">
                <label htmlFor="poc-search">Rechercher un étudiant</label>
                <input
                  id="poc-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nom de l’étudiant"
                />
              </div>
              <div className="sap-iee2e-poc__filters" role="group" aria-label="Filtres de cohorte">
                {(
                  [
                    ["tous", "Tous"],
                    ["a_accompagner", "À accompagner"],
                    ["sans_maj", "Sans mise à jour"],
                    ["non_commence", "Non commencé"],
                    ["acces_non_confirme", "Accès non confirmé"],
                    ["achievement", "Achievement obtenu"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={filter === id}
                    data-testid={
                      id === "a_accompagner"
                        ? "poc-filter-support"
                        : id === "acces_non_confirme"
                          ? "poc-filter-no-access"
                          : undefined
                    }
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="sap-iee2e-poc__table-wrap">
                <table className="sap-iee2e-poc__table">
                  <thead>
                    <tr>
                      <th scope="col">Étudiant</th>
                      <th scope="col">Accès SAP</th>
                      <th scope="col">Étape</th>
                      <th scope="col">Statut institutionnel</th>
                      <th scope="col">Unité déclarée</th>
                      <th scope="col">Progression déclarée</th>
                      <th scope="col">Dernière activité enregistrée</th>
                      <th scope="col">Difficulté</th>
                      <th scope="col">Accompagnement</th>
                      <th scope="col">Achievement informé</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCohort.length === 0 ? (
                      <tr>
                        <td colSpan={11}>
                          {liveCohort && cohortSource.length === 0
                            ? "Aucune personne associée à la cohorte pour le moment."
                            : "Aucun résultat pour ce filtre."}
                        </td>
                      </tr>
                    ) : (
                      filteredCohort.map((row) => (
                        <CohortRow
                          key={row.id}
                          row={row}
                          selected={selectedStudentId === row.id}
                          onSelect={() => setSelectedStudentId(row.id)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="sap-iee2e-poc__mobile-cards" data-testid="poc-cohort-mobile">
                {filteredCohort.map((row) => (
                  <article key={row.id} className="sap-iee2e-poc__student-card">
                    <strong>{row.name}</strong>
                    <p>
                      {ACCESS_LABEL[row.access]} · Unité {row.declaredUnit ?? "—"} ·{" "}
                      {row.progressionLabel}
                    </p>
                    <p className="sap-iee2e-poc__muted">
                      {row.difficulty} · {ACHIEVEMENT_LABEL[row.achievement]}
                    </p>
                    {row.needsSupport ? (
                      <span className="sap-iee2e-poc__pill sap-iee2e-poc__pill--warn">
                        À accompagner
                      </span>
                    ) : null}
                  </article>
                ))}
              </div>
            </article>

            <article className="sap-iee2e-poc__card" style={{ marginTop: "1rem" }} data-testid="sap-suite-professor-notes">
              <h2 className="sap-iee2e-poc__h2">Observation professeur (interne)</h2>
              <p className="sap-iee2e-poc__muted">
                Visible uniquement par le professeur ou l’administrateur. Ce n’est pas une
                validation SAP.
              </p>
              <div className="sap-iee2e-poc__form">
                <div className="sap-iee2e-poc__field">
                  <label htmlFor="sap-note-student">Étudiant</label>
                  <select
                    id="sap-note-student"
                    value={selectedStudentId ?? ""}
                    onChange={(event) => setSelectedStudentId(event.target.value || null)}
                  >
                    <option value="">Choisir</option>
                    {cohortSource.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sap-iee2e-poc__field">
                  <label htmlFor="sap-note-text">Observation</label>
                  <textarea
                    id="sap-note-text"
                    value={professorNoteDraft}
                    onChange={(event) => setProfessorNoteDraft(event.target.value)}
                  />
                </div>
                <div className="sap-iee2e-poc__actions">
                  <button
                    type="button"
                    className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
                    disabled={!selectedStudentId || professorNoteDraft.trim().length === 0}
                    onClick={() => {
                      if (!selectedStudentId) return;
                      const selected = cohortSource.find((row) => row.id === selectedStudentId);
                      void onPersistNote?.(
                        selectedStudentId,
                        professorNoteDraft.trim(),
                        selected?.currentStageCode ?? null,
                      );
                      setProfessorNoteDraft("");
                    }}
                  >
                    Enregistrer l’observation
                  </button>
                  <button
                    type="button"
                    className="sap-iee2e-poc__btn sap-iee2e-poc__btn--ghost"
                    disabled={!selectedStudentId || !onPersistStageReview}
                    onClick={() => {
                      const selected = cohortSource.find((row) => row.id === selectedStudentId);
                      if (!selected?.currentStageCode) return;
                      void onPersistStageReview?.(
                        selected.id,
                        selected.currentStageCode,
                        "institutional_review",
                      );
                    }}
                  >
                    Marquer en révision institutionnelle
                  </button>
                </div>
              </div>
            </article>

            {assignments.length > 0 || onPersistAssignment ? (
              <article className="sap-iee2e-poc__card" style={{ marginTop: "1rem" }} data-testid="sap-suite-assignments">
                <h2 className="sap-iee2e-poc__h2">Association de cohorte</h2>
                <p className="sap-iee2e-poc__muted">
                  Le programme {SAP_SUITE_E2E_TITLE} réutilise les cohortes existantes de TEC.ERP.
                </p>
                {assignments.length === 0 ? (
                  <p className="sap-iee2e-poc__muted">Aucune cohorte visible pour cet acteur.</p>
                ) : (
                  <ul>
                    {assignments.map((assignment) => (
                      <li key={assignment.cohortId}>
                        <strong>
                          {assignment.cohortCode} · {assignment.cohortName}
                        </strong>
                        <span className="sap-iee2e-poc__muted">
                          {" "}
                          · {assignment.language} · {assignment.institutionalStatus} ·{" "}
                          {assignment.assigned ? "associé" : "non associé"}
                        </span>
                        {onPersistAssignment ? (
                          <button
                            type="button"
                            className="sap-iee2e-poc__btn sap-iee2e-poc__btn--ghost"
                            onClick={() =>
                              void onPersistAssignment({
                                cohortId: assignment.cohortId,
                                language: assignment.language,
                                institutionalStatus: assignment.assigned
                                  ? assignment.institutionalStatus
                                  : "active",
                                assigned: !assignment.assigned,
                              })
                            }
                          >
                            {assignment.assigned ? "Retirer" : "Associer"}
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ) : null}
          </section>
        ) : null}

        {view === "preparation" && showProfessorTools ? (
          <section data-testid="poc-session-prep" aria-labelledby="poc-prep-title">
            <div className="sap-iee2e-poc__ribbon">Comfort Pack · 10 séances Collège</div>
            <h1 id="poc-prep-title" className="sap-iee2e-poc__h1">
              Préparation de séance {selectedPlan.sessionNumber}
            </h1>
            <p className="sap-iee2e-poc__muted">{selectedPlan.titleFr}</p>
            <div
              className="sap-iee2e-poc__filters"
              role="tablist"
              aria-label="Choisir une séance Collège"
              style={{ margin: "1rem 0" }}
            >
              {SESSION_PLANS.map((session) => (
                <button
                  key={session.sessionNumber}
                  type="button"
                  role="tab"
                  aria-selected={session.sessionNumber === selectedSessionNumber}
                  data-testid={`poc-session-tab-${session.sessionNumber}`}
                  onClick={() => setSelectedSessionNumber(session.sessionNumber)}
                >
                  S{session.sessionNumber}
                </button>
              ))}
            </div>

            <article className="sap-iee2e-poc__card sap-iee2e-poc__teach" data-testid="poc-teach-guide">
              <div className="sap-iee2e-poc__ribbon">Comment enseigner cette séance</div>
              <h2 className="sap-iee2e-poc__h2">Votre première phrase</h2>
              <blockquote>{teachingGuide.openingLine}</blockquote>
              <div className="sap-iee2e-poc__grid-2">
                <div>
                  <h3 className="sap-iee2e-poc__h3">SAP enseigne</h3>
                  <p>{teachingGuide.sapDoes}</p>
                </div>
                <div>
                  <h3 className="sap-iee2e-poc__h3">Vous médiez</h3>
                  <p>{teachingGuide.youDo}</p>
                </div>
              </div>
              <p>
                <strong>Piège du jour :</strong> {teachingGuide.trap}
              </p>
              <h3 className="sap-iee2e-poc__h3">Cas Collège — à faire vivre</h3>
              <p>{teachingGuide.collegeCase}</p>
              <p>
                <strong>Question d’ouverture :</strong> {teachingGuide.firstQuestion}
              </p>
              <p>
                <strong>Clôture (à dire) :</strong> {teachingGuide.closeScript}
              </p>
            </article>

            <div className="sap-iee2e-poc__grid-2" style={{ marginTop: "1rem" }}>
              <article className="sap-iee2e-poc__card">
                <h2 className="sap-iee2e-poc__h2">Contexte pédagogique</h2>
                <p>
                  <strong>Objectif :</strong> {selectedPlan.objective}
                </p>
                <p>
                  <strong>Unité SAP officielle liée :</strong> Unité {selectedUnit.unitNumber} —{" "}
                  {selectedUnit.titleFr}
                </p>
                <p>
                  <strong>Durée accompagnée :</strong> 180 minutes (séance Collège)
                </p>
                <p>
                  <strong>Travail individuel estimé :</strong> {selectedPlan.individualWork}
                </p>
                <p>
                  <strong>Lien officiel :</strong>{" "}
                  <SapOfficialLaunchLink testId="sap-prep-official-launch" />
                </p>
                <h3 className="sap-iee2e-poc__h3">Séquence recommandée</h3>
                <ol>
                  {selectedPlan.sequence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <h3 className="sap-iee2e-poc__h3">Points à observer</h3>
                <ul>
                  {selectedPlan.observe.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3 className="sap-iee2e-poc__h3">Questions de discussion</h3>
                <ul>
                  {selectedPlan.discussion.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <div>
                <article className="sap-iee2e-poc__card">
                  <h2 className="sap-iee2e-poc__h2">Difficultés déjà déclarées</h2>
                  <ul>
                    <li>Structures organisationnelles (Camille, Jade)</li>
                    <li>Accès SAP Learning non confirmé (Sofia, Olivier)</li>
                  </ul>
                  <h3 className="sap-iee2e-poc__h3">Étudiants à accompagner</h3>
                  <ul>
                    {cohortSource.filter((r) => r.needsSupport).map((r) => (
                      <li key={r.id}>
                        {r.name} — {r.difficulty}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="sap-iee2e-poc__card" style={{ marginTop: "1rem" }}>
                  <h2 className="sap-iee2e-poc__h2">Vérification administrative</h2>
                  <ul className="sap-iee2e-poc__checklist">
                    <li>
                      <input
                        type="checkbox"
                        checked={prepChecks.acces}
                        onChange={(e) =>
                          setPrepChecks((p) => ({ ...p, acces: e.target.checked }))
                        }
                      />
                      Accès SAP Learning confirmés pour la cohorte
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={prepChecks.glossaire}
                        onChange={(e) =>
                          setPrepChecks((p) => ({ ...p, glossaire: e.target.checked }))
                        }
                      />
                      Glossaire Collège EN–FR prêt
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={prepChecks.cas}
                        onChange={(e) => setPrepChecks((p) => ({ ...p, cas: e.target.checked }))}
                      />
                      Cas d’étude Collège imprimé / partagé
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={prepChecks.liste}
                        onChange={(e) =>
                          setPrepChecks((p) => ({ ...p, liste: e.target.checked }))
                        }
                      />
                      Liste « À accompagner » revue
                    </li>
                  </ul>
                  <h3 className="sap-iee2e-poc__h3">Checklist de clôture</h3>
                  <ul className="sap-iee2e-poc__checklist">
                    <li>
                      <input
                        type="checkbox"
                        checked={closeChecks.checkpoint}
                        onChange={(e) =>
                          setCloseChecks((p) => ({ ...p, checkpoint: e.target.checked }))
                        }
                      />
                      Checkpoint de séance communiqué
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={closeChecks.relance}
                        onChange={(e) =>
                          setCloseChecks((p) => ({ ...p, relance: e.target.checked }))
                        }
                      />
                      Relances d’accès planifiées
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={closeChecks.prochain}
                        onChange={(e) =>
                          setCloseChecks((p) => ({ ...p, prochain: e.target.checked }))
                        }
                      />
                      {selectedPlan.closeReminder}
                    </li>
                  </ul>
                  <p>
                    <strong>Prochaine étape :</strong> {selectedPlan.nextStep}
                  </p>
                </article>
              </div>
            </div>
          </section>
        ) : null}

        <p className="sap-iee2e-poc__footer-note">
          {embedded
            ? "TEC.ERP organise la cohorte · SAP Learning demeure la source officielle du contenu, des quiz et de l’Achievement"
            : "PoC isolée · /poc/sap-iee2e · Zéro impact M1–M10 · Zéro TEC.WMS · Zéro API · Zéro base de données"}
        </p>
      </div>
    </div>
  );
}

function CohortRow(props: {
  readonly row: CohortStudentRow;
  readonly selected?: boolean;
  readonly onSelect?: () => void;
}): ReactNode {
  const { row } = props;
  return (
    <tr data-selected={props.selected ? "true" : "false"}>
      <td>{row.name}</td>
      <td>{ACCESS_LABEL[row.access]}</td>
      <td>{row.currentStageCode ?? "—"}</td>
      <td>{INSTITUTIONAL_STATUS_LABEL_FR[row.institutionalStatus]}</td>
      <td>{row.declaredUnit ?? "—"}</td>
      <td>{row.progressionLabel}</td>
      <td>{row.lastUpdateLabel}</td>
      <td>{row.difficulty}</td>
      <td>{row.needsSupport ? "Oui" : "Non"}</td>
      <td>{ACHIEVEMENT_LABEL[row.achievement]}</td>
      <td>
        <button
          type="button"
          className="sap-iee2e-poc__btn sap-iee2e-poc__btn--secondary"
          onClick={props.onSelect}
        >
          Accompagner
        </button>
      </td>
    </tr>
  );
}
