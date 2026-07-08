import type { ReactNode } from "react";

export interface FirstDayWelcomeProps {
  readonly employeeName?: string;
}

/**
 * RC01 first-day welcome banner. The opening emotional moment of the
 * NordHabitat experience — the new hire is greeted as an employee.
 */
export function FirstDayWelcome({ employeeName }: FirstDayWelcomeProps): ReactNode {
  return (
    <section data-testid="first-day-welcome" aria-label="Bienvenue">
      <p data-testid="first-day-welcome-message">
        Bienvenue chez NordHabitat. Aujourd&apos;hui est votre premier jour.
      </p>
      {employeeName ? <p>Ravi de vous compter parmi nous, {employeeName}.</p> : null}
    </section>
  );
}
