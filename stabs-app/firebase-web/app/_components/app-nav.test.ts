import assert from "node:assert/strict";
import test from "node:test";

import { buildPrimaryNav } from "./app-nav";

test("buildPrimaryNav returns the core workspace routes", () => {
  const items = buildPrimaryNav("/messages");

  assert.deepEqual(
    items.map((item) => item.href),
    ["/", "/messages", "/journal"]
  );
  assert.equal(items.find((item) => item.href === "/messages")?.active, true);
});
