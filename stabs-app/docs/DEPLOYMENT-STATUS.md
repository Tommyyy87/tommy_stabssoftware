# Deployment-Status

Version: `1.1`  
Stand: `2026-05-14`  
Status: `Live-Betrieb / Referenz fuer Weiterentwicklung`

## 1. Kurzfassung

Zum Stand `2026-05-14` ist das Grundsystem online und technisch verbunden:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Google Cloud Run
- Frontend zeigt echten Backend-Status
- Frontend zeigt die erste Lage aus der API

Damit ist das Projekt nicht mehr nur ein lokales Grundgeruest, sondern ein online erreichbarer erster Systemkern.

## 2. Live-Systeme

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Incidents: `https://stabs-api-1059988621010.europe-west4.run.app/api/incidents`

## 3. Projektzuordnung

- Firebase-Projekt: `tommys-stabssoftware`
- Firebase App-Hosting-Backend: `stabsbackend`
- Cloud-Run-Service: `stabs-api`
- Region Frontend/Backend: `europe-west4`
- GitHub-Repository: `https://github.com/Tommyyy87/tommy_stabssoftware`
- Live-Branch: `main`

## 4. Repo-Pfade

- Repo-Root: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- Frontend-Quellstand: `stabs-app/apps/web`
- Frontend-Deploy-Ordner: `stabs-app/firebase-web`
- Backend: `stabs-app/apps/api`
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
- Im Bereich `Erste Lage aus dem Backend` erscheint mindestens:
  - `Pilotlage Waldbrand`
  - `WB-2026-001`

## 7. Relevante Deploy-Dateien

- Frontend-Deploy-Konfiguration: `firebase-web/apphosting.yaml`
- Frontend-Startseite mit Live-Anzeige: `firebase-web/app/page.tsx`
- Frontend-API-Helfer: `firebase-web/lib/api.ts`
- Backend-Containerbuild: `apps/api/Dockerfile`
- Lokaler Cloud-Run-Deploy-Weg: `apps/api/scripts/deploy-cloud-run.ps1`

## 8. Verifizierter Ist-Stand

Zum letzten verifizierten Stand gilt:

- `GET /api/health` liefert:
  - `{"service":"stabs-api","status":"ok","stage":"mvp-0.1-foundation"}`
- `GET /api/incidents` liefert mindestens eine Lage:
  - `incident-001`
  - `Pilotlage Waldbrand`
  - `WB-2026-001`
- Das Frontend rendert diese Daten sichtbar in der Oberflaeche.

## 9. Zeitlinie

### 2026-05-14 ca. 00:45 bis 01:09

- Mehrere Firebase-App-Hosting-Rollouts schlagen fehl.
- Hauptfehler:
  - `Cannot find module 'styled-jsx/package.json'`
- Folge:
  - App Hosting konnte den Standalone-Next-Server nicht starten.

### 2026-05-14 ca. 20:04

- Root-Lockfile-Fix fuer `styled-jsx` auf `main` gepusht.
- Commit:
  - `b689807`

### 2026-05-14 ca. 20:09 bis 20:10

- Eigenstaendiger Frontend-Deploy-Ordner `firebase-web` eingefuehrt.
- Commit:
  - `f0632c3`

### 2026-05-14 ca. 20:28 bis 20:29 UTC

- API-Image erfolgreich in Cloud Build gebaut.
- Build-ID:
  - `870ada04-2393-42af-965c-8a740382961d`

### 2026-05-14 ca. 20:32 UTC

- Cloud-Run-Service `stabs-api` erfolgreich erstellt.
- Erste Lage aus In-Memory-Daten online verfuegbar.

### 2026-05-14 danach

- Frontend auf echte API-URL konfiguriert.
- Commit:
  - `8e0d03b`

### 2026-05-14 spaeter

- Live-Backend-Status und erste Lage im Frontend sichtbar gemacht.
- Commit:
  - `0ac2a0f`

## 10. Letzte relevante Commits

- `0ac2a0f` `Show live backend status in frontend`
- `8e0d03b` `Configure frontend API base URL`
- `cae9d19` `Prepare API for Cloud Run deployment`
- `f0632c3` `Add standalone Firebase App Hosting web app`
- `b689807` `Fix App Hosting lockfile for styled-jsx`

## 11. Bekannte technische Leitplanken

- Firebase App Hosting soll fuer dieses Projekt aus `firebase-web` deployen, nicht direkt aus `apps/web`.
- Das Frontend fuer Firebase App Hosting bleibt auf `Next.js 15.2.9`.
- `output: "standalone"` darf nicht entfernt werden.
- `styled-jsx` muss in den Frontend-Dependencies erhalten bleiben.
- Die Startseite ist bewusst dynamisch, damit Live-Daten nicht statisch eingefroren werden.

## 12. Nächster sinnvoller Ausbau

Die naechste Entwicklungsstufe sollte nicht mehr die Infrastruktur, sondern die erste echte Nutzfunktion priorisieren:

1. Frontend-Loginformular
2. Session-/Benutzeranzeige im Frontend
3. Incident-Liste als echte Arbeitsansicht
4. Anlegen neuer Incidents aus dem Frontend
5. Danach Persistenz statt In-Memory-Daten
