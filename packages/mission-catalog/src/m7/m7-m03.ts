import type { MissionDefinitionDocument } from "../schema.js";

export const M7_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m7-m03-cloturer-cas-nps",
  "missionCode": "M7-M03",
  "moduleCode": "M7",
  "title": "Cloturer le cas et recuperer le NPS",
  "preview": "Cloturez CAS-7701, documentez la resolution et collectez le NPS institutionnel.",
  "briefing": "Bonjour,\n\nLes deux unites de remplacement sont installees; le Dr Meunier confirme le bon fonctionnement. Il est time de cloturer CAS-7701 proprement et de recuperer son NPS — c'est notre indicateur cle pour les comptes institutionnels.\n\nDocumentez cause racine, actions correctives et delai reel. Ne demandez pas le NPS avant confirmation explicite de resolution. Patrick veut un NPS >= 8 pour le comite CRM de septembre.\n\nCloture propre = apprentissage pour toute l'organisation.\n\nSophie Lambert\nService client — NordHabitat",
  "unlockExplanation": "Completez d'abord « Coordonner l'escalade » (remplacement installe).",
  "sequence": 3,
  "estimatedMinutes": 35,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-CRM-04"
  ],
  "contextItems": [
    {
      "key": "ctx-resolution",
      "title": "Resolution CAS-7701",
      "body": "Remplacement 2 unites SN-4421-A17/B03; delai reel 22 h; cause lot LT-8842; action corrective QH-221 ouverte; client confirme satisfaction operationnelle.",
      "required": true
    },
    {
      "key": "ctx-nps-policy",
      "title": "Politique NPS institutionnel",
      "body": "NPS demande uniquement apres cloture technique confirmee; echelle 0-10; seuil vert >= 8; commentaire obligatoire si score <= 6; fenetre envoi : 24 h post-resolution.",
      "required": true
    },
    {
      "key": "ctx-closure-checklist",
      "title": "Liste de controle cloture CRM",
      "body": "Cause racine documentee; actions correctives liees; delai mesure vs SLA; proprietaire qualite assigne; communication finale client archivee.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "closure-timing",
      "type": "SINGLE_CHOICE",
      "prompt": "Quand pouvez-vous envoyer la enquete NPS au Dr Meunier ?",
      "options": [
        {
          "key": "after-confirm",
          "label": "Apres confirmation explicite de resolution par le client"
        },
        {
          "key": "during-repair",
          "label": "Pendant l'installation du remplacement"
        },
        {
          "key": "before-close",
          "label": "Avant de documenter la cause racine"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "after-confirm"
        ]
      }
    },
    {
      "id": "closure-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont requis pour une cloture CRM complete ?",
      "options": [
        {
          "key": "root-cause",
          "label": "Cause racine documentee (lot LT-8842)"
        },
        {
          "key": "corrective",
          "label": "Actions correctives qualite liees"
        },
        {
          "key": "sla-actual",
          "label": "Delai reel vs SLA P1"
        },
        {
          "key": "nps-survey",
          "label": "Enquete NPS dans la fenetre 24 h"
        },
        {
          "key": "skip-doc",
          "label": "Cloture sans documentation"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "root-cause",
          "corrective",
          "sla-actual",
          "nps-survey"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "closure-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la sequence de cloture et recuperation NPS.",
      "options": [
        {
          "key": "document",
          "label": "Documenter cause racine et actions correctives"
        },
        {
          "key": "confirm",
          "label": "Obtenir confirmation client de resolution"
        },
        {
          "key": "close-case",
          "label": "Clore le dossier CAS-7701 dans le CRM"
        },
        {
          "key": "nps",
          "label": "Envoyer l'enquete NPS institutionnelle"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "document",
          "confirm",
          "close-case",
          "nps"
        ]
      }
    },
    {
      "id": "nps-threshold",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel score NPS minimum Patrick vise pour le comite CRM de septembre ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 8,
        "numericTolerance": 0
      }
    },
    {
      "id": "closure-reflection",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Le Dr Meunier donne un NPS de 9. Quelle lecon metier tirez-vous de CAS-7701 pour les futurs comptes institutionnels ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "qualite",
          "escalade",
          "trace",
          "institutionnel"
        ]
      }
    }
  ],
  "completionFeedback": "CAS-7701 cloture avec NPS 9 recueilli. Cause racine et actions correctives archivees pour le comite CRM de septembre.\n\nSophie Lambert"
} as const satisfies MissionDefinitionDocument;
