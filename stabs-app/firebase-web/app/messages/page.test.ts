import assert from "node:assert/strict";
import test from "node:test";

import { dynamic } from "./page";

test("messages route is forced to render dynamically for live api data", () => {
  assert.equal(dynamic, "force-dynamic");
});
