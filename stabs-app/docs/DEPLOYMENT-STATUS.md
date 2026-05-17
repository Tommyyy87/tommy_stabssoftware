# Deployment-Status

Version: `1.7`
Stand: `2026-05-17`
Status: `Fuehrungsrahmen lokal verifiziert und nach GitHub gepusht`

## 1. Kurzfassung

Der aktuelle Stand kombiniert:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Google Cloud Run
- Incident-Daten persistent in PostgreSQL ueber Cloud SQL
- gemeinsamen Fuehrungsrahmen im Frontend
- `Fuehrungsueberblick` auf `/`
- `Nachrichten` auf `/messages`
- `Tagebuch` als sichtbares Querschnittsmodul auf `/journal`
- sichtbare Fachbereichs-Platzhalter fuer `S1` bis `S6`

## 2. Live-Systeme

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Incidents: `https://stabs-api-1059988621010.europe-west4.run.app/api/incidents`

## 3. Projektzuordnung

- Firebase-Projekt: `tommys-stabssoftware`
- Firebase App-Hosting-Backend: `stabsbackend`
- Cloud-Run-Service: `stabs-api`
- Region Frontend/Backend/DB: `europe-west4`
- Live-Branch: `main`

## 4. Relevante Pfade

- Repo-Root: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- Frontend-Deploy-Ordner: `stabs-app/firebase-web`
- Backend: `stabs-app/apps/api`
- Betriebsdoku: `stabs-app/docs`

## 5. Was aktuell sichtbar funktionieren soll

- die Frontend-URL oeffnet den `Fuehrungsueberblick` auf `/`
- die obere Navigation zeigt:
  - `Fuehrungsueberblick`
  - `S1 Personal / Inneres`
  - `S2 Lage`
  - `S3 Einsatz`
  - `S4 Versorgung`
  - `S5 Presse / Oeffentlichkeit`
  - `S6 Information / Kommunikation`
  - `Nachrichten`
  - `Tagebuch`
- Login mit `admin / demo` ist im gemeinsamen Workspace verfuegbar
- neue Lagen lassen sich anlegen und erscheinen im gemeinsamen Kontext
- `/messages` ist als eigene Arbeitsflaeche erreichbar
- `/journal` ist fachlich als `Tagebuch` eingebunden
- `/s1` bis `/s6` sind als Platzhalterseiten im Build enthalten

## 6. Verifikation fuer diesen Stand

Im Frontend-Deploy-Pfad `firebase-web` wurden erfolgreich ausgefuehrt:

- `npm test`
- `npm run typecheck`
- `npm run build`

Hinweis:

- ein erster Build-Versuch schlug lokal an einer gesperrten `.next/trace` vom
  laufenden Dev-Server fehl
- nach Stop des lokalen `next dev` lief der Produktions-Build sauber durch

## 7. Relevante Deploy-Dateien

- Frontend-Lagekopf und Navigation:
  - `firebase-web/app/_components/app-header.tsx`
  - `firebase-web/app/_components/app-nav.tsx`
  - `firebase-web/app/_components/app-shell.tsx`
- Frontend-Workspace:
  - `firebase-web/app/_providers/workspace-provider.tsx`
  - `firebase-web/lib/workspace-storage.ts`
- Frontend-Startseite:
  - `firebase-web/app/page.tsx`
- Frontend-Lagepflege:
  - `firebase-web/app/operations-console.tsx`
- Frontend-Nachrichtenmodul:
  - `firebase-web/app/messages/*`
- Frontend-Tagebuch:
  - `firebase-web/app/journal/*`
- Frontend-Fachbereichs-Platzhalter:
  - `firebase-web/app/s1/page.tsx`
  - `firebase-web/app/s2/page.tsx`
  - `firebase-web/app/s3/page.tsx`
  - `firebase-web/app/s4/page.tsx`
  - `firebase-web/app/s5/page.tsx`
  - `firebase-web/app/s6/page.tsx`

## 8. Zeitlinie

### 2026-05-16

- Frontend auf eigene Modulroute `/messages` umgestellt
- Startseite verschlankt, damit die Nachrichtenarbeit nicht weiter als
  Single-Page-Block waechst

### 2026-05-17

- gemeinsame App-Shell eingefuehrt
- Workspace-Grundlage fuer Session- und Lagekontext aufgebaut
- Startseite zu einer echten Lageuebersicht mit Onboarding-Pfad umgebaut
- `/messages` in kleinere Workflow-Komponenten zerlegt
- `/journal` als sichtbare Route im selben Arbeitsrahmen ergaenzt
- Workspace-Kontext in `/` und `/messages` wirklich konsolidiert
- visuellen Fuehrungsrahmen mit Lagekopf statt linker Sidebar aufgebaut
- `Tagebuch` als fachliche UI-Bezeichnung eingefuehrt
- `S1` bis `S6` als sichtbare Fachbereiche im Frontend angelegt
- GitHub-Stand auf Commit `213f3e1` gepusht

## 9. Bekannte technische Leitplanken

- Firebase App Hosting deployt aus `firebase-web`, nicht aus `apps/web`
- das Frontend bleibt auf `Next.js 15.2.9`
- `styled-jsx` bleibt in den Frontend-Dependencies
- die Live-URL muss nach dem naechsten Rollout noch visuell gegen den neuen
  Fuehrungsrahmen geprueft werden

## 10. Naechste sinnvolle Schritte

1. `S2 Lage` als erste echte Facharbeitsflaeche aufbauen
2. `Tagebuch` auf echte Datenuebernahme aus `Nachrichten` vorbereiten
3. den neuen Fuehrungsrahmen live visuell auf `/`, `/messages`, `/journal` und
   mindestens `/s2` pruefen
4. danach weitere `S`-Bereiche schrittweise mit echter Fachlogik ausbauen

## 11. Handoff fuer den naechsten Chat

Fuer die naechste Session ist der technische Bezugspunkt:

- `docs/NEXT-CHAT-HANDOFF.md`

Dort stehen:

- letzter verifizierter Commit
- relevante Referenzdateien
- naechste konkrete Entwicklungsschritte
- Verifikations- und Rollout-Reihenfolge
