import { useEffect, useState, type ReactElement } from "react";

import {
  getProfessorAnalyticsHeatmap,
  getProfessorCompetencySummary,
  type ProfessorCompetencyRow,
  type ProfessorHeatmapStudentRow,
} from "../../api/analytics.js";
import { listProfessorAiInteractions } from "../../api/aiCoach.js";
import {
  getProfessorPredictions,
  listProfessorCapstoneQueue,
  reviewProfessorCapstoneSubmission,
} from "../../api/capstone.js";
import { issueProfessorGoldCertificate } from "../../api/certification.js";
import {
  downloadProfessorCsv,
  getProfessorStudentDetail,
  listProfessorAudit,
  listProfessorCertificates,
  listProfessorCohorts,
  listProfessorStudents,
  professorOverride,
  revokeProfessorCertificate,
} from "../../api/professor.js";
import { useAuth } from "../../auth/AuthContext.js";
import { PedagogicalRunsProfessorPanel } from "../../components/professor/PedagogicalRunsProfessorPanel.js";

type PortalTab =
  | "cohorts"
  | "roster"
  | "detail"
  | "runs"
  | "analytics"
  | "ai-usage"
  | "predictions"
  | "capstone"
  | "gold"
  | "certificates"
  | "audit";

export function ProfessorPortalPage(): ReactElement {
  const { employee } = useAuth();
  const [tab, setTab] = useState<PortalTab>("cohorts");
  const [cohorts, setCohorts] = useState<Array<Record<string, unknown>>>([]);
  const [students, setStudents] = useState<Array<Record<string, unknown>>>([]);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [certificates, setCertificates] = useState<Array<Record<string, unknown>>>([]);
  const [audit, setAudit] = useState<Array<Record<string, unknown>>>([]);
  const [heatmap, setHeatmap] = useState<ProfessorHeatmapStudentRow[]>([]);
  const [competencies, setCompetencies] = useState<ProfessorCompetencyRow[]>([]);
  const [aiInteractions, setAiInteractions] = useState<Array<Record<string, unknown>>>([]);
  const [predictions, setPredictions] = useState<Record<string, unknown> | null>(null);
  const [capstoneQueue, setCapstoneQueue] = useState<Array<Record<string, unknown>>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("Justification pedagogique obligatoire pour l'action");
  const [overrideScore, setOverrideScore] = useState("85");

  async function refresh(): Promise<void> {
    const [
      cohortResponse,
      studentResponse,
      certificateResponse,
      auditResponse,
      heatmapResponse,
      competencyResponse,
      aiResponse,
      capstoneResponse,
    ] = await Promise.all([
      listProfessorCohorts(),
      listProfessorStudents(),
      listProfessorCertificates(),
      listProfessorAudit(),
      getProfessorAnalyticsHeatmap(),
      getProfessorCompetencySummary(),
      listProfessorAiInteractions(),
      listProfessorCapstoneQueue(),
    ]);
    setCohorts(cohortResponse.cohorts);
    setStudents(studentResponse.students);
    setCertificates(certificateResponse.certificates);
    setAudit(auditResponse.events);
    setHeatmap(heatmapResponse.rows);
    setCompetencies(competencyResponse.competencies);
    setAiInteractions(aiResponse.interactions);
    setCapstoneQueue(capstoneResponse.submissions);
  }

  useEffect(() => {
    if (employee?.role !== "PROFESSOR") {
      return;
    }
    void refresh().catch((err: Error) => setError(err.message));
  }, [employee?.role]);

  if (employee?.role !== "PROFESSOR") {
    return (
      <main className="workspace-page" data-testid="professor-portal-page">
        <h1>Portail professeur</h1>
        <p role="alert">Acces reserve aux comptes professeur.</p>
      </main>
    );
  }

  async function openStudent(studentId: string): Promise<void> {
    setSelectedStudentId(studentId);
    setTab("detail");
    setError(null);
    try {
      const next = await getProfessorStudentDetail(studentId);
      setDetail(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detail indisponible");
    }
  }

  async function loadPredictions(studentId: string): Promise<void> {
    setSelectedStudentId(studentId);
    setTab("predictions");
    setError(null);
    try {
      setPredictions(await getProfessorPredictions(studentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Predictions indisponibles");
    }
  }

  async function runOverride(
    action: string,
    extra: Record<string, unknown> = {},
    confirmMessage?: string,
  ): Promise<void> {
    if (!selectedStudentId) {
      setError("Selectionnez un etudiant.");
      return;
    }
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    if (reason.trim().length < 8) {
      setError("Une raison d'au moins 8 caracteres est obligatoire.");
      return;
    }
    try {
      await professorOverride(selectedStudentId, {
        action,
        reason,
        ...extra,
      });
      setStatus(`Action ${action} enregistree avec audit.`);
      const next = await getProfessorStudentDetail(selectedStudentId);
      setDetail(next);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec action professeur");
    }
  }

  async function downloadCsv(): Promise<void> {
    try {
      const csv = await downloadProfessorCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cohort-export.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("Export CSV telecharge.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export CSV impossible");
    }
  }

  async function revoke(certificateNumber: string): Promise<void> {
    if (!window.confirm(`Revoquer le certificat ${certificateNumber} ?`)) {
      return;
    }
    if (reason.trim().length < 8) {
      setError("Raison de revocation obligatoire (min. 8 caracteres).");
      return;
    }
    try {
      await revokeProfessorCertificate(certificateNumber, reason);
      setStatus(`Certificat ${certificateNumber} revoque.`);
      await refresh();
      if (selectedStudentId) {
        setDetail(await getProfessorStudentDetail(selectedStudentId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revocation impossible");
    }
  }

  async function issueGold(studentId: string): Promise<void> {
    if (!window.confirm("Emettre le certificat Gold pour cet etudiant ?")) {
      return;
    }
    if (reason.trim().length < 8) {
      setError("Raison obligatoire pour l'emission Gold.");
      return;
    }
    try {
      await issueProfessorGoldCertificate(studentId, reason);
      setStatus("Certificat Gold emis.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Emission Gold impossible");
    }
  }

  async function reviewCapstone(submissionId: string, approved: boolean): Promise<void> {
    const label = approved ? "approuver" : "demander une revision de";
    if (!window.confirm(`Confirmer : ${label} ce dossier Capstone ?`)) {
      return;
    }
    try {
      await reviewProfessorCapstoneSubmission(submissionId, {
        approved,
        notes: reason.trim().length >= 8 ? reason : undefined,
      });
      setStatus(approved ? "Capstone approuve." : "Capstone renvoye pour revision.");
      await refresh();
      if (selectedStudentId) {
        setDetail(await getProfessorStudentDetail(selectedStudentId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revue Capstone impossible");
    }
  }

  const missions = (detail?.missions as Array<Record<string, unknown>> | undefined) ?? [];
  const assessments = (detail?.assessments as Array<Record<string, unknown>> | undefined) ?? [];
  const pending = (detail?.pendingManualReviews as Array<Record<string, unknown>> | undefined) ?? [];
  const competencySummary = (detail?.competencySummary as string[] | undefined) ?? [];
  const moduleProgress = (detail?.moduleProgress as Array<Record<string, unknown>> | undefined) ?? [];
  const pendingCapstoneCount = capstoneQueue.filter(
    (submission) =>
      String(submission.reviewStatus ?? "pending") === "pending" ||
      String(submission.status) === "submitted",
  ).length;

  return (
    <main className="workspace-page" data-testid="professor-portal-page">
      <h1>Portail professeur</h1>
      <p>Suivi de cohorte, analytics, IA, predictions, capstone, certificats et audit.</p>
      {error ? (
        <p role="alert" data-testid="professor-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="professor-status">
          {status}
        </p>
      ) : null}

      <nav aria-label="Sections professeur">
        {(
          [
            ["cohorts", "Cohortes"],
            ["roster", "Etudiants"],
            ["detail", "Detail etudiant"],
            ["runs", "Parcours pedagogiques"],
            ["analytics", "Analytics"],
            ["ai-usage", "Usage IA"],
            ["predictions", "Predictions"],
            ["capstone", `Capstone${pendingCapstoneCount > 0 ? ` (${pendingCapstoneCount})` : ""}`],
            ["gold", "Gold"],
            ["certificates", "Certificats"],
            ["audit", "Audit"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            data-testid={`professor-tab-${id}`}
          >
            {label}
          </button>
        ))}
        <button type="button" onClick={() => void downloadCsv()} data-testid="professor-export-csv">
          Exporter CSV
        </button>
      </nav>

      <label>
        Raison obligatoire (actions / revocation / Gold)
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          data-testid="professor-reason"
        />
      </label>

      {tab === "runs" ? <PedagogicalRunsProfessorPanel /> : null}

      {tab === "cohorts" ? (
        <section data-testid="professor-cohorts">
          <h2>Vue d&apos;ensemble des cohortes</h2>
          <ul>
            {cohorts.map((cohort) => (
              <li key={String(cohort.code)}>
                {String(cohort.name)} — {String(cohort.studentCount)} etudiants
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "roster" ? (
        <section data-testid="professor-roster">
          <h2>Liste des etudiants</h2>
          <ul>
            {students.map((student) => (
              <li key={String(student.employeeId)}>
                {String(student.displayName)} — missions {String(student.completedMissions)} — Silver{" "}
                {String(student.silverStatus)}
                <button
                  type="button"
                  onClick={() => void openStudent(String(student.employeeId))}
                  data-testid={`professor-open-${String(student.employeeNumber)}`}
                >
                  Ouvrir detail
                </button>
                <button type="button" onClick={() => void loadPredictions(String(student.employeeId))}>
                  Predictions
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "detail" ? (
        <section data-testid="professor-student-detail">
          <h2>Detail etudiant</h2>
          {!detail ? <p>Selectionnez un etudiant dans la liste.</p> : null}
          {detail ? (
            <>
              <p>
                <strong>{String(detail.displayName)}</strong> ({String(detail.employeeNumber)})
              </p>
              <h3>Progression modules</h3>
              <ul>
                {moduleProgress.map((item) => (
                  <li key={String(item.moduleCode)}>
                    {String(item.moduleCode)} — {String(item.status)} ({String(item.percentComplete)}%)
                  </li>
                ))}
              </ul>
              <h3>Missions / tentatives / scores</h3>
              <ul>
                {missions.map((mission) => (
                  <li key={`${String(mission.missionKey)}-${String(mission.attemptNumber)}`}>
                    {String(mission.missionCode)} {String(mission.title)} — {String(mission.status)} —{" "}
                    {String(mission.scorePercent ?? "—")}%
                  </li>
                ))}
              </ul>
              <h3>Competences</h3>
              <p>{competencySummary.length > 0 ? competencySummary.join(", ") : "Aucune pour l'instant."}</p>
              <h3>Evaluations</h3>
              <ul>
                {assessments.map((assessment) => (
                  <li key={`${String(assessment.code)}-${String(assessment.attemptNumber)}`}>
                    {String(assessment.title)} — {String(assessment.status)} —{" "}
                    {String(assessment.scorePercent ?? "—")}%
                  </li>
                ))}
              </ul>
              <h3>Revues manuelles en attente</h3>
              <ul>
                {pending.length === 0 ? <li>Aucune</li> : null}
                {pending.map((item) => (
                  <li key={String(item.missionKey)}>{String(item.missionKey)}</li>
                ))}
              </ul>
              <h3>Actions</h3>
              <button
                type="button"
                onClick={() =>
                  void runOverride(
                    "release_mission",
                    { missionKey: "m2-m01-structurer-organisation" },
                    "Confirmer la liberation de mission ?",
                  )
                }
              >
                Liberer / debloquer mission
              </button>
              <button
                type="button"
                onClick={() =>
                  void runOverride(
                    "reset_attempt",
                    { missionKey: "m2-m01-structurer-organisation" },
                    "Confirmer la reinitialisation de tentative ?",
                  )
                }
              >
                Reinitialiser tentative
              </button>
              <button
                type="button"
                onClick={() =>
                  void runOverride("review_analytical", {
                    missionKey: "m2-m03-corriger-qualite-donnees",
                    reviewDecision: "approved",
                  })
                }
              >
                Approuver revue analytique
              </button>
              <button
                type="button"
                onClick={() =>
                  void runOverride("review_analytical", {
                    missionKey: "m2-m03-corriger-qualite-donnees",
                    reviewDecision: "rejected",
                  })
                }
              >
                Rejeter revue analytique
              </button>
              <label>
                Score override
                <input
                  value={overrideScore}
                  onChange={(event) => setOverrideScore(event.target.value)}
                  inputMode="decimal"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  void runOverride(
                    "override_score",
                    {
                      missionKey: "m2-m03-corriger-qualite-donnees",
                      scorePercent: Number(overrideScore),
                    },
                    "Confirmer l'override de score ?",
                  )
                }
              >
                Override score
              </button>
              <button
                type="button"
                onClick={() =>
                  void runOverride(
                    "validate_completion",
                    {},
                    "Valider la completion pratique / Silver ?",
                  )
                }
              >
                Valider completion pratique
              </button>
            </>
          ) : null}
        </section>
      ) : null}

      {tab === "analytics" ? (
        <section data-testid="professor-analytics">
          <h2>Carte de chaleur</h2>
          <ul>
            {heatmap.map((row, index) => {
              const moduleCounts = Object.entries(row.moduleCounts)
                .map(([code, count]) => `${code}:${count}`)
                .join(" · ");
              return (
                <li key={row.studentId || String(index)}>
                  {row.displayName} — {row.completedMissions} missions
                  {moduleCounts ? ` · ${moduleCounts}` : ""}
                  {row.curriculumVersion ? ` · ${row.curriculumVersion}` : ""}
                </li>
              );
            })}
          </ul>
          <h2>Resume des competences</h2>
          <ul>
            {competencies.map((item, index) => (
              <li key={item.moduleCode || String(index)}>
                {item.moduleCode} — {item.title} · couverture {item.coveragePercent}%
                {item.missionCount > 0 ? ` · ${item.missionCount} missions` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "ai-usage" ? (
        <section data-testid="professor-ai-usage">
          <h2>Usage du coach IA</h2>
          <ul>
            {aiInteractions.map((interaction) => (
              <li key={String(interaction.id)}>
                {String(interaction.createdAt)} — {String(interaction.studentName ?? interaction.employeeId)} —{" "}
                {String(interaction.questionPreview ?? interaction.question ?? "")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "predictions" ? (
        <section data-testid="professor-predictions">
          <h2>Predictions et risques</h2>
          {!predictions ? <p>Selectionnez un etudiant pour voir les predictions.</p> : null}
          {predictions ? (
            <>
              <p>Risque echec mission : {String(predictions.missionFailureRisk ?? "—")}</p>
              <p>Risque non-completion : {String(predictions.nonCompletionRisk ?? "—")}</p>
              <p>Faiblesse competences : {String(predictions.competencyWeakness ?? "—")}</p>
            </>
          ) : null}
        </section>
      ) : null}

      {tab === "capstone" ? (
        <section data-testid="professor-capstone-queue">
          <h2>File Capstone</h2>
          <p data-testid="professor-capstone-pending-count">
            Dossiers en attente de revue : {pendingCapstoneCount}
          </p>
          <ul>
            {capstoneQueue.map((submission) => (
              <li key={String(submission.id)} data-testid={`professor-capstone-item-${String(submission.id)}`}>
                {String(submission.studentName ?? submission.employeeId)} — {String(submission.status)} —{" "}
                {String(submission.reviewStatus ?? "en attente")}
                {submission.employeeId ? (
                  <button
                    type="button"
                    onClick={() => void openStudent(String(submission.employeeId))}
                    data-testid={`professor-capstone-open-${String(submission.employeeId)}`}
                  >
                    Ouvrir l&apos;etudiant
                  </button>
                ) : null}
                {String(submission.reviewStatus ?? "pending") === "pending" ||
                String(submission.status) === "submitted" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void reviewCapstone(String(submission.id), true)}
                      data-testid={`professor-capstone-approve-${String(submission.id)}`}
                    >
                      Approuver
                    </button>
                    <button
                      type="button"
                      onClick={() => void reviewCapstone(String(submission.id), false)}
                      data-testid={`professor-capstone-reject-${String(submission.id)}`}
                    >
                      Demander revision
                    </button>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "gold" ? (
        <section data-testid="professor-gold">
          <h2>Emission / revocation Gold</h2>
          <p>
            N&apos;emettez Gold que lorsque le Capstone est approuve et l&apos;evaluation Gold reussie.
            L&apos;API refuse sinon (eligibilite serveur).
          </p>
          <ul>
            {students.map((student) => {
              const capstoneOk = String(student.capstoneStatus) === "approved";
              const missionsOk = Number(student.completedMissions ?? 0) >= 30;
              const eligibleHint = capstoneOk && missionsOk;
              return (
                <li key={String(student.employeeId)}>
                  {String(student.displayName)} — Capstone: {String(student.capstoneStatus ?? "none")} —
                  missions: {String(student.completedMissions ?? 0)}/30
                  <button
                    type="button"
                    onClick={() => void issueGold(String(student.employeeId))}
                    disabled={!eligibleHint}
                    title={
                      eligibleHint
                        ? "Emettre Gold"
                        : "Eligibilite incomplete (Capstone approuve + 30 missions requis cote UI; serveur valide aussi l'evaluation Gold)"
                    }
                    data-testid={`professor-issue-gold-${String(student.employeeNumber)}`}
                  >
                    Emettre Gold
                  </button>
                </li>
              );
            })}
          </ul>
          <h3>Revocation certificats</h3>
          <ul>
            {certificates.map((certificate) => (
              <li key={String(certificate.certificateNumber)}>
                {String(certificate.studentName)} — {String(certificate.certificateNumber)} —{" "}
                {String(certificate.status)}
                {certificate.status === "issued" ? (
                  <button
                    type="button"
                    onClick={() => void revoke(String(certificate.certificateNumber))}
                    data-testid={`professor-revoke-${String(certificate.certificateNumber)}`}
                  >
                    Revoquer
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "certificates" ? (
        <section data-testid="professor-certificates">
          <h2>Certificats Silver</h2>
          <ul>
            {certificates.map((certificate) => (
              <li key={String(certificate.certificateNumber)}>
                {String(certificate.studentName)} — {String(certificate.certificateNumber)} —{" "}
                {String(certificate.status)}
                {certificate.revokedAt ? ` (revoque ${String(certificate.revokedAt)})` : ""}
                {certificate.status === "issued" ? (
                  <button
                    type="button"
                    onClick={() => void revoke(String(certificate.certificateNumber))}
                    data-testid={`professor-revoke-${String(certificate.certificateNumber)}`}
                  >
                    Revoquer
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "audit" ? (
        <section data-testid="professor-audit">
          <h2>Historique d&apos;audit</h2>
          <ul>
            {audit.map((event) => (
              <li key={String(event.id)}>
                {String(event.createdAt)} — {String(event.actorName)} — {String(event.action)} —{" "}
                {String(event.resourceKey)} — {String(event.reason ?? "")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
