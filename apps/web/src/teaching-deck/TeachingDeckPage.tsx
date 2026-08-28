import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { useLocale } from "../i18n/LocaleProvider.js";
import { TEACHING_SESSION_CODES } from "../sofa/sapCollegeCalendar.js";
import { getTeachingDeck } from "./deckCatalog.js";
import "./teaching-deck.css";

const PROFESSOR_QUERY = "professor";
const PROFESSOR_VALUE = "1";

function resolveModuleCode(paramCode: string | undefined, queryModule: string | null): string {
  const fromParam = paramCode?.trim().toUpperCase();
  if (fromParam && (TEACHING_SESSION_CODES as readonly string[]).includes(fromParam)) {
    return fromParam;
  }
  const fromQuery = queryModule?.trim().toUpperCase();
  if (fromQuery && (TEACHING_SESSION_CODES as readonly string[]).includes(fromQuery)) {
    return fromQuery;
  }
  return fromParam ?? fromQuery ?? "S1";
}

export function TeachingDeckPage(): ReactElement {
  const { moduleCode: routeModuleCode } = useParams<{ moduleCode: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, locale, setLocale } = useLocale();

  const moduleCode = resolveModuleCode(routeModuleCode, searchParams.get("module"));
  const professorMode =
    searchParams.get(PROFESSOR_QUERY) === PROFESSOR_VALUE ||
    searchParams.get("prof") === PROFESSOR_VALUE;

  const deck = useMemo(() => getTeachingDeck(moduleCode), [moduleCode]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [moduleCode]);

  const slideCount = deck?.slides.length ?? 0;
  const currentSlide = deck?.slides[slideIndex] ?? null;

  const goPrev = useCallback(() => {
    setSlideIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setSlideIndex((index) => Math.min(slideCount - 1, index + 1));
  }, [slideCount]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goNext();
      } else if (event.key === "Home") {
        event.preventDefault();
        setSlideIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setSlideIndex(Math.max(0, slideCount - 1));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, slideCount]);

  function toggleProfessorMode(): void {
    const next = new URLSearchParams(searchParams);
    if (professorMode) {
      next.delete(PROFESSOR_QUERY);
    } else {
      next.set(PROFESSOR_QUERY, PROFESSOR_VALUE);
    }
    setSearchParams(next, { replace: true });
  }

  if (!deck) {
    return (
      <div className="teaching-deck" data-testid="teaching-deck-page">
        <div className="teaching-deck__empty">
          <h1>{t("teachingDeck.notFound")}</h1>
          <p>{moduleCode}</p>
          <p>
            Les decks suivent les séances SAP (S1–S10), pas les modules lab M1–M10. Exemple :{" "}
            <Link to="/workspace/teaching-deck/S1?professor=1">Séance 1</Link>.
          </p>
          <Link to="/workspace">{t("teachingDeck.backWorkspace")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="teaching-deck teaching-deck--projector"
      data-testid="teaching-deck-page"
      data-module={deck.moduleCode}
      data-professor-mode={professorMode ? "true" : "false"}
    >
      <header className="teaching-deck__toolbar">
        <div className="teaching-deck__toolbar-group">
          <span className="teaching-deck__progress" data-testid="teaching-deck-progress">
            {t("teachingDeck.slideProgress")
              .replace("{current}", String(slideIndex + 1))
              .replace("{total}", String(slideCount))
              .replace("{module}", deck.moduleCode)}
          </span>
        </div>
        <div className="teaching-deck__toolbar-group">
          <button type="button" onClick={goPrev} disabled={slideIndex === 0} aria-label={t("teachingDeck.prev")}>
            ← {t("teachingDeck.prev")}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={slideIndex >= slideCount - 1}
            aria-label={t("teachingDeck.next")}
          >
            {t("teachingDeck.next")} →
          </button>
          <button
            type="button"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
            aria-label={t("teachingDeck.toggleLocale")}
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <button type="button" onClick={toggleProfessorMode} data-testid="teaching-deck-professor-toggle">
            {professorMode ? t("teachingDeck.learnerMode") : t("teachingDeck.professorMode")}
          </button>
          <Link to="/workspace">{t("teachingDeck.backWorkspace")}</Link>
        </div>
      </header>

      <main className="teaching-deck__stage" aria-live="polite">
        {currentSlide ? (
          <>
            <p className="teaching-deck__meta">
              {deck.moduleCode} · {deck.sapUnitLabel}
            </p>
            <h1 className="teaching-deck__title" data-testid="teaching-deck-slide-title">
              {currentSlide.title}
            </h1>
            <ul className="teaching-deck__bullets" data-testid="teaching-deck-slide-bullets">
              {currentSlide.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {professorMode ? (
              <aside className="teaching-deck__notes" data-testid="teaching-deck-speaker-notes">
                <span className="teaching-deck__notes-label">{t("teachingDeck.speakerNotes")}</span>
                {currentSlide.speakerNotes}
              </aside>
            ) : null}
            <p className="teaching-deck__hint">{t("teachingDeck.keyboardHint")}</p>
          </>
        ) : null}
      </main>
    </div>
  );
}
