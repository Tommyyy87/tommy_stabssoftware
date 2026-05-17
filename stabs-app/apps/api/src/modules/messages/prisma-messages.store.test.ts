import assert from "node:assert/strict";
import test from "node:test";

import { PrismaMessagesStore } from "./prisma-messages.store";

test("onModuleInit seeds messages idempotently with createMany and skipDuplicates", async () => {
  const calls: {
    message?: { data: unknown[]; skipDuplicates: boolean };
    dispatch?: { data: unknown[]; skipDuplicates: boolean };
    audit?: { data: unknown[]; skipDuplicates: boolean };
  } = {};

  const store = new PrismaMessagesStore({
    message: {
      async count() {
        return 0;
      },
      async createMany(input: { data: unknown[]; skipDuplicates: boolean }) {
        calls.message = input;
      }
    },
    messageDispatch: {
      async createMany(input: { data: unknown[]; skipDuplicates: boolean }) {
        calls.dispatch = input;
      }
    },
    messageAuditEntry: {
      async createMany(input: { data: unknown[]; skipDuplicates: boolean }) {
        calls.audit = input;
      }
    }
  } as never);

  await store.onModuleInit();

  assert.equal(calls.message?.skipDuplicates, true);
  assert.equal(calls.dispatch?.skipDuplicates, true);
  assert.equal(calls.audit?.skipDuplicates, true);
  assert.equal(calls.message?.data.length, 1);
  assert.equal(calls.dispatch?.data.length, 3);
  assert.equal(calls.audit?.data.length, 1);
});

test("onModuleInit skips seeding when messages already exist", async () => {
  let createManyCalls = 0;

  const store = new PrismaMessagesStore({
    message: {
      async count() {
        return 1;
      },
      async createMany() {
        createManyCalls += 1;
      }
    },
    messageDispatch: {
      async createMany() {
        createManyCalls += 1;
      }
    },
    messageAuditEntry: {
      async createMany() {
        createManyCalls += 1;
      }
    }
  } as never);

  await store.onModuleInit();

  assert.equal(createManyCalls, 0);
});
