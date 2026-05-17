import assert from "node:assert/strict";
import test from "node:test";

import { createInitialWorkspaceState } from "./workspace-provider";

test("createInitialWorkspaceState prefers first incident when no selection is stored", () => {
  const state = createInitialWorkspaceState({
    incidents: [
      {
        id: "incident-001",
        title: "Pilotlage Waldbrand",
        referenceNumber: "WB-2026-001",
        status: "active",
        createdAt: "2026-05-17T07:00:00.000Z",
        createdBy: "System Admin"
      }
    ],
    selectedIncidentId: ""
  });

  assert.equal(state.selectedIncidentId, "incident-001");
});
