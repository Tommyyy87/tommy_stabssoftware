# Deployment-Status

Version: `1.6`
Stand: `2026-05-17`
Status: `Sprint-1-Frontendstand verifiziert`

## 1. Kurzfassung

Der aktuelle Stand kombiniert:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Google Cloud Run
- Incident-Daten persistent in PostgreSQL ueber Cloud SQL
- gemeinsame App-Shell im Frontend
- Lageuebersicht auf `/`
- Nachrichtenworkflow auf `/messages`
- integrierten Journal-Einstieg auf `/journal`

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

- Die Frontend-URL oeffnet die Lageuebersicht auf `/`
- Die Navigation zeigt `Lageuebersicht`, `Nachrichten` und `Journal`
- Login mit `admin / demo` ist im Arbeitskontext verfuegbar
- Neue Lagen lassen sich anlegen und erscheinen in der Liste
- `/messages` ist als eigene Arbeitsflaeche erreichbar
- `/journal` ist als integrierter Nebenpfad erreichbar

## 6. Verifikation fuer diesen Stand

Im Frontend-Deploy-Pfad `firebase-web` wurden erfolgreich ausgefuehrt:

- `npm test`
- `npm run typecheck`
- `npm run build`

Zusatz:

- `/journal` ist als Route im Build enthalten
- `/messages` ist in kleinere Workflow-Komponenten zerlegt
- Shell, Workspace-Grundlage und Onboarding sind im Frontend verankert

## 7. Relevante Deploy-Dateien

- Frontend-Deploy-Konfiguration: `firebase-web/apphosting.yaml`
- Frontend-Startseite: `firebase-web/app/page.tsx`
- Frontend-Lagepflege: `firebase-web/app/operations-console.tsx`
- Frontend-Journalroute: `firebase-web/app/journal/page.tsx`
- Frontend-Nachrichtenkomponenten: `firebase-web/app/messages/_components`
- Frontend-API-Helfer: `firebase-web/lib/api.ts`

## 8. Zeitlinie

### 2026-05-16

- Frontend auf eigene Modulroute `/messages` umgestellt
- Startseite verschlankt, damit die Nachrichtenarbeit nicht weiter als Single-Page-Block waechst

### 2026-05-17

- gemeinsame App-Shell mit linker Navigation eingefuehrt
- Workspace-Grundlage fuer Session- und Lagekontext aufgebaut
- Startseite zu einer echten Lageuebersicht mit Onboarding-Pfad umgebaut
- `/messages` in kleinere Workflow-Komponenten zerlegt
- `/journal` als sichtbare Route im selben Arbeitsrahmen ergaenzt

## 9. Bekannte technische Leitplanken

- Firebase App Hosting deployt aus `firebase-web`, nicht aus `apps/web`
- das Frontend bleibt auf `Next.js 15.2.9`
- `output: "standalone"` bleibt erhalten
- `styled-jsx` bleibt in den Frontend-Dependencies

## 10. Naechste sinnvolle Schritte

1. globalen Workspace-Kontext in die Modulrouten verdrahten
2. `journal` von der Einstiegsroute auf echte Datenuebernahme ausbauen
3. lagebezogene Mitgliedschaften und feinere Rollen-/Rechtepruefung anschliessen
4. weitere Fachmodule auf denselben persistenten Kern setzen

## 11. Handoff fuer den naechsten Chat

Fuer die naechste Session ist der technische Bezugspunkt:

- `docs/NEXT-CHAT-HANDOFF.md`

Dort stehen:

- letzter verifizierter Commit
- relevante Referenzdateien
- naechste konkrete Entwicklungsschritte
- Verifikations- und Rollout-Reihenfolge
