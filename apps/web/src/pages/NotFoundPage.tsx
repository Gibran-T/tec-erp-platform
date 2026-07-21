import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function NotFoundPage(): ReactNode {
  return (
    <section data-testid="not-found-page">
      <h1>Page introuvable</h1>
      <p>La page demandée n’existe pas dans votre espace de travail.</p>
      <Link to="/">Revenir à l’accueil</Link>
    </section>
  );
}
