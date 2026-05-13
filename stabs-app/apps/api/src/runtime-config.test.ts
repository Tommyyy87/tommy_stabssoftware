import test from "node:test";
import assert from "node:assert/strict";
import { getRuntimeBinding } from "./runtime-config";

test("getRuntimeBinding uses Cloud Run defaults when env is missing", () => {
  assert.deepEqual(getRuntimeBinding({}), {
    host: "0.0.0.0",
    port: 8080
  });
});

test("getRuntimeBinding ignores empty or invalid PORT values", () => {
  assert.deepEqual(getRuntimeBinding({ PORT: "" }), {
    host: "0.0.0.0",
    port: 8080
  });

  assert.deepEqual(getRuntimeBinding({ PORT: "invalid" }), {
    host: "0.0.0.0",
    port: 8080
  });
});

test("getRuntimeBinding accepts valid PORT and HOST values", () => {
  assert.deepEqual(getRuntimeBinding({ PORT: "9090", HOST: "127.0.0.1" }), {
    host: "127.0.0.1",
    port: 9090
  });
});
