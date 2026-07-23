import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";
import {
  CAPSTONE_STAGES,
  PLAYBACK_MODULES,
  PROCESS_CHAIN_STEPS,
  PROFESSIONAL_STAGES,
} from "./modules.js";

const NODE_LAYOUT: { id: keyof ReturnType<typeof usePlayback>["copy"]["nodes"]; left: string; top: string; tone?: string; labelFr: string; labelEn: string }[] = [
  { id: "customers", left: "12%", top: "22%", labelFr: "Clients", labelEn: "Customers" },
  { id: "sales", left: "28%", top: "18%", tone: "blue", labelFr: "Ventes", labelEn: "Sales" },
  { id: "inventory", left: "46%", top: "28%", tone: "amber", labelFr: "Stocks", labelEn: "Inventory" },
  { id: "procurement", left: "34%", top: "48%", labelFr: "Achats", labelEn: "Procurement" },
  { id: "suppliers", left: "16%", top: "62%", labelFr: "Fournisseurs", labelEn: "Suppliers" },
  { id: "warehouse", left: "52%", top: "58%", tone: "amber", labelFr: "Entrepôt", labelEn: "Warehouse" },
  { id: "finance", left: "70%", top: "42%", tone: "green", labelFr: "Finance", labelEn: "Finance" },
  { id: "hcm", left: "66%", top: "68%", labelFr: "HCM", labelEn: "HCM" },
  { id: "governance", left: "84%", top: "28%", tone: "red", labelFr: "Gouvernance", labelEn: "Governance" },
  { id: "bi", left: "82%", top: "58%", tone: "purple", labelFr: "BI", labelEn: "BI" },
  { id: "management", left: "58%", top: "16%", tone: "gold", labelFr: "Direction", labelEn: "Management" },
];

export function PortalPage(): ReactNode {
  const { copy, locale, tModuleTitle, tRole, selectedModule, setSelectedModuleCode, selectedModuleCode, ambientEvent } =
    usePlayback();
  const [navOpen, setNavOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<(typeof NODE_LAYOUT)[number]["id"]>("procurement");
  const [processPulse, setProcessPulse] = useState(4);

  const nodeDetail = copy.nodes[activeNode] ?? {
    role: "—",
    process: "—",
    document: "—",
    consequence: "—",
  };
  const complexityLabel =
    selectedModule.stakeholderComplexity === "low"
      ? locale === "fr"
        ? "Faible"
        : "Low"
      : selectedModule.stakeholderComplexity === "medium"
        ? locale === "fr"
          ? "Moyenne"
          : "Medium"
        : locale === "fr"
          ? "Élevée"
          : "High";

  const ambientMessages = useMemo(() => {
    const chain = {
      supplier: {
        fr: "Fournisseur: délai de livraison +4 jours si quantité > 120.",
        en: "Supplier: delivery lead time +4 days if quantity > 120.",
      },
      warehouse: {
        fr: "Entrepôt: quai B saturé jeudi — capacité partielle.",
        en: "Warehouse: dock B saturated Thursday — partial capacity.",
      },
      finance: {
        fr: "Finance: engagement cash anticipé de 18 k$ sur 30 jours.",
        en: "Finance: anticipated cash commitment of $18k over 30 days.",
      },
      supervisor: {
        fr: "Superviseur: justifiez l’arbitrage service vs coût avant le comité.",
        en: "Supervisor: justify the service-vs-cost trade-off before the committee.",
      },
    };
    return chain[ambientEvent];
  }, [ambientEvent]);

  return (
    <>
      <header className="playback-header">
        <div className="playback-brand">
          <strong>TEC.ERP</strong>
          <span>Collège de la Concorde</span>
        </div>
        <button
          type="button"
          className="playback-btn playback-btn--small playback-mobile-nav"
          aria-expanded={navOpen}
          aria-controls="playback-primary-nav"
          onClick={() => setNavOpen((open) => !open)}
        >
          Menu
        </button>
        <nav id="playback-primary-nav" className="playback-nav" data-open={navOpen ? "true" : "false"} aria-label="Playback">
          <a href="#experience" onClick={() => setNavOpen(false)}>
            {copy.nav.experience}
          </a>
          <a href="#parcours" onClick={() => setNavOpen(false)}>
            {copy.nav.journey}
          </a>
          <a href="#entreprise" onClick={() => setNavOpen(false)}>
            {copy.nav.enterprise}
          </a>
          <a href="#bi-ia" onClick={() => setNavOpen(false)}>
            {copy.nav.biAi}
          </a>
          <a href="#capstone" onClick={() => setNavOpen(false)}>
            {copy.nav.capstone}
          </a>
        </nav>
        <div className="playback-header-actions">
          <Link className="playback-btn playback-btn--primary" to="/playback/v2/login">
            {copy.nav.login}
          </Link>
        </div>
      </header>

      <div className="playback-main">
        <section className="playback-hero" id="experience" aria-labelledby="hero-title">
          <div>
            <div className="playback-eyebrow">{copy.hero.eyebrow}</div>
            <h1 id="hero-title">{copy.hero.title}</h1>
            <p>{copy.hero.support}</p>
            <div className="playback-hero-actions">
              <Link className="playback-btn playback-btn--primary" to="/playback/v2/login" data-testid="playback-hero-primary">
                {copy.hero.primaryCta}
              </Link>
              <a className="playback-btn" href="#parcours">
                {copy.hero.secondaryCta}
              </a>
            </div>
            <span className="playback-pill">{copy.hero.notLms}</span>
          </div>
          <div className="playback-detail" aria-label={copy.enterprise.title}>
            <p className="playback-eyebrow">{locale === "fr" ? "Digital Twin" : "Digital Twin"}</p>
            <h2 style={{ marginTop: 0 }}>{locale === "fr" ? "Equinoxe en un regard" : "Equinoxe at a glance"}</h2>
            <p className="playback-lead" style={{ marginBottom: "1rem" }}>
              {locale === "fr"
                ? "Processus connectés · preuves · conséquences · mandats"
                : "Connected processes · evidence · consequences · mandates"}
            </p>
            <dl>
              <div>
                <dt>{locale === "fr" ? "Entreprise" : "Enterprise"}</dt>
                <dd>Equinoxe</dd>
              </div>
              <div>
                <dt>{locale === "fr" ? "Progression" : "Progression"}</dt>
                <dd>COMPRENDRE → AGIR → CONSEILLER</dd>
              </div>
              <div>
                <dt>{locale === "fr" ? "Modes" : "Modes"}</dt>
                <dd>Exploration · Pratique · Simulation · Évaluation</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="playback-section" id="entreprise" aria-labelledby="enterprise-title">
          <h2 id="enterprise-title">{copy.enterprise.title}</h2>
          <p className="playback-lead">{copy.enterprise.support}</p>
          <p className="playback-note">{copy.enterprise.hint}</p>
          <div className="playback-map">
            <div className="playback-constellation" role="group" aria-label={copy.enterprise.title}>
              {NODE_LAYOUT.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="playback-node"
                  style={{ left: node.left, top: node.top }}
                  data-active={activeNode === node.id ? "true" : "false"}
                  data-tone={node.tone}
                  onClick={() => setActiveNode(node.id)}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onFocus={() => setActiveNode(node.id)}
                >
                  {locale === "fr" ? node.labelFr : node.labelEn}
                </button>
              ))}
            </div>
            <aside className="playback-detail">
              <dl>
                <div>
                  <dt>{locale === "fr" ? "Rôle" : "Role"}</dt>
                  <dd>{nodeDetail.role}</dd>
                </div>
                <div>
                  <dt>{locale === "fr" ? "Processus" : "Process"}</dt>
                  <dd>{nodeDetail.process}</dd>
                </div>
                <div>
                  <dt>{locale === "fr" ? "Document" : "Document"}</dt>
                  <dd>{nodeDetail.document}</dd>
                </div>
                <div>
                  <dt>{locale === "fr" ? "Conséquence / KPI" : "Consequence / KPI"}</dt>
                  <dd>{nodeDetail.consequence}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="playback-section" id="consulting" aria-labelledby="consulting-title">
          <h2 id="consulting-title">{copy.consulting.title}</h2>
          <p className="playback-lead">{copy.consulting.support}</p>
          <div className="playback-mission-flow" aria-hidden="true">
            <span data-step>{copy.consulting.understand}</span>
            <span>→</span>
            <span data-step>{copy.consulting.act}</span>
            <span>→</span>
            <span data-step>{copy.consulting.advise}</span>
          </div>
          <div className="playback-mission-grid">
            <article className="playback-mission" data-kind="diagnose">
              <h3>{copy.consulting.m1Title}</h3>
              <p>{copy.consulting.m1Body}</p>
            </article>
            <article className="playback-mission" data-kind="act">
              <h3>{copy.consulting.m2Title}</h3>
              <p>{copy.consulting.m2Body}</p>
            </article>
            <article className="playback-mission" data-kind="advise">
              <h3>{copy.consulting.m3Title}</h3>
              <p>{copy.consulting.m3Body}</p>
            </article>
          </div>
        </section>

        <section className="playback-section" aria-labelledby="modes-title">
          <h2 id="modes-title">{copy.modes.title}</h2>
          <p className="playback-lead">{copy.modes.support}</p>
          <div className="playback-modes">
            {(["exploration", "guided", "simulation", "evaluation"] as const).map((key) => {
              const mode = copy.modes[key];
              return (
                <article key={key} className="playback-mode">
                  <h3>{mode.name}</h3>
                  <ul>
                    <li>{mode.guidance}</li>
                    <li>{mode.consequence}</li>
                    <li>{mode.ai}</li>
                    <li>{mode.evidence}</li>
                    <li>{mode.score}</li>
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="playback-section" id="parcours" aria-labelledby="journey-title">
          <h2 id="journey-title">{copy.journey.title}</h2>
          <p className="playback-lead">{copy.journey.support}</p>
          <div className="playback-dual">
            <article>
              <strong>{copy.journey.enterpriseLabel}</strong>
              <ol>
                {PLAYBACK_MODULES.map((module) => (
                  <li key={module.code}>{locale === "fr" ? module.enterpriseChapterFr : module.enterpriseChapterEn}</li>
                ))}
              </ol>
            </article>
            <article>
              <strong>{copy.journey.professionalLabel}</strong>
              <ol>
                {PROFESSIONAL_STAGES.map((stage) => (
                  <li key={stage.id}>{locale === "fr" ? stage.fr : stage.en}</li>
                ))}
              </ol>
            </article>
          </div>
          <div className="playback-journey-rail" role="list" aria-label={copy.journey.title}>
            {PLAYBACK_MODULES.map((module) => (
              <button
                key={module.code}
                type="button"
                className="playback-journey-chip"
                role="listitem"
                data-active={selectedModuleCode === module.code ? "true" : "false"}
                onClick={() => setSelectedModuleCode(module.code)}
              >
                <strong>
                  {module.code} · {tModuleTitle(module)}
                </strong>
                <span>{tRole(module.role)}</span>
              </button>
            ))}
            <div className="playback-journey-chip playback-capstone-chip" role="listitem">
              <strong>Capstone</strong>
              <span>{copy.capstone.separate}</span>
            </div>
          </div>
          <div className="playback-detail" style={{ marginTop: "1rem" }}>
            <p className="playback-note">{copy.journey.selectHint}</p>
            <dl>
              <div>
                <dt>{copy.journey.business}</dt>
                <dd>{locale === "fr" ? selectedModule.businessAreaFr : selectedModule.businessAreaEn}</dd>
              </div>
              <div>
                <dt>{copy.journey.role}</dt>
                <dd>{tRole(selectedModule.role)}</dd>
              </div>
              <div>
                <dt>{copy.journey.process}</dt>
                <dd>{locale === "fr" ? selectedModule.processFr : selectedModule.processEn}</dd>
              </div>
              <div>
                <dt>{copy.journey.mandate}</dt>
                <dd>{locale === "fr" ? selectedModule.mandateFr : selectedModule.mandateEn}</dd>
              </div>
              <div>
                <dt>{copy.journey.stakeholders}</dt>
                <dd>{complexityLabel}</dd>
              </div>
              <div>
                <dt>{copy.journey.evidence}</dt>
                <dd>{locale === "fr" ? selectedModule.evidenceFr : selectedModule.evidenceEn}</dd>
              </div>
              <div>
                <dt>{copy.journey.impact}</dt>
                <dd>{locale === "fr" ? selectedModule.impactFr : selectedModule.impactEn}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="playback-section" aria-labelledby="process-title">
          <h2 id="process-title">{copy.process.title}</h2>
          <p className="playback-lead">{copy.process.support}</p>
          <div className="playback-process" role="list">
            {PROCESS_CHAIN_STEPS.map((step, index) => (
              <div key={step.en} style={{ display: "contents" }}>
                <button
                  type="button"
                  className="playback-process-step"
                  role="listitem"
                  data-pulse={processPulse === index ? "true" : "false"}
                  onClick={() => setProcessPulse(index)}
                  onFocus={() => setProcessPulse(index)}
                >
                  {locale === "fr" ? step.fr : step.en}
                </button>
                {index < PROCESS_CHAIN_STEPS.length - 1 ? (
                  <span className="playback-process-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="playback-section" id="bi-ia" aria-labelledby="impact-title">
          <h2 id="impact-title">{copy.impact.title}</h2>
          <p className="playback-lead">{copy.impact.support}</p>
          <span className="playback-demo-label">{copy.impact.demoLabel}</span>
          <div className="playback-kpi-grid">
            {[
              { label: "OTIF", value: "91% → 86%", tone: "amber", cause: "PO qty ↑", timing: locale === "fr" ? "Semaine +1" : "Week +1", who: locale === "fr" ? "Client / Achats" : "Customer / Procurement" },
              { label: locale === "fr" ? "Stock" : "Inventory", value: "+6%", tone: "blue", cause: "Réception partielle", timing: locale === "fr" ? "Immédiat" : "Immediate", who: locale === "fr" ? "Entrepôt" : "Warehouse" },
              { label: locale === "fr" ? "Marge" : "Margin", value: "-0.4 pt", tone: "red", cause: "Urgence fournisseur", timing: locale === "fr" ? "Mois" : "Month", who: "Finance" },
              { label: locale === "fr" ? "Cash" : "Cash", value: "-18 k$", tone: "amber", cause: "Engagement anticipé", timing: "30j", who: "Finance" },
              { label: locale === "fr" ? "Productivité" : "Productivity", value: "stable", tone: "green", cause: "Capacité quai", timing: locale === "fr" ? "Cycle" : "Cycle", who: locale === "fr" ? "Entrepôt" : "Warehouse" },
              { label: "CSAT", value: "4.2 → 4.0", tone: "amber", cause: "Délai", timing: locale === "fr" ? "Semaine +2" : "Week +2", who: locale === "fr" ? "Client" : "Customer" },
              { label: locale === "fr" ? "Risque" : "Risk", value: "↑ contrôle", tone: "red", cause: "Pression urgence", timing: locale === "fr" ? "Immédiat" : "Immediate", who: locale === "fr" ? "Gouvernance" : "Governance" },
            ].map((kpi) => (
              <article key={kpi.label} className="playback-kpi" data-tone={kpi.tone}>
                <span className="playback-note">{kpi.label}</span>
                <strong>{kpi.value}</strong>
                <span className="playback-note">
                  {copy.impact.cause}: {kpi.cause}
                </span>
                <span className="playback-note">
                  {copy.impact.timing}: {kpi.timing}
                </span>
                <span className="playback-note">
                  {copy.impact.stakeholder}: {kpi.who}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="playback-section" aria-labelledby="ai-title">
          <h2 id="ai-title">{copy.ai.title}</h2>
          <p className="playback-lead">{copy.ai.support}</p>
          <div className="playback-ai-grid">
            <article className="playback-ai-card" data-kind="visible">
              <h3>{copy.ai.visibleTitle}</h3>
              <p>{copy.ai.visibleBody}</p>
            </article>
            <article className="playback-ai-card" data-kind="ambient">
              <h3>{copy.ai.ambientTitle}</h3>
              <p>{copy.ai.ambientBody}</p>
            </article>
          </div>
          <h3>{copy.ai.chainTitle}</h3>
          <div className="playback-chain">
            <div className="playback-chain-item">
              <span className="playback-tag" data-kind="fact">
                {copy.ai.fact}
              </span>
              <p>
                {locale === "fr"
                  ? "Quantité PO proposée portée de 100 à 140 unités."
                  : "Proposed PO quantity raised from 100 to 140 units."}
              </p>
            </div>
            <div className="playback-chain-item">
              <span className="playback-tag" data-kind="stakeholder">
                {copy.ai.stakeholder}
              </span>
              <p>{locale === "fr" ? ambientMessages.fr : ambientMessages.en}</p>
            </div>
            <div className="playback-chain-item">
              <span className="playback-tag" data-kind="coach">
                {copy.ai.coach}
              </span>
              <p>
                {locale === "fr"
                  ? "Quelles preuves justifient 140 plutôt que 120 ? Quel risque acceptez-vous ?"
                  : "What evidence justifies 140 instead of 120? What risk are you accepting?"}
              </p>
            </div>
            <div className="playback-chain-item">
              <span className="playback-tag" data-kind="projection">
                {copy.ai.projection}
              </span>
              <p>
                {locale === "fr"
                  ? "Projection: OTIF -5 pts sur 7 jours si le délai fournisseur se confirme."
                  : "Projection: OTIF -5 pts over 7 days if the supplier delay is confirmed."}
              </p>
            </div>
          </div>
        </section>

        <section className="playback-section" aria-labelledby="professor-title">
          <div className="playback-professor">
            <span className="playback-demo-label">{copy.professor.previewLabel}</span>
            <h2 id="professor-title">{copy.professor.title}</h2>
            <p className="playback-lead">{copy.professor.support}</p>
            <ul>
              {copy.professor.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="playback-section" id="capstone" aria-labelledby="capstone-title">
          <div className="playback-capstone">
            <h2 id="capstone-title">{copy.capstone.title}</h2>
            <p className="playback-lead">{copy.capstone.support}</p>
            <p>
              <strong>{copy.capstone.separate}</strong>
            </p>
            <div className="playback-capstone-stages">
              {CAPSTONE_STAGES.map((stage) => (
                <span key={stage.id}>
                  {stage.id} · {locale === "fr" ? stage.fr : stage.en}
                </span>
              ))}
            </div>
            <p className="playback-note">{copy.capstone.approval}</p>
          </div>
        </section>

        <section className="playback-section" aria-labelledby="cta-title">
          <div className="playback-cta">
            <h2 id="cta-title">{copy.cta.title}</h2>
            <p className="playback-lead">{copy.cta.support}</p>
            <div className="playback-hero-actions">
              <Link className="playback-btn playback-btn--primary" to="/playback/v2/login">
                {copy.cta.login}
              </Link>
              <a className="playback-btn" href="#entreprise">
                {copy.cta.explore}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
