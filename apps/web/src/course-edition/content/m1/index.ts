import type { CourseEditionModulePack } from "../../types.js";
import { M1_ANALYST_ROLE, M1_GLOSSARY, M1_LEARNING_OBJECTIVES, M1_VISUAL_FRAMES } from "./apprendre.js";
import { M1_BILAN } from "./bilan.js";
import { M1_CONNECTION_LAB } from "./connectionLab.js";
import { M1_DOCUMENTS } from "./documents.js";
import { M1_KPI } from "./kpi.js";
import { M1_MISSIONS } from "./missions.js";
import { M1_QUIZ } from "./quiz.js";
import { getAppPath } from "../../../workspace/appRegistry.js";

export { M1_SPINE } from "./spine.js";
export { M1_ANALYST_ROLE };

export const M1_COURSE_EDITION_PACK: CourseEditionModulePack = {
  moduleCode: "M1",
  title: "Entreprise et processus d’affaires",
  subtitle: "Enterprise and business processes — Course Edition",
  learningObjectives: M1_LEARNING_OBJECTIVES,
  surfaces: [
    {
      id: "apprendre",
      label: "APPRENDRE",
      shortLabel: "Apprendre",
      objective:
        "Comprendre l’entreprise intégrée, les départements NordHabitat et le signal 40 versus 36.",
    },
    {
      id: "connecter",
      label: "CONNECTER ET PRATIQUER",
      shortLabel: "Connecter",
      objective:
        "Associer objets ERP, départements, processus, master data, erreurs et KPI avec rétroaction immédiate.",
    },
    {
      id: "missions",
      label: "MISSIONS",
      shortLabel: "Missions",
      objective: "Accomplir M1-M01, M1-M02 et M1-M03 dans le Centre de mission existant.",
    },
    {
      id: "bilan",
      label: "BILAN ET CONSOLIDATION",
      shortLabel: "Bilan",
      objective:
        "Synthétiser décisions, impacts, KPI et consolider par un quiz de module.",
    },
  ],
  visualFrames: M1_VISUAL_FRAMES,
  glossary: M1_GLOSSARY,
  documents: M1_DOCUMENTS,
  connectionLab: M1_CONNECTION_LAB,
  missions: M1_MISSIONS,
  bilan: M1_BILAN,
  quiz: M1_QUIZ,
  kpi: M1_KPI,
  erpDemoPath: getAppPath("erp"),
  professorNotes: [
    "Présenter APPRENDRE comme cadrage, pas comme LMS.",
    "Faciliter le Connection Lab : corriger les associations manquantes sans révéler toutes les paires d’emblée.",
    "Envoyer ensuite les étudiants dans le Centre de mission (M1-M01 → M03).",
    "Débriefer avec le Bilan : conséquence authored + KPI exactitude d’inventaire.",
    "Suivre progression missions et scores objectifs via Portail professeur / PCC existant.",
  ],
};

