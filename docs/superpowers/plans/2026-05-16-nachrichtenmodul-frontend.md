# Nachrichtenmodul Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first visible, interactive Nachrichtenmodul frontend as an eingangsorientierte Nachrichtenzentrale in `firebase-web`.

**Architecture:** Keep the current live backend connectivity intact, but add a separate client-side message-center slice with realistic mock data and focused state transitions. Use small helper functions for filtering, sorting, and seed data so the UI can be tested without adding a full React test harness.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS in `app/globals.css`, Node test runner via `tsx --test`

---

## File Structure

- Create: `docs/superpowers/specs/2026-05-16-nachrichtenmodul-design.md`
- Create: `docs/superpowers/plans/2026-05-16-nachrichtenmodul-frontend.md`
- Create: `stabs-app/firebase-web/lib/message-center.ts`
- Create: `stabs-app/firebase-web/lib/message-center.test.ts`
- Create: `stabs-app/firebase-web/app/message-center.tsx`
- Modify: `stabs-app/firebase-web/app/page.tsx`
- Modify: `stabs-app/firebase-web/app/globals.css`
- Modify: `stabs-app/firebase-web/package.json`
- Modify: `Umsetzungsplan-Stabsunterstuetzungssoftware.md`
- Modify: `stabs-app/docs/ARCHITECTURE.md`
- Modify: `stabs-app/docs/DEPLOYMENT-STATUS.md`

### Task 1: Message Center Domain Helpers

**Files:**
- Create: `stabs-app/firebase-web/lib/message-center.ts`
- Test: `stabs-app/firebase-web/lib/message-center.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { filterMessages, sortMessages, demoMessages } from "./message-center";

test("sortMessages orders by message time descending", () => {
  const sorted = sortMessages(demoMessages);
  assert.equal(sorted[0]?.trackingNumber, "E-240516-018");
});

test("filterMessages matches status and text query", () => {
  const result = filterMessages(demoMessages, {
    status: "neu",
    query: "evakuierung"
  });

  assert.equal(result.length, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- message-center.test.ts`
Expected: FAIL because `./message-center` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const demoMessages = [{ trackingNumber: "E-240516-018", messageTime: "2026-05-16T11:45:00.000Z" }];

export function sortMessages(messages) {
  return [...messages].sort((left, right) => right.messageTime.localeCompare(left.messageTime));
}

export function filterMessages(messages, filters) {
  return messages.filter((message) => {
    const matchesStatus = filters.status === "alle" || message.status === filters.status;
    const needle = filters.query.toLowerCase();
    const matchesQuery = needle.length === 0 || message.subject.toLowerCase().includes(needle);
    return matchesStatus && matchesQuery;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- message-center.test.ts`
Expected: PASS with 2 tests.

- [ ] **Step 5: Commit**

```bash
git add stabs-app/firebase-web/lib/message-center.ts stabs-app/firebase-web/lib/message-center.test.ts
git commit -m "feat: add message center domain helpers"
```

### Task 2: Build the Interactive Message Center UI

**Files:**
- Create: `stabs-app/firebase-web/app/message-center.tsx`
- Modify: `stabs-app/firebase-web/app/page.tsx`
- Modify: `stabs-app/firebase-web/app/globals.css`

- [ ] **Step 1: Write the failing integration check**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import HomePage from "./page";

test("home page module remains defined after adding message center", () => {
  assert.equal(typeof HomePage, "function");
});
```

- [ ] **Step 2: Run test to verify the current page shape still loads**

Run: `npm test`
Expected: PASS on existing tests, giving a safe baseline before UI edits.

- [ ] **Step 3: Implement the message center component and embed it above the live backend console**

```tsx
<section className="panel message-center-panel">
  <div className="message-center-shell">
    <aside className="message-list-pane">...</aside>
    <div className="message-detail-pane">...</div>
  </div>
</section>
```

- [ ] **Step 4: Add responsive layout, badges, filters, timeline, and composer styling**

```css
.message-center-shell {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr);
}

@media (max-width: 960px) {
  .message-center-shell {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run tests and build**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS with Next.js production build output

- [ ] **Step 6: Commit**

```bash
git add stabs-app/firebase-web/app/message-center.tsx stabs-app/firebase-web/app/page.tsx stabs-app/firebase-web/app/globals.css
git commit -m "feat: add first message center frontend"
```

### Task 3: Update Docs to Reflect the Started Module

**Files:**
- Modify: `Umsetzungsplan-Stabsunterstuetzungssoftware.md`
- Modify: `stabs-app/docs/ARCHITECTURE.md`
- Modify: `stabs-app/docs/DEPLOYMENT-STATUS.md`

- [ ] **Step 1: Add the new frontend stage to roadmap and architecture docs**

```md
- Frontend-Arbeitsflaeche fuer das Nachrichtenmodul als eingangsorientierte Nachrichtenzentrale begonnen
- erste interaktive Mock-Arbeitslogik fuer Sichtung, Status und Detailansicht umgesetzt
```

- [ ] **Step 2: Verify the wording matches the actual implementation scope**

Run: `rg -n "Nachrichtenzentrale|Nachrichtenmodul|Mock-Arbeitslogik" Umsetzungsplan-Stabsunterstuetzungssoftware.md stabs-app/docs/ARCHITECTURE.md stabs-app/docs/DEPLOYMENT-STATUS.md`
Expected: each file contains at least one matching status line.

- [ ] **Step 3: Commit**

```bash
git add Umsetzungsplan-Stabsunterstuetzungssoftware.md stabs-app/docs/ARCHITECTURE.md stabs-app/docs/DEPLOYMENT-STATUS.md
git commit -m "docs: record message center frontend start"
```

### Task 4: Final Verification and Delivery

**Files:**
- Modify: `stabs-app/firebase-web/package.json`

- [ ] **Step 1: Ensure the test script includes the new helper test**

```json
"test": "tsx --test lib/api.test.ts lib/message-center.test.ts app/page.test.ts"
```

- [ ] **Step 2: Run the verification bundle**

Run: `npm test`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit and push**

```bash
git add docs/superpowers stabs-app/firebase-web/package.json
git commit -m "feat: deliver first visible messages frontend"
git push
```

## Self-Review

- Spec coverage: UI shell, list/detail model, interactive mock logic, responsive tablet behavior, and doc updates are covered by Tasks 1-4.
- Placeholder scan: no `TODO`, `TBD`, or implicit "handle later" instructions remain in task steps.
- Type consistency: `demoMessages`, `sortMessages`, `filterMessages`, and the `Nachrichtenzentrale` naming remain consistent across tasks.
