import assert from "node:assert/strict";
import test from "node:test";

import { dynamic } from "./page";

test("home page is forced to render dynamically for live backend data", () => {
  assert.equal(dynamic, "force-dynamic");
});
