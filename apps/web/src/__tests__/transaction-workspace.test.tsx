import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TransactionWorkspacePage } from "../pages/workspace/transactions/TransactionWorkspacePage.js";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  localStorage.setItem(
    "tec.erp.auth.tokens",
    JSON.stringify({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
    }),
  );
});

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function renderWorkspacePage() {
  return render(
    <MemoryRouter initialEntries={["/workspace/apps/documents"]}>
      <Routes>
        <Route path="/workspace/apps/:appId" element={<TransactionWorkspacePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TransactionWorkspacePage", () => {
  it("loads documents tab with mocked fetch", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        documents: [
          {
            id: "doc_1",
            documentType: "purchase_requisition",
            documentNumber: "PR-001",
            status: "pending_approval",
            missionKey: null,
            createdAt: "2026-07-21T12:00:00.000Z",
            payloadSummary: { materialKey: "SKU-HVAC-4421", quantity: 10 },
          },
        ],
      }),
    );

    renderWorkspacePage();

    expect(screen.getByTestId("transaction-workspace-page")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("document-row-doc_1")).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/me/transactions/documents"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("switches to inventory tab and loads stock", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ documents: [] }))
      .mockResolvedValueOnce(
        jsonResponse({
          stock: [{ materialKey: "SKU-HVAC-4421", locationKey: "DC-MTL", quantityOnHand: 36 }],
          recentMovements: [],
        }),
      );

    renderWorkspacePage();
    await waitFor(() => {
      expect(screen.getByTestId("transaction-documents-empty")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("transaction-tab-inventory"));

    await waitFor(() => {
      expect(screen.getByText("SKU-HVAC-4421")).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/me/transactions/inventory"),
      expect.objectContaining({ method: "GET" }),
    );
  });
});
