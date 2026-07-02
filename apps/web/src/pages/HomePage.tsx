import { useEffect, useState, type ReactNode } from "react";

import { fetchApiHealth, getApiBaseUrl, type ApiConnectivityState } from "../api/health.js";

export function HomePage(): ReactNode {
  const [connectivity, setConnectivity] = useState<ApiConnectivityState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth(): Promise<void> {
      setConnectivity({ status: "loading" });

      try {
        const health = await fetchApiHealth(controller.signal);
        setConnectivity({ status: "connected", health });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to reach API";
        setConnectivity({ status: "error", message });
      }
    }

    void loadHealth();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section data-testid="home-page">
      <h2>Platform Foundation</h2>
      <p>Welcome to the TEC.ERP application shell. Business modules will mount here in later milestones.</p>

      <div data-testid="api-connectivity-card">
        <h3>API Connectivity</h3>
        <p>Base URL: {getApiBaseUrl()}</p>

        {connectivity.status === "idle" || connectivity.status === "loading" ? (
          <p>Checking API health...</p>
        ) : null}

        {connectivity.status === "connected" ? (
          <p data-testid="api-health-status">
            API status: {connectivity.health.status} (platform {connectivity.health.platformVersion})
          </p>
        ) : null}

        {connectivity.status === "error" ? (
          <p role="alert" data-testid="api-health-error">
            {connectivity.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
