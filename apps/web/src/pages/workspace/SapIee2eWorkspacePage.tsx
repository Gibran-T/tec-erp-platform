import { useCallback, useEffect, useState, type ReactNode } from "react";
import type {
  SapIee2eCalendarView,
  SapIee2eSelfReport,
  SapSuiteProgramAssignment,
  SapSuiteProgramCatalog,
} from "@tec-platform/contracts";

import {
  getMySapIee2eSelfReport,
  getProfessorProgramAssignments,
  getProfessorSapIee2eCohort,
  getSapSuiteProgramCatalog,
  saveMySapIee2eSelfReport,
  saveProfessorCalendar,
  saveProfessorProgramAssignment,
  saveProfessorStageReview,
  saveProfessorStudentNote,
} from "../../api/sap-iee2e.js";
import { useAuth } from "../../auth/AuthContext.js";
import { SapIee2ePocApp } from "../../poc/sap-iee2e/SapIee2ePocApp.js";
import type { CohortStudentRow, StudentSelfReport } from "../../poc/sap-iee2e/fixtures.js";

function toUiReport(report: SapIee2eSelfReport): StudentSelfReport {
  return {
    currentUnit: report.currentUnit,
    sessionNumber: report.sessionNumber,
    currentStageCode: report.currentStageCode,
    institutionalStatus: report.institutionalStatus,
    sapAccess: report.sapAccess,
    progressionLabel: report.progressionLabel,
    difficulty: report.difficulty,
    needsSupport: report.needsSupport,
    note: report.note,
    achievement: report.achievement,
    lastUpdateLabel: report.lastUpdateLabel,
    units: report.units.map((unit) => ({
      unitNumber: unit.unitNumber,
      status: unit.status,
      lastUpdateLabel: report.lastUpdateLabel,
      professorHint: "",
    })),
    stages: report.stages,
    evidence: report.evidence,
    semaineZero: report.semaineZero,
    semaineZeroReady: report.semaineZeroReady,
  };
}

export function SapIee2eWorkspacePage(): ReactNode {
  const { employee } = useAuth();
  const professorView = employee?.role === "PROFESSOR" || employee?.role === "ADMIN";
  const [report, setReport] = useState<StudentSelfReport | null>(null);
  const [calendar, setCalendar] = useState<SapIee2eCalendarView | undefined>(undefined);
  const [cohortRows, setCohortRows] = useState<CohortStudentRow[] | undefined>(undefined);
  const [assignments, setAssignments] = useState<readonly SapSuiteProgramAssignment[]>([]);
  const [catalog, setCatalog] = useState<SapSuiteProgramCatalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      try {
        const program = await getSapSuiteProgramCatalog();
        if (cancelled) return;
        setCatalog(program);
        if (professorView) {
          const [cohort, assignmentList] = await Promise.all([
            getProfessorSapIee2eCohort(),
            getProfessorProgramAssignments(),
          ]);
          if (cancelled) return;
          setCalendar(cohort.calendar);
          setAssignments(assignmentList.assignments);
          setCohortRows(
            cohort.students.map((student) => ({
              id: student.employeeId,
              name: student.displayName,
              access: student.sapAccess,
              declaredUnit: student.declaredUnit,
              currentStageCode: student.currentStageCode,
              institutionalStatus: student.institutionalStatus,
              progressionLabel: student.progressionLabel,
              lastUpdateLabel: student.lastUpdateLabel,
              difficulty: student.difficulty,
              needsSupport: student.needsSupport,
              achievement: student.achievement,
              staleUpdate: student.staleUpdate,
              notStarted: student.notStarted,
              semaineZeroReady: student.semaineZeroReady,
              evidenceCount: student.evidenceCount,
              professorNoteCount: student.professorNoteCount,
            })),
          );
        } else {
          const payload = await getMySapIee2eSelfReport();
          if (cancelled) return;
          setReport(toUiReport(payload));
          setCalendar(payload.calendar);
        }
        setReady(true);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Chargement impossible.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [professorView]);

  const persistReport = useCallback(async (next: StudentSelfReport) => {
    const saved = await saveMySapIee2eSelfReport({
      currentUnit: next.currentUnit,
      sessionNumber: next.sessionNumber,
      currentStageCode: next.currentStageCode,
      institutionalStatus:
        next.institutionalStatus === "institutional_review" ||
        next.institutionalStatus === "accompaniment_completed"
          ? undefined
          : next.institutionalStatus,
      sapAccess: next.sapAccess,
      difficulty: next.difficulty,
      needsSupport: next.needsSupport,
      note: next.note,
      achievement: next.achievement,
      units: next.units.map((unit) => ({
        unitNumber: unit.unitNumber,
        status: unit.status,
      })),
      stages: [...next.stages],
      evidence: next.evidence.map((item) => ({
        id: item.id,
        stageCode: item.stageCode,
        kind: item.kind,
        label: item.label,
        referenceUrl: item.referenceUrl,
      })),
      semaineZero: next.semaineZero,
    });
    setReport(toUiReport(saved));
    setCalendar(saved.calendar);
  }, []);

  const persistCalendar = useCallback(async (session1Date: string) => {
    const saved = await saveProfessorCalendar({ session1Date });
    setCalendar(saved);
  }, []);

  const persistNote = useCallback(async (studentId: string, note: string, stageCode: StudentSelfReport["currentStageCode"] | null) => {
    await saveProfessorStudentNote(studentId, { note, stageCode });
    setCohortRows((current) =>
      current?.map((row) =>
        row.id === studentId ? { ...row, professorNoteCount: row.professorNoteCount + 1 } : row,
      ),
    );
  }, []);

  const persistStageReview = useCallback(
    async (studentId: string, stageCode: StudentSelfReport["currentStageCode"], status: "institutional_review" | "accompaniment_completed") => {
      const accompaniment = await saveProfessorStageReview(studentId, { stageCode, status });
      setCohortRows((current) =>
        current?.map((row) =>
          row.id === studentId
            ? {
                ...row,
                institutionalStatus: accompaniment.student.institutionalStatus,
                currentStageCode: accompaniment.student.currentStageCode,
              }
            : row,
        ),
      );
    },
    [],
  );

  const persistAssignment = useCallback(
    async (input: {
      cohortId: string;
      language: string;
      institutionalStatus: SapSuiteProgramAssignment["institutionalStatus"];
      assigned: boolean;
    }) => {
      const saved = await saveProfessorProgramAssignment(input);
      setAssignments(saved.assignments);
    },
    [],
  );

  if (loadError) {
    return (
      <p role="alert">
        {loadError} Les données de démonstration ne sont pas affichées afin de protéger la
        confidentialité.
      </p>
    );
  }

  if (!ready || !catalog) {
    return <p>Chargement du programme SAP Suite End to End…</p>;
  }

  if (!professorView && !report) {
    return <p>Chargement du suivi institutionnel…</p>;
  }

  return (
    <SapIee2ePocApp
      embedded
      audience={professorView ? "professor" : "student"}
      initialView={professorView ? "professeur" : "parcours"}
      displayName={employee?.displayName}
      initialReport={report ?? undefined}
      initialCalendar={calendar}
      cohortRows={professorView ? (cohortRows ?? []) : undefined}
      assignments={assignments}
      officialUrl={catalog.officialUrl}
      onPersistReport={professorView ? undefined : persistReport}
      onPersistCalendar={professorView ? persistCalendar : undefined}
      onPersistNote={professorView ? persistNote : undefined}
      onPersistStageReview={professorView ? persistStageReview : undefined}
      onPersistAssignment={professorView ? persistAssignment : undefined}
    />
  );
}
