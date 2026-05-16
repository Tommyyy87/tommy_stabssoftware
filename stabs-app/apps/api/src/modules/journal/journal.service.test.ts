import assert from "node:assert/strict";
import test from "node:test";

import { JournalService } from "./journal.service";

test("createFromMessage requires journal.create permission", async () => {
  const service = new JournalService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-s2"
          },
          permissions: ["journal.read"]
        };
      }
    } as never,
    {} as never
  );

  await assert.rejects(
    service.create(
      "incident-001",
      {
        title: "Lageeintrag",
        body: "In Tagebuch uebernommen."
      },
      "Bearer session-user-s2",
      "message-001"
    ),
    /Keine Berechtigung zum Erstellen von Tagebucheintraegen/
  );
});

test("createFromMessage stores the source message link", async () => {
  const service = new JournalService(
    {
      async getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-s2"
          },
          permissions: ["journal.create"]
        };
      }
    } as never,
    {
      async create(
        incidentId: string,
        input: { title: string; body: string },
        createdByUserId: string,
        sourceMessageId?: string | null
      ) {
        return {
          id: "journal-001",
          incidentId,
          title: input.title,
          body: input.body,
          createdAt: "2026-05-16T12:10:00.000Z",
          createdBy: "S2 Lage",
          sourceMessageId: sourceMessageId ?? null
        };
      }
    } as never
  );

  const entry = await service.create(
    "incident-001",
    {
      title: "Lageeintrag",
      body: "In Tagebuch uebernommen."
    },
    "Bearer session-user-s2",
    "message-001"
  );

  assert.equal(entry.sourceMessageId, "message-001");
});
