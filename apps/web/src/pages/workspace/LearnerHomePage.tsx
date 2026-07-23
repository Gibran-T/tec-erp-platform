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
import { ProgressBar } from "../../living-erp/components/Badges.js";
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
  const [missionProgress, setMissionProgress] = useState<string | null>(null);

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
          if (typeof active.completionPercent === "number") {
            const completed = Math.round((active.completionPercent / 100) * 30);
            setMissionProgress(`${completed}/30`);
          }
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
          nextAttention.push(t("home.attention.historical"));
        }
        for (const module of courseResponse.modules) {
          for (const mission of module.missions) {
            if (mission.status === "in_progress" && !isHistorical) {
              nextAttention.push(`${mission.missionCode} — ${statusLabel(mission.status)}`);
            }
          }
        }
        if (String(capstone?.lifecycleStatus ?? "") === "LOCKED") {
          nextAttention.push(t("home.attention.capstoneLocked"));
        }
        if (
          String(capstone?.reviewStatus ?? "") === "revision_requested" ||
          String(capstone?.reviewStatus ?? "") === "needs_revision" ||
          String(capstone?.lifecycleStatus ?? "") === "REVISION_REQUESTED"
        ) {
          nextAttention.push(t("home.attention.capstoneRevision"));
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
      <header className="living-home-section living-home-section--primary living-card--l1">
        <h1 className="living-type-page">{t("home.workstation")}</h1>
        <p data-testid="workspace-welcome-message" className="living-lede">
          {historical
            ? buildHistoricalWelcomeMessage(employee.displayName)
            : buildWelcomeMessage(employee.displayName)}
        </p>
      </header>

      {loading ? <SkeletonBlock testId="learner-home-loading" /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error && course ? (
        <>
          <section
            className="living-home-section living-home-summary living-card--l1"
            data-testid="learner-home-current-state"
          >
            <h2 className="living-type-section">
              {historical ? t("home.historicalSummary") : t("home.currentState")}
            </h2>
            <div className="living-home-summary__stats">
              {historical ? (
                <StatusChip label={t("home.parcoursTermine")} tone="green" testId="home-parcours-termine" />
              ) : (
                <StatusChip label={statusLabel(runStatus)} tone={toneForStatus(runStatus)} />
              )}
              {missionProgress ? (
                <StatusChip label={missionProgress} tone={historical ? "green" : "strong"} testId="home-mission-progress" />
              ) : (
                <StatusChip
                  label={`${Math.round(course.percentComplete)} %`}
                  tone={historical ? "gray" : "strong"}
                />
              )}
              <StatusChip label={capstoneLabel} tone={toneForStatus(capstoneStatusRaw)} testId="home-capstone-status" />
              <StatusChip label={goldLabel} tone={goldTone} testId="home-gold-status" />
              {historical ? (
                <StatusChip label={t("status.readOnly")} tone="gray" testId="home-read-only" />
              ) : null}
            </div>
            <ProgressBar
              value={course.percentComplete}
              label={`${t("shell.progress")}: ${Math.round(course.percentComplete)} %`}
            />
            <p>
              {historical ? t("home.currentBlock") : t("home.currentBlock")}{" "}
              {currentModule ? `${currentModule.moduleCode} — ${currentModule.title}` : "—"}
            </p>
            <p>
              {historical ? t("home.noActiveMission") : t("home.nextMission")}
              {!historical &&
                (nextMission
                  ? ` ${nextMission.mission.missionCode} — ${nextMission.mission.title}`
                  : ` ${t("home.noActiveMission")}`)}
            </p>
            <p>
              <Link to={getAppPath("evaluations")}>{t("shell.assessments")}</Link>
              {" · "}
              <Link to={getAppPath("capstone")}>{t("shell.capstone")}</Link>
              {" · "}
              <Link to={getAppPath("certificats")}>{t("shell.certificates")}</Link>
            </p>
          </section>

          <section className="living-home-section living-card--l2" data-testid="learner-home-journey">
            <h2 className="living-type-section">{t("home.journey")}</h2>
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
                  <h3 className="living-type-card">{block.moduleCode}</h3>
                  <p>{block.title.replace(/^Module \d+\s*—\s*/, "")}</p>
                  <StatusChip label={statusLabel(block.status)} tone={toneForStatus(block.status)} />
                  <ProgressBar value={block.percentComplete} />
                  <p>
                    {block.missions.length} {t("home.missionsCount")}
                  </p>
                </Link>
              ))}
              <Link
                className="living-module-card"
                to={getAppPath("capstone")}
                data-testid="learner-home-capstone-milestone"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3 className="living-type-card">{t("shell.capstone")}</h3>
                <p>{t("home.capstoneProject")}</p>
                <StatusChip label={capstoneLabel} tone={toneForStatus(capstoneStatusRaw)} />
              </Link>
              <Link
                className="living-module-card"
                to={getAppPath("certificats")}
                data-testid="learner-home-gold-milestone"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3 className="living-type-card">{t("certificate.gold")}</h3>
                <p>{t("home.verifiedCertification")}</p>
                <StatusChip label={goldLabel} tone={goldTone} />
              </Link>
            </div>
          </section>

          <section className="living-home-section living-card--l2" data-testid="learner-home-recent">
            <h2 className="living-type-section">
              {historical ? t("home.firstDayHistory") : t("home.recent")}
            </h2>
            <ul>
              {historical ? (
                <>
                  <li>{t("home.history.archived")}</li>
                  <li>
                    {t("shell.capstone")} / {t("shell.certificates")} :{" "}
                    <Link to={getAppPath("capstone")}>{t("shell.capstone")}</Link> ·{" "}
                    <Link to={getAppPath("certificats")}>{t("shell.certificates")}</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    {t("home.lastBlock")}: {currentModule?.moduleCode ?? "—"}
                  </li>
                  <li>
                    {t("home.nextAction")}:{" "}
                    {nextMission ? (
                      <Link
                        to={`${getAppPath("centre-mission")}?mission=${nextMission.mission.missionKey}`}
                      >
                        {nextMission.mission.missionCode}
                      </Link>
                    ) : (
                      t("home.pathUpToDate")
                    )}
                  </li>
                </>
              )}
              <li>
                {t("home.erpTimeline")}:{" "}
                <Link to={getAppPath("documents")}>{t("shell.documents")}</Link>
              </li>
            </ul>
          </section>

          <section className="living-home-section living-card--l2" data-testid="learner-home-attention">
            <h2 className="living-type-section">{t("home.attention")}</h2>
            {attention.length === 0 ? (
              <p>{t("home.noAlerts")}</p>
            ) : (
              <ul>
                {attention.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="living-home-section living-card--l3" data-testid="learner-home-competencies">
            <h2 className="living-type-section">{t("home.competencies")}</h2>
            <p>
              {t("home.competencySnapshot")}{" "}
              {course.curriculumVersionLabel ?? course.curriculumVersion ?? course.courseCode}.
            </p>
            <ul>
              {course.modules
                .filter((block) => block.status === "completed")
                .slice(0, 3)
                .map((block) => (
                  <li key={`strong-${block.moduleCode}`}>
                    {t("home.strength")}: {block.moduleCode} — {block.competencySummary ?? block.title}
                  </li>
                ))}
              {course.modules
                .filter((block) => block.status !== "completed")
                .slice(0, 3)
                .map((block) => (
                  <li key={`gap-${block.moduleCode}`}>
                    {t("home.toReinforce")}: {block.moduleCode} —{" "}
                    {block.competencySummary ?? block.title}
                  </li>
                ))}
            </ul>
          </section>

          {/* Launcher is secondary — below primary learning summary */}
          <AppLauncherGrid />
        </>
      ) : null}

      {!loading && !error && !course ? <EmptyState title={t("empty.generic")} /> : null}

      {loading || error ? <AppLauncherGrid /> : null}
    </section>
  );
}
