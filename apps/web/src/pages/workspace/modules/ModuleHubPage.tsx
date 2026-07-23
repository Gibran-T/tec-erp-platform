import type { ModuleDetailResponse } from "@tec-platform/contracts";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { requestModule } from "../../../api/course.js";
import { listMyPedagogicalRuns } from "../../../api/pedagogical-runs.js";
import { useLocale } from "../../../i18n/LocaleProvider.js";
import { CurriculumBadge, ProgressBar, RunBadge } from "../../../living-erp/components/Badges.js";
import { EmptyState, ErrorState, SkeletonBlock } from "../../../living-erp/components/States.js";
import { StatusChip, toneForStatus } from "../../../living-erp/components/StatusChip.js";
import { getAppPath } from "../../../workspace/appRegistry.js";

const MODULE_WHY: Record<string, { purpose: string; process: string; impact: string }> = {
  M1: {
    purpose: "Comprendre l’entreprise intégrée et la circulation de l’information.",
    process: "Découverte organisationnelle et cartographie des dépendances.",
    impact: "Prépare toutes les décisions P2P, O2C, finance et gouvernance.",
  },
  M2: {
    purpose: "Structurer l’organisation et les données de référence.",
    process: "Master data, sites, articles, partenaires.",
    impact: "Évite les erreurs en cascade dans les transactions Aval.",
  },
  M3: {
    purpose: "Maîtriser le cycle Procure-to-Pay.",
    process: "Demande → commande → réception → facture.",
    impact: "Alimente stocks, finance et performance fournisseur.",
  },
  M4: {
    purpose: "Exécuter le cycle Order-to-Cash.",
    process: "Commande client → allocation → livraison → clôture.",
    impact: "Relie service client, inventaire et encaissement.",
  },
  M5: {
    purpose: "Décider en supply chain et inventaire.",
    process: "Stock, transfert, S&OP.",
    impact: "Équilibre service, coût et risque de rupture.",
  },
  M6: {
    purpose: "Contrôler finance et rapprochements.",
    process: "Facture, three-way match, écarts.",
    impact: "Protège la trésorerie et la conformité.",
  },
  M7: {
    purpose: "Gérer la relation et le service client.",
    process: "Dossier, escalade, clôture NPS.",
    impact: "Convertit l’expérience client en preuves CRM.",
  },
  M8: {
    purpose: "Appliquer HCM / RH ou gouvernance selon le curriculum.",
    process: "Accès, conformité, dossier employé ou SoD.",
    impact: "Relie personnes, droits et risques opérationnels.",
  },
  M9: {
    purpose: "Consolider gouvernance ou BI selon le curriculum.",
    process: "Contrôles, KPI, décisions assistées.",
    impact: "Prépare Capstone et lecture exécutive.",
  },
  M10: {
    purpose: "Synthétiser BI/IA/conseil ou Capstone historique V1.",
    process: "Indicateurs, scénarios, recommandation.",
    impact: "Ponte vers Capstone et certification.",
  },
};

export function ModuleHubPage(): ReactNode {
  const { moduleCode = "" } = useParams<{ moduleCode: string }>();
  const navigate = useNavigate();
  const { t, statusLabel } = useLocale();
  const [module, setModule] = useState<ModuleDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runLabel, setRunLabel] = useState<string>("—");
  const [historical, setHistorical] = useState(false);
  const [curriculumLabel, setCurriculumLabel] = useState("—");

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const [detail, runs] = await Promise.all([
          requestModule(moduleCode.toUpperCase()),
          listMyPedagogicalRuns(),
        ]);
        if (cancelled) return;
        setModule(detail);
        const active =
          runs.find((run) => run.status === "ACTIVE") ?? runs[runs.length - 1] ?? null;
        if (active) {
          setRunLabel(String(active.runLabel ?? active.runCode ?? "—"));
          setHistorical(Boolean(active.isHistorical) || active.status === "COMPLETED");
          setCurriculumLabel(
            String(active.curriculumVersionLabel ?? active.curriculumVersion ?? detail.courseCode),
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("error.generic"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (moduleCode) {
      void load();
    }
    return () => {
      cancelled = true;
    };
  }, [moduleCode, t]);

  if (loading) {
    return <SkeletonBlock testId="module-hub-loading" />;
  }
  if (error) {
    return <ErrorState message={error} testId="module-hub-error" />;
  }
  if (!module) {
    return <EmptyState title={t("empty.generic")} testId="module-hub-empty" />;
  }

  const why = MODULE_WHY[module.moduleCode] ?? {
    purpose: module.competencySummary ?? "Module du parcours TEC.ERP.",
    process: (module.processTags ?? []).join(" · ") || "Processus ERP",
    impact: "Contributeur au parcours et aux preuves de compétence.",
  };

  return (
    <section className="living-module-hub" data-testid="module-hub-page">
      <header className="living-home-section">
        <p>
          <Link to={getAppPath("centre-mission")}>Centre de mission</Link> / {module.moduleCode}
        </p>
        <h1>
          {module.moduleCode} — {module.title.replace(/^Module \d+\s*—\s*/, "")}
        </h1>
        <div className="living-shell-controls">
          <StatusChip
            label={statusLabel(module.status)}
            tone={toneForStatus(module.status)}
            testId="module-hub-status"
          />
          <RunBadge label={`${t("shell.run")}: ${runLabel}`} historical={historical} active={!historical} />
          <CurriculumBadge label={`${t("shell.curriculum")}: ${curriculumLabel}`} />
        </div>
        <ProgressBar value={module.percentComplete} label={`${t("shell.progress")}: ${Math.round(module.percentComplete)} %`} />
        {module.competencySummary ? <p>{module.competencySummary}</p> : null}
        {module.processTags && module.processTags.length > 0 ? (
          <p data-testid="module-hub-process-tags">Processus : {module.processTags.join(" · ")}</p>
        ) : null}
      </header>

      <section className="living-home-section" data-testid="module-hub-why">
        <h2>{t("module.why")}</h2>
        <p>{why.purpose}</p>
        <p>
          <strong>Contexte processus :</strong> {why.process}
        </p>
        <p>
          <strong>Impact aval :</strong> {why.impact}
        </p>
      </section>

      <section className="living-home-section" data-testid="module-hub-process-map">
        <h2>{t("module.processMap")}</h2>
        <div className="living-flow">
          {(module.processTags && module.processTags.length > 0
            ? module.processTags
            : ["Entrée", "Décision", "Preuve", "Impact"]
          ).map((node, index, arr) => (
            <div key={node} style={{ display: "contents" }}>
              <span className="living-flow__node">{node}</span>
              {index < arr.length - 1 ? <span className="living-flow__arrow">→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="living-home-section" data-testid="module-hub-missions">
        <h2>{t("module.missions")}</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {module.missions.map((mission) => (
            <article
              key={mission.missionKey}
              className="living-mission-card"
              data-testid={`module-hub-mission-${mission.missionKey}`}
            >
              <header style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                <h3>
                  {mission.missionCode} — {mission.title}
                </h3>
                <StatusChip label={statusLabel(mission.status)} tone={toneForStatus(mission.status)} />
              </header>
              <p>Compétence module : {module.competencySummary ?? "—"}</p>
              {mission.unlockExplanation ? <p>{mission.unlockExplanation}</p> : null}
              {mission.status === "locked" ? (
                <p role="status">Mission verrouillée — prérequis non satisfaits.</p>
              ) : (
                <button
                  type="button"
                  data-testid={`module-hub-open-${mission.missionKey}`}
                  onClick={() =>
                    navigate(`${getAppPath("centre-mission")}?mission=${encodeURIComponent(mission.missionKey)}`)
                  }
                >
                  Ouvrir la mission
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="living-home-section" data-testid="module-hub-evidence">
        <h2>{t("module.evidence")}</h2>
        <ul>
          <li>Documents et décisions liés aux missions complétées du module.</li>
          <li>Exceptions traitées et reprises visibles dans la chronologie.</li>
          <li>Compétences démontrées : {module.competencySummary ?? "à consolider"}.</li>
        </ul>
      </section>

      <section className="living-home-section" data-testid="module-hub-assessment">
        <h2>{t("module.assessment")}</h2>
        <p>
          Consultez le centre d’évaluations pour le statut de déblocage, les tentatives et les thèmes à
          réviser liés à {module.moduleCode}.
        </p>
        <Link to={getAppPath("evaluations")}>Ouvrir les évaluations</Link>
      </section>
    </section>
  );
}
