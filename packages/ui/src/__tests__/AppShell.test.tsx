import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "../components/AppShell/AppShell.js";

describe("AppShell", () => {
  it("renders the enterprise layout regions", () => {
    render(
      <AppShell
        topNav={<div>Top Navigation</div>}
        sidebar={<nav>Sidebar</nav>}
        rightPanel={<aside>Context Panel</aside>}
      >
        <div>Main Content</div>
      </AppShell>,
    );

    expect(screen.getByTestId("tec-app-shell")).toBeInTheDocument();
    expect(screen.getByTestId("tec-app-shell-top-nav")).toHaveTextContent("Top Navigation");
    expect(screen.getByTestId("tec-app-shell-sidebar")).toHaveTextContent("Sidebar");
    expect(screen.getByTestId("tec-app-shell-main")).toHaveTextContent("Main Content");
    expect(screen.getByTestId("tec-app-shell-right-panel")).toHaveTextContent("Context Panel");
  });

  it("supports a collapsed context panel", () => {
    const { container } = render(
      <AppShell
        topNav={<div>Top</div>}
        sidebar={<nav>Side</nav>}
        rightPanel={<aside>Context</aside>}
        rightPanelCollapsed
      >
        <div>Main</div>
      </AppShell>,
    );

    const shell = container.querySelector('[data-testid="tec-app-shell"]');
    const panel = container.querySelector('[data-testid="tec-app-shell-right-panel"]');
    expect(shell).toHaveClass("tec-app-shell--context-collapsed");
    expect(panel).toHaveAttribute("hidden");
  });
});
