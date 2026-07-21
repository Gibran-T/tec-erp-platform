import type { MissionDefinitionDocument } from "../schema.js";

export const M8_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m8-m03-autoevaluation-probation",
  "missionCode": "M8-M03",
  "moduleCode": "M8",
  "title": "Autoevaluation de probation",
  "preview": "Completez votre autoevaluation de fin de probation avec preuves M1-M8.",
  "briefing": "Bonjour,\n\nVotre periode de probation Equinoxe se termine. Avant la certification Or, vous devez soumettre une autoevaluation honnete : competences acquises, ecarts identifies, preuves des missions M1-M8.\n\nJe ne cherche pas la perfection — je cherche la reflexion. Documentez ce que vous maitrisez, ce qui reste fragile et comment vous comptez progresser en M9-M10.\n\nC'est votre dossier de credibilite professionnelle.\n\nIsabelle Roy\nGouvernance — NordHabitat",
  "unlockExplanation": "Completez d'abord « Revue d'acces et segregation des taches » (revue Q3 archivee).",
  "sequence": 3,
  "estimatedMinutes": 45,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-PRO-01",
    "C-REF-01"
  ],
  "contextItems": [
    {
      "key": "ctx-probation-rubric",
      "title": "Grille autoevaluation Equinoxe",
      "body": "Criteres : maitrise processus (P2P, O2C, CRM, GOV); qualite decisions; trace audit; reflexion metier. Echelle : Emergent / Confirme / Maitrise.",
      "required": true
    },
    {
      "key": "ctx-evidence-portfolio",
      "title": "Portfolio preuves M1-M8",
      "body": "PO-88421, SO-12047, CAS-7701, PO-URG-9033, revue SoD Q3, narration finance Marc. Chaque preuve liee a une competence.",
      "required": true
    },
    {
      "key": "ctx-gap-analysis",
      "title": "Ecarts identifies",
      "body": "Fragilites signalees : pression approbation M8-M01; communication multi-departements M7-M02; KPI non formalises (a traiter M9).",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "self-assess-start",
      "type": "SINGLE_CHOICE",
      "prompt": "Par ou commencez-vous une autoevaluation de probation credible ?",
      "options": [
        {
          "key": "evidence",
          "label": "Relier chaque competence a une preuve mission M1-M8"
        },
        {
          "key": "inflate",
          "label": "Declarer maitrise sur tous les criteres"
        },
        {
          "key": "vague",
          "label": "Rediger des generalites sans preuves"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "evidence"
        ]
      }
    },
    {
      "id": "self-assess-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements Isabelle attend dans votre autoevaluation ?",
      "options": [
        {
          "key": "strengths",
          "label": "Competences confirmees avec preuves"
        },
        {
          "key": "gaps",
          "label": "Ecarts identifies honnetement"
        },
        {
          "key": "plan",
          "label": "Plan de progression M9-M10"
        },
        {
          "key": "reflection",
          "label": "Reflexion metier sur decisions cles"
        },
        {
          "key": "hide-errors",
          "label": "Masquer les erreurs de probation"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "strengths",
          "gaps",
          "plan",
          "reflection"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "self-assess-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la structure de votre autoevaluation.",
      "options": [
        {
          "key": "inventory",
          "label": "Inventorier les preuves M1-M8"
        },
        {
          "key": "rate",
          "label": "Evaluer chaque competence avec la grille"
        },
        {
          "key": "gaps",
          "label": "Documenter ecarts et causes"
        },
        {
          "key": "commit",
          "label": "Engager un plan de progression M9-M10"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "inventory",
          "rate",
          "gaps",
          "commit"
        ]
      }
    },
    {
      "id": "mission-count",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de modules (M1 a M8) couvrent votre portfolio de preuves avant M9 ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 8,
        "numericTolerance": 0
      }
    },
    {
      "id": "probation-reflection",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Identifiez votre plus grande fragilite en probation et expliquez comment M9-M10 vous aidera a progresser. Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "fragilite",
          "progression",
          "reflexion",
          "preuve"
        ]
      }
    }
  ],
  "completionFeedback": "Autoevaluation de probation soumise. Portfolio M1-M8 documente; plan M9-M10 valide par Isabelle. Probation levee conditionnellement.\n\nIsabelle Roy"
} as const satisfies MissionDefinitionDocument;
