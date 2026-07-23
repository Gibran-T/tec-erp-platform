import type { CourseOverviewResponse } from "@tec-platform/contracts";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAnalyticsExceptions } from "../../api/analytics.js";
import { getCapstoneSubmission } from "../../api/capstone.js";
import { getGoldEligibility, listMyCertificates } from "../../api/certification.js";
import { requestCourse } from "../../api/course.js";
import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";
import { useAuth } from "../../auth/AuthContext.js";
import { AppLauncherGrid } from "../../components/workspace/AppLauncherGrid.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { CurriculumBadge, ProgressBar } from "../../living-erp/components/Badges.js";
import { EmptyState, ErrorState, SkeletonBlock } from "../../living-erp/components/States.js";
import { StatusChip, toneForStatus, type StatusTone } from "../../living-erp/components/StatusChip.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import {
  buildHistoricalWelcomeMessage,
  buildWelcomeMessage,
} from "../../workspace/workspaceCopy.js";

export function LearnerHomePage(): ReactNode {
  const { employee } = useAuth();
  const { t, statusLabel } = useLocale();
  const [course, setCourse] = useState<CourseOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string>("—");
  const [historical, setHistorical] = useState(false);
  const [attention, setAttention] = useState<string[]>([]);
  const [capstoneStatusRaw, setCapstoneStatusRaw] = useState<string>("—");
  const [capstoneLabel, setCapstoneLabel] = useState("—");
  const [goldLabel, setGoldLabel] = useState(t("certificate.gold"));
  const [goldTone, setGoldTone] = useState<StatusTone>("gray");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const [courseResponse, runs, capstone, exceptions, gold, certs] = await Promise.all([
          requestCourse(),
          listMyPedagogicalRuns(),
          getCapstoneSubmission().catch(() => null),
          getAnalyticsExceptions().catch(() => ({ exceptions: [] as Array<{ summary: string }> })),
          getGoldEligibility().catch(() => null),
          listMyCertificates().catch(() => ({ certificates: [] })),
        ]);
        if (cancelled) return;
        setCourse(courseResponse);
        const active =
          runs.find((run) => run.status === "ACTIVE") ?? runs[runs.length - 1] ?? null;
        const isHistorical =
          Boolean(active?.isHistorical) || active?.status === "COMPLETED";
        if (active) {
          setRunStatus(String(active.status ?? "—"));
          setHistorical(isHistorical);
        }
        const rawLifecycle = String(
          capstone?.lifecycleStatus ?? capstone?.status ?? "—",
        );
        setCapstoneStatusRaw(rawLifecycle);
        setCapstoneLabel(
          capstone?.lifecycleStatusLabel ??
            statusLabel(capstone?.lifecycleStatus ?? capstone?.status ?? "—"),
        );
        const goldIssued = certs.certificates.some(
          (certificate) =>
            String(certificate.certificateType).toUpperCase().includes("GOLD") &&
            certificate.status === "issued",
        );
        if (goldIssued) {
          setGoldLabel(t("status.gold_issued"));
          setGoldTone("gold");
        } else if (
          gold?.awaitingProfessorIssuance ||
          gold?.studentReadyChecklist.capstoneProfessorApproved
        ) {
          setGoldLabel(t("status.gold_pending_issue"));
          setGoldTone("amber");
        } else {
          setGoldLabel(t("certificate.gold"));
          setGoldTone("gray");
        }
        const nextAttention: string[] = [];
        if (isHistorical) {
          nextAttention.push("Parcours historique en lecture seule — aucun redémarrage actif.");
        }
        for (const module of courseResponse.modules) {
          for (const mission of module.missions) {
            if (mission.status === "in_progress" && !isHistorical) {
              nextAttention.push(`${mission.missionCode} — ${statusLabel(mission.status)}`);
            }
          }
        }
        if (String(capstone?.lifecycleStatus ?? "") === "LOCKED") {
          nextAttention.push("Capstone verrouillé — missions régulières requises.");
        }
        if (
          String(capstone?.reviewStatus ?? "") === "revision_requested" ||
          String(capstone?.reviewStatus ?? "") === "needs_revision" ||
          String(capstone?.lifecycleStatus ?? "") === "REVISION_REQUESTED"
        ) {
          nextAttention.push("Révision Capstone demandée par le professeur.");
        }
        for (const row of exceptions.exceptions.slice(0, 3)) {
          nextAttention.push(row.summary);
        }
        setAttention(nextAttention);
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
  }, [statusLabel, t]);

  const currentModule = useMemo(() => {
    if (!course) return null;
    return (
      course.modules.find((module) => module.status === "in_progress") ??
      course.modules.find((module) => module.status === "available") ??
      course.modules[course.modules.length - 1] ??
      null
    );
  }, [course]);

  const nextMission = useMemo(() => {
    if (!course || historical) return null;
    for (const module of course.modules) {
      const mission = module.missions.find(
        (item) => item.status === "available" || item.status === "in_progress",
      );
      if (mission) return { module, mission };
    }
    return null;
  }, [course, historical]);

  if (!employee) return null;

  return (
    <section data-testid="workspace-home-page" className="living-learner-home">
      <header className="living-home-section">
        <h1>Poste de travail</h1>
        <p data-testid="workspace-welcome-message">
          {historical
            ? buildHistoricalWelcomeMessage(employee.displayName)
            : buildWelcomeMessage(employee.displayName)}
        </p>
        <div className="living-shell-controls">
          <CurriculumBadge
            label={`${t("shell.curriculum")}: ${
              course?.curriculumVersionLabel ?? course?.curriculumVersion ?? course?.courseCode ?? "—"
            }`}
          />
          <StatusChip label={statusLabel(runStatus)} tone={toneForStatus(runStatus)} />
          {historical ? <StatusChip label={t("status.historical")} tone="gray" /> : null}
          <StatusChip
            label={`${Math.round(course?.percentComplete ?? 0)} %`}
            tone={historical ? "gray" : "strong"}
          />
        </div>
      </header>

      <AppLauncherGrid />

      {loading ? <SkeletonBlock testId="learner-home-loading" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && course ? (
        <>
          <section className="living-home-section" data-testid="learner-home-current-state">
            <h2>{t("home.currentState")}</h2>
            <ProgressBar
              value={course.percentComplete}
              label={`${t("shell.progress")}: ${Math.round(course.percentComplete)} %`}
            />
            <p>
              Bloc courant :{" "}
              {currentModule ? `${currentModule.moduleCode} — ${currentModule.title}` : "—"}
            </p>
            <p>
              {historical ? "Mission active : aucune (parcours historique)" : "Prochaine mission : "}
              {!historical &&
                (nextMission
                  ? `${nextMission.mission.missionCode} — ${nextMission.mission.title}`
                  : "Aucune mission active")}
            </p>
            <p>
              Capstone :{" "}
              <StatusChip label={capstoneLabel} tone={toneForStatus(capstoneStatusRaw)} />
            </p>
            <p>
              <Link to={getAppPath("evaluations")}>{t("shell.assessments")}</Link>
            </p>
          </section>

          <section className="living-home-section" data-testid="learner-home-journey">
            <h2>{t("home.journey")}</h2>
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
              }}
            >
              {course.modules.map((block) => (
                <Link
                  key={block.moduleCode}
                  className="living-module-card"
                  to={`/workspace/modules/${block.moduleCode}`}
                  data-testid={`learner-home-module-${block.moduleCode}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3>{block.moduleCode}</h3>
                  <p>{block.title.replace(/^Module \d+\s*—\s*/, "")}</p>
                  <StatusChip label={statusLabel(block.status)} tone={toneForStatus(block.status)} />
                  <ProgressBar value={block.percentComplete} />
                  <p>{block.missions.length} missions</p>
                </Link>
              ))}
              <Link
                className="living-module-card"
                to={getAppPath("capstone")}
                data-testid="learner-home-capstone-milestone"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>MCapstone</h3>
                <p>Projet intégrateur</p>
                <StatusChip label={capstoneLabel} tone={toneForStatus(capstoneStatusRaw)} />
              </Link>
              <Link
                className="living-module-card"
                to={getAppPath("certificats")}
                data-testid="learner-home-gold-milestone"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>Or</h3>
                <p>Certification vérifiée</p>
                <StatusChip label={goldLabel} tone={goldTone} />
              </Link>
            </div>
          </section>

          <section className="living-home-section" data-testid="learner-home-recent">
            <h2>{historical ? t("home.firstDayHistory") : t("home.recent")}</h2>
            <ul>
              {historical ? (
                <>
                  <li>Intégration initiale archivée dans la chronologie et les preuves de module.</li>
                  <li>
                    Capstone et certificats :{" "}
                    <Link to={getAppPath("capstone")}>{t("shell.capstone")}</Link> ·{" "}
                    <Link to={getAppPath("certificats")}>{t("shell.certificates")}</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>Dernier bloc suivi : {currentModule?.moduleCode ?? "—"}</li>
                  <li>
                    Prochaine action :{" "}
                    {nextMission ? (
                      <Link
                        to={`${getAppPath("centre-mission")}?mission=${nextMission.mission.missionKey}`}
                      >
                        {nextMission.mission.missionCode}
                      </Link>
                    ) : (
                      "Parcours à jour"
                    )}
                  </li>
                </>
              )}
              <li>
                Chronologie ERP : <Link to={getAppPath("documents")}>{t("shell.documents")}</Link>
              </li>
            </ul>
          </section>

          <section className="living-home-section" data-testid="learner-home-attention">
            <h2>{t("home.attention")}</h2>
            {attention.length === 0 ? (
              <p>Aucune alerte pédagogique active.</p>
            ) : (
              <ul>
                {attention.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="living-home-section" data-testid="learner-home-competencies">
            <h2>{t("home.competencies")}</h2>
            <p>
              Instantané basé sur le curriculum{" "}
              {course.curriculumVersionLabel ?? course.curriculumVersion ?? course.courseCode}.
              Aucune comparaison trompeuse entre V1 et V2.
            </p>
            <ul>
              {course.modules
                .filter((block) => block.status === "completed")
                .slice(0, 3)
                .map((block) => (
                  <li key={`strong-${block.moduleCode}`}>
                    Force : {block.moduleCode} — {block.competencySummary ?? block.title}
                  </li>
                ))}
              {course.modules
                .filter((block) => block.status !== "completed")
                .slice(0, 3)
                .map((block) => (
                  <li key={`gap-${block.moduleCode}`}>
                    À renforcer : {block.moduleCode} — {block.competencySummary ?? block.title}
                  </li>
                ))}
            </ul>
          </section>
        </>
      ) : null}

      {!loading && !error && !course ? <EmptyState title={t("empty.generic")} /> : null}
    </section>
  );
}
