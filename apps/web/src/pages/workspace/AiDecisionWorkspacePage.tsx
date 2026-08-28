import { useMemo, useState, type ReactElement } from "react";

import { askAiCoach, type AiCoachAskResponse } from "../../api/aiCoach.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { StatusChip } from "../../living-erp/components/StatusChip.js";

type AiMode = "understand" | "diagnose" | "decide" | "review" | "reflect";

interface ChatEntry {
  readonly id: string;
  readonly role: "student" | "coach";
  readonly text: string;
  readonly mode: AiMode;
}

const MODE_PROMPTS: Record<AiMode, string> = {
  understand: "Mode Comprendre — explique le concept ou le document sans donner la réponse attendue.",
  diagnose: "Mode Diagnostiquer — aide à distinguer symptôme et cause, sans clé de correction.",
  decide: "Mode Préparer une décision — structure preuves, risques et recommandation.",
  review: "Mode Réviser — prépare l'évaluation / résume l'apprentissage sans fuite de réponses.",
  reflect: "Mode Réfléchir — guide une réflexion sur les leçons apprises et alternatives.",
};

export function AiDecisionWorkspacePage(): ReactElement {
  const { t } = useLocale();
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [mode, setMode] = useState<AiMode>("decide");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [synthesis, setSynthesis] = useState("");
  const [reflectionClosed, setReflectionClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modes = useMemo(
    () =>
      [
        { id: "understand" as const, label: t("ai.mode.understand") },
        { id: "diagnose" as const, label: t("ai.mode.diagnose") },
        { id: "decide" as const, label: t("ai.mode.decide") },
        { id: "review" as const, label: t("ai.mode.review") },
        { id: "reflect" as const, label: t("ai.mode.reflect") },
      ] as const,
    [t],
  );

  const synthesisValid = synthesis.trim().length >= 20;

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmed = question.trim();
    if (trimmed.length < 4) {
      setError(t("aiDecision.questionTooShort"));
      return;
    }
    setError(null);
    setLoading(true);
    const evidenceContext =
      evidenceNotes.trim().length > 0
        ? `\n\nPreuves collées par l'apprenant:\n${evidenceNotes.trim()}`
        : "";
    const studentEntry: ChatEntry = {
      id: `q-${Date.now()}`,
      role: "student",
      text: trimmed,
      mode,
    };
    setEntries((current) => [...current, studentEntry]);
    setQuestion("");
    try {
      const framed = `${MODE_PROMPTS[mode]}${evidenceContext}\n\nQuestion apprenant: ${trimmed}`;
      const response: AiCoachAskResponse = await askAiCoach(framed, {
        moduleCode: moduleCode.trim() || undefined,
      });
      setEntries((current) => [
        ...current,
        {
          id: response.interactionId,
          role: "coach",
          text: response.answer,
          mode,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.generic"));
    } finally {
      setLoading(false);
    }
  }

  function closeReflection(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!synthesisValid) {
      setError(t("aiDecision.synthesisRequired"));
      return;
    }
    setError(null);
    setReflectionClosed(true);
  }

  return (
    <main className="workspace-page ai-decision-workspace" data-testid="ai-decision-workspace-page">
      <header>
        <h1>{t("aiDecision.title")}</h1>
        <p role="note" data-testid="ai-decision-visible-banner">
          {t("aiDecision.visibleAiBanner")}
        </p>
        <p data-testid="ai-decision-ambient-note">{t("aiDecision.ambientAiNote")}</p>
        <StatusChip label={t("aiDecision.visibleAiBadge")} tone="purple" testId="ai-decision-visible-badge" />
      </header>

      {error ? (
        <p role="alert" data-testid="ai-decision-error">
          {error}
        </p>
      ) : null}

      <div
        className="ai-decision-grid"
        style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}
        data-testid="ai-decision-columns"
      >
        <section aria-label={t("aiDecision.evidencePanel")} data-testid="ai-decision-evidence-panel">
          <h2>{t("aiDecision.evidencePanel")}</h2>
          <p>{t("aiDecision.evidenceHint")}</p>
          <label>
            {t("aiDecision.evidenceLabel")}
            <textarea
              value={evidenceNotes}
              onChange={(event) => setEvidenceNotes(event.target.value)}
              rows={12}
              data-testid="ai-decision-evidence-notes"
            />
          </label>
        </section>

        <section aria-label={t("aiDecision.coachThread")} data-testid="ai-decision-coach-thread">
          <h2>{t("aiDecision.coachThread")}</h2>
          <div className="living-shell-controls" data-testid="ai-decision-modes" role="tablist">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                data-testid={`ai-decision-mode-${item.id}`}
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <ul data-testid="ai-decision-conversation">
            {entries.length === 0 ? <li>{t("aiDecision.emptyThread")}</li> : null}
            {entries.map((entry) => (
              <li key={entry.id} data-testid={`ai-decision-entry-${entry.role}`}>
                <strong>{entry.role === "student" ? t("aiDecision.you") : t("shell.aiCoach")}</strong>{" "}
                <StatusChip
                  label={modes.find((item) => item.id === entry.mode)?.label ?? entry.mode}
                  tone="purple"
                />
                : {entry.text}
              </li>
            ))}
          </ul>

          <form onSubmit={(event) => void submitQuestion(event)} data-testid="ai-decision-ask-form">
            <label>
              {t("aiDecision.moduleOptional")}
              <select
                value={moduleCode}
                onChange={(event) => setModuleCode(event.target.value)}
                data-testid="ai-decision-module"
              >
                <option value="">—</option>
                {["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("aiDecision.questionLabel")}
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                data-testid="ai-decision-question"
              />
            </label>
            <button type="submit" disabled={loading} data-testid="ai-decision-submit">
              {loading ? t("aiDecision.sending") : t("aiDecision.askCoach")}
            </button>
          </form>
        </section>
      </div>

      <section aria-label={t("aiDecision.synthesisLabel")} data-testid="ai-decision-synthesis-section">
        <h2>{t("aiDecision.synthesisLabel")}</h2>
        <p>{t("aiDecision.synthesisHint")}</p>
        <form onSubmit={closeReflection} data-testid="ai-decision-close-form">
          <label>
            {t("aiDecision.synthesisLabel")}
            <textarea
              value={synthesis}
              onChange={(event) => setSynthesis(event.target.value)}
              rows={4}
              placeholder={t("aiDecision.synthesisPlaceholder")}
              data-testid="ai-decision-synthesis"
              required
              minLength={20}
            />
          </label>
          <button
            type="submit"
            disabled={!synthesisValid || reflectionClosed}
            data-testid="ai-decision-close-reflection"
          >
            {reflectionClosed ? t("aiDecision.reflectionClosed") : t("aiDecision.closeReflection")}
          </button>
        </form>
        {!synthesisValid ? (
          <p role="status" data-testid="ai-decision-synthesis-required">
            {t("aiDecision.synthesisRequired")}
          </p>
        ) : null}
        {reflectionClosed ? (
          <p role="status" data-testid="ai-decision-reflection-complete">
            {t("aiDecision.reflectionComplete")}
          </p>
        ) : null}
      </section>
    </main>
  );
}
