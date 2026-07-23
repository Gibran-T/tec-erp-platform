import { useId, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePlayback } from "./PlaybackProvider.js";
import {
  ACTIVE_FLOW,
  CAPSTONE_STAGES,
  JOURNEY_CHAPTERS,
  PLAYBACK_MODULES,
  PROCESS_CHAIN_STEPS,
  PULSE_NODES,
  type JourneyChapter,
  type PulseNodeId,
} from "./modules.js";

function BrandHeader(): ReactNode {
  const { branding, endorsement, copy } = usePlayback();
  return (
    <header className="playback-topnav">
      <div className="playback-brand-block">
        <div className="playback-brand" data-testid="playback-product-name">
          {branding.productName}
        </div>
        {branding.showInstitution && endorsement ? (
          <div className="playback-endorsement" data-testid="playback-institution-endorsement">
            {endorsement}
          </div>
        ) : null}
      </div>
      <nav aria-label="Sections">
        <ul className="playback-nav">
          <li>
            <a href="#promise">{copy.nav.promise}</a>
          </li>
          <li>
            <a href="#enterprise">{copy.nav.enterprise}</a>
          </li>
          <li>
            <a href="#missions">{copy.nav.missions}</a>
          </li>
          <li>
            <a href="#modes">{copy.nav.modes}</a>
          </li>
          <li>
            <a href="#journey">{copy.nav.journey}</a>
          </li>
          <li>
            <a href="#process">{copy.nav.process}</a>
          </li>
          <li>
            <a href="#impact">{copy.nav.impact}</a>
          </li>
          <li>
            <a href="#ai">{copy.nav.ai}</a>
          </li>
          <li>
            <a href="#professor">{copy.nav.professor}</a>
          </li>
          <li>
            <a href="#capstone">{copy.nav.capstone}</a>
          </li>
          <li>
            <Link to="/playback/v2/login">{copy.nav.login}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function HeroSection(): ReactNode {
  const { copy } = usePlayback();
  const h = copy.hero;
  return (
    <section id="promise" className="playback-section" aria-labelledby="hero-title">
      <div className="pb-hero" data-testid="playback-hero">
        <div className="pb-hero__copy">
          <span className="playback-chip">{h.kicker}</span>
          <h1 id="hero-title" className="pb-hero__title">
            {h.title}
          </h1>
          <p className="pb-hero__subtitle">{h.subtitle}</p>
          <div className="pb-hero__cta">
            <Link className="playback-btn" to="/playback/v2/login" data-testid="hero-cta-primary">
              {h.ctaPrimary}
            </Link>
            <a className="playback-btn playback-btn--ghost" href="#journey" data-testid="hero-cta-secondary">
              {h.ctaSecondary}
            </a>
          </div>
        </div>
        <aside className="pb-live-preview" data-testid="hero-live-preview" aria-label={h.previewTitle}>
          <div className="pb-live-preview__title">{h.previewTitle}</div>
          <div className="pb-live-flow" aria-hidden="true" />
          <dl className="pb-live-row">
            <dt>{h.demandLabel}</dt>
            <dd>{h.demandValue}</dd>
          </dl>
          <dl className="pb-live-row">
            <dt>{h.processLabel}</dt>
            <dd>{h.processValue}</dd>
          </dl>
          <dl className="pb-live-row">
            <dt>{h.messageLabel}</dt>
            <dd>{h.messageValue}</dd>
          </dl>
          <dl className="pb-live-row">
            <dt>{h.impactLabel}</dt>
            <dd>{h.impactValue}</dd>
          </dl>
          <dl className="pb-live-row pb-live-row--decision">
            <dt>{h.decisionLabel}</dt>
            <dd>{h.decisionValue}</dd>
          </dl>
          <span className="playback-demo-tag">{copy.demoData}</span>
        </aside>
      </div>
    </section>
  );
}

function nodeLabel(id: PulseNodeId, locale: "fr" | "en"): string {
  const node = PULSE_NODES.find((n) => n.id === id)!;
  return locale === "fr" ? node.fr : node.en;
}

function EnterprisePulseMap(): ReactNode {
  const { copy, locale } = usePlayback();
  const [selected, setSelected] = useState<PulseNodeId>("sales");
  const detail = copy.enterprise.nodes[selected]!;
  const titleId = useId();

  const pathD = useMemo(() => {
    const pts = ACTIVE_FLOW.map((id) => {
      const n = PULSE_NODES.find((p) => p.id === id)!;
      return `${n.x},${n.y}`;
    });
    return `M ${pts.join(" L ")}`;
  }, []);

  return (
    <section id="enterprise" className="playback-section" aria-labelledby={titleId}>
      <div className="pb-pulse-section" data-testid="enterprise-pulse-map">
        <h2 id={titleId} className="playback-section__title">
          {copy.enterprise.title}
        </h2>
        <p className="playback-section__lead">{copy.enterprise.lead}</p>
        <p className="playback-chip">
          {copy.enterprise.twin} · {copy.enterprise.engine}
        </p>
        <div className="pb-pulse-layout">
          <div className="pb-pulse-map" role="group" aria-label={copy.enterprise.selectHint}>
            <svg className="pb-pulse-svg" viewBox="0 0 100 80" aria-hidden="true">
              <path className="pb-pulse-path" d="M8,28 L24,18 L42,26 L34,48 L14,66 L52,58 L70,42 L66,70" />
              <path className="pb-pulse-path" d="M70,42 L86,24 L84,56 L58,12" />
              <path
                id="pb-active-flow"
                className="pb-pulse-path pb-pulse-path--active"
                d={pathD}
                data-testid="pulse-active-path"
              />
              <circle r="1.4" className="pb-pulse-marker">
                <animateMotion dur="8s" repeatCount="indefinite" path={pathD} />
              </circle>
            </svg>
            {PULSE_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`pb-pulse-node${
                  node.id === "inventory" || node.id === "suppliers" || node.id === "warehouse"
                    ? " pb-pulse-node--tension"
                    : ""
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                aria-pressed={selected === node.id}
                data-testid={`pulse-node-${node.id}`}
                onClick={() => setSelected(node.id)}
              >
                {locale === "fr" ? node.fr : node.en}
              </button>
            ))}
            <ol className="pb-pulse-a11y">
              {ACTIVE_FLOW.map((id) => (
                <li key={id}>{nodeLabel(id, locale)}</li>
              ))}
            </ol>
          </div>
          <aside className="pb-pulse-panel" data-testid="pulse-node-detail" aria-live="polite">
            <h3>{nodeLabel(selected, locale)}</h3>
            <dl>
              <div>
                <dt>{copy.enterprise.detail.person}</dt>
                <dd>
                  {detail.person} · {detail.role}
                </dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.process}</dt>
                <dd>{detail.process}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.document}</dt>
                <dd>{detail.document}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.situation}</dt>
                <dd>{detail.situation}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.message}</dt>
                <dd>{detail.message}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.consequence}</dt>
                <dd>{detail.consequence}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.kpi}</dt>
                <dd>{detail.kpi}</dd>
              </div>
              <div>
                <dt>{copy.enterprise.detail.dependency}</dt>
                <dd>{detail.dependency}</dd>
              </div>
            </dl>
          </aside>
        </div>
        <p className="pb-pulse-flow-label">{copy.enterprise.flowLabel}</p>
        <span className="playback-demo-tag">{copy.demoData}</span>
      </div>
    </section>
  );
}

function MissionsSection(): ReactNode {
  const { copy } = usePlayback();
  return (
    <section id="missions" className="playback-section" data-testid="mission-transformation" aria-labelledby="missions-title">
      <h2 id="missions-title" className="playback-section__title">
        {copy.missions.title}
      </h2>
      <p className="playback-section__lead">{copy.missions.lead}</p>
      <div className="pb-mission-transform">
        {copy.missions.items.map((item, index) => (
          <article key={item.title} className="pb-mission-step">
            <div className="pb-mission-step__index">
              {index === 0 ? "Comprendre" : index === 1 ? "Agir" : "Conseiller"}
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="pb-mission-step__output">{item.output}</div>
          </article>
        ))}
      </div>
      <div className="pb-mission-chain" data-testid="mission-output-chain">
        {copy.missions.chain}
      </div>
    </section>
  );
}

function ModesSection(): ReactNode {
  const { copy } = usePlayback();
  const [active, setActive] = useState(1);
  const axes = [
    { label: copy.modes.axes.help, ...copy.modes.continuum[0]! },
    { label: copy.modes.axes.autonomy, ...copy.modes.continuum[1]! },
    { label: copy.modes.axes.consequences, ...copy.modes.continuum[2]! },
    { label: copy.modes.axes.evidence, ...copy.modes.continuum[3]! },
  ];
  return (
    <section id="modes" className="playback-section" data-testid="mode-continuum" aria-labelledby="modes-title">
      <h2 id="modes-title" className="playback-section__title">
        {copy.modes.title}
      </h2>
      <p className="playback-section__lead">{copy.modes.lead}</p>
      <div className="pb-continuum">
        <div className="pb-continuum-track">
          {copy.modes.items.map((item, index) => (
            <div key={item.title} className="pb-mode-stop" data-active={active === index}>
              <button
                type="button"
                aria-label={item.title}
                aria-pressed={active === index}
                data-testid={`mode-stop-${index}`}
                onClick={() => setActive(index)}
              />
              <strong>{item.title}</strong>
              <span>{item.short}</span>
            </div>
          ))}
        </div>
        <div className="pb-axis-bands" aria-hidden="false">
          {axes.map((axis) => (
            <div key={axis.label} className="pb-axis">
              <span>
                {axis.label}: {axis.from}
              </span>
              <div className="pb-axis__bar" />
              <span>{axis.to}</span>
            </div>
          ))}
        </div>
        <div className="pb-mode-detail" data-testid="mode-detail">
          <strong>{copy.modes.items[active]!.title}</strong>
          <p>{copy.modes.items[active]!.detail}</p>
        </div>
      </div>
    </section>
  );
}

function JourneySection(): ReactNode {
  const { copy, locale, selectedModule, selectedModuleCode, setSelectedModuleCode, tModuleTitle, tRole } =
    usePlayback();

  const modulesByChapter = (chapter: JourneyChapter) =>
    PLAYBACK_MODULES.filter((module) => module.chapter === chapter);

  return (
    <section id="journey" className="playback-section" data-testid="chapter-journey" aria-labelledby="journey-title">
      <h2 id="journey-title" className="playback-section__title">
        {copy.journey.title}
      </h2>
      <p className="playback-section__lead">{copy.journey.lead}</p>
      <div className="pb-dual-strip" data-testid="dual-journey">
        <div>
          <strong>{copy.journey.enterpriseAxis}</strong>
          <div>
            {locale === "fr" ? selectedModule.enterpriseChapterFr : selectedModule.enterpriseChapterEn}
          </div>
        </div>
        <div className="pb-dual-strip__arrow" aria-hidden="true">
          →
        </div>
        <div>
          <strong>{copy.journey.professionalAxis}</strong>
          <div>
            {locale === "fr" ? selectedModule.professionalStepFr : selectedModule.professionalStepEn}
          </div>
        </div>
      </div>
      <div className="pb-chapters">
        {JOURNEY_CHAPTERS.map((chapter) => {
          const modules = modulesByChapter(chapter.id);
          const sample = modules[0]!;
          return (
            <div key={chapter.id} className="pb-chapter" data-testid={`chapter-${chapter.id}`}>
              <div className="pb-chapter__head">
                <h3>{locale === "fr" ? chapter.fr : chapter.en}</h3>
                <div className="pb-chapter__axes">
                  {(locale === "fr" ? sample.enterpriseChapterFr : sample.enterpriseChapterEn) +
                    " → " +
                    (locale === "fr" ? sample.professionalStepFr : sample.professionalStepEn)}
                </div>
              </div>
              <div className="pb-module-grid">
                {modules.map((module) => (
                  <button
                    key={module.code}
                    type="button"
                    className="pb-module-pill"
                    aria-pressed={selectedModuleCode === module.code}
                    data-testid={`module-${module.code}`}
                    onClick={() => setSelectedModuleCode(module.code)}
                  >
                    <strong>
                      {module.code} · {tModuleTitle(module)}
                    </strong>
                    <span>
                      {(locale === "fr" ? module.enterpriseChapterFr : module.enterpriseChapterEn) +
                        " → " +
                        tRole(module.role)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <aside className="pb-journey-detail" data-testid="module-detail-panel" aria-live="polite">
        <dl>
          <div>
            <dt>{copy.journey.detail.domain}</dt>
            <dd>{locale === "fr" ? selectedModule.businessAreaFr : selectedModule.businessAreaEn}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.role}</dt>
            <dd>{tRole(selectedModule.role)}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.process}</dt>
            <dd>{locale === "fr" ? selectedModule.processFr : selectedModule.processEn}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.mandate}</dt>
            <dd>{locale === "fr" ? selectedModule.mandateFr : selectedModule.mandateEn}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.stakeholders}</dt>
            <dd>{selectedModule.stakeholderComplexity}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.evidence}</dt>
            <dd>{locale === "fr" ? selectedModule.evidenceFr : selectedModule.evidenceEn}</dd>
          </div>
          <div>
            <dt>{copy.journey.detail.impact}</dt>
            <dd>{locale === "fr" ? selectedModule.impactFr : selectedModule.impactEn}</dd>
          </div>
        </dl>
      </aside>
      <p data-testid="module-count" hidden>
        {PLAYBACK_MODULES.length}
      </p>
    </section>
  );
}

function ProcessSection(): ReactNode {
  const { copy, locale } = usePlayback();
  const [step, setStep] = useState(1);
  const active = PROCESS_CHAIN_STEPS[step]!;
  return (
    <section id="process" className="playback-section" data-testid="process-teach" aria-labelledby="process-title">
      <h2 id="process-title" className="playback-section__title">
        {copy.process.title}
      </h2>
      <p className="playback-section__lead">{copy.process.lead}</p>
      <div className="pb-process">
        <div className="pb-process-layers">
          <strong>{copy.process.documentFlow}</strong>
          <div className="pb-process-row">
            {PROCESS_CHAIN_STEPS.map((item, index) => (
              <button
                key={item.documentFr}
                type="button"
                className="pb-process-step"
                aria-pressed={step === index}
                data-testid={`process-step-${index}`}
                onClick={() => setStep(index)}
              >
                {locale === "fr" ? item.documentFr : item.documentEn}
              </button>
            ))}
          </div>
          <strong>{copy.process.consequenceFlow}</strong>
          <div className="pb-process-row">
            {PROCESS_CHAIN_STEPS.map((item, index) => (
              <button
                key={item.consequenceFr}
                type="button"
                className="pb-process-step"
                aria-pressed={step === index}
                onClick={() => setStep(index)}
              >
                {locale === "fr" ? item.consequenceFr : item.consequenceEn}
              </button>
            ))}
          </div>
        </div>
        <div className="pb-process-active" data-testid="process-active">
          <div>
            <strong>{copy.process.activeDoc}</strong>
            {locale === "fr" ? active.documentFr : active.documentEn}
          </div>
          <div>
            <strong>{copy.process.activeStakeholder}</strong>
            {locale === "fr" ? active.stakeholderFr : active.stakeholderEn}
          </div>
          <div>
            <strong>{locale === "fr" ? "Conséquence" : "Consequence"}</strong>
            {locale === "fr" ? active.consequenceFr : active.consequenceEn}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection(): ReactNode {
  const { copy } = usePlayback();
  return (
    <section id="impact" className="playback-section" data-testid="executive-impact-bi" aria-labelledby="impact-title">
      <h2 id="impact-title" className="playback-section__title">
        {copy.impact.title}
      </h2>
      <p className="playback-section__lead">{copy.impact.lead}</p>
      <div className="pb-bi">
        <div className="pb-bi__decision">
          <span>{copy.impact.decision}</span>
          <strong>{copy.impact.decisionValue}</strong>
        </div>
        <div className="pb-bi-grid">
          {copy.impact.signals.map((signal) => (
            <article key={signal.label} className="pb-signal" data-testid={`signal-${signal.label}`}>
              <h3>{signal.label}</h3>
              <div className="pb-signal__compare">
                <del>
                  {copy.impact.labels.baseline}: {signal.baseline}
                </del>
                <span>
                  {copy.impact.labels.after}: {signal.next}
                </span>
              </div>
              <svg className="pb-signal__spark" viewBox="0 0 100 28" aria-hidden="true">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points="0,8 20,10 40,9 60,16 80,20 100,24"
                />
              </svg>
              <dl>
                <div>
                  <dt>{copy.impact.labels.cause}</dt>
                  <dd>{signal.cause}</dd>
                </div>
                <div>
                  <dt>{copy.impact.labels.horizon}</dt>
                  <dd>{signal.horizon}</dd>
                </div>
                <div>
                  <dt>{copy.impact.labels.stakeholder}</dt>
                  <dd>{signal.stakeholder}</dd>
                </div>
                <div>
                  <dt>{copy.impact.labels.projection}</dt>
                  <dd>{signal.confidence}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <span className="playback-demo-tag">{copy.demoData}</span>
      </div>
    </section>
  );
}

function AiSection(): ReactNode {
  const { copy } = usePlayback();
  return (
    <section id="ai" className="playback-section" aria-labelledby="ai-title">
      <div className="pb-ai-section" data-testid="ai-communication">
        <h2 id="ai-title" className="playback-section__title">
          {copy.ai.title}
        </h2>
        <p className="playback-section__lead">{copy.ai.lead}</p>
        <div className="pb-ai-split">
          <article className="pb-ai-card" data-testid="visible-ai">
            <h3>{copy.ai.visibleTitle}</h3>
            <p>{copy.ai.visibleBody}</p>
          </article>
          <article className="pb-ai-card pb-ai-card--ambient" data-testid="ambient-ai">
            <h3>{copy.ai.ambientTitle}</h3>
            <p>{copy.ai.ambientBody}</p>
          </article>
        </div>
        <h3>{copy.ai.timelineTitle}</h3>
        <div className="pb-ai-timeline" data-testid="ai-timeline">
          {copy.ai.items.map((item) => (
            <article key={`${item.time}-${item.classification}`} className="pb-ai-item" data-kind={item.kind}>
              <time dateTime={item.time}>{item.time}</time>
              <div>
                <strong>{item.classification}</strong>
                <p>{item.message}</p>
                <div className="pb-ai-meta">
                  <span>{item.source}</span>
                  <span>{item.channel}</span>
                  <span>{item.nature}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfessorSection(): ReactNode {
  const { copy } = usePlayback();
  return (
    <section id="professor" className="playback-section" aria-labelledby="professor-title">
      <div className="pb-prof-section" data-testid="professor-orchestration">
        <span className="pb-preview-badge">{copy.previewBadge}</span>
        <h2 id="professor-title" className="playback-section__title">
          {copy.professor.title}
        </h2>
        <p className="playback-section__lead">{copy.professor.lead}</p>
        <div className="pb-classroom">
          <div className="pb-classroom-board">
            <p>
              <strong>{copy.professor.classInProgress}</strong>
            </p>
            <p>{copy.professor.cohort}</p>
            <p>{copy.professor.mandate}</p>
            <div className="pb-decision-bars" aria-label={copy.professor.decisions}>
              <div>
                <span>Confirmer</span>
                <i style={{ width: "70%" }} />
                <span>11</span>
              </div>
              <div>
                <span>Négocier</span>
                <i style={{ width: "50%" }} />
                <span>8</span>
              </div>
              <div>
                <span>Replanifier</span>
                <i style={{ width: "32%" }} />
                <span>5</span>
              </div>
            </div>
            <p>{copy.professor.misconception}</p>
            <p>{copy.professor.simStatus}</p>
            <p>{copy.professor.nextEvent}</p>
            <p>{copy.professor.debrief}</p>
            <p>{copy.professor.deck}</p>
          </div>
          <div className="pb-prof-controls">
            {copy.professor.controls.map((label) => (
              <button key={label} type="button" disabled title={copy.previewBadge}>
                {label}
                <div className="pb-preview-badge">{copy.previewBadge}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapstoneSection(): ReactNode {
  const { copy, locale } = usePlayback();
  return (
    <section id="capstone" className="playback-section" aria-labelledby="capstone-title">
      <div className="pb-capstone" data-testid="capstone-culmination">
        <div className="pb-capstone-badge">{copy.capstone.badge}</div>
        <h2 id="capstone-title" className="playback-section__title">
          {copy.capstone.title}
        </h2>
        <p>{copy.capstone.lead}</p>
        <div className="pb-capstone-stages">
          {CAPSTONE_STAGES.map((stage) => (
            <span key={stage.id}>
              {stage.id} · {locale === "fr" ? stage.fr : stage.en}
            </span>
          ))}
        </div>
        <div className="pb-capstone-meta">
          <div>{copy.capstone.framing}</div>
          <div>{copy.capstone.approval}</div>
          <div>{copy.capstone.evidence}</div>
        </div>
      </div>
    </section>
  );
}

export function PortalPage(): ReactNode {
  return (
    <main className="playback-shell" data-testid="playback-portal">
      <BrandHeader />
      <HeroSection />
      <EnterprisePulseMap />
      <MissionsSection />
      <ModesSection />
      <JourneySection />
      <ProcessSection />
      <ImpactSection />
      <AiSection />
      <ProfessorSection />
      <CapstoneSection />
    </main>
  );
}
