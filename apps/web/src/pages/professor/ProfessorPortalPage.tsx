import { useEffect, useState, type ReactElement } from "react";

import {
  downloadProfessorCsv,
  listProfessorCohorts,
  listProfessorStudents,
  professorOverride,
} from "../../api/professor.js";
import { useAuth } from "../../auth/AuthContext.js";

export function ProfessorPortalPage(): ReactElement {
  const { employee } = useAuth();
  const [cohorts, setCohorts] = useState<Array<Record<string, unknown>>>([]);
  const [students, setStudents] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (employee?.role !== "PROFESSOR") {
      return;
    }
    void Promise.all([listProfessorCohorts(), listProfessorStudents()])
      .then(([cohortResponse, studentResponse]) => {
        setCohorts(cohortResponse.cohorts);
        setStudents(studentResponse.students);
      })
      .catch((err: Error) => setError(err.message));
  }, [employee?.role]);

  if (employee?.role !== "PROFESSOR") {
    return (
      <main className="workspace-page" data-testid="professor-portal-page">
        <h1>Portail professeur</h1>
        <p role="alert">Acces reserve aux comptes professeur.</p>
      </main>
    );
  }

  async function actOnFirstStudent(
    action: "release_mission" | "reset_attempt" | "review_analytical",
    statusMessage: string,
  ): Promise<void> {
    if (students.length === 0) {
      return;
    }
    const student = students[0]!;
    try {
      await professorOverride(String(student.employeeId), {
        action,
        missionKey:
          action === "review_analytical"
            ? "m2-m03-corriger-qualite-donnees"
            : "m2-m01-structurer-organisation",
        reason: `Action professeur ${action} avec justification pedagogique`,
        ...(action === "review_analytical" ? { reviewDecision: "approved" } : {}),
      });
      setStatus(statusMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec override");
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

  return (
    <main className="workspace-page" data-testid="professor-portal-page">
      <h1>Portail professeur</h1>
      <p>Suivi de cohorte, progression, overrides et export.</p>
      {error ? <p role="alert">{error}</p> : null}
      {status ? <p role="status">{status}</p> : null}
      <section>
        <h2>Cohortes</h2>
        <ul>
          {cohorts.map((cohort) => (
            <li key={String(cohort.code)}>
              {String(cohort.name)} ({String(cohort.studentCount)} etudiants)
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Etudiants</h2>
        <ul>
          {students.map((student) => (
            <li key={String(student.employeeId)}>
              {String(student.displayName)} — missions {String(student.completedMissions)} — Silver{" "}
              {String(student.silverStatus)}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            void actOnFirstStudent("release_mission", "Mission liberee avec journal d'audit.")
          }
        >
          Liberer une mission (etudiant 1)
        </button>
        <button
          type="button"
          onClick={() =>
            void actOnFirstStudent("reset_attempt", "Tentative reinitialisee avec journal d'audit.")
          }
        >
          Reinitialiser une tentative
        </button>
        <button
          type="button"
          onClick={() => void actOnFirstStudent("review_analytical", "Reponse analytique revisee.")}
        >
          Reviser une reponse analytique
        </button>
        <button type="button" onClick={() => void downloadCsv()}>
          Exporter CSV
        </button>
      </section>
    </main>
  );
}
