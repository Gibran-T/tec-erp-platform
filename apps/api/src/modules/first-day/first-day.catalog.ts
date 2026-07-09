import type { MessageKey, TaskKey } from "@tec-platform/contracts";

export const MANAGER_MESSAGE_KEY = "premier-message-gestionnaire" satisfies MessageKey;
export const FIRST_TASK_KEY = "decouvrir-nordhabitat" satisfies TaskKey;

export interface CatalogMessage {
  readonly messageKey: MessageKey;
  readonly fromName: string;
  readonly subject: string;
  readonly preview: string;
  readonly body: string;
}

export interface CatalogTask {
  readonly taskKey: TaskKey;
  readonly title: string;
  readonly description: string;
}

export const FIRST_DAY_MESSAGE_CATALOG: readonly CatalogMessage[] = [
  {
    messageKey: MANAGER_MESSAGE_KEY,
    fromName: "Claire Fontaine",
    subject: "Bienvenue chez NordHabitat — votre première journée",
    preview:
      "Bonjour et bienvenue au sein du Centre d'excellence ERP. Je suis votre gestionnaire, Claire Fontaine.",
    body:
      "Bonjour et bienvenue au sein du Centre d'excellence ERP. Je suis votre gestionnaire, Claire Fontaine. " +
      "Prenez le temps d'explorer votre poste de travail numérique. Votre première responsabilité vous sera transmise " +
      "dès que vous aurez pris connaissance de ce message.",
  },
];

export const FIRST_DAY_TASK_CATALOG: readonly CatalogTask[] = [
  {
    taskKey: FIRST_TASK_KEY,
    title: "Découvrir NordHabitat",
    description:
      "Explorez votre environnement de travail et familiarisez-vous avec les applications disponibles pour votre intégration.",
  },
];

export function isKnownMessageKey(messageKey: string): messageKey is MessageKey {
  return FIRST_DAY_MESSAGE_CATALOG.some((message) => message.messageKey === messageKey);
}

export function isKnownTaskKey(taskKey: string): taskKey is TaskKey {
  return FIRST_DAY_TASK_CATALOG.some((task) => task.taskKey === taskKey);
}
