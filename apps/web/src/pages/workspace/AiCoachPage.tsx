import { useState, type ReactElement } from "react";

import { askAiCoach, type AiCoachAskResponse } from "../../api/aiCoach.js";

const AI_DISCLAIMER =
  "Assistance pédagogique IA — cette réponse ne modifie jamais vos scores, ne débloque aucune mission et ne remplace pas votre jugement professionnel.";

interface ChatEntry {
  readonly id: string;
  readonly role: "student" | "coach";
  readonly text: string;
}

export function AiCoachPage(): ReactElement {
  const [question, setQuestion] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    };
    setEntries((current) => [...current, studentEntry]);
    setQuestion("");
    try {
      const response: AiCoachAskResponse = await askAiCoach(trimmed, {
        moduleCode: moduleCode.trim() || undefined,
      });
      setEntries((current) => [
        ...current,
        {
          id: response.interactionId,
          role: "coach",
          text: response.answer,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Question impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="workspace-page" data-testid="ai-coach-page">
      <h1>Coach IA</h1>
      <p data-testid="ai-coach-disclaimer" role="note">
        {AI_DISCLAIMER}
      </p>
      {error ? (
        <p role="alert" data-testid="ai-coach-error">
          {error}
        </p>
      ) : null}

      <section aria-label="Conversation" data-testid="ai-coach-conversation">
        {entries.length === 0 ? (
          <p>Posez une question liée à votre mission en cours (flux documentaire, risque, KPI…).</p>
        ) : null}
        <ul>
          {entries.map((entry) => (
            <li key={entry.id} data-testid={`ai-coach-entry-${entry.role}`}>
              <strong>{entry.role === "student" ? "Vous" : "Coach IA"} :</strong> {entry.text}
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
