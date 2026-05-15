import assert from "node:assert/strict";
import test from "node:test";

import { IncidentsService } from "./incidents.service";

test("list returns the persisted incidents from the configured store", async () => {
  const service = new IncidentsService(
    {
      getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["incidents.read"]
        };
      }
    } as never,
    {
      async list() {
        return [
          {
            id: "incident-db-1",
            title: "Datenbanklage",
            referenceNumber: "DB-2026-001",
            status: "active",
            createdAt: "2026-05-15T00:15:00.000Z",
            createdBy: "System Admin"
          }
        ];
      }
    } as never
  );

  const incidents = await service.list();

  assert.equal(incidents.length, 1);
  assert.equal(incidents[0]?.referenceNumber, "DB-2026-001");
  assert.equal(incidents[0]?.createdBy, "System Admin");
});

test("create forwards the normalized incident to the configured store", async () => {
  let repositoryCall:
    | {
        title: string;
        referenceNumber: string;
        createdByUserId: string;
      }
    | undefined;

  const service = new IncidentsService(
    {
      getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["incidents.create"]
        };
      }
    } as never,
    {
      async list() {
        return [];
      },
      async create(input: { title: string; referenceNumber: string }, createdByUserId: string) {
        repositoryCall = {
          ...input,
          createdByUserId
        };

        return {
          id: "incident-db-2",
          title: input.title,
          referenceNumber: input.referenceNumber,
          status: "draft",
          createdAt: "2026-05-15T00:16:00.000Z",
          createdBy: "System Admin"
        };
      }
    } as never
  );

  const incident = await service.create(
    {
      title: "  Neue Datenbanklage  ",
      referenceNumber: "  DB-2026-002  "
    },
    "Bearer demo-user-admin"
  );

  assert.deepEqual(repositoryCall, {
    title: "Neue Datenbanklage",
    referenceNumber: "DB-2026-002",
    createdByUserId: "user-admin"
  });
  assert.equal(incident.createdBy, "System Admin");
});

test("update returns not found when the configured store does not know the incident", async () => {
  const service = new IncidentsService(
    {
      getPermissionsForCurrentUser() {
        return {
          user: {
            id: "user-admin"
          },
          permissions: ["incidents.update"]
        };
      }
    } as never,
    {
      async list() {
        return [];
      },
      async update() {
        return null;
      }
    } as never
  );

  await assert.rejects(
    service.update(
      "incident-missing",
      {
        status: "active"
      },
      "Bearer demo-user-admin"
    ),
    /Lage nicht gefunden/
  );
});
