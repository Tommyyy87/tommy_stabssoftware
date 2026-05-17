import assert from "node:assert/strict";
import test from "node:test";

import { buildPrimaryNav } from "./app-nav";

test("buildPrimaryNav returns the core workspace routes", () => {
  const items = buildPrimaryNav("/s2");

  assert.deepEqual(
    items.map((item) => ({
      href: item.href,
      label: item.label
    })),
    [
      { href: "/", label: "Fuehrungsueberblick" },
      { href: "/s1", label: "S1 Personal / Inneres" },
      { href: "/s2", label: "S2 Lage" },
      { href: "/s3", label: "S3 Einsatz" },
      { href: "/s4", label: "S4 Versorgung" },
      { href: "/s5", label: "S5 Presse / Oeffentlichkeit" },
      { href: "/s6", label: "S6 Information / Kommunikation" },
      { href: "/messages", label: "Nachrichten" },
      { href: "/journal", label: "Tagebuch" }
    ]
  );
  assert.equal(items.find((item) => item.href === "/s2")?.active, true);
});
