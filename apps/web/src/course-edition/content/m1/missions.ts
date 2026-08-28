import type { CourseMissionLink } from "../../types.js";

export const M1_MISSIONS: readonly CourseMissionLink[] = [
  {
    missionKey: "m1-m01-decouvrir-entreprise",
    missionCode: "M1-M01",
    title: "Découvrir l’entreprise",
    role: "Observateur-Analyste",
    objective:
      "Identifier les départements touchés par l’écart 40 versus 36 et justifier la fragmentation d’information.",
    consequenceSummary:
      "La découverte valide que l’écart n’est pas un ajustement de stock isolé : il expose une lecture fragmentée entre départements.",
  },
  {
    missionKey: "m1-m02-connecter-departements",
    missionCode: "M1-M02",
    title: "Connecter les départements",
    role: "Analyste de dépendances",
    objective:
      "Reconstruire la chaîne d’information et quantifier l’écart pour relier signal terrain et impact entreprise.",
    consequenceSummary:
      "La connexion montre qu’un signal entrepôt non partagé dégrade coordination, promesse client et lecture financière.",
  },
  {
    missionKey: "m1-m03-diagnostiquer-preparation",
    missionCode: "M1-M03",
    title: "Diagnostiquer la préparation",
    role: "Analyste de préparation",
    objective:
      "Évaluer si NordHabitat est partiellement prête et recommander les priorités avant le Module 2.",
    consequenceSummary:
      "Le diagnostic autorise la poursuite pédagogique : rôles et données encore partiellement alignés ; propriété de processus à clarifier.",
  },
];
