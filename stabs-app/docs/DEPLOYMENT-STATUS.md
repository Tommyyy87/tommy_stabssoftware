# Deployment-Status

Version: `1.4`  
Stand: `2026-05-16`  
Status: `Live-Betrieb / Referenz fuer Weiterentwicklung`

## 1. Kurzfassung

Zum Stand `2026-05-16` ist der erste echte Online-Kern live. Zusaetzlich liegt ein erweiterter, lokal verifizierter Code-Stand fuer Audit/Historie und persistente Auth vor:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Google Cloud Run
- Frontend zeigt echten Backend-Status
- Frontend erlaubt Login, Benutzerstatus und Lagearbeit
- Frontend enthaelt jetzt zusaetzlich eine eigene Route `/messages` fuer die Nachrichtenzentrale
- Incident-Daten liegen persistent in PostgreSQL ueber Cloud SQL
- Audit-/Historienlogik fuer Lagen ist im Code umgesetzt, aber noch nicht als Live-Stand nachverifiziert
- persistente Benutzer-, Rollen- und Session-Daten sind im Code umgesetzt, aber noch nicht als Live-Stand nachverifiziert
- Nachrichten-Persistenz und Message-Audit sind im Code umgesetzt, aber noch nicht als Live-Stand nachverifiziert

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

Hinweis zum Stand `2026-05-16`:

- Diese Punkte sind fuer den bereits ausgerollten Live-Kern verifiziert.
- Die neue Historienansicht und die persistente Auth-Umstellung sind bislang lokal gebaut und getestet, aber noch nicht als Live-Revision verifiziert.

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

Zusatz fuer den lokalen, noch nicht live nachverifizierten Code-Stand:

- API-Build und API-Tests fuer Auth-/Audit-Erweiterung laufen lokal erfolgreich.
- Frontend-Typecheck, Frontend-Tests und Frontend-Build fuer Historienansicht laufen lokal erfolgreich.
- Frontend-Typecheck, Frontend-Tests und Frontend-Build fuer die erste Nachrichtenzentrale laufen lokal erfolgreich.
- API-Build, API-Tests, Frontend-Typecheck, Frontend-Tests und Frontend-Build fuer den echten `messages`-Pfad laufen lokal erfolgreich.

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

### 2026-05-16

- Prisma-Schema um persistente Benutzer-, Rollen-, Session- und Audit-Tabellen erweitert.
- neue Migration `20260515094500_add_auth_and_incident_audit` angelegt.
- API um `GET /api/incidents/:incidentId/history` erweitert.
- Frontend um eine Historienansicht je Lage erweitert.
- Login- und Session-Pfad auf persistente Store-Abstraktionen umgestellt.
- lokale Verifikation fuer API und Frontend erfolgreich ausgefuehrt.

### 2026-05-16-02

- erste sichtbare Frontend-Arbeitsflaeche fuer das Nachrichtenmodul begonnen.
- eingangsorientierte Nachrichtenzentrale mit Listenbereich, Detailbereich, Such-/Statusfiltern und lokaler Erfassungslogik eingebaut.
- diese Stufe ist bewusst noch kein live verifizierter Message-Backend-Stand, sondern eine sichtbar nutzbare Frontend-Vorstufe fuer die weitere Fachiteration.

### 2026-05-16-03

- neues Backend-Modul `messages` mit Incident-Bezug, Persistenzpfad und Audit-Modell vorbereitet.
- Prisma-Schema und neue Migration fuer `Message` und `MessageAuditEntry` angelegt.
- Frontend auf eigene Modulroute `/messages` umgestellt und an echte Message-Endpunkte angebunden.
- Startseite verschlankt, damit die eigentliche Nachrichtenarbeit nicht als Single-Page-Block weiterwachsen muss.

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

## 12. Naechste erforderliche Schritte

Bevor der neue Kern als echter Betriebsstand gelten kann, sind diese Schritte erforderlich:

1. neue Prisma-Migration in Cloud SQL deployen
2. Backend als neue Cloud-Run-Revision deployen
3. Frontend-Deploy fuer Historienansicht und `/messages`-Route durchziehen
4. Login, Session, Incident-Anlage, Incident-Bearbeitung, Nachrichtenliste, Nachrichtenerfassung und Nachrichtenhistorie gegen den Live-Stand gezielt nachverifizieren

Danach ist die naechste Entwicklungsstufe:

1. lagebezogene Mitgliedschaften und feinere Rollen-/Rechtepruefung anschliessen
2. Tagebuch direkt auf demselben persistenten Incident-/Message-Kern aufbauen
3. danach weitere Fachmodule auf denselben persistenten Kern setzen

## 13. Entwicklungsstand 2026-05-15-02

- Prisma-Schema um `User`, `Role`, `UserRole`, `AuthSession` und `IncidentAuditEntry` erweitert.
- API um `GET /api/incidents/:incidentId/history` erweitert.
- Login- und Session-Aufloesung von In-Memory auf persistente Store-Abstraktionen umgestellt.
- Seed-Daten fuer erste Benutzer und Rollen in den persistenten Pfad ueberfuehrt.
- Frontend um eine Historienansicht je Lage erweitert.
- Test-Skripte fuer API und Frontend auf explizite Testdatei-Erkennung nachgeschaerft.

## 14. Operative Klarstellung

Zum Stand `2026-05-16` ist zwischen zwei Ebenen zu unterscheiden:

- `Live-Betrieb`: der bereits ausgerollte Incident-Kern mit persistenter Incident-Datenhaltung.
- `Erweiterter Code-Stand`: Audit/Historie und persistente Auth sind im Repository umgesetzt und lokal verifiziert, aber noch nicht als neuer Live-Stand in Cloud SQL, Cloud Run und Firebase App Hosting nachgezogen.
