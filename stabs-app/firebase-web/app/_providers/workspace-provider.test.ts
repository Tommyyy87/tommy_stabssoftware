import assert from "node:assert/strict";
import test from "node:test";

import { createInitialWorkspaceState } from "./workspace-provider";

test("createInitialWorkspaceState prefers first incident when no selection is stored", () => {
  const state = createInitialWorkspaceState({
    baseUrl: "https://api.example.test",
    backendReachable: true,
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

  assert.equal(state.baseUrl, "https://api.example.test");
  assert.equal(state.backendReachable, true);
  assert.equal(state.selectedIncidentId, "incident-001");
});

test("createInitialWorkspaceState falls back when stored incident is no longer available", () => {
  const state = createInitialWorkspaceState({
    baseUrl: "https://api.example.test",
    backendReachable: false,
    incidents: [
      {
        id: "incident-002",
        title: "Pilotlage Hochwasser",
        referenceNumber: "HW-2026-002",
        status: "active",
        createdAt: "2026-05-17T09:00:00.000Z",
        createdBy: "System Admin"
      }
    ],
    selectedIncidentId: "incident-missing"
  });

  assert.equal(state.selectedIncidentId, "incident-002");
});
