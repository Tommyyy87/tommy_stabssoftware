import assert from "node:assert/strict";
import test from "node:test";

import {
  acknowledgeMessageDispatch,
  createIncident,
  createJournalEntry,
  dispatchMessage,
  getIncidentHistory,
  listJournalEntriesByIncident,
  listMessagesByIncident,
  updateIncident
} from "./demo-store";

test("updateIncident applies edited title, reference number, and status", { concurrency: false }, () => {
  const created = createIncident(
    {
      title: "Ausgangslage Starkregen",
      referenceNumber: "SR-2026-009"
    },
    "user-admin"
  );

  const updated = updateIncident(
    created.id,
    {
      title: "Ausgangslage Starkregen Nord",
      referenceNumber: "SR-2026-010",
      status: "active"
    },
    "user-admin"
  );

  assert.ok(updated, "expected incident update to succeed");
  assert.equal(updated.id, created.id);
  assert.equal(updated.title, "Ausgangslage Starkregen Nord");
  assert.equal(updated.referenceNumber, "SR-2026-010");
  assert.equal(updated.status, "active");
});

test("incident history stores create and update events", { concurrency: false }, () => {
  const created = createIncident(
    {
      title: "Ausgangslage Hochwasser",
      referenceNumber: "HW-2026-015"
    },
    "user-admin"
  );

  updateIncident(
    created.id,
    {
      status: "active"
    },
    "user-admin"
  );

  const history = getIncidentHistory(created.id);

  assert.ok(history, "expected incident history");
  assert.equal(history.length, 2);
  assert.equal(history[0]?.summary, "Statuswechsel von draft zu active.");
  assert.equal(history[1]?.action, "created");
});

test("dispatchMessage assigns one message to multiple target roles", { concurrency: false }, () => {
  const updated = dispatchMessage(
    "incident-001",
    "message-001",
    {
      targetRoles: ["s2", "s4"],
      note: "Bitte priorisiert auswerten."
    },
    "user-kgs"
  );

  assert.ok(updated, "expected dispatch update");
  assert.ok(updated.dispatches.some((entry) => entry.targetRole === "s2"));
  assert.ok(updated.dispatches.some((entry) => entry.targetRole === "s4"));
  assert.equal(updated.status, "weitergeleitet");
});

test("acknowledgeMessageDispatch stores actor and timestamp", { concurrency: false }, () => {
  const updated = acknowledgeMessageDispatch(
    "incident-001",
    "message-001",
    "dispatch-002",
    "user-s2"
  );

  assert.ok(updated, "expected acknowledgement update");
  const dispatch = updated.dispatches.find((entry) => entry.id === "dispatch-002");
  assert.equal(dispatch?.acknowledgedBy, "S2 Lage");
  assert.equal(dispatch?.processingStatus, "quittiert");
});

test("createJournalEntry stores a source message link", { concurrency: false }, () => {
  const created = createJournalEntry(
    "incident-001",
    {
      title: "Nachricht uebernommen",
      body: "Winddreher im Tagebuch nachgefuehrt."
    },
    "user-s2",
    "message-001"
  );

  const journal = listJournalEntriesByIncident("incident-001");
  const messages = listMessagesByIncident("incident-001");

  assert.equal(created.sourceMessageId, "message-001");
  assert.equal(journal[0]?.id, created.id);
  assert.ok(messages[0]?.dispatches.length);
});
