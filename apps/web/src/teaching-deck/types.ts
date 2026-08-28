/** Canonical 17-slide anchor sequence per Teaching Deck contract. */
export type SlideAnchor =
  | "cover"
  | "objectives"
  | "sap-reminder"
  | "context"
  | "process-map"
  | "actors"
  | "data"
  | "concept"
  | "quantitative"
  | "common-error"
  | "erp-lab"
  | "kpi"
  | "decision"
  | "classroom-question"
  | "mission-briefing"
  | "debrief"
  | "synthesis";

export interface TeachingSlide {
  readonly id: string;
  readonly anchor: SlideAnchor;
  readonly title: string;
  readonly bullets: readonly string[];
  readonly speakerNotes: string;
}

export interface TeachingModuleDeck {
  readonly moduleCode: string;
  readonly sessionNumber: number;
  readonly title: string;
  readonly sapUnitLabel: string;
  readonly tecModuleLabel: string;
  readonly slides: readonly TeachingSlide[];
}

export interface ModuleDeckMeta {
  readonly moduleCode: string;
  readonly sessionNumber: number;
  readonly title: string;
  readonly sapUnitLabel: string;
  readonly tecModuleLabel: string;
  readonly objectives: readonly string[];
  readonly context: string;
  readonly processMap: readonly string[];
  readonly actors: readonly string[];
  readonly dataPoints: readonly string[];
  readonly concept: string;
  readonly quantitativeExample: readonly string[];
  readonly commonError: string;
  readonly erpLabDemo: readonly string[];
  readonly kpiFocus: readonly string[];
  readonly decisionPrompt: string;
  readonly classroomQuestion: string;
  readonly missionBriefing: readonly string[];
  readonly debriefPoints: readonly string[];
  readonly synthesis: readonly string[];
  readonly nextModuleLabel: string;
}
