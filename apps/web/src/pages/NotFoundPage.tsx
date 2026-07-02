import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function NotFoundPage(): ReactNode {
  return (
    <section data-testid="not-found-page">
      <h2>Page not found</h2>
      <p>The requested route does not exist in the platform shell.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}
