import assert from "node:assert/strict";
import test from "node:test";

import {
  createIncident,
  getIncidentHistory,
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
