import type { CourseOverviewResponse } from "@tec-platform/contracts";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAnalyticsExceptions } from "../../api/analytics.js";
import { getCapstoneSubmission } from "../../api/capstone.js";
import { requestCourse } from "../../api/course.js";
import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";
import { useAuth } from "../../auth/AuthContext.js";
import { AppLauncherGrid } from "../../components/workspace/AppLauncherGrid.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { CurriculumBadge, ProgressBar, RunBadge } from "../../living-erp/components/Badges.js";
import { EmptyState, ErrorState, SkeletonBlock } from "../../living-erp/components/States.js";
import { StatusChip, toneForStatus } from "../../living-erp/components/StatusChip.js";
import { getAppPath } from "../../workspace/appRegistry.js";
import { buildWelcomeMessage } from "../../workspace/workspaceCopy.js";

export function LearnerHomePage(): ReactNode {
  const { employee } = useAuth();
  const { t, statusLabel } = useLocale();
  const [course, setCourse] = useState<CourseOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runLabel, setRunLabel] = useState("—");
  const [runStatus, setRunStatus] = useState<string>("—");
  const [historical, setHistorical] = useState(false);
  const [attention, setAttention] = useState<string[]>([]);
  const [capstoneLabel, setCapstoneLabel] = useState("—");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const [courseResponse, runs, capstone, exceptions] = await Promise.all([
          requestCourse(),
          listMyPedagogicalRuns(),
          getCapstoneSubmission().catch(() => null),
          getAnalyticsExceptions().catch(() => ({ exceptions: [] as Array<{ summary: string }> })),
        ]);
        if (cancelled) return;
        setCourse(courseResponse);
        const active =
          runs.find((run) => run.status === "ACTIVE") ?? runs[runs.length - 1] ?? null;
        const isHistorical =
          Boolean(active?.isHistorical) || active?.status === "COMPLETED";
        if (active) {
          setRunLabel(String(active.runLabel ?? active.runCode ?? "—"));
          setRunStatus(String(active.status ?? "—"));
          setHistorical(isHistorical);
        }
        setCapstoneLabel(
          String(
            capstone?.lifecycleStatusLabel ??
              capstone?.lifecycleStatus ??
              capstone?.status ??
              "—",
          ),
        );
        const nextAttention: string[] = [];
        if (isHistorical) {
          nextAttention.push("Parcours historique en lecture seule — aucun redémarrage actif.");
        }
        for (const module of courseResponse.modules) {
          for (const mission of module.missions) {
            if (mission.status === "in_progress") {
              nextAttention.push(`${mission.missionCode} — ${statusLabel(mission.status)}`);
            }
          }
        }
        if (String(capstone?.lifecycleStatus ?? "") === "LOCKED") {
          nextAttention.push("Capstone verrouillé — missions régulières requises.");
        }
        if (String(capstone?.reviewStatus ?? "") === "revision_requested") {
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
    if (!course) return null;
    for (const module of course.modules) {
      const mission = module.missions.find(
        (item) => item.status === "available" || item.status === "in_progress",
      );
      if (mission) return { module, mission };
    }
    return null;
  }, [course]);

  if (!employee) return null;

  return (
    <section data-testid="workspace-home-page" className="living-learner-home">
      <header className="living-home-section">
        <h1>Poste de travail</h1>
        <p data-testid="workspace-welcome-message">{buildWelcomeMessage(employee.displayName)}</p>
        <div className="living-shell-controls">
          <RunBadge
            label={`${t("shell.run")}: ${runLabel}`}
            historical={historical}
            active={!historical}
          />
          <CurriculumBadge
            label={`${t("shell.curriculum")}: ${
              course?.curriculumVersionLabel ?? course?.curriculumVersion ?? course?.courseCode ?? "—"
            }`}
          />
          <StatusChip label={statusLabel(runStatus)} tone={toneForStatus(runStatus)} />
          {historical ? <StatusChip label={t("status.historical")} tone="gray" /> : null}
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
              Prochaine mission :{" "}
              {nextMission
                ? `${nextMission.mission.missionCode} — ${nextMission.mission.title}`
                : "Aucune mission active"}
            </p>
            <p>Capstone : {capstoneLabel}</p>
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
                <StatusChip label={capstoneLabel} tone={toneForStatus(capstoneLabel)} />
              </Link>
              <Link
                className="living-module-card"
                to={getAppPath("certificats")}
                data-testid="learner-home-gold-milestone"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>Or</h3>
                <p>Certification vérifiée</p>
                <StatusChip label={t("certificate.gold")} tone="gold" />
              </Link>
            </div>
          </section>

          <section className="living-home-section" data-testid="learner-home-recent">
            <h2>{t("home.recent")}</h2>
            <ul>
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
