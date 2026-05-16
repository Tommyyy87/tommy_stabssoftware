import assert from "node:assert/strict";
import test from "node:test";

import { MessagesService } from "./messages.service";

test("listByIncident returns messages for one incident", async () => {
  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["messages.read"]
        };
      }
    } as never,
    {
      async listByIncident() {
        return [
          {
            id: "message-001",
            incidentId: "incident-001",
            trackingNumber: "E-240516-001",
            direction: "eingang",
            channel: "funk",
            priority: "sofort",
            status: "neu",
            messageTime: "2026-05-16T11:45:00.000Z",
            recordedAt: "2026-05-16T11:47:00.000Z",
            senderLabel: "Abschnitt Nord",
            recipientLabel: "Stabsraum S2/S3",
            subject: "Evakuierung vorbereiten",
            body: "Winddreher nach Ost.",
            assignee: "S3 Einsatz",
            distribution: "S2, S3",
            notes: "Quittierung ausstehend.",
            createdAt: "2026-05-16T11:47:00.000Z",
            createdBy: "System Admin",
            updatedAt: "2026-05-16T11:47:00.000Z",
            updatedBy: "System Admin",
            dispatches: []
          }
        ];
      }
    } as never
  );

  const messages = await service.listByIncident(
    "incident-001",
    "Bearer session-user-admin"
  );

  assert.equal(messages[0]?.trackingNumber, "E-240516-001");
  assert.equal(messages[0]?.status, "neu");
});

test("create normalizes text and forwards actor id", async () => {
  let repositoryCall:
    | {
        incidentId: string;
        createdByUserId: string;
        input: {
          subject: string;
          senderLabel: string;
        };
      }
    | undefined;

  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["messages.create"]
        };
      }
    } as never,
    {
      async create(incidentId: string, input: { subject: string; senderLabel: string }, createdByUserId: string) {
        repositoryCall = {
          incidentId,
          createdByUserId,
          input
        };

        return {
          id: "message-002",
          incidentId,
          trackingNumber: "E-240516-002",
          direction: "eingang",
          channel: "telefon",
          priority: "hoch",
          status: "neu",
          messageTime: "2026-05-16T12:00:00.000Z",
          recordedAt: "2026-05-16T12:01:00.000Z",
          senderLabel: input.senderLabel,
          recipientLabel: "Stab",
          subject: input.subject,
          body: "Test",
          assignee: "Sichtung offen",
          distribution: "offen",
          notes: "",
          createdAt: "2026-05-16T12:01:00.000Z",
          createdBy: "System Admin",
          updatedAt: "2026-05-16T12:01:00.000Z",
          updatedBy: "System Admin",
          dispatches: []
        };
      }
    } as never
  );

  await service.create(
    "incident-001",
    {
      direction: "eingang",
      channel: "telefon",
      priority: "hoch",
      messageTime: "2026-05-16T12:00:00.000Z",
      senderLabel: "  Abschnitt Nord  ",
      recipientLabel: "  Stab  ",
      subject: "  Rauchentwicklung Osthang  ",
      body: "  Neue Lage  "
    },
    "Bearer session-user-admin"
  );

  assert.equal(repositoryCall?.incidentId, "incident-001");
  assert.equal(repositoryCall?.createdByUserId, "user-admin");
  assert.equal(repositoryCall?.input.subject, "Rauchentwicklung Osthang");
  assert.equal(repositoryCall?.input.senderLabel, "Abschnitt Nord");
});

test("update returns not found when the store does not know the message", async () => {
  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["messages.update"]
        };
      }
    } as never,
    {
      async update() {
        return null;
      }
    } as never
  );

  await assert.rejects(
    service.update(
      "incident-001",
      "message-missing",
      { status: "weitergeleitet" },
      "Bearer session-user-admin"
    ),
    /Nachricht nicht gefunden/
  );
});

test("listHistory returns the persisted message history", async () => {
  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["audit.read"]
        };
      }
    } as never,
    {
      async listHistory() {
        return [
          {
            id: "message-audit-001",
            messageId: "message-001",
            incidentId: "incident-001",
            action: "updated",
            summary: "Statuswechsel von neu zu weitergeleitet.",
            createdAt: "2026-05-16T11:50:00.000Z",
            actor: "System Admin",
            changes: [
              {
                field: "status",
                from: "neu",
                to: "weitergeleitet"
              }
            ]
          }
        ];
      }
    } as never
  );

  const history = await service.listHistory(
    "incident-001",
    "message-001",
    "Bearer session-user-admin"
  );

  assert.equal(history.length, 1);
  assert.equal(history[0]?.changes[0]?.field, "status");
});

test("dispatch requires messages.dispatch permission", async () => {
  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-kgs"
          },
          permissions: ["messages.read"]
        };
      }
    } as never,
    {} as never
  );

  await assert.rejects(
    service.dispatch(
      "incident-001",
      "message-001",
      { targetRoles: ["s2"] },
      "Bearer session-user-kgs"
    ),
    /Keine Berechtigung zum Verteilen von Nachrichten/
  );
});

test("acknowledgeDispatch forwards actor id to the configured store", async () => {
  let repositoryCall:
    | {
        incidentId: string;
        messageId: string;
        dispatchId: string;
        acknowledgedByUserId: string;
      }
    | undefined;

  const service = new MessagesService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-s2"
          },
          permissions: ["messages.acknowledge"]
        };
      }
    } as never,
    {
      async acknowledgeDispatch(
        incidentId: string,
        messageId: string,
        dispatchId: string,
        acknowledgedByUserId: string
      ) {
        repositoryCall = {
          incidentId,
          messageId,
          dispatchId,
          acknowledgedByUserId
        };

        return {
          id: "message-001",
          incidentId,
          trackingNumber: "E-240516-001",
          direction: "eingang",
          channel: "funk",
          priority: "sofort",
          status: "weitergeleitet",
          messageTime: "2026-05-16T11:45:00.000Z",
          recordedAt: "2026-05-16T11:47:00.000Z",
          senderLabel: "Abschnitt Nord",
          recipientLabel: "Stabsraum S2/S3",
          subject: "Evakuierung vorbereiten",
          body: "Winddreher nach Ost.",
          assignee: "S3 Einsatz",
          distribution: "S2, S3",
          notes: "Quittierung ausstehend.",
          createdAt: "2026-05-16T11:47:00.000Z",
          createdBy: "System Admin",
          updatedAt: "2026-05-16T12:10:00.000Z",
          updatedBy: "S2 Lage",
          dispatches: [
            {
              id: dispatchId,
              messageId,
              incidentId,
              targetRole: "s2",
              dispatchedAt: "2026-05-16T11:50:00.000Z",
              dispatchedBy: "KGS Nachrichtenzentrale",
              dispatchNote: "Lagebewertung erforderlich.",
              seenAt: "2026-05-16T12:10:00.000Z",
              acknowledgedAt: "2026-05-16T12:10:00.000Z",
              acknowledgedBy: "S2 Lage",
              processingStatus: "quittiert"
            }
          ]
        };
      }
    } as never
  );

  const updated = await service.acknowledgeDispatch(
    "incident-001",
    "message-001",
    "dispatch-001",
    "Bearer session-user-s2"
  );

  assert.equal(repositoryCall?.acknowledgedByUserId, "user-s2");
  assert.equal(updated.dispatches[0]?.processingStatus, "quittiert");
});
