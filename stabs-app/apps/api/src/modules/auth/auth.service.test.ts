import assert from "node:assert/strict";
import test from "node:test";

import { AuthService } from "./auth.service";

test("login returns a persisted session payload from the configured auth store", async () => {
  const service = new AuthService({
    async login(username: string, password: string) {
      assert.equal(username, "admin");
      assert.equal(password, "demo");

      return {
        token: "session-user-admin",
        user: {
          id: "user-admin",
          username: "admin",
          displayName: "System Admin",
          roles: ["system_admin", "lageleiter"]
        },
        permissions: ["audit.read", "incidents.create"]
      };
    }
  } as never);

  const session = await service.login("admin", "demo");

  assert.equal(session.token, "session-user-admin");
  assert.equal(session.user.displayName, "System Admin");
});

test("getPermissionsForCurrentUser resolves the bearer token against the configured auth store", async () => {
  const service = new AuthService({
    async login() {
      return null;
    },
    async resolveSession(token: string | undefined) {
      assert.equal(token, "session-user-admin");

      return {
        token,
        user: {
          id: "user-admin",
          username: "admin",
          displayName: "System Admin",
          roles: ["system_admin"]
        },
        permissions: ["audit.read", "incidents.read"]
      };
    },
    async resolveUserDisplayName() {
      return "System Admin";
    }
  } as never);

  const currentUser = await service.getPermissionsForCurrentUser(
    "Bearer session-user-admin"
  );

  assert.deepEqual(currentUser.permissions, ["audit.read", "incidents.read"]);
  assert.equal(currentUser.user.username, "admin");
});
