# Deployment-Status

Version: `1.2`  
Stand: `2026-05-15`  
Status: `Live-Betrieb / Referenz fuer Weiterentwicklung`

## 1. Kurzfassung

Zum Stand `2026-05-15` ist der erste echte Online-Kern live und funktional erweitert:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Google Cloud Run
- Frontend zeigt echten Backend-Status
- Frontend erlaubt Login, Benutzerstatus und Lagearbeit
- Incident-Daten liegen persistent in PostgreSQL ueber Cloud SQL

Damit ist das Projekt nicht mehr nur ein online sichtbarer Demo-Kern, sondern hat jetzt auch eine erste dauerhafte Datenbasis fuer die Lageverwaltung.

## 2. Live-Systeme

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Incidents: `https://stabs-api-1059988621010.europe-west4.run.app/api/incidents`

## 3. Projektzuordnung

- Firebase-Projekt: `tommys-stabssoftware`
- Firebase App-Hosting-Backend: `stabsbackend`
- Cloud-Run-Service: `stabs-api`
- Cloud-SQL-Instanz: `stabs-db`
- Cloud-SQL-Datenbank: `stabsapp`
- Region Frontend/Backend/DB: `europe-west4`
- GitHub-Repository: `https://github.com/Tommyyy87/tommy_stabssoftware`
- Live-Branch: `main`

## 4. Repo-Pfade

- Repo-Root: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- Frontend-Quellstand: `stabs-app/apps/web`
- Frontend-Deploy-Ordner: `stabs-app/firebase-web`
- Backend: `stabs-app/apps/api`
- Prisma-Schema und Migrationen: `stabs-app/apps/api/prisma`
- Betriebsdoku: `stabs-app/docs`

## 5. Bekannte Zugriffe

- Demo-Benutzer: `admin`
- Demo-Passwort: `demo`

Hinweis:

- Diese Zugangsdaten sind nur fuer den aktuellen Demo-/MVP-Stand gedacht.
- Vor einem echten Produktivbetrieb muessen sie ersetzt werden.

## 6. Was aktuell sichtbar funktionieren muss

- Die Frontend-URL oeffnet die Startseite.
- Im Bereich `Live-Verbindung` steht der Status auf `verbunden`.
- Im Bereich `API-Gesundheit` wird `ok` angezeigt.
- In der `Arbeitsansicht` ist Login mit `admin / demo` moeglich.
- Nach erfolgreichem Login lassen sich neue Lagen anlegen.
- Neu angelegte Lagen erscheinen in der Liste aus dem Backend.

## 7. Relevante Deploy-Dateien

- Frontend-Deploy-Konfiguration: `firebase-web/apphosting.yaml`
- Frontend-Startseite: `firebase-web/app/page.tsx`
- Frontend-Arbeitsansicht: `firebase-web/app/operations-console.tsx`
- Frontend-API-Helfer: `firebase-web/lib/api.ts`
- Backend-Containerbuild: `apps/api/Dockerfile`
- Lokaler Cloud-Run-Deploy-Weg: `apps/api/scripts/deploy-cloud-run.ps1`
- Prisma-Schema: `apps/api/prisma/schema.prisma`

## 8. Verifizierter Ist-Stand

Zum letzten verifizierten Stand gilt:

- `GET /api/health` liefert:
  - `{"service":"stabs-api","status":"ok","stage":"mvp-0.1-foundation"}`
- `GET /api/incidents` liefert mindestens:
  - `incident-001`
  - `Pilotlage Waldbrand`
  - `WB-2026-001`
- `POST /api/incidents` legt neue Lagen persistent an.
- Ein verifizierter Persistenztest wurde mit einer neuen Lage ueber den Live-Endpunkt durchgefuehrt.
- Cloud Run Revision `stabs-api-00003-t4b` laeuft mit angebundener Cloud-SQL-Instanz.

## 9. Zeitlinie

### 2026-05-14

- Root-Lockfile-Fix fuer `styled-jsx` auf `main` gepusht.
- Eigenstaendiger Frontend-Deploy-Ordner `firebase-web` eingefuehrt.
- Cloud-Run-Service `stabs-api` erfolgreich erstellt.
- Frontend auf echte API-URL konfiguriert.
- Live-Backend-Status und erste Lage im Frontend sichtbar gemacht.

### 2026-05-15

- Incident-Store von direktem In-Memory-Zugriff auf austauschbaren Store umgestellt.
- Prisma mit PostgreSQL-Schema und Migrationen eingebaut.
- Cloud-SQL-Instanz `stabs-db` in `europe-west4` angelegt.
- Datenbank `stabsapp` angelegt.
- Secret `stabs-api-database-url` erstellt und an Cloud Run gebunden.
- Cloud-Run-Service `stabs-api` auf Revision `stabs-api-00003-t4b` mit Cloud-SQL-Anbindung ausgerollt.
- Persistenzpfad live verifiziert durch Login, Incident-Anlage und erneutes Lesen ueber `/api/incidents`.

## 10. Letzte relevante Commits

- `d18c479` `Add interactive incident workspace`
- `0ac2a0f` `Show live backend status in frontend`
- `8e0d03b` `Configure frontend API base URL`
- `cae9d19` `Prepare API for Cloud Run deployment`

## 11. Bekannte technische Leitplanken

- Firebase App Hosting soll fuer dieses Projekt aus `firebase-web` deployen, nicht direkt aus `apps/web`.
- Das Frontend fuer Firebase App Hosting bleibt auf `Next.js 15.2.9`.
- `output: "standalone"` darf im Frontend nicht entfernt werden.
- `styled-jsx` muss in den Frontend-Dependencies erhalten bleiben.
- Cloud Run bezieht `DATABASE_URL` aus Secret Manager.
- Cloud Run nutzt fuer PostgreSQL die angebundene Cloud-SQL-Instanz `tommys-stabssoftware:europe-west4:stabs-db`.

## 12. Naechster sinnvoller Ausbau

Die naechste Entwicklungsstufe sollte jetzt auf dem persistenten Incident-Kern aufsetzen:

1. Bearbeiten von Lagen gegen den persistenten Store gezielt nachverifizieren
2. Demo-Benutzer und Rollen aus dem In-Memory-Zustand herausloesen
3. Audit-/Historienlogik fuer Lageaenderungen aufbauen
4. Danach weitere Fachmodule auf denselben persistenten Kern setzen
