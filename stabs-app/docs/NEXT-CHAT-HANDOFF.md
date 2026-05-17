# Next Chat Handoff

Stand: `2026-05-17`
Letzter verifizierter Frontend-Commit: `feb4894`
Vorherige Sprint-1-Frontend-Commits:

- `2ec1954` `feat: split messages workspace into workflow components`
- `c598818` `feat: add workspace shell and overview foundation`

## 1. Worum es im naechsten Chat gehen soll

Der naechste fachlich sinnvolle Schritt ist:

1. den globalen Workspace-Kontext wirklich in `/` und `/messages` verdrahten
2. danach `journal` von der Einstiegsroute auf echte Datenuebernahme vorbereiten

Der Fokus fuer den naechsten Start soll also auf `Task 1 + Task 4 sauber verbinden`
liegen, nicht auf neuer Shell oder neuem Grundlayout.

## 2. Aktueller sichtbarer Stand

Im Frontend sind aktuell live sichtbar:

- gemeinsame App-Shell mit linker Navigation
- Lageuebersicht auf `/`
- Nachrichtenarbeitsflaeche auf `/messages`
- Journal-Einstieg auf `/journal`
- Onboarding-Pfad auf der Startseite

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

### Frontend-Grundlage

- App-Shell:
  - `firebase-web/app/_components/app-shell.tsx`
  - `firebase-web/app/_components/app-header.tsx`
  - `firebase-web/app/_components/app-nav.tsx`
- Workspace-Basis:
  - `firebase-web/app/_providers/workspace-provider.tsx`
  - `firebase-web/app/_hooks/use-workspace.ts`
  - `firebase-web/lib/workspace-storage.ts`

### Startseite

- `firebase-web/app/page.tsx`
- `firebase-web/app/operations-console.tsx`

### Nachrichtenmodul

- Orchestrierung:
  - `firebase-web/app/messages/messages-workspace.tsx`
- zerlegte Komponenten:
  - `firebase-web/app/messages/_components/*`
- Pure View Helper:
  - `firebase-web/lib/messages-view.ts`

### Journal

- `firebase-web/app/journal/page.tsx`
- `firebase-web/app/journal/journal-workspace.tsx`

## 5. Was noch nicht fertig ist

Wichtig: Der Workspace-Kontext ist als Grundlage angelegt, aber noch nicht
wirklich durchgezogen.

Das bedeutet konkret:

1. `operations-console.tsx` und `messages-workspace.tsx` halten weiterhin eigene
   Session-/Incident-States
2. `workspace-provider.tsx` ist noch nicht die echte gemeinsame Quelle fuer
   Session, Benutzer und gewaehlte Lage
3. `/journal` ist aktuell noch ein strukturierter Einstieg, aber noch kein
   datengetriebenes Modul

## 6. Was im naechsten Chat konkret gemacht werden soll

### Schritt 1

Die bestehenden doppelten States in:

- `firebase-web/app/operations-console.tsx`
- `firebase-web/app/messages/messages-workspace.tsx`

gegen den gemeinsamen Workspace-Kontext konsolidieren.

### Schritt 2

`layout.tsx` oder die Routenstruktur so erweitern, dass die relevanten
Workspace-Daten zentral bereitgestellt werden koennen, ohne Session-Logik
zweimal zu halten.

### Schritt 3

Die Lageauswahl in `/` und `/messages` auf denselben aktiven Incident-Kontext
umstellen.

### Schritt 4

Erst danach `journal` auf einen echten Uebernahmepfad ausrichten.

## 7. Lokale Verifikation vor Abschluss

Arbeitsverzeichnis: `stabs-app/firebase-web`

Immer in dieser Reihenfolge laufen lassen:

1. `npm test`
2. `npm run build`
3. `npm run typecheck`

Hinweis:

- `npm run typecheck` kann fehlschlagen, wenn parallel dazu gerade `.next/types`
  neu erzeugt oder geloescht werden
- deshalb `typecheck` nicht parallel zu `build` starten

## 8. Online-Rollout

Der aktuelle manuelle Rollout-Pfad fuer das Frontend ist:

1. `git push origin main`
2. optional gezielt:
   - `firebase apphosting:rollouts:create stabsbackend -P tommys-stabssoftware -g <commit> -f`
3. danach live pruefen:
   - `/`
   - `/messages`
   - `/journal`

## 9. Formulierung fuer den naechsten Chat

Wenn der neue Chat ohne Rueckfragen schnell starten soll, diese Kurzform
verwenden:

`Bitte setze in stabs-app Sprint 1 fort. Bezugspunkt ist docs/NEXT-CHAT-HANDOFF.md und der Plan 2026-05-17-sprint-1-usable-workflow. Nächster Schritt: Workspace-Kontext wirklich in / und /messages verdrahten, keine neue Shell bauen, danach Journal-Datenpfad vorbereiten.`
