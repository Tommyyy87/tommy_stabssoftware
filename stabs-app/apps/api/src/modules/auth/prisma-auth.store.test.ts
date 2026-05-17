import assert from "node:assert/strict";
import test from "node:test";

import { PrismaAuthStore } from "./prisma-auth.store";

test("onModuleInit seeds user roles with createMany and skipDuplicates", async () => {
  let createManyInput:
    | {
        data: Array<{ userId: string; roleKey: string }>;
        skipDuplicates: boolean;
      }
    | undefined;

  const store = new PrismaAuthStore({
    role: {
      async upsert() {}
    },
    user: {
      async upsert() {}
    },
    userRole: {
      async createMany(input: {
        data: Array<{ userId: string; roleKey: string }>;
        skipDuplicates: boolean;
      }) {
        createManyInput = input;
      }
    }
  } as never);

  await store.onModuleInit();

  assert.equal(createManyInput?.skipDuplicates, true);
  assert.ok((createManyInput?.data.length ?? 0) > 0);
  assert.deepEqual(createManyInput?.data[0], {
    userId: "user-admin",
    roleKey: "system_admin"
  });
});
