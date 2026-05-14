import assert from "node:assert/strict";
import test from "node:test";

import {
  createIncident,
  loadApiSnapshot,
  loginWithDemoCredentials,
  readCurrentUser,
  updateIncident
} from "./api";

test("loadApiSnapshot reads health and incidents from the configured API", async () => {
  const responses = new Map([
    [
      "https://example.test/api/health",
      {
        ok: true,
        async json() {
          return {
            service: "stabs-api",
            status: "ok",
            stage: "mvp-0.1-foundation"
          };
        }
      }
    ],
    [
      "https://example.test/api/incidents",
      {
        ok: true,
        async json() {
          return [
            {
              id: "incident-001",
              title: "Pilotlage Waldbrand",
              referenceNumber: "WB-2026-001",
              status: "active",
              createdAt: "2026-05-14T20:32:13.209Z",
              createdBy: "user-admin"
            }
          ];
        }
      }
    ]
  ]);

  const snapshot = await loadApiSnapshot({
    baseUrl: "https://example.test",
    fetchImpl: async (input) => {
      const response = responses.get(String(input));

      assert.ok(response, `unexpected request: ${String(input)}`);

      return response as Response;
    }
  });

  assert.equal(snapshot.baseUrl, "https://example.test");
  assert.equal(snapshot.backendReachable, true);
  assert.equal(snapshot.health?.status, "ok");
  assert.equal(snapshot.incidents.length, 1);
  assert.equal(snapshot.incidents[0]?.referenceNumber, "WB-2026-001");
});

test("loadApiSnapshot reports missing API configuration", async () => {
  const snapshot = await loadApiSnapshot({
    baseUrl: "",
    fetchImpl: async () => {
      throw new Error("fetch should not be called without a base URL");
    }
  });

  assert.equal(snapshot.backendReachable, false);
  assert.match(snapshot.error ?? "", /api-basis-url/i);
});

test("loginWithDemoCredentials posts demo credentials and returns the session", async () => {
  let request: { url: string; method?: string; body?: string } | null = null;

  const session = await loginWithDemoCredentials({
    baseUrl: "https://example.test",
    username: "admin",
    password: "demo",
    fetchImpl: async (input, init) => {
      request = {
        url: String(input),
        method: init?.method,
        body: String(init?.body)
      };

      return {
        ok: true,
        async json() {
          return {
            token: "demo-user-admin",
            user: {
              id: "user-admin",
              username: "admin",
              displayName: "System Admin",
              roles: ["system_admin", "lageleiter"]
            }
          };
        }
      } as Response;
    }
  });

  assert.deepEqual(request, {
    url: "https://example.test/api/auth/login",
    method: "POST",
    body: JSON.stringify({ username: "admin", password: "demo" })
  });
  assert.equal(session.token, "demo-user-admin");
  assert.equal(session.user.displayName, "System Admin");
});

test("readCurrentUser sends the bearer token to auth/me", async () => {
  let authorization = "";

  const session = await readCurrentUser({
    baseUrl: "https://example.test",
    token: "demo-user-admin",
    fetchImpl: async (_input, init) => {
      authorization = String((init?.headers as Record<string, string>)?.authorization);

      return {
        ok: true,
        async json() {
          return {
            user: {
              id: "user-admin",
              username: "admin",
              displayName: "System Admin",
              roles: ["system_admin", "lageleiter"]
            },
            permissions: ["incidents.create", "incidents.update"]
          };
        }
      } as Response;
    }
  });

  assert.equal(authorization, "Bearer demo-user-admin");
  assert.deepEqual(session.permissions, ["incidents.create", "incidents.update"]);
});

test("createIncident posts a new incident with authorization", async () => {
  let request: {
    url: string;
    method?: string;
    authorization?: string;
    body?: string;
  } | null = null;

  const incident = await createIncident({
    baseUrl: "https://example.test",
    token: "demo-user-admin",
    input: {
      title: "Flutlage Innenstadt",
      referenceNumber: "FL-2026-002"
    },
    fetchImpl: async (input, init) => {
      request = {
        url: String(input),
        method: init?.method,
        authorization: String((init?.headers as Record<string, string>)?.authorization),
        body: String(init?.body)
      };

      return {
        ok: true,
        async json() {
          return {
            id: "incident-002",
            title: "Flutlage Innenstadt",
            referenceNumber: "FL-2026-002",
            status: "draft",
            createdAt: "2026-05-14T22:00:00.000Z",
            createdBy: "user-admin"
          };
        }
      } as Response;
    }
  });

  assert.deepEqual(request, {
    url: "https://example.test/api/incidents",
    method: "POST",
    authorization: "Bearer demo-user-admin",
    body: JSON.stringify({
      title: "Flutlage Innenstadt",
      referenceNumber: "FL-2026-002"
    })
  });
  assert.equal(incident.id, "incident-002");
});

test("updateIncident patches incident fields with authorization", async () => {
  let request: {
    url: string;
    method?: string;
    authorization?: string;
    body?: string;
  } | null = null;

  const incident = await updateIncident({
    baseUrl: "https://example.test",
    token: "demo-user-admin",
    incidentId: "incident-002",
    input: {
      title: "Flutlage Innenstadt Nord",
      status: "active"
    },
    fetchImpl: async (input, init) => {
      request = {
        url: String(input),
        method: init?.method,
        authorization: String((init?.headers as Record<string, string>)?.authorization),
        body: String(init?.body)
      };

      return {
        ok: true,
        async json() {
          return {
            id: "incident-002",
            title: "Flutlage Innenstadt Nord",
            referenceNumber: "FL-2026-002",
            status: "active",
            createdAt: "2026-05-14T22:00:00.000Z",
            createdBy: "user-admin"
          };
        }
      } as Response;
    }
  });

  assert.deepEqual(request, {
    url: "https://example.test/api/incidents/incident-002",
    method: "PATCH",
    authorization: "Bearer demo-user-admin",
    body: JSON.stringify({
      title: "Flutlage Innenstadt Nord",
      status: "active"
    })
  });
  assert.equal(incident.status, "active");
});
