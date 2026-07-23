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

export function AiCoachPage(): ReactElement {
  const { t } = useLocale();
  const [question, setQuestion] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [mode, setMode] = useState<AiMode>("understand");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
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

  async function submitQuestion(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmed = question.trim();
    if (trimmed.length < 4) {
      setError("Posez une question d'au moins 4 caractères.");
      return;
    }
    setError(null);
    setLoading(true);
    const studentEntry: ChatEntry = {
      id: `q-${Date.now()}`,
      role: "student",
      text: trimmed,
      mode,
    };
    setEntries((current) => [...current, studentEntry]);
    setQuestion("");
    try {
      const framed = `${MODE_PROMPTS[mode]}\n\nQuestion apprenant: ${trimmed}`;
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
      setError(err instanceof Error ? err.message : "Question impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="workspace-page living-ai-coach" data-testid="ai-coach-page">
      <h1>{t("shell.aiCoach")}</h1>
      <p data-testid="ai-coach-disclaimer" role="note">
        {t("ai.disclaimer")}
      </p>
      <StatusChip label="Assistance IA" tone="purple" testId="ai-coach-tone" />
      <ul data-testid="ai-coach-safeguards">
        <li>Aucune modification de score</li>
        <li>Aucune décision d’emploi finale</li>
        <li>Aucune exposition de clé de réponses</li>
        <li>Aucune inférence de traits sensibles</li>
        <li>Repli déterministe et responsabilité humaine rappelés</li>
      </ul>
      {error ? (
        <p role="alert" data-testid="ai-coach-error">
          {error}
        </p>
      ) : null}

      <div className="living-shell-controls" data-testid="ai-coach-modes" role="tablist" aria-label="Modes Coach IA">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            data-testid={`ai-coach-mode-${item.id}`}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section aria-label="Conversation" data-testid="ai-coach-conversation">
        {entries.length === 0 ? (
          <p>Choisissez un mode, puis posez une question liée à votre mission en cours.</p>
        ) : null}
        <ul>
          {entries.map((entry) => (
            <li key={entry.id} data-testid={`ai-coach-entry-${entry.role}`}>
              <strong>{entry.role === "student" ? "Vous" : "Coach IA"}</strong>{" "}
              <StatusChip label={modes.find((item) => item.id === entry.mode)?.label ?? entry.mode} tone="purple" />
              : {entry.text}
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={(event) => void submitQuestion(event)} data-testid="ai-coach-form">
        <label>
          Module (optionnel)
          <select
            value={moduleCode}
            onChange={(event) => setModuleCode(event.target.value)}
            data-testid="ai-coach-module"
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
          Votre question
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            data-testid="ai-coach-question"
          />
        </label>
        <button type="submit" disabled={loading} data-testid="ai-coach-submit">
          {loading ? "Envoi…" : "Demander au coach"}
        </button>
      </form>
    </main>
  );
}
