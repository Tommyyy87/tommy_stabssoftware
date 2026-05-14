# Firebase und Cloud Run Setup

Version: 1.2  
Stand: 2026-05-14  
Status: Einrichtungs- und Betriebsleitfaden  
Bezug:

- [Technologievorschlag-Stabsunterstuetzungssoftware](./Technologievorschlag-Stabsunterstuetzungssoftware.md)
- [Pflichtenheft-Stabsunterstuetzungssoftware](./Pflichtenheft-Stabsunterstuetzungssoftware.md)
- [Umsetzungsplan-Stabsunterstuetzungssoftware](./Umsetzungsplan-Stabsunterstuetzungssoftware.md)

## 1. Zielbild

Fuer dieses Projekt gilt als Zielbetrieb:

- `Frontend`: Firebase App Hosting
- `Backend`: Google Cloud Run
- `Repo-Root`: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- `Web-App-Source`: `stabs-app/apps/web`
- `Web-App-Deploy-Root`: `stabs-app/firebase-web`
- `API-Root`: `stabs-app/apps/api`

## 2. Betriebsprinzip

Die Verbindung wird in der ersten sauberen Ausbaustufe so aufgebaut:

1. Die eigentliche Web-Entwicklung liegt unter `apps/web`.
2. Firebase App Hosting deployed aus dem stabilen Deploy-Ordner `firebase-web`.
3. NestJS-Backend wird als eigener Service aus `apps/api` auf Cloud Run deployed.
4. Das Frontend spricht die API ueber eine eigene URL an, zum Beispiel:
   - Frontend: `https://<frontend-domain>`
   - API: `https://<api-service>-<hash>.<region>.run.app`

Spaeter kann optional eine gemeinsame oeffentliche Domain mit Routingregeln eingefuehrt werden.

## 3. Aktueller Projektstand

Im Repo ist bereits vorbereitet:

- Monorepo unter `stabs-app`
- Next.js-Frontend-Quellstand unter `apps/web`
- Firebase-App-Hosting-Deploy-Ordner unter `firebase-web`
- NestJS-Backend unter `apps/api`
- Startdokumentation unter `stabs-app/README.md`

### Produktiver Stand am 2026-05-14

- Firebase App Hosting ist live auf:
  - `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Cloud Run API ist live auf:
  - `https://stabs-api-1059988621010.europe-west4.run.app`
- Health-Check:
  - `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Demo-Zugang:
  - Benutzer `admin`
  - Passwort `demo`

## 4. Was du in Firebase und Google Cloud einrichten musst

### Schritt 1: Firebase-Projekt anlegen

1. Gehe in die Firebase Console.
2. Erstelle ein neues Projekt oder waehle ein bestehendes.
3. Aktiviere den `Blaze`-Plan, weil App Hosting darauf aufbaut.

### Schritt 2: Google-Cloud-Projekt pruefen

Das Firebase-Projekt ist gleichzeitig ein Google-Cloud-Projekt. In der Google Cloud Console pruefst du:

1. `Billing` ist aktiv.
2. Die benoetigte Region ist festgelegt, zum Beispiel `europe-west3` oder `europe-west1`.
3. Diese APIs sollten verfuegbar sein:
   - Cloud Run
   - Cloud Build
   - Artifact Registry
   - Secret Manager

### Schritt 3: GitHub-Repository bereitstellen

Firebase App Hosting arbeitet laut empfohlenem Setup mit GitHub-Verbindung.

Du brauchst also:

1. ein Git-Repository fuer `stabs-app`
2. dieses Repository auf GitHub gepusht
3. einen Branch, der fuer Live-Rollouts verwendet wird, zum Beispiel `main`

### Schritt 4: Firebase App Hosting fuer das Frontend anlegen

In Firebase:

1. Oeffne `App Hosting`.
2. Waehle `Get started` oder `Create backend`.
3. Verbinde dein GitHub-Konto.
4. Waehle das Repository aus, das `stabs-app` enthaelt.
5. Setze den `Root directory` fuer das Frontend auf:

`stabs-app/firebase-web`

6. Waehle den Live-Branch, zum Beispiel:

`main`

7. Waehle die Zielregion.
8. Lege den Backend-Namen fuer App Hosting fest.
9. Erstelle dabei auch die zugehoerige Firebase Web App, falls noch nicht vorhanden.

### Schritt 5: Cloud Run fuer die API vorbereiten

Das Backend wird getrennt von Firebase App Hosting betrieben.

Du brauchst dafuer:

1. einen Cloud-Run-Service-Namen, zum Beispiel:
   - `stabs-api`
2. eine Zielregion, moeglichst dieselbe wie beim Frontend
3. einen Build-/Deploy-Weg fuer `apps/api`

### Schritt 6: Umgebungsvariablen planen

Schon jetzt solltest du diese Trennung vorsehen:

- Frontend:
  - `NEXT_PUBLIC_API_BASE_URL`
- Backend:
  - Datenbank-URL
  - Auth-/Session-Konfiguration
  - spaeter Secret-Parameter

## 5. Was du lokal bzw. im Repo vorbereiten solltest

### Fuer App Hosting

Der relevante Deploy-Ordner ist:

`stabs-app/firebase-web`

Hier wird die produktive `apphosting.yaml` gepflegt.

Fuer dieses konkrete Repo gilt nach dem ersten erfolgreichen Build-Durchlauf zusaetzlich:

- `stabs-app/firebase-web/package-lock.json` muss vorhanden sein
- `firebase-web/next.config.ts` muss `output: "standalone"` enthalten
- `firebase-web/package.json` muss `next` auf `15.2.9` fest pinnen
- `firebase-web/package.json` muss `styled-jsx` explizit als Dependency enthalten
- `firebase-web/apphosting.yaml` muss die echte Cloud-Run-URL als `NEXT_PUBLIC_API_BASE_URL` enthalten

### Fuer Cloud Run

Der relevante API-Ordner ist:

`stabs-app/apps/api`

Hier sollte die API produktiv build- und startfaehig sein.

Zusatz fuer dieses Repo:

- `apps/api/package-lock.json` ist vorhanden
- `apps/api/Dockerfile` baut mit `npm ci`
- `apps/api/scripts/deploy-cloud-run.ps1` enthaelt den lokale CLI-Deploy-Weg

## 6. Empfohlene Einfuehrungsreihenfolge

1. Firebase-Projekt und Billing aktivieren
2. GitHub-Repository bereitstellen
3. Firebase App Hosting fuer `firebase-web` verbinden
4. Cloud Run fuer `apps/api` deployen
5. API-URL ermitteln
6. `NEXT_PUBLIC_API_BASE_URL` im Frontend setzen
7. Frontend neu ausrollen
8. Verbindung testen

## 7. Technische Zielkonfiguration fuer dieses Repo

### Frontend

- Plattform: Firebase App Hosting
- Root: `stabs-app/firebase-web`
- Buildquelle: GitHub-Repository

### Backend

- Plattform: Cloud Run
- Source Root: `stabs-app/apps/api`

## 8. Erster Verbindungscheck

Wenn alles verbunden ist, pruefst du:

1. Frontend-URL oeffnet sich
2. API-URL antwortet mit `/api/health`
3. Frontend kennt die API-Basis-URL
4. Frontend zeigt im Live-Bereich den Backend-Status und die erste Lage
5. Browser-Konsole zeigt keine CORS- oder Netzwerkfehler

## 8a. Erkenntnisse aus dem ersten Firebase-Rollout

Beim ersten realen App-Hosting-Rollout sind bereits mehrere typische Stolperstellen dieses Monorepo-Setups sichtbar geworden:

### Stolperstelle 1: Missing Lock File

Firebase App Hosting erwartet im konfigurierten Frontend-Root einen Lockfile.

Fuer dieses Repo bedeutet das:

- `stabs-app/apps/web/package-lock.json` ist Pflicht

### Stolperstelle 2: Root- und Frontend-Lockfile muessen zusammenpassen

Da Firebase das Projekt im Monorepo-Kontext verarbeitet, reicht ein einzelner Frontend-Lockfile nicht aus. Der Root-Lockfile muss ebenfalls mit dem Frontend-Workspace synchron sein.

### Stolperstelle 3: Next.js-Kompatibilitaet

Der anfängliche Stand mit `Next.js 16` war fuer Firebase App Hosting in diesem Setup nicht belastbar. Der Frontend-Stand wurde deshalb auf `Next.js 15.2.9` umgestellt.

### Stolperstelle 4: Standalone-Output ist erforderlich

Firebase startet das Next-Frontend mit einem Standalone-Server. Deshalb muss `output: "standalone"` aktiv sein.

### Stolperstelle 5: Fehlende Runtime-Abhaengigkeit im Standalone-Bundle

Der isolierte Standalone-Start scheiterte zunaechst an:

- `Cannot find module 'styled-jsx/package.json'`

Die Frontend-Dependency `styled-jsx` wurde daraufhin explizit hinzugefuegt.

### Fazit

Fuer dieses Repo gilt damit praktisch:

1. App Hosting nicht direkt aus `apps/web` deployen
2. Stattdessen den entkoppelten Deploy-Ordner `firebase-web` verwenden
3. `Next.js 15.2.9` beibehalten, bis spaeter ein bewusst getesteter Plattformwechsel erfolgt
4. `output: "standalone"` nicht entfernen
5. `styled-jsx` nicht aus den Frontend-Dependencies entfernen
6. API als eigenen Cloud-Run-Service getrennt betreiben

## 9. Spaetere Ausbaustufe

Spaeter moeglich:

- gemeinsame Domain
- Routing ueber Firebase Hosting / Rewrite
- Secret Manager statt einfacher Umgebungsvariablen
- Managed PostgreSQL-Anbindung

## 10. Aenderungsprotokoll

### Version 1.0 - 2026-05-14

- Erstfassung des Firebase-/Cloud-Run-Einrichtungsleitfadens erstellt.

### Version 1.1 - 2026-05-14

- Reale Rollout-Erkenntnisse zu Lockfiles, Next.js-Kompatibilitaet, Standalone-Output und `styled-jsx` dokumentiert.

### Version 1.2 - 2026-05-14

- Produktive URLs, Deploy-Root `firebase-web`, Cloud-Run-Service `stabs-api` und den aktuellen Live-Verbindungsstand dokumentiert.
