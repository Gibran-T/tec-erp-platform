import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "../components/ErrorBoundary.js";

function BrokenComponent(): ReactNode {
  throw new Error("Test failure");
}

describe("ErrorBoundary", () => {
  it("renders fallback UI when a child throws", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
