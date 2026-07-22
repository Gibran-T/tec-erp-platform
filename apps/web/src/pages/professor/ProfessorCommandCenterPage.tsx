import { useEffect, useMemo, useState, type ReactElement } from "react";

import {
  getProfessorAnalyticsHeatmap,
  getProfessorCompetencySummary,
} from "../../api/analytics.js";
import { listProfessorAiInteractions } from "../../api/aiCoach.js";
import {
  getProfessorPredictions,
  listProfessorCapstoneQueue,
  reviewProfessorCapstoneSubmission,
} from "../../api/capstone.js";
import { issueProfessorGoldCertificate } from "../../api/certification.js";
import {
  compareProfessorPedagogicalRuns,
  createProfessorIntervention,
  getProfessorUniqueStudentMetric,
  listProfessorPedagogicalRuns,
} from "../../api/pedagogical-runs.js";
import {
  getProfessorStudentDetail,
  listProfessorAudit,
  listProfessorCertificates,
  listProfessorCohorts,
  listProfessorStudents,
} from "../../api/professor.js";
import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { StatusChip, toneForStatus } from "../../living-erp/components/StatusChip.js";
import { EmptyState, ErrorState, SkeletonBlock } from "../../living-erp/components/States.js";
import { ProfessorPortalPage } from "./ProfessorPortalPage.js";

type CommandSection =
  | "overview"
  | "students"
  | "runs"
  | "activity"
  | "documents"
  | "exceptions"
  | "assessments"
  | "competencies"
  | "analytics"
  | "ai"
  | "capstone"
  | "interventions"
  | "comparisons"
  | "cohorts"
  | "presentation"
  | "legacy";

function labelOf(value: unknown, fallback = "Non précisé"): string {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

export function ProfessorCommandCenterPage(): ReactElement {
  const { employee } = useAuth();
  const { t, statusLabel, formatDate } = useLocale();
  const [section, setSection] = useState<CommandSection>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cohorts, setCohorts] = useState<Array<Record<string, unknown>>>([]);
  const [students, setStudents] = useState<Array<Record<string, unknown>>>([]);
  const [runs, setRuns] = useState<Array<Record<string, unknown>>>([]);
  const [heatmap, setHeatmap] = useState<Array<Record<string, unknown>>>([]);
  const [heatmapMeta, setHeatmapMeta] = useState<{ enrolled: number; versions: string[] }>({
    enrolled: 0,
    versions: [],
  });
  const [competencies, setCompetencies] = useState<Array<Record<string, unknown>>>([]);
  const [aiInteractions, setAiInteractions] = useState<Array<Record<string, unknown>>>([]);
  const [capstoneQueue, setCapstoneQueue] = useState<Array<Record<string, unknown>>>([]);
  const [certificates, setCertificates] = useState<Array<Record<string, unknown>>>([]);
  const [audit, setAudit] = useState<Array<Record<string, unknown>>>([]);
  const [uniqueStudents, setUniqueStudents] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [student360, setStudent360] = useState<Record<string, unknown> | null>(null);
  const [compareLeft, setCompareLeft] = useState("");
  const [compareRight, setCompareRight] = useState("");
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(null);
  const [interventionMessage, setInterventionMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [presentationOpen, setPresentationOpen] = useState(false);

  const sections: Array<{ id: CommandSection; label: string }> = [
    { id: "overview", label: t("professor.overview") },
    { id: "students", label: t("professor.students") },
    { id: "runs", label: t("professor.runs") },
    { id: "activity", label: t("professor.activity") },
    { id: "documents", label: t("professor.documents") },
    { id: "exceptions", label: t("professor.exceptions") },
    { id: "assessments", label: t("professor.assessments") },
    { id: "competencies", label: t("professor.competencies") },
    { id: "analytics", label: t("professor.analytics") },
    { id: "ai", label: t("professor.ai") },
    { id: "capstone", label: t("professor.capstone") },
    { id: "interventions", label: t("professor.interventions") },
    { id: "comparisons", label: t("professor.comparisons") },
    { id: "cohorts", label: t("professor.cohorts") },
    { id: "presentation", label: t("professor.presentation") },
    { id: "legacy", label: "Portail classique" },
  ];

  useEffect(() => {
    if (employee?.role !== "PROFESSOR" && employee?.role !== "ADMIN") {
      return;
    }
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const [
          cohortResponse,
          studentResponse,
          runResponse,
          heatmapResponse,
          competencyResponse,
          aiResponse,
          capstoneResponse,
          certificateResponse,
          auditResponse,
          uniqueResponse,
        ] = await Promise.all([
          listProfessorCohorts(),
          listProfessorStudents(),
          listProfessorPedagogicalRuns().catch(() => []),
          getProfessorAnalyticsHeatmap().catch(() => ({ rows: [] as Array<Record<string, unknown>> })),
          getProfessorCompetencySummary().catch(() => ({
            competencies: [] as Array<Record<string, unknown>>,
          })),
          listProfessorAiInteractions().catch(() => ({
            interactions: [] as Array<Record<string, unknown>>,
          })),
          listProfessorCapstoneQueue().catch(() => ({
            submissions: [] as Array<Record<string, unknown>>,
          })),
          listProfessorCertificates().catch(() => ({
            certificates: [] as Array<Record<string, unknown>>,
          })),
          listProfessorAudit().catch(() => ({ events: [] as Array<Record<string, unknown>> })),
          getProfessorUniqueStudentMetric().catch(() => null),
        ]);
        if (cancelled) return;
        setCohorts(cohortResponse.cohorts);
        setStudents(studentResponse.students);
        setRuns(runResponse);
        setHeatmap(heatmapResponse.rows ?? []);
        setHeatmapMeta({
          enrolled: Number(heatmapResponse.enrolledStudentCount ?? 0),
          versions: Array.isArray(heatmapResponse.curriculumVersionsPresent)
            ? heatmapResponse.curriculumVersionsPresent.map((value) => String(value))
            : [],
        });
        setCompetencies(competencyResponse.competencies ?? []);
        setAiInteractions(aiResponse.interactions ?? []);
        setCapstoneQueue(capstoneResponse.submissions ?? []);
        setCertificates(certificateResponse.certificates ?? []);
        setAudit(auditResponse.events ?? []);
        setUniqueStudents(uniqueResponse?.studentCount ?? null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t("error.generic"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [employee?.role, t]);

  const attentionQueue = useMemo(() => {
    const items: string[] = [];
    for (const student of students) {
      const name = labelOf(student.displayName, "Apprenant");
      const progress = Number(student.percentComplete ?? student.progressPercent ?? NaN);
      if (!Number.isNaN(progress) && progress < 20) {
        items.push(`${name} — progression faible (${progress} %)`);
      }
      if (String(student.status ?? "") === "inactive") {
        items.push(`${name} — inactif`);
      }
    }
    for (const submission of capstoneQueue) {
      if (String(submission.reviewStatus ?? "") === "revision_requested") {
        items.push(
          `${labelOf(submission.studentName, "Apprenant")} — révision Capstone demandée`,
        );
      }
    }
    return items;
  }, [students, capstoneQueue]);

  async function openStudent360(studentId: string): Promise<void> {
    setSelectedStudentId(studentId);
    setSection("students");
    setError(null);
    try {
      const detail = await getProfessorStudentDetail(studentId);
      setStudent360(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
    }
  }

  async function runCompare(): Promise<void> {
    if (!compareLeft || !compareRight) return;
    setError(null);
    try {
      const result = await compareProfessorPedagogicalRuns(compareLeft, compareRight);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
    }
  }

  async function sendIntervention(runId: string): Promise<void> {
    if (!interventionMessage.trim()) return;
    try {
      await createProfessorIntervention(runId, {
        interventionType: "CONCEPT_EXPLANATION",
        reason: "Intervention pédagogique Living ERP",
        content: interventionMessage.trim(),
      });
      setStatus("Intervention envoyée.");
      setInterventionMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
    }
  }

  if (employee?.role !== "PROFESSOR" && employee?.role !== "ADMIN") {
    return (
      <main className="workspace-page" data-testid="professor-command-center">
        <h1>{t("shell.professor")}</h1>
        <p role="alert">{t("error.unauthorized")}</p>
      </main>
    );
  }

  if (section === "legacy") {
    return <ProfessorPortalPage />;
  }

  return (
    <main className="workspace-page professor-cc" data-testid="professor-command-center">
      <header>
        <h1>{t("shell.professor")}</h1>
        <p>Pilotage pédagogique, opérationnel et analytique — données scopées à votre entreprise.</p>
      </header>

      <nav className="professor-cc__nav" aria-label="Centre de commande professeur">
        {sections.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={section === item.id ? "page" : undefined}
            data-testid={`professor-cc-nav-${item.id}`}
            onClick={() => {
              setSection(item.id);
              if (item.id === "presentation") setPresentationOpen(true);
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {error ? <ErrorState message={error} /> : null}
      {status ? <p role="status">{status}</p> : null}
      {loading ? <SkeletonBlock testId="professor-cc-loading" /> : null}

      {!loading && section === "overview" ? (
        <section data-testid="professor-cc-overview" className="living-home-section">
          <h2>{t("professor.overview")}</h2>
          <ul>
            <li>Cohortes assignées : {cohorts.length}</li>
            <li>Apprenants inscrits : {students.length}</li>
            <li>
              Apprenants uniques (métrique officielle) :{" "}
              <span data-testid="professor-unique-students">
                {uniqueStudents === null ? "—" : uniqueStudents}
              </span>
            </li>
            <li>Parcours visibles : {runs.length}</li>
            <li>Dossiers Capstone : {capstoneQueue.length}</li>
            <li>Certificats : {certificates.length}</li>
          </ul>
          <h3>File d’attention</h3>
          {attentionQueue.length === 0 ? (
            <p>Aucune intervention urgente détectée.</p>
          ) : (
            <ul data-testid="professor-attention-queue">
              {attentionQueue.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <h3>Activité récente</h3>
          <ul>
            {audit.slice(0, 8).map((event, index) => (
              <li key={`${labelOf(event.id, String(index))}`}>
                {formatDate(labelOf(event.createdAt, ""))} —{" "}
                {labelOf(event.action ?? event.eventType, "Événement")} —{" "}
                {labelOf(event.actorName ?? event.employeeName, "Acteur")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!loading && section === "students" ? (
        <section data-testid="professor-cc-students" className="living-home-section">
          <h2>Student 360</h2>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "16rem 1fr" }}>
            <ul>
              {students.map((student) => {
                const id = labelOf(student.id ?? student.employeeId);
                const name = labelOf(student.displayName, "Apprenant");
                return (
                  <li key={id}>
                    <button type="button" onClick={() => void openStudent360(id)}>
                      {name}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div data-testid="professor-student-360">
              {!selectedStudentId ? (
                <EmptyState title="Sélectionnez un apprenant" />
              ) : !student360 ? (
                <SkeletonBlock />
              ) : (
                <>
                  <h3>{labelOf(student360.displayName)}</h3>
                  <p>
                    Matricule : {labelOf(student360.employeeNumber)} · Cohorte :{" "}
                    {labelOf(student360.cohortName)} · Curriculum :{" "}
                    {labelOf(student360.curriculumVersionLabel ?? student360.curriculumVersion)}
                  </p>
                  <StatusChip
                    label={statusLabel(labelOf(student360.runStatus ?? student360.status))}
                    tone={toneForStatus(labelOf(student360.runStatus ?? student360.status))}
                  />
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>
                    {JSON.stringify(
                      {
                        progress: student360.progress ?? student360.modules,
                        assessments: student360.assessments,
                        competencies: student360.competencies,
                        capstone: student360.capstone,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && section === "runs" ? (
        <section data-testid="professor-cc-runs" className="living-home-section">
          <h2>{t("professor.runs")}</h2>
          <table>
            <thead>
              <tr>
                <th>Apprenant</th>
                <th>Parcours</th>
                <th>Curriculum</th>
                <th>Statut</th>
                <th>Progression</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={labelOf(run.id)}>
                  <td>{labelOf(run.employeeName ?? run.displayName)}</td>
                  <td>{labelOf(run.runLabel ?? run.runCode)}</td>
                  <td>{labelOf(run.curriculumVersionLabel ?? run.curriculumVersion)}</td>
                  <td>
                    <StatusChip
                      label={statusLabel(labelOf(run.status))}
                      tone={toneForStatus(labelOf(run.status))}
                    />
                    {run.isHistorical ? ` · ${t("status.historical")}` : ""}
                  </td>
                  <td>{labelOf(run.completionPercent)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {!loading && (section === "activity" || section === "documents" || section === "exceptions") ? (
        <section data-testid={`professor-cc-${section}`} className="living-home-section">
          <h2>
            {section === "activity"
              ? t("professor.activity")
              : section === "documents"
                ? t("professor.documents")
                : t("professor.exceptions")}
          </h2>
          <p>
            Explorateur basé sur l’audit et les preuves de parcours. Filtrez par apprenant, mission et
            résultat.
          </p>
          <ul>
            {audit.slice(0, 20).map((event, index) => (
              <li key={`${section}-${index}`}>
                {formatDate(labelOf(event.createdAt, ""))} ·{" "}
                {labelOf(event.employeeName ?? event.actorName)} ·{" "}
                {labelOf(event.action ?? event.eventType)} ·{" "}
                {labelOf(event.objectType ?? event.sourceType, "objet")} ·{" "}
                {labelOf(event.result ?? event.status, "résultat")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!loading && section === "assessments" ? (
        <section data-testid="professor-cc-assessments" className="living-home-section">
          <h2>{t("professor.assessments")}</h2>
          <p>
            Répartition des tentatives et distinctions curriculum (y compris HCM V2) — sans exposition
            des clés de bonnes réponses avant politique autorisée.
          </p>
          <ul>
            {students.map((student) => (
              <li key={labelOf(student.id ?? student.employeeId)}>
                {labelOf(student.displayName)} — évaluations :{" "}
                {labelOf(student.assessmentSummary ?? student.assessmentsPassed ?? "voir fiche 360")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!loading && section === "competencies" ? (
        <section data-testid="professor-cc-competencies" className="living-home-section">
          <h2>{t("professor.competencies")}</h2>
          <ul>
            {competencies.map((row, index) => {
              const moduleCode = labelOf(row.moduleCode, `M${index + 1}`);
              const title = labelOf(row.title, moduleCode);
              const coverage = Number(row.coveragePercent ?? 0);
              const missionCount = Number(row.missionCount ?? 0);
              return (
                <li key={moduleCode}>
                  {moduleCode} — {title} · couverture {Number.isFinite(coverage) ? `${coverage}%` : "n/d"}
                  {missionCount > 0 ? ` · ${missionCount} missions` : ""}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {!loading && section === "analytics" ? (
        <section data-testid="professor-cc-analytics" className="living-home-section">
          <h2>{t("professor.analytics")}</h2>
          <p className="living-lede">
            Cohorte : {heatmapMeta.enrolled} étudiant(s)
            {heatmapMeta.versions.length > 0
              ? ` · curriculum ${heatmapMeta.versions.join(", ")}`
              : ""}
          </p>
          <ul>
            {heatmap.map((row, index) => {
              const name = labelOf(row.displayName, "Apprenant");
              const completed = Number(row.completedMissions ?? 0);
              const moduleCounts =
                row.moduleCounts && typeof row.moduleCounts === "object"
                  ? Object.entries(row.moduleCounts as Record<string, unknown>)
                      .map(([code, count]) => `${code}:${String(count)}`)
                      .join(" · ")
                  : "";
              return (
                <li key={`${labelOf(row.studentId, String(index))}`}>
                  {name} — {Number.isFinite(completed) ? completed : 0} missions
                  {moduleCounts ? ` · ${moduleCounts}` : ""}
                  {row.curriculumVersion ? ` · ${String(row.curriculumVersion)}` : ""}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {!loading && section === "ai" ? (
        <section data-testid="professor-cc-ai" className="living-home-section">
          <h2>{t("professor.ai")}</h2>
          <p>
            Supervision pédagogique de l’usage IA — sans prompts système ni clés de réponses. Usage ≠
            faute.
          </p>
          <ul>
            {aiInteractions.slice(0, 20).map((row, index) => (
              <li key={`${labelOf(row.id, String(index))}`}>
                {labelOf(row.employeeName)} · {labelOf(row.mode ?? row.category, "mode")} ·{" "}
                {labelOf(row.moduleCode, "module")} · {formatDate(labelOf(row.createdAt, ""))}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!loading && section === "capstone" ? (
        <section data-testid="professor-cc-capstone" className="living-home-section">
          <h2>{t("professor.capstone")}</h2>
          <ul>
            {capstoneQueue.map((submission) => {
              const id = labelOf(submission.id);
              return (
                <li key={id}>
                  {labelOf(submission.studentName)} —{" "}
                  <StatusChip
                    label={statusLabel(labelOf(submission.lifecycleStatus ?? submission.status))}
                    tone={toneForStatus(labelOf(submission.lifecycleStatus ?? submission.status))}
                  />
                  <div className="living-shell-controls">
                    <button
                      type="button"
                      onClick={() =>
                        void reviewProfessorCapstoneSubmission(id, {
                          approved: true,
                          notes: "Approuvé depuis le centre de commande.",
                        }).then(() => setStatus("Capstone approuvé."))
                      }
                    >
                      Approuver
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void issueProfessorGoldCertificate(
                          labelOf(submission.employeeId),
                          "Éligibilité Or confirmée",
                        ).then(() => setStatus("Certificat Or émis."))
                      }
                    >
                      Émettre Or
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {!loading && section === "interventions" ? (
        <section data-testid="professor-cc-interventions" className="living-home-section">
          <h2>{t("professor.interventions")}</h2>
          <label>
            Message
            <textarea
              value={interventionMessage}
              onChange={(event) => setInterventionMessage(event.target.value)}
              rows={3}
            />
          </label>
          <ul>
            {runs
              .filter((run) => run.status === "ACTIVE")
              .map((run) => (
                <li key={labelOf(run.id)}>
                  {labelOf(run.employeeName ?? run.displayName)} — {labelOf(run.runCode)}
                  <button type="button" onClick={() => void sendIntervention(labelOf(run.id))}>
                    Envoyer
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {!loading && section === "comparisons" ? (
        <section data-testid="professor-cc-comparisons" className="living-home-section">
          <h2>{t("professor.comparisons")}</h2>
          <p>
            Comparaison honnête des parcours. Si les curricula diffèrent, les modules ne sont pas
            équivalents automatiquement.
          </p>
          <div className="living-shell-controls">
            <select value={compareLeft} onChange={(event) => setCompareLeft(event.target.value)}>
              <option value="">Parcours A</option>
              {runs.map((run) => (
                <option key={`l-${labelOf(run.id)}`} value={labelOf(run.id)}>
                  {labelOf(run.runLabel ?? run.runCode)}
                </option>
              ))}
            </select>
            <select value={compareRight} onChange={(event) => setCompareRight(event.target.value)}>
              <option value="">Parcours B</option>
              {runs.map((run) => (
                <option key={`r-${labelOf(run.id)}`} value={labelOf(run.id)}>
                  {labelOf(run.runLabel ?? run.runCode)}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => void runCompare()}>
              Comparer
            </button>
          </div>
          {comparison ? (
            <pre data-testid="professor-run-comparison" style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(comparison, null, 2)}
            </pre>
          ) : null}
        </section>
      ) : null}

      {!loading && section === "cohorts" ? (
        <section data-testid="professor-cc-cohorts" className="living-home-section">
          <h2>{t("professor.cohorts")}</h2>
          <ul>
            {cohorts.map((cohort) => (
              <li key={labelOf(cohort.id)}>
                {labelOf(cohort.name)} — {labelOf(cohort.studentCount)} apprenants
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {presentationOpen ? (
        <div className="professor-presentation" data-testid="professor-presentation-mode">
          <div className="professor-presentation__content">
            <header className="living-shell-controls">
              <h2>Mode présentation</h2>
              <button type="button" onClick={() => setPresentationOpen(false)}>
                Quitter
              </button>
            </header>
            <p>
              Interface agrandie pour salle de classe. Données personnelles et notes professeur
              masquées. Clés de réponses absentes sauf mode correction explicite.
            </p>
            <h3>Carte de processus</h3>
            <div className="living-flow">
              {["Besoin", "Transaction", "Document", "Contrôle", "KPI"].map((node, index, arr) => (
                <div key={node} style={{ display: "contents" }}>
                  <span className="living-flow__node">{node}</span>
                  {index < arr.length - 1 ? <span className="living-flow__arrow">→</span> : null}
                </div>
              ))}
            </div>
            <h3>Faits de scénario (non sensibles)</h3>
            <ul>
              <li>Entreprise simulée NordHabitat</li>
              <li>Décisions apprenant visibles via preuves de mission</li>
              <li>Curriculum et parcours actifs affichés sans notes privées</li>
            </ul>
          </div>
        </div>
      ) : null}

      {/* keep predictions hook available for future attention scoring */}
      <button
        type="button"
        hidden
        onClick={() =>
          selectedStudentId
            ? void getProfessorPredictions(selectedStudentId)
            : undefined
        }
      >
        predictions
      </button>
    </main>
  );
}
