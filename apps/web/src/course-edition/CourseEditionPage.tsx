import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { BusinessDocumentView } from "./components/BusinessDocumentView.js";
import { ConnectionLab } from "./components/ConnectionLab.js";
import { CourseLearningSurface } from "./components/CourseLearningSurface.js";
import { MissionBilan } from "./components/MissionBilan.js";
import { ModuleConsolidation } from "./components/ModuleConsolidation.js";
import { VisualLearningFrame } from "./components/VisualLearningFrame.js";
import { getCourseEditionPack, M1_ANALYST_ROLE } from "./content/index.js";
import {
  computeSurfaceProgressPercent,
  hydrateCourseEditionProgress,
  isCourseEditionModuleComplete,
  loadCourseEditionProgress,
  markDocumentOpened,
  markFrameViewed,
  markSurfaceComplete,
  recordConnectionLabResult,
  recordQuizResult,
  type CourseEditionProgressState,
} from "./progress.js";
import type { CourseEditionSurfaceId } from "./types.js";
import { getAppPath } from "../workspace/appRegistry.js";

const SURFACE_IDS: readonly CourseEditionSurfaceId[] = [
  "apprendre",
  "connecter",
  "missions",
  "bilan",
];

function isSurfaceId(value: string | undefined): value is CourseEditionSurfaceId {
  return value !== undefined && (SURFACE_IDS as readonly string[]).includes(value);
}

export function CourseEditionPage(): ReactNode {
  const { moduleCode = "", surfaceId } = useParams<{
    moduleCode: string;
    surfaceId?: string;
  }>();
  const navigate = useNavigate();
  const pack = useMemo(() => getCourseEditionPack(moduleCode), [moduleCode]);
  const [progress, setProgress] = useState<CourseEditionProgressState>(() =>
    loadCourseEditionProgress(moduleCode || "M1"),
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [professorMode, setProfessorMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const code = moduleCode || "M1";
    setProgress(loadCourseEditionProgress(code));
    void hydrateCourseEditionProgress(code).then((hydrated) => {
      if (!cancelled) {
        setProgress(hydrated);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [moduleCode]);

  if (!pack) {
    return (
      <section className="living-home-section" data-testid="course-edition-unavailable">
        <h1>Course Edition</h1>
        <p>
          Le packaging Course Edition n’est pas encore disponible pour le module{" "}
          {moduleCode.toUpperCase() || "—"}. Les modules M1 à M10 sont pris en charge.
        </p>
        <Link to={`/workspace/modules/${moduleCode || "M1"}`}>Retour au hub module</Link>
      </section>
    );
  }

  const basePath = `/workspace/modules/${pack.moduleCode}/course-edition`;
  if (!surfaceId) {
    return <Navigate to={`${basePath}/apprendre`} replace />;
  }
  if (!isSurfaceId(surfaceId)) {
    return <Navigate to={`${basePath}/apprendre`} replace />;
  }

  const activeMeta = pack.surfaces.find((surface) => surface.id === surfaceId)!;
  const progressPercent = computeSurfaceProgressPercent(progress);
  const activeDocument =
    pack.documents.find((document) => document.id === activeDocumentId) ?? pack.documents[0] ?? null;

  const footerFor = (surface: CourseEditionSurfaceId): ReactNode => {
    const index = SURFACE_IDS.indexOf(surface);
    const next = SURFACE_IDS[index + 1];
    const prev = SURFACE_IDS[index - 1];
    return (
      <div className="ce-surface__footer-actions">
        {prev ? (
          <button type="button" onClick={() => navigate(`${basePath}/${prev}`)}>
            Surface précédente
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            data-testid={`course-edition-next-${next}`}
            onClick={() => {
              setProgress(markSurfaceComplete(pack.moduleCode, surface));
              navigate(`${basePath}/${next}`);
            }}
          >
            Continuer vers {pack.surfaces.find((item) => item.id === next)?.label}
          </button>
        ) : (
          <Link to={`/workspace/modules/${pack.moduleCode}`} data-testid="course-edition-back-hub">
            Retour au hub module
          </Link>
        )}
      </div>
    );
  };

  let body: ReactNode = null;

  if (surfaceId === "apprendre") {
    body = (
      <div className="ce-apprendre" data-testid="course-surface-apprendre">
        <section className="living-home-section">
          <h2>Objectifs d’apprentissage</h2>
          <ul data-testid="apprendre-objectives">
            {pack.learningObjectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="living-home-section" data-testid="apprendre-role">
          {pack.moduleCode === "M1" ? (
            <>
              <h2>{M1_ANALYST_ROLE.title}</h2>
              {M1_ANALYST_ROLE.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </>
          ) : (
            <>
              <h2>Rôle pédagogique — {pack.moduleCode}</h2>
              <p>{pack.subtitle}</p>
              <p>
                Progressez dans la séquence comprendre → exécuter → décider. SAP est enseigné en
                cours ; TEC.ERP et NordHabitat (lab-only) servent à l’exercice guidé.
              </p>
            </>
          )}
        </section>

        <VisualLearningFrame
          frames={pack.visualFrames}
          activeIndex={frameIndex}
          professorMode={professorMode}
          onIndexChange={(index) => {
            setFrameIndex(index);
            const frame = pack.visualFrames[index];
            if (frame) {
              setProgress(markFrameViewed(pack.moduleCode, frame.id));
            }
          }}
        />

        <section className="living-home-section" data-testid="apprendre-glossary">
          <h2>Glossaire introductif</h2>
          <dl>
            {pack.glossary.map((entry) => (
              <div key={entry.term}>
                <dt>{entry.term}</dt>
                <dd>{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="living-home-section" data-testid="apprendre-documents">
          <h2>Documents d’affaires (démonstration)</h2>
          <div className="ce-doc-picker">
            {pack.documents.map((document) => (
              <button
                key={document.id}
                type="button"
                data-testid={`apprendre-open-doc-${document.id}`}
                onClick={() => {
                  setActiveDocumentId(document.id);
                  setProgress(markDocumentOpened(pack.moduleCode, document.id));
                }}
              >
                {document.title}
              </button>
            ))}
          </div>
          {activeDocument ? <BusinessDocumentView document={activeDocument} /> : null}
        </section>

        <section className="living-home-section" data-testid="apprendre-erp-demo">
          <h2>Démonstration écran ERP</h2>
          <p>
            Ouvrez l’ERP organisationnel NordHabitat pour observer les sept départements et les
            signaux de fragmentation.
          </p>
          <Link to={pack.erpDemoPath} data-testid="apprendre-open-erp">
            Ouvrir l’ERP organisationnel
          </Link>
        </section>

        <label className="ce-professor-toggle">
          <input
            type="checkbox"
            checked={professorMode}
            onChange={(event) => setProfessorMode(event.target.checked)}
            data-testid="apprendre-professor-mode"
          />
          Afficher les notes professeur (facilitation)
        </label>
      </div>
    );
  }

  if (surfaceId === "connecter") {
    body = (
      <div data-testid="course-surface-connecter">
        <ConnectionLab
          lab={pack.connectionLab}
          onCompleted={(result) => {
            setProgress(
              recordConnectionLabResult(pack.moduleCode, result.scorePercent, result.passed),
            );
          }}
        />
        <section className="living-home-section">
          <h3>Document source du laboratoire</h3>
          <BusinessDocumentView
            document={
              pack.documents.find((document) => document.id === "doc-inventory-signal") ??
              pack.documents[0]!
            }
          />
        </section>
      </div>
    );
  }

  if (surfaceId === "missions") {
    body = (
      <div className="ce-missions" data-testid="course-surface-missions">
        <section className="living-home-section">
          <h2>Parcours missions {pack.moduleCode} (runtime existant)</h2>
          <p>
            Course Edition compose le parcours. Le Centre de mission reste l’autorité d’exécution,
            de scoring et de progression.
          </p>
          <div className="ce-mission-list">
            {pack.missions.map((mission) => (
              <article
                key={mission.missionKey}
                className="living-mission-card"
                data-testid={`course-mission-${mission.missionCode}`}
              >
                <h3>
                  {mission.missionCode} — {mission.title}
                </h3>
                <p>
                  <strong>Rôle :</strong> {mission.role}
                </p>
                <p>
                  <strong>Objectif :</strong> {mission.objective}
                </p>
                <p>
                  <strong>Conséquence authored (bilan) :</strong> {mission.consequenceSummary}
                </p>
                <button
                  type="button"
                  data-testid={`course-open-mission-${mission.missionKey}`}
                  onClick={() =>
                    navigate(
                      `${getAppPath("centre-mission")}?mission=${encodeURIComponent(mission.missionKey)}`,
                    )
                  }
                >
                  Ouvrir dans le Centre de mission
                </button>
              </article>
            ))}
          </div>
          <button
            type="button"
            data-testid="course-missions-mark-complete"
            onClick={() => setProgress(markSurfaceComplete(pack.moduleCode, "missions"))}
          >
            Marquer la surface Missions comme parcourue
          </button>
        </section>
      </div>
    );
  }

  if (surfaceId === "bilan") {
    body = (
      <div data-testid="course-surface-bilan">
        <MissionBilan
          bilan={pack.bilan}
          kpi={pack.kpi}
          completedMissionCodes={pack.missions.map((mission) => mission.missionCode)}
        />
        <ModuleConsolidation
          items={pack.quiz}
          progressPercent={progressPercent}
          moduleComplete={isCourseEditionModuleComplete(progress)}
          onCompleted={(result) => {
            setProgress(recordQuizResult(pack.moduleCode, result.percent, result.passed));
          }}
        />
        <section className="living-home-section" data-testid="course-professor-support">
          <h2>Support professeur (existant)</h2>
          <ul>
            {pack.professorNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p>
            Identité étudiante, scores objectifs, missions complétées, réponses ouvertes et
            progression Course Edition {pack.moduleCode} : réutilisez le{" "}
            <Link to={getAppPath("portail-professeur")}>Portail professeur / PCC</Link>. La
            progression CE est persistée dans les métadonnées du parcours pédagogique (sans Wave 7).
          </p>
        </section>
      </div>
    );
  }

  return (
    <CourseLearningSurface
      moduleCode={pack.moduleCode}
      moduleTitle={pack.title}
      surfaces={pack.surfaces}
      activeSurfaceId={surfaceId}
      objective={activeMeta.objective}
      progressPercent={progressPercent}
      completedSurfaces={progress.completedSurfaces}
      basePath={basePath}
      footerActions={footerFor(surfaceId)}
    >
      {body}
    </CourseLearningSurface>
  );
}
