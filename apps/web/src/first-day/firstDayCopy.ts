export function formatUnreadCountMessage(unreadCount: number): string {
  if (unreadCount <= 0) {
    return "Aucun message professionnel en attente de lecture.";
  }

  if (unreadCount === 1) {
    return "1 message professionnel en attente de lecture.";
  }

  return `${unreadCount} messages professionnels en attente de lecture.`;
}

export const MESSAGE_READ_SUCCESS_FEEDBACK =
  "Message lu. Une première responsabilité vous a été assignée dans Tâches.";

export const TASK_COMPLETE_SUCCESS_FEEDBACK =
  "Première responsabilité enregistrée. Vous avez amorcé votre repérage opérationnel chez NordHabitat.";
