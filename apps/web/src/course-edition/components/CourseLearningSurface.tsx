import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { CourseEditionSurfaceId, CourseEditionSurfaceMeta } from "../types.js";

export interface CourseLearningSurfaceProps {
  readonly moduleCode: string;
  readonly moduleTitle: string;
  readonly surfaces: readonly CourseEditionSurfaceMeta[];
  readonly activeSurfaceId: CourseEditionSurfaceId;
  readonly objective: string;
  readonly progressPercent: number;
  readonly completedSurfaces: readonly CourseEditionSurfaceId[];
  readonly basePath: string;
  readonly children: ReactNode;
  readonly footerActions?: ReactNode;
}

export function CourseLearningSurface(props: CourseLearningSurfaceProps): ReactNode {
  return (
    <section className="ce-surface" data-testid="course-learning-surface">
      <header className="ce-surface__header">
        <p className="ce-surface__eyebrow">
          <Link to={`/workspace/modules/${props.moduleCode}`}>Module {props.moduleCode}</Link>
          {" · Course Edition"}
        </p>
        <h1 data-testid="course-learning-surface-title">
          {props.moduleCode} — {props.moduleTitle}
        </h1>
        <p className="ce-surface__objective" data-testid="course-learning-surface-objective">
          {props.objective}
        </p>
        <div
          className="ce-surface__progress"
          role="status"
          aria-label={`Progression Course Edition ${props.progressPercent} pour cent`}
          data-testid="course-learning-surface-progress"
        >
          <div className="ce-surface__progress-track">
            <div
              className="ce-surface__progress-fill"
              style={{ width: `${Math.max(0, Math.min(100, props.progressPercent))}%` }}
            />
          </div>
          <span>{props.progressPercent} %</span>
        </div>
      </header>

      <nav className="ce-surface__nav" aria-label="Surfaces d’apprentissage" data-testid="course-learning-surface-nav">
        <ol>
          {props.surfaces.map((surface, index) => {
            const complete = props.completedSurfaces.includes(surface.id);
            const active = surface.id === props.activeSurfaceId;
            return (
              <li key={surface.id}>
                <Link
                  to={`${props.basePath}/${surface.id}`}
                  className={[
                    "ce-surface__nav-link",
                    active ? "ce-surface__nav-link--active" : "",
                    complete ? "ce-surface__nav-link--complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active ? "page" : undefined}
                  data-testid={`course-surface-nav-${surface.id}`}
                >
                  <span className="ce-surface__nav-index">{index + 1}</span>
                  <span>
                    <strong>{surface.label}</strong>
                    <small>{surface.shortLabel}</small>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="ce-surface__body" data-testid="course-learning-surface-body">
        {props.children}
      </div>

      {props.footerActions ? (
        <footer className="ce-surface__footer" data-testid="course-learning-surface-footer">
          {props.footerActions}
        </footer>
      ) : null}
    </section>
  );
}
