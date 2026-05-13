# Firebase und Cloud Run Setup

Version: 1.0  
Stand: 2026-05-14  
Status: Einrichtungsleitfaden  
Bezug:

- [Technologievorschlag-Stabsunterstuetzungssoftware](./Technologievorschlag-Stabsunterstuetzungssoftware.md)
- [Pflichtenheft-Stabsunterstuetzungssoftware](./Pflichtenheft-Stabsunterstuetzungssoftware.md)
- [Umsetzungsplan-Stabsunterstuetzungssoftware](./Umsetzungsplan-Stabsunterstuetzungssoftware.md)

## 1. Zielbild

Fuer dieses Projekt gilt als Zielbetrieb:

- `Frontend`: Firebase App Hosting
- `Backend`: Google Cloud Run
- `Repo-Root`: `D:\Dropbox\dev\Stabsarbeit\stabs-app`
- `Web-App-Root`: `stabs-app/apps/web`
- `API-Root`: `stabs-app/apps/api`

## 2. Betriebsprinzip

Die Verbindung wird in der ersten sauberen Ausbaustufe so aufgebaut:

1. Next.js-Frontend wird aus `apps/web` auf Firebase App Hosting deployed.
2. NestJS-Backend wird als eigener Service aus `apps/api` auf Cloud Run deployed.
3. Das Frontend spricht die API ueber eine eigene URL an, zum Beispiel:
   - Frontend: `https://<frontend-domain>`
   - API: `https://<api-service>-<hash>.<region>.run.app`

Spaeter kann optional eine gemeinsame oeffentliche Domain mit Routingregeln eingefuehrt werden.

## 3. Aktueller Projektstand

Im Repo ist bereits vorbereitet:

- Monorepo unter `stabs-app`
- Next.js-Frontend unter `apps/web`
- NestJS-Backend unter `apps/api`
- Startdokumentation unter `stabs-app/README.md`

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

`stabs-app/apps/web`

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

Der relevante App-Ordner ist:

`stabs-app/apps/web`

Hier kann optional eine `apphosting.yaml` gepflegt werden.

### Fuer Cloud Run

Der relevante API-Ordner ist:

`stabs-app/apps/api`

Hier sollte die API produktiv build- und startfaehig sein.

## 6. Empfohlene Einfuehrungsreihenfolge

1. Firebase-Projekt und Billing aktivieren
2. GitHub-Repository bereitstellen
3. Firebase App Hosting fuer `apps/web` verbinden
4. Cloud Run fuer `apps/api` deployen
5. API-URL ermitteln
6. `NEXT_PUBLIC_API_BASE_URL` im Frontend setzen
7. Frontend neu ausrollen
8. Verbindung testen

## 7. Technische Zielkonfiguration fuer dieses Repo

### Frontend

- Plattform: Firebase App Hosting
- Root: `stabs-app/apps/web`
- Buildquelle: GitHub-Repository

### Backend

- Plattform: Cloud Run
- Source Root: `stabs-app/apps/api`

## 8. Erster Verbindungscheck

Wenn alles verbunden ist, pruefst du:

1. Frontend-URL oeffnet sich
2. API-URL antwortet mit `/api/health`
3. Frontend kennt die API-Basis-URL
4. Browser-Konsole zeigt keine CORS- oder Netzwerkfehler

## 9. Spaetere Ausbaustufe

Spaeter moeglich:

- gemeinsame Domain
- Routing ueber Firebase Hosting / Rewrite
- Secret Manager statt einfacher Umgebungsvariablen
- Managed PostgreSQL-Anbindung

## 10. Aenderungsprotokoll

### Version 1.0 - 2026-05-14

- Erstfassung des Firebase-/Cloud-Run-Einrichtungsleitfadens erstellt.
