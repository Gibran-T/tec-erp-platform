import type { InteractionDefinition, InteractionResponses } from "../mission/MissionInteractions.js";

export type CourseEditionSurfaceId =
  | "apprendre"
  | "connecter"
  | "missions"
  | "bilan";

export interface CourseEditionSurfaceMeta {
  readonly id: CourseEditionSurfaceId;
  readonly label: string;
  readonly shortLabel: string;
  readonly objective: string;
}

export interface VisualFrameContent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly professorNote?: string;
  /** Optional PNG/WebP path under public/; omit for native HTML visual. */
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly bodyHtml?: string;
}

export interface BusinessDocumentContent {
  readonly id: string;
  readonly title: string;
  readonly docType: string;
  readonly reference: string;
  readonly status: string;
  readonly issuedAt: string;
  readonly companyName: string;
  readonly sections: readonly {
    readonly heading: string;
    readonly paragraphs: readonly string[];
    readonly rows?: readonly { readonly label: string; readonly value: string }[];
  }[];
  readonly footerNote?: string;
}

export interface ConnectionLabActivity {
  readonly id: string;
  readonly title: string;
  readonly instruction: string;
  readonly interaction: InteractionDefinition & {
    readonly scoring: {
      readonly maxPoints: number;
      readonly correctKeys?: readonly string[];
      readonly correctOrder?: readonly string[];
      readonly numericTarget?: number;
      readonly numericTolerance?: number;
      readonly requiredConcepts?: readonly string[];
      readonly allowedPairs?: readonly { readonly leftKey: string; readonly rightKey: string }[];
      readonly minimumSelections?: number;
    };
  };
}

export interface ConnectionLabDefinition {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly activities: readonly ConnectionLabActivity[];
  readonly passThresholdPercent: number;
  readonly feedback: {
    readonly correctRelationships: string;
    readonly missingRelationships: string;
    readonly systemicImplication: string;
    readonly improvement: string;
  };
}

export interface CourseMissionLink {
  readonly missionKey: string;
  readonly missionCode: string;
  readonly title: string;
  readonly role: string;
  readonly objective: string;
  readonly consequenceSummary: string;
}

export interface MissionBilanContent {
  readonly title: string;
  readonly learnerActionsSummary: string;
  readonly recognizedConcepts: readonly string[];
  readonly keyDecisions: readonly string[];
  readonly crossFunctionalImpact: string;
  readonly kpiInterpretation: string;
  readonly strengths: readonly string[];
  readonly gaps: readonly string[];
  readonly recommendedAction: string;
  readonly improvementGuidance: string;
  readonly authoredConsequence: string;
  readonly affectedDepartments: readonly string[];
  readonly kpiImpact: string;
}

export interface ConsolidationQuizItem {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly { readonly key: string; readonly label: string }[];
  readonly correctKey: string;
  readonly explanation: string;
}

export interface ModuleKpiLearningView {
  readonly name: string;
  readonly definition: string;
  readonly formula: string;
  readonly unit: string;
  readonly period: string;
  readonly target: string;
  readonly actual: string;
  readonly variance: string;
  readonly trend: string;
  readonly source: string;
  readonly interpretation: string;
  readonly risk: string;
  readonly recommendedAction: string;
  readonly affectedProcess: string;
  readonly affectedDepartment: string;
}

export interface CourseEditionModulePack {
  readonly moduleCode: string;
  readonly title: string;
  readonly subtitle: string;
  readonly learningObjectives: readonly string[];
  readonly surfaces: readonly CourseEditionSurfaceMeta[];
  readonly visualFrames: readonly VisualFrameContent[];
  readonly glossary: readonly { readonly term: string; readonly definition: string }[];
  readonly documents: readonly BusinessDocumentContent[];
  readonly connectionLab: ConnectionLabDefinition;
  readonly missions: readonly CourseMissionLink[];
  readonly bilan: MissionBilanContent;
  readonly quiz: readonly ConsolidationQuizItem[];
  readonly kpi: ModuleKpiLearningView;
  readonly erpDemoPath: string;
  readonly professorNotes: readonly string[];
}

export type { InteractionResponses };
