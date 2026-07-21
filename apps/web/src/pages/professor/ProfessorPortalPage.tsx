import { useEffect, useState, type ReactElement } from "react";

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

type PortalTab =
  | "cohorts"
  | "roster"
  | "detail"
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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [reason, setReason] = useState("Justification pedagogique obligatoire pour l'action");
  const [overrideScore, setOverrideScore] = useState("85");

  async function refresh(): Promise<void> {
    const [cohortResponse, studentResponse, certificateResponse, auditResponse] = await Promise.all([
      listProfessorCohorts(),
      listProfessorStudents(),
      listProfessorCertificates(),
      listProfessorAudit(),
    ]);
    setCohorts(cohortResponse.cohorts);
    setStudents(studentResponse.students);
    setCertificates(certificateResponse.certificates);
    setAudit(auditResponse.events);
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

  const missions = (detail?.missions as Array<Record<string, unknown>> | undefined) ?? [];
  const assessments = (detail?.assessments as Array<Record<string, unknown>> | undefined) ?? [];
  const pending = (detail?.pendingManualReviews as Array<Record<string, unknown>> | undefined) ?? [];
  const competencies = (detail?.competencySummary as string[] | undefined) ?? [];
  const moduleProgress = (detail?.moduleProgress as Array<Record<string, unknown>> | undefined) ?? [];

  return (
    <main className="workspace-page" data-testid="professor-portal-page">
      <h1>Portail professeur</h1>
      <p>Suivi de cohorte, detail etudiant, evaluations, certificats et audit.</p>
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
        Raison obligatoire (actions / revocation)
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          data-testid="professor-reason"
        />
      </label>

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
              <p>{competencies.length > 0 ? competencies.join(", ") : "Aucune pour l'instant."}</p>
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
