# Nachrichtenmodul Persistenz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist messages per incident in the API and move the frontend message center into a dedicated `/messages` route backed by real API data.

**Architecture:** Extend the existing incident/auth/audit backbone with a focused `messages` module that mirrors the established store/service/controller pattern. Keep the homepage short and use a separate route for the real working surface so the UI does not collapse into a single scroll-heavy page.

**Tech Stack:** NestJS, Prisma/PostgreSQL, TypeScript, Next.js App Router, React 19, Node test runner via `tsx --test`

---

## File Structure

- Create: `docs/superpowers/specs/2026-05-16-nachrichtenmodul-persistenz-design.md`
- Create: `docs/superpowers/plans/2026-05-16-nachrichtenmodul-persistenz-plan.md`
- Modify: `stabs-app/apps/api/prisma/schema.prisma`
- Create: `stabs-app/apps/api/src/modules/messages/messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/in-memory-messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/prisma-messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.service.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.controller.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.service.test.ts`
- Modify: `stabs-app/apps/api/src/app.module.ts`
- Modify: `stabs-app/apps/api/package.json`
- Modify: `stabs-app/firebase-web/lib/api.ts`
- Modify: `stabs-app/firebase-web/lib/api.test.ts`
- Create: `stabs-app/firebase-web/app/messages/page.tsx`
- Create: `stabs-app/firebase-web/app/messages/messages-workspace.tsx`
- Modify: `stabs-app/firebase-web/app/page.tsx`
- Modify: `stabs-app/firebase-web/app/globals.css`
- Modify: `stabs-app/firebase-web/package.json`
- Modify: `Umsetzungsplan-Stabsunterstuetzungssoftware.md`
- Modify: `stabs-app/docs/ARCHITECTURE.md`
- Modify: `stabs-app/docs/DEPLOYMENT-STATUS.md`

### Task 1: Add Message Domain Tests and Types in the API

**Files:**
- Create: `stabs-app/apps/api/src/modules/messages/messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.service.test.ts`
- Modify: `stabs-app/apps/api/package.json`

- [ ] **Step 1: Write the failing test**

```ts
test("listByIncident returns messages for one incident", async () => {
  const service = new MessagesService(authStub, storeStub);
  const messages = await service.listByIncident("incident-001", "Bearer token");
  assert.equal(messages[0]?.trackingNumber, "E-240516-001");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build && npm test`
Expected: FAIL because `MessagesService` and `messages.store.ts` do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
export const MESSAGE_STORE = Symbol("MESSAGE_STORE");

export type MessageStatus = "neu" | "gesichtet" | "in_bearbeitung" | "weitergeleitet" | "erledigt";
```

- [ ] **Step 4: Run test to verify it passes once the service stub exists**

Run: `npm run build && npm test`
Expected: PASS for the new message service tests.

- [ ] **Step 5: Commit**

```bash
git add stabs-app/apps/api/src/modules/messages/messages.store.ts stabs-app/apps/api/src/modules/messages/messages.service.test.ts stabs-app/apps/api/package.json
git commit -m "test: add messages service coverage"
```

### Task 2: Implement Persisted Message Store, Service, Controller, and Prisma Schema

**Files:**
- Modify: `stabs-app/apps/api/prisma/schema.prisma`
- Create: `stabs-app/apps/api/src/modules/messages/in-memory-messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/prisma-messages.store.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.service.ts`
- Create: `stabs-app/apps/api/src/modules/messages/messages.controller.ts`
- Modify: `stabs-app/apps/api/src/app.module.ts`

- [ ] **Step 1: Write failing tests for create/update/history behavior**

```ts
test("create normalizes text and writes actor id", async () => {
  const created = await service.create("incident-001", input, "Bearer token");
  assert.equal(created.subject, "Rauchentwicklung Osthang");
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run build && npm test`
Expected: FAIL because the store/service/controller methods are missing.

- [ ] **Step 3: Implement minimal Prisma schema and module wiring**

```prisma
model Message {
  id              String   @id
  incidentId      String
  trackingNumber  String
  subject         String
  ...
}
```

- [ ] **Step 4: Run tests and build**

Run: `npm run build && npm test`
Expected: PASS, including the new messages service tests.

- [ ] **Step 5: Commit**

```bash
git add stabs-app/apps/api/prisma/schema.prisma stabs-app/apps/api/src/modules/messages stabs-app/apps/api/src/app.module.ts
git commit -m "feat: add persisted messages api module"
```

### Task 3: Add Frontend API Client Support for Real Messages

**Files:**
- Modify: `stabs-app/firebase-web/lib/api.ts`
- Modify: `stabs-app/firebase-web/lib/api.test.ts`

- [ ] **Step 1: Write the failing API client test**

```ts
test("listMessages requests incident-scoped messages", async () => {
  const messages = await listMessages({ baseUrl, incidentId: "incident-001", fetchImpl });
  assert.equal(messages[0]?.trackingNumber, "E-240516-001");
});
```

- [ ] **Step 2: Run frontend tests to verify RED**

Run: `npm test`
Expected: FAIL because `listMessages` does not exist yet.

- [ ] **Step 3: Implement real message client functions**

```ts
export async function listMessages(...) { ... }
export async function createMessage(...) { ... }
export async function updateMessage(...) { ... }
export async function getMessageHistory(...) { ... }
```

- [ ] **Step 4: Run frontend tests to verify GREEN**

Run: `npm test`
Expected: PASS with message API coverage added.

- [ ] **Step 5: Commit**

```bash
git add stabs-app/firebase-web/lib/api.ts stabs-app/firebase-web/lib/api.test.ts
git commit -m "feat: add frontend message api client"
```

### Task 4: Move the Message Center into `/messages` and Keep the Homepage Short

**Files:**
- Create: `stabs-app/firebase-web/app/messages/page.tsx`
- Create: `stabs-app/firebase-web/app/messages/messages-workspace.tsx`
- Modify: `stabs-app/firebase-web/app/page.tsx`
- Modify: `stabs-app/firebase-web/app/globals.css`
- Modify: `stabs-app/firebase-web/package.json`

- [ ] **Step 1: Write a failing route test**

```ts
test("messages route is dynamically rendered", () => {
  assert.equal(dynamic, "force-dynamic");
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `/app/messages/page.tsx` does not exist.

- [ ] **Step 3: Implement the dedicated route and real-data workspace**

```tsx
export default async function MessagesPage() {
  return <MessagesWorkspace initialMessages={...} />;
}
```

- [ ] **Step 4: Reduce the homepage to overview + module entry**

```tsx
<Link href="/messages">Nachrichtenmodul oeffnen</Link>
```

- [ ] **Step 5: Run tests, typecheck, and build**

Run: `npm test`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add stabs-app/firebase-web/app/messages stabs-app/firebase-web/app/page.tsx stabs-app/firebase-web/app/globals.css stabs-app/firebase-web/package.json
git commit -m "feat: move messages workspace to dedicated route"
```

### Task 5: Update Architecture and Delivery Docs

**Files:**
- Modify: `Umsetzungsplan-Stabsunterstuetzungssoftware.md`
- Modify: `stabs-app/docs/ARCHITECTURE.md`
- Modify: `stabs-app/docs/DEPLOYMENT-STATUS.md`

- [ ] **Step 1: Record the dedicated route and real-data transition**

```md
- Nachrichtenmodul jetzt ueber eigene Route `/messages`
- Frontend an echte Message-Endpunkte angeschlossen
- Startseite wieder kompakter Einstieg statt Single-Page-Ausbau
```

- [ ] **Step 2: Verify wording with ripgrep**

Run: `rg -n "/messages|Message-Endpunkte|Single-Page" Umsetzungsplan-Stabsunterstuetzungssoftware.md stabs-app/docs/ARCHITECTURE.md stabs-app/docs/DEPLOYMENT-STATUS.md`
Expected: all three docs show the new routing and persistence state.

- [ ] **Step 3: Commit and push**

```bash
git add docs/superpowers/specs/2026-05-16-nachrichtenmodul-persistenz-design.md docs/superpowers/plans/2026-05-16-nachrichtenmodul-persistenz-plan.md Umsetzungsplan-Stabsunterstuetzungssoftware.md stabs-app/docs/ARCHITECTURE.md stabs-app/docs/DEPLOYMENT-STATUS.md
git commit -m "docs: record persisted messages module architecture"
git push
```

## Self-Review

- Spec coverage: persistence, API, dedicated route, compact homepage, and real frontend data flow are all covered.
- Placeholder scan: no `TODO`, `TBD`, or missing commands remain.
- Type consistency: route name `/messages`, entity name `Message`, and message status naming remain consistent across tasks.
