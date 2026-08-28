import type { ReactNode } from "react";

import type { VisualFrameContent } from "../types.js";

export interface VisualLearningFrameProps {
  readonly frames: readonly VisualFrameContent[];
  readonly activeIndex: number;
  readonly onIndexChange: (index: number) => void;
  readonly professorMode?: boolean;
}

export function VisualLearningFrame(props: VisualLearningFrameProps): ReactNode {
  const frame = props.frames[props.activeIndex];
  if (!frame) {
    return <p role="status">Aucun cadre visuel disponible.</p>;
  }

  const canPrev = props.activeIndex > 0;
  const canNext = props.activeIndex < props.frames.length - 1;

  return (
    <section className="ce-visual-frame" data-testid="visual-learning-frame">
      <header className="ce-visual-frame__header">
        <p data-testid="visual-learning-frame-progress">
          Cadre {props.activeIndex + 1} / {props.frames.length}
        </p>
        <h2 data-testid="visual-learning-frame-title">{frame.title}</h2>
        <p data-testid="visual-learning-frame-description">{frame.description}</p>
      </header>

      <div
        className="ce-visual-frame__canvas"
        data-testid="visual-learning-frame-canvas"
        data-asset-slot={frame.id}
        data-has-image={frame.imageSrc ? "true" : "false"}
      >
        {frame.imageSrc ? (
          <figure className="ce-visual-frame__image" data-testid="visual-learning-frame-image">
            <img src={frame.imageSrc} alt={frame.imageAlt ?? frame.title} />
          </figure>
        ) : null}
        {frame.bodyHtml ? (
          <div
            className="ce-visual-frame__html"
            data-testid="visual-learning-frame-html"
            dangerouslySetInnerHTML={{ __html: frame.bodyHtml }}
          />
        ) : null}
        {!frame.imageSrc && !frame.bodyHtml ? (
          <p className="ce-visual-frame__placeholder" data-testid="visual-learning-frame-placeholder">
            Cadre « {frame.title} » — renseigner imageSrc (PNG/WebP) ou bodyHtml professionnel.
          </p>
        ) : null}
        {!frame.imageSrc && frame.bodyHtml ? (
          <p className="ce-visual-frame__slot-note" data-testid="visual-learning-frame-asset-slot">
            Emplacement PNG/WebP prêt : définir <code>imageSrc</code> sur ce cadre pour remplacer le
            rendu HTML natif sans changer le runtime.
          </p>
        ) : null}
      </div>

      {props.professorMode && frame.professorNote ? (
        <aside className="ce-visual-frame__professor" data-testid="visual-learning-frame-professor-note">
          <strong>Note professeur</strong>
          <p>{frame.professorNote}</p>
        </aside>
      ) : null}

      <div className="ce-visual-frame__controls">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => props.onIndexChange(props.activeIndex - 1)}
          data-testid="visual-learning-frame-prev"
        >
          Précédent
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => props.onIndexChange(props.activeIndex + 1)}
          data-testid="visual-learning-frame-next"
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
