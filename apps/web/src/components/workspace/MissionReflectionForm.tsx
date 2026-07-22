import { useEffect, useState, type ReactElement } from "react";

import {
  getMyMissionReflection,
  saveMyMissionReflection,
} from "../../api/pedagogical-runs.js";

const LABELS: Record<string, string> = {
  clarity: "Clarté",
  confidence: "Confiance",
  cognitiveLoad: "Charge cognitive",
  realism: "Réalisme",
  relevance: "Pertinence",
  navigationQuality: "Navigation",
  feedbackQuality: "Qualité du feedback",
  visualQuality: "Qualité visuelle",
  aiUsefulness: "Utilité du coach IA",
  biUsefulness: "Utilité des indicateurs",
};

type LikertKey =
  | "clarity"
  | "confidence"
  | "cognitiveLoad"
  | "realism"
  | "relevance"
  | "navigationQuality"
  | "feedbackQuality"
  | "visualQuality";

const REQUIRED: LikertKey[] = [
  "clarity",
  "confidence",
  "cognitiveLoad",
  "realism",
  "relevance",
  "navigationQuality",
  "feedbackQuality",
  "visualQuality",
];

export function MissionReflectionForm(props: {
  readonly runId: string;
  readonly missionKey: string;
  readonly enabled: boolean;
}): ReactElement | null {
  const { runId, missionKey, enabled } = props;
  const [values, setValues] = useState<Record<LikertKey, number>>({
    clarity: 3,
    confidence: 3,
    cognitiveLoad: 3,
    realism: 3,
    relevance: 3,
    navigationQuality: 3,
    feedbackQuality: 3,
    visualQuality: 3,
  });
  const [aiUsefulness, setAiUsefulness] = useState<number | "">("");
  const [biUsefulness, setBiUsefulness] = useState<number | "">("");
  const [externalExplanationRequired, setExternalExplanationRequired] = useState(false);
  const [externalSlidesWouldHelp, setExternalSlidesWouldHelp] = useState(false);
  const [qualitativeNote, setQualitativeNote] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !runId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void getMyMissionReflection(runId, missionKey)
      .then((row) => {
        if (!row) {
          return;
        }
        setExistingId(String(row.id));
        setValues({
          clarity: Number(row.clarity),
          confidence: Number(row.confidence),
          cognitiveLoad: Number(row.cognitiveLoad),
          realism: Number(row.realism),
          relevance: Number(row.relevance),
          navigationQuality: Number(row.navigationQuality),
          feedbackQuality: Number(row.feedbackQuality),
          visualQuality: Number(row.visualQuality),
        });
        setAiUsefulness(row.aiUsefulness == null ? "" : Number(row.aiUsefulness));
        setBiUsefulness(row.biUsefulness == null ? "" : Number(row.biUsefulness));
        setExternalExplanationRequired(Boolean(row.externalExplanationRequired));
        setExternalSlidesWouldHelp(Boolean(row.externalSlidesWouldHelp));
        setQualitativeNote(typeof row.qualitativeNote === "string" ? row.qualitativeNote : "");
      })
      .catch(() => {
        // Absence is normal for a first reflection.
      })
      .finally(() => setLoading(false));
  }, [enabled, runId, missionKey]);

  if (!enabled) {
    return null;
  }

  async function save(): Promise<void> {
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const saved = await saveMyMissionReflection({
        runId,
        missionKey,
        isUpdate: Boolean(existingId),
        body: {
          ...values,
          aiUsefulness: aiUsefulness === "" ? null : aiUsefulness,
          biUsefulness: biUsefulness === "" ? null : biUsefulness,
          externalExplanationRequired,
          externalSlidesWouldHelp,
          qualitativeNote: qualitativeNote.trim() || null,
        },
      });
      setExistingId(String(saved.id));
      setStatus("Réflexion enregistrée.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="workspace-mission__feedback" data-testid="mission-reflection-form">
      <h3>Réflexion post-mission</h3>
      <p>Optionnelle — n&apos;empêche pas la poursuite du parcours.</p>
      {loading ? <p role="status">Chargement de la réflexion…</p> : null}
      {error ? (
        <p role="alert" data-testid="mission-reflection-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="mission-reflection-status">
          {status}
        </p>
      ) : null}
      <div className="workspace-mission__reflection-grid">
        {REQUIRED.map((key) => (
          <label key={key}>
            {LABELS[key]}
            <select
              value={values[key]}
              onChange={(event) =>
                setValues((current) => ({ ...current, [key]: Number(event.target.value) }))
              }
              data-testid={`mission-reflection-${key}`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label>
          {LABELS.aiUsefulness}
          <select
            value={aiUsefulness}
            onChange={(event) =>
              setAiUsefulness(event.target.value === "" ? "" : Number(event.target.value))
            }
          >
            <option value="">Non renseigné</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          {LABELS.biUsefulness}
          <select
            value={biUsefulness}
            onChange={(event) =>
              setBiUsefulness(event.target.value === "" ? "" : Number(event.target.value))
            }
          >
            <option value="">Non renseigné</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <input
          type="checkbox"
          checked={externalExplanationRequired}
          onChange={(event) => setExternalExplanationRequired(event.target.checked)}
        />{" "}
        Explication externe requise
      </label>
      <label>
        <input
          type="checkbox"
          checked={externalSlidesWouldHelp}
          onChange={(event) => setExternalSlidesWouldHelp(event.target.checked)}
        />{" "}
        Des diapositives externes auraient aidé
      </label>
      <label>
        Note qualitative
        <textarea
          value={qualitativeNote}
          onChange={(event) => setQualitativeNote(event.target.value)}
          data-testid="mission-reflection-note"
        />
      </label>
      <button
        type="button"
        disabled={saving || loading}
        onClick={() => void save()}
        data-testid="mission-reflection-save"
      >
        {saving ? "Enregistrement…" : existingId ? "Mettre à jour" : "Enregistrer"}
      </button>
    </section>
  );
}
