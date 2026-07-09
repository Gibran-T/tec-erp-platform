import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest runs with globals: false, so Testing Library's automatic per-test
// cleanup is not registered. Register it explicitly to avoid DOM accumulation.
afterEach(() => {
  cleanup();
});
