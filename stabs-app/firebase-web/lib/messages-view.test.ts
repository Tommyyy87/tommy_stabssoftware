import assert from "node:assert/strict";
import test from "node:test";

import type { MessageSnapshot } from "./api";
import {
  deriveMessageWorkflowSummary,
  filterVisibleMessages
} from "./messages-view";

const messages: MessageSnapshot[] = [
  {
    id: "message-1",
    incidentId: "incident-1",
    trackingNumber: "E-001",
    direction: "eingang",
    channel: "funk",
    priority: "hoch",
    status: "neu",
    messageTime: "2026-05-17T10:00:00.000Z",
    recordedAt: "2026-05-17T10:01:00.000Z",
    senderLabel: "Abschnitt Nord",
    recipientLabel: "Stab",
    subject: "Evakuierung pruefen",
    body: "Wind dreht auf Ost.",
    assignee: "Sichtung offen",
    distribution: "S2, S3",
    notes: "",
    createdAt: "2026-05-17T10:01:00.000Z",
    createdBy: "System Admin",
    updatedAt: "2026-05-17T10:01:00.000Z",
    updatedBy: "System Admin"
  },
  {
    id: "message-2",
    incidentId: "incident-1",
    trackingNumber: "A-002",
    direction: "ausgang",
    channel: "telefon",
    priority: "sofort",
    status: "weitergeleitet",
    messageTime: "2026-05-17T11:00:00.000Z",
    recordedAt: "2026-05-17T11:01:00.000Z",
    senderLabel: "Stabsleitung",
    recipientLabel: "Leitstelle",
    subject: "Busse anfordern",
    body: "Drei Busse in 45 Minuten.",
    assignee: "KGS Nachrichtenzentrale",
    distribution: "S3, S4",
    notes: "Quittierung offen",
    createdAt: "2026-05-17T11:01:00.000Z",
    createdBy: "System Admin",
    updatedAt: "2026-05-17T11:01:00.000Z",
    updatedBy: "System Admin"
  }
];

test("filterVisibleMessages filters and sorts live messages", () => {
  const result = filterVisibleMessages(messages, {
    query: "busse",
    status: "alle",
    priority: "alle",
    direction: "alle"
  });

  assert.equal(result.length, 1);
  assert.equal(result[0]?.trackingNumber, "A-002");
});

test("deriveMessageWorkflowSummary counts workflow-relevant states", () => {
  const summary = deriveMessageWorkflowSummary(messages);

  assert.deepEqual(summary, {
    total: 2,
    inboxCount: 1,
    inProgressCount: 1,
    urgentCount: 1
  });
});
