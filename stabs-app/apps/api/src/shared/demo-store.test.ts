import assert from "node:assert/strict";
import test from "node:test";

import {
  createIncident,
  createSession,
  getSeededUsers,
  getSession,
  updateIncident
} from "./demo-store";

test("createSession stores a retrievable demo session", () => {
  const admin = getSeededUsers().find((user) => user.username === "admin");

  assert.ok(admin, "expected seeded admin user");

  const session = createSession(admin);

  assert.equal(getSession(session.token)?.user.username, "admin");
});

test("updateIncident applies edited title, reference number, and status", { concurrency: false }, () => {
  const created = createIncident(
    {
      title: "Ausgangslage Starkregen",
      referenceNumber: "SR-2026-009"
    },
    "user-admin"
  );

  const updated = updateIncident(created.id, {
    title: "Ausgangslage Starkregen Nord",
    referenceNumber: "SR-2026-010",
    status: "active"
  });

  assert.ok(updated, "expected incident update to succeed");
  assert.equal(updated.id, created.id);
  assert.equal(updated.title, "Ausgangslage Starkregen Nord");
  assert.equal(updated.referenceNumber, "SR-2026-010");
  assert.equal(updated.status, "active");
});
