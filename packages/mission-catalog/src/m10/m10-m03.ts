import type { MissionDefinitionDocument } from "../schema.js";

export const M10_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m10-m03-presentation-capstone-or",
  "missionCode": "M10-M03",
  "moduleCode": "M10",
  "title": "Presentation Capstone et certification Or",
  "preview": "Presentez votre parcours Equinoxe et recevez la certification Or NordHabitat.",
  "briefing": "Bonjour,\n\nVous avez survecu au defi final. Derniere etape : presenter votre parcours Capstone devant le jury Equinoxe — DG, Marc, Isabelle, Nadia.\n\nRacontez votre transformation M1-M10 : ce que vous avez appris, les decisions dont vous etes fier, les erreurs corrigees, votre vision professionnelle. Puis recevez la certification Or si le jury valide.\n\nC'est la cloture de votre parcours analyste ERP NordHabitat.\n\nDirecteur General\nEquinoxe — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Defi final Equinoxe (crise integree) » (defi reussi).",
  "sequence": 3,
  "estimatedMinutes": 50,
  "difficulty": "expert",
  "competencyCodes": [
    "C-CAP-03",
    "C-LEAD-02"
  ],
  "contextItems": [
    {
      "key": "ctx-capstone-rubric",
      "title": "Grille certification Or",
      "body": "Criteres : maitrise chaine M1-M10; leadership en crise; reflexion metier; communication executive; integrite gouvernance. Seuil : 70 % jury unanime.",
      "required": true
    },
    {
      "key": "ctx-journey-highlights",
      "title": "Moments cles parcours",
      "body": "M3 PO-88421; M4 Sacre-Coeur ATP; M6 narration Marc; M7 CAS-7701 NPS 9; M8 gouvernance PO-URG; M9 dashboard; M10 crise integree.",
      "required": true
    },
    {
      "key": "ctx-jury-expectations",
      "title": "Attentes jury Equinoxe",
      "body": "15 min presentation + 10 min questions. Pas de slides generiques : preuves, decisions, lecons. Certification Or = credibilite professionnelle NordHabitat.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "capstone-opening",
      "type": "SINGLE_CHOICE",
      "prompt": "Comment ouvrez-vous votre presentation Capstone devant le jury ?",
      "options": [
        {
          "key": "journey",
          "label": "Recit de transformation M1-M10 avec preuves concretes"
        },
        {
          "key": "generic",
          "label": "Definition generique de l'ERP sans exemples"
        },
        {
          "key": "blame",
          "label": "Attribuer les erreurs aux autres departements"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "journey"
        ]
      }
    },
    {
      "id": "capstone-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements le jury attend dans votre presentation Or ?",
      "options": [
        {
          "key": "proofs",
          "label": "Preuves missions M1-M10"
        },
        {
          "key": "decisions",
          "label": "Decisions cles et leur justification"
        },
        {
          "key": "lessons",
          "label": "Lecons apprises et erreurs corrigees"
        },
        {
          "key": "vision",
          "label": "Vision professionnelle post-Equinoxe"
        },
        {
          "key": "skip-gov",
          "label": "Omettre gouvernance et integrite"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "proofs",
          "decisions",
          "lessons",
          "vision"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "capstone-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez votre presentation Capstone certification Or.",
      "options": [
        {
          "key": "hook",
          "label": "Accroche : enjeu NordHabitat et votre role"
        },
        {
          "key": "journey",
          "label": "Parcours M1-M10 avec preuves"
        },
        {
          "key": "crisis",
          "label": "Defi final et leadership en crise"
        },
        {
          "key": "close",
          "label": "Vision professionnelle et engagement"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "hook",
          "journey",
          "crisis",
          "close"
        ]
      }
    },
    {
      "id": "module-count",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de modules M1 a M10 couvrent votre parcours Capstone complet ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 10,
        "numericTolerance": 0
      }
    },
    {
      "id": "capstone-leadership",
      "type": "TEXT_ANALYSIS",
      "prompt": "En conclusion, expliquez au jury comment le defi final Equinoxe a demontre votre leadership professionnel.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "leadership",
          "crise",
          "gouvernance",
          "transformation"
        ]
      }
    }
  ],
  "completionFeedback": "Certification Or Equinoxe accordee. Parcours M1-M10 valide par le jury. Bienvenue dans la communaute analystes ERP NordHabitat.\n\nDirecteur General"
} as const satisfies MissionDefinitionDocument;
