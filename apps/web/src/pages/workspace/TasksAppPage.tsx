import type { EmployeeTask } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import { EmptyStateCard } from "../../components/workspace/EmptyStateCard.js";
import { useFirstDayData } from "../../first-day/FirstDayDataContext.js";
import { TASK_COMPLETE_SUCCESS_FEEDBACK } from "../../first-day/firstDayCopy.js";
import { MANAGER_NAME } from "../../workspace/workspaceCopy.js";

const TASK_STATUS_LABELS = {
  a_faire: "À faire",
  terminee: "Terminée",
} as const;

function TaskCard({
  task,
  onComplete,
  isCompleting,
  completeTaskError,
  taskCompleteSuccess,
}: {
  task: EmployeeTask;
  onComplete: () => void;
  isCompleting: boolean;
  completeTaskError: string | null;
  taskCompleteSuccess: boolean;
}): ReactNode {
  const isComplete = task.status === "terminee";

  return (
    <article className="workspace-tasks__card" data-testid={`task-card-${task.taskKey}`}>
      <div className="workspace-tasks__card-header">
        <h2>{task.title}</h2>
        <span
          className={`workspace-tasks__status workspace-tasks__status--${task.status}`}
          data-testid={`task-status-${task.taskKey}`}
        >
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>
      <p>{task.description}</p>
      {isComplete ? (
        <p
          className="workspace-tasks__complete-note"
          data-testid={`task-complete-note-${task.taskKey}`}
        >
          {taskCompleteSuccess
            ? TASK_COMPLETE_SUCCESS_FEEDBACK
            : "Responsabilité enregistrée."}
        </p>
      ) : (
        <button
          type="button"
          className="workspace-tasks__complete-button"
          data-testid={`task-complete-button-${task.taskKey}`}
          disabled={isCompleting}
          aria-busy={isCompleting}
          onClick={onComplete}
        >
          {isCompleting ? "Enregistrement…" : "Marquer comme terminée"}
        </button>
      )}
      {completeTaskError ? (
        <p
          className="workspace-first-day__error"
          role="alert"
          data-testid={`task-complete-error-${task.taskKey}`}
        >
          {completeTaskError}
        </p>
      ) : null}
    </article>
  );
}

export function TasksAppPage(): ReactNode {
  const {
    tasks,
    initialLoading,
    loadError,
    completeTaskError,
    completingTaskKey,
    taskCompleteSuccess,
    completeTask,
  } = useFirstDayData();

  if (initialLoading && tasks === null) {
    return (
      <section data-testid="tasks-app-page">
        <p
          className="workspace-first-day__status"
          role="status"
          data-testid="tasks-initial-loading"
        >
          Chargement de vos responsabilités…
        </p>
      </section>
    );
  }

  if (loadError && tasks === null) {
    return (
      <section data-testid="tasks-app-page">
        <p className="workspace-first-day__error" role="alert" data-testid="tasks-load-error">
          {loadError}
        </p>
      </section>
    );
  }

  const taskList = tasks?.tasks ?? [];

  if (taskList.length === 0) {
    return (
      <section data-testid="tasks-app-page">
        <EmptyStateCard
          title="Tâches"
          description={`Aucune responsabilité ne vous est encore assignée. Consultez d'abord le message de votre gestionnaire, ${MANAGER_NAME}, dans la boîte de réception.`}
        />
      </section>
    );
  }

  return (
    <section className="workspace-tasks" data-testid="tasks-app-page">
      <header className="workspace-tasks__header">
        <h1>Tâches</h1>
        <p>Vos responsabilités opérationnelles pour votre intégration chez NordHabitat.</p>
      </header>

      <div className="workspace-tasks__list">
        {taskList.map((task) => (
          <TaskCard
            key={task.taskKey}
            task={task}
            isCompleting={completingTaskKey === task.taskKey}
            completeTaskError={
              completingTaskKey === task.taskKey || (!completingTaskKey && task.status === "a_faire")
                ? completeTaskError
                : null
            }
            taskCompleteSuccess={taskCompleteSuccess}
            onComplete={() => {
              void completeTask(task.taskKey);
            }}
          />
        ))}
      </div>
    </section>
  );
}
