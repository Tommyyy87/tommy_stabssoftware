import assert from "node:assert/strict";
import test from "node:test";

import {
  assignMessage,
  buildStatusSummary,
  createLocalMessage,
  demoMessages,
  filterMessages,
  sortMessages,
  updateMessageStatus
} from "./message-center";

test("sortMessages orders by message time descending", () => {
  const sorted = sortMessages(demoMessages);

  assert.equal(sorted[0]?.trackingNumber, "E-240516-018");
  assert.equal(sorted.at(-1)?.trackingNumber, "E-240516-015");
});

test("filterMessages narrows by status and text query", () => {
  const result = filterMessages(demoMessages, {
    status: "neu",
    priority: "alle",
    direction: "alle",
    query: "evakuierung"
  });

  assert.equal(result.length, 1);
  assert.equal(result[0]?.trackingNumber, "E-240516-018");
});

test("buildStatusSummary derives inbox counters", () => {
  const summary = buildStatusSummary(demoMessages);

  assert.deepEqual(summary, {
    total: 4,
    newCount: 1,
    urgentCount: 1,
    outgoingCount: 1
  });
});

test("update helpers append timeline entries", () => {
  const assigned = assignMessage(demoMessages[0], "S5 Presse");
  const updated = updateMessageStatus(assigned, "weitergeleitet");

  assert.equal(updated.assignee, "S5 Presse");
  assert.equal(updated.status, "weitergeleitet");
  assert.match(updated.timeline[0]?.note ?? "", /weitergeleitet/i);
});

test("createLocalMessage generates a local preview record", () => {
  const created = createLocalMessage({
    subject: "Tankstelle pruefen",
    body: "Lage Rueckfrage zur Kraftstoffversorgung.",
    senderLabel: "Abschnitt Sued",
    recipientLabel: "Stab",
    priority: "hoch",
    channel: "telefon"
  });

  assert.equal(created.status, "neu");
  assert.equal(created.assignee, "Sichtung offen");
  assert.match(created.trackingNumber, /^E-\d{6}-\d{3}$/);
});
