import assert from "node:assert/strict";
import test from "node:test";

import { loadApiSnapshot } from "./api";

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
