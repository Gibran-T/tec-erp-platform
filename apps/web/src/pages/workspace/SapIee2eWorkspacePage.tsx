import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { SapIee2eCalendarView, SapIee2eSelfReport } from "@tec-platform/contracts";

import {
  getMySapIee2eSelfReport,
  getProfessorSapIee2eCohort,
  saveMySapIee2eSelfReport,
  saveProfessorCalendar,
} from "../../api/sap-iee2e.js";
import { useAuth } from "../../auth/AuthContext.js";
import { SapIee2ePocApp } from "../../poc/sap-iee2e/SapIee2ePocApp.js";
import type { CohortStudentRow, StudentSelfReport } from "../../poc/sap-iee2e/fixtures.js";

function toUiReport(report: SapIee2eSelfReport): StudentSelfReport {
  return {
    currentUnit: report.currentUnit,
    sessionNumber: report.sessionNumber,
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      try {
        if (professorView) {
          const cohort = await getProfessorSapIee2eCohort();
          if (cancelled) return;
          setCalendar(cohort.calendar);
          setCohortRows(
            cohort.students.map((student) => ({
              id: student.employeeId,
              name: student.displayName,
              access: student.sapAccess,
              declaredUnit: student.declaredUnit,
              progressionLabel: student.progressionLabel,
              lastUpdateLabel: student.lastUpdateLabel,
              difficulty: student.difficulty,
              needsSupport: student.needsSupport,
              achievement: student.achievement,
              staleUpdate: student.staleUpdate,
              notStarted: student.notStarted,
              semaineZeroReady: student.semaineZeroReady,
            })),
          );
        } else {
          const payload = await getMySapIee2eSelfReport();
          if (cancelled) return;
          setReport(toUiReport(payload));
          setCalendar(payload.calendar);
        }
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
      sapAccess: next.sapAccess,
      difficulty: next.difficulty,
      needsSupport: next.needsSupport,
      note: next.note,
      achievement: next.achievement,
      units: next.units.map((unit) => ({
        unitNumber: unit.unitNumber,
        status: unit.status,
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

  if (!professorView && !report && !loadError) {
    return <p>Chargement du parcours SAP…</p>;
  }

  return (
    <>
      {loadError ? (
        <p role="status">{loadError} Affichage local de démonstration.</p>
      ) : null}
      <SapIee2ePocApp
        embedded
        audience={professorView ? "professor" : "student"}
        initialView={professorView ? "professeur" : "parcours"}
        displayName={employee?.displayName}
        initialReport={report ?? undefined}
        initialCalendar={calendar}
        cohortRows={cohortRows}
        onPersistReport={professorView || loadError ? undefined : persistReport}
        onPersistCalendar={professorView && !loadError ? persistCalendar : undefined}
      />
    </>
  );
}
