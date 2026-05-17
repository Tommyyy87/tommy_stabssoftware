import assert from "node:assert/strict";
import test from "node:test";

import {
  clearWorkspaceSession,
  readSelectedIncidentId,
  readWorkspaceSession,
  saveSelectedIncidentId,
  saveWorkspaceSession
} from "./workspace-storage";

test("workspace storage round-trips session and selected incident", () => {
  const storage = new Map<string, string>();

  const adapter = {
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
    removeItem(key: string) {
      storage.delete(key);
    }
  };

  saveWorkspaceSession(adapter, {
    token: "session-1",
    user: {
      id: "user-admin",
      username: "admin",
      displayName: "System Admin",
      roles: ["system_admin"]
    }
  });
  saveSelectedIncidentId(adapter, "incident-001");

  assert.equal(readWorkspaceSession(adapter)?.token, "session-1");
  assert.equal(readSelectedIncidentId(adapter), "incident-001");
});

test("clearing the workspace session removes unreadable session state", () => {
  const storage = new Map<string, string>();

  const adapter = {
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
    removeItem(key: string) {
      storage.delete(key);
    }
  };

  saveWorkspaceSession(adapter, {
    token: "session-2",
    user: {
      id: "user-s2",
      username: "s2",
      displayName: "S2 Dienst",
      roles: ["s2"]
    }
  });

  clearWorkspaceSession(adapter);

  assert.equal(readWorkspaceSession(adapter), null);
});
