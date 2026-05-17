import assert from "node:assert/strict";
import test from "node:test";

import JournalPage, { dynamic } from "./page";

test("journal page remains a dynamic module route", () => {
  assert.equal(dynamic, "force-dynamic");
  assert.equal(typeof JournalPage, "function");
});
