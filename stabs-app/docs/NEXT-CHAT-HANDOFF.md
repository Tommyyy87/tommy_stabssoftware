# Next Chat Handoff

Stand: `2026-05-17`
Letzter verifizierter Frontend-Commit: `213f3e1`
Vorherige relevante Frontend-Commits:

- `b163067` `docs: add next chat handoff`
- `feb4894` `feat: add journal route and refresh sprint 1 docs`
- `2ec1954` `feat: split messages workspace into workflow components`
- `c598818` `feat: add workspace shell and overview foundation`

## 1. Worum es im naechsten Chat gehen soll

Der naechste fachlich sinnvolle Schritt ist nicht mehr Shell- oder
Workspace-Grundlage, sondern der erste echte Fachausbau auf dem neuen Rahmen:

1. `S2 Lage` von der Platzhalterseite zur ersten echten Facharbeitsflaeche machen
2. danach den Datenpfad von `Nachrichten` in das `Tagebuch` vorbereiten

Der Fokus fuer den naechsten Start soll also auf `S2 + Tagebuch-Uebernahme`
liegen, nicht auf weiterer Layoutkosmetik.

## 2. Aktueller sichtbarer Stand

Im Frontend sind aktuell strukturell vorhanden:

- Fuehrungsrahmen mit oberem Lagekopf
- horizontale Navigation fuer:
  - `Fuehrungsueberblick`
  - `S1` bis `S6`
  - `Nachrichten`
  - `Tagebuch`
- gemeinsamer Workspace-Kontext fuer Session, Benutzer, Lagen und aktive Lage
- Lagepflege auf `/`
- Nachrichtenarbeitsflaeche auf `/messages`
- Tagebuch-Einstieg auf `/journal`
- Platzhalterseiten fuer `S1` bis `S6`

Live-URL:

- `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`

## 3. Wichtige Referenzdateien

Diese Dateien zuerst lesen, bevor im neuen Chat weiterentwickelt wird:

- Plan:
  - `C:/Users/thbro/.config/superpowers/worktrees/Stabsarbeit/feature-stabsuebung-mvp02/stabs-app/docs/superpowers/plans/2026-05-17-sprint-1-usable-workflow.md`
- Zielbeschreibung:
  - `C:/Users/thbro/.config/superpowers/worktrees/Stabsarbeit/feature-stabsuebung-mvp02/stabs-app/docs/superpowers/specs/2026-05-17-sprint-1-usable-workflow-design.md`
- Betriebsdoku:
  - `stabs-app/docs/DEPLOYMENT-STATUS.md`
- Architektur:
  - `stabs-app/docs/ARCHITECTURE.md`
- Diese Handoff-Datei:
  - `stabs-app/docs/NEXT-CHAT-HANDOFF.md`

## 4. Was technisch schon umgesetzt ist

### Frontend-Rahmen

- `firebase-web/app/_components/app-shell.tsx`
- `firebase-web/app/_components/app-header.tsx`
- `firebase-web/app/_components/app-nav.tsx`
- `firebase-web/app/globals.css`

### Workspace-Kontext

- `firebase-web/app/_providers/workspace-provider.tsx`
- `firebase-web/app/_hooks/use-workspace.ts`
- `firebase-web/lib/workspace-storage.ts`

### Startseite und Lagepflege

- `firebase-web/app/page.tsx`
- `firebase-web/app/operations-console.tsx`

### Nachrichtenmodul

- Orchestrierung:
  - `firebase-web/app/messages/messages-workspace.tsx`
- Workflow-Komponenten:
  - `firebase-web/app/messages/_components/*`
- Pure View Helper:
  - `firebase-web/lib/messages-view.ts`

### Tagebuch

- `firebase-web/app/journal/page.tsx`
- `firebase-web/app/journal/journal-workspace.tsx`

### Fachbereiche

- gemeinsamer Platzhalter-Renderer:
  - `firebase-web/app/_components/staff-area-page.tsx`
- Platzhalterseiten:
  - `firebase-web/app/s1/page.tsx`
  - `firebase-web/app/s2/page.tsx`
  - `firebase-web/app/s3/page.tsx`
  - `firebase-web/app/s4/page.tsx`
  - `firebase-web/app/s5/page.tsx`
  - `firebase-web/app/s6/page.tsx`

## 5. Was noch nicht fertig ist

Wichtig: Der Fuehrungsrahmen und die Navigation stehen, aber die Fachbereiche
sind noch nicht inhaltlich ausgebaut.

Das bedeutet konkret:

1. `S1` bis `S6` sind aktuell noch Platzhalterseiten
2. `S2 Lage` hat noch keine echte Lagearbeitslogik
3. das `Tagebuch` hat noch keinen echten Uebernahmepfad aus `Nachrichten`
4. der neue Fuehrungsrahmen ist technisch verifiziert, aber live noch nicht
   systematisch visuell geprueft

## 6. Was im naechsten Chat konkret gemacht werden soll

### Schritt 1

`S2 Lage` als erste echte Facharbeitsflaeche aufbauen.

Ziel:

- die aktive Lage aus dem Workspace sichtbar und sinnvoll nutzen
- aus dem Fuehrungsueberblick in eine echte Lagearbeitsflaeche verzweigen
- `S2` nicht nur als Platzhalter, sondern als erster fachlich brauchbarer Bereich

### Schritt 2

Den fachlichen Uebernahmepfad in Richtung `Tagebuch` vorbereiten.

Ziel:

- aus `Nachrichten` ableitbare Punkte fuer das `Tagebuch` vormerken
- UI und State so vorbereiten, dass spaeter echte Uebernahmen moeglich sind

### Schritt 3

Den neuen Fuehrungsrahmen live pruefen.

Mindestens pruefen:

- `/`
- `/messages`
- `/journal`
- `/s2`

## 7. Lokale Verifikation vor Abschluss

Arbeitsverzeichnis: `stabs-app/firebase-web`

Immer in dieser Reihenfolge laufen lassen:

1. `npm test`
2. `npm run build`
3. `npm run typecheck`

Hinweis:

- wenn lokal ein `next dev` auf Port `3000` laeuft, kann ein Build an einer
  gesperrten `.next/trace` scheitern
- in dem Fall den Dev-Server vor dem finalen `build` stoppen

## 8. Online-Rollout

Der aktuelle manuelle Rollout-Pfad fuer das Frontend ist:

1. `git push origin main`
2. optional gezielt:
   - `firebase apphosting:rollouts:create stabsbackend -P tommys-stabssoftware -g <commit> -f`
3. danach live pruefen:
   - `/`
   - `/messages`
   - `/journal`
   - `/s2`

## 9. Formulierung fuer den naechsten Chat

Wenn der neue Chat ohne Rueckfragen schnell starten soll, diese Kurzform
verwenden:

`Bitte setze in stabs-app auf Basis von docs/NEXT-CHAT-HANDOFF.md fort. Letzter Stand ist Commit 213f3e1. Naechster Schritt: S2 Lage als erste echte Facharbeitsflaeche ausbauen und danach den Uebernahmepfad von Nachrichten ins Tagebuch vorbereiten.`
