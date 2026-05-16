# Stabs-App

Monorepo fuer die browserbasierte Stabsunterstuetzungssoftware mit:

- Frontend auf Firebase App Hosting
- API auf Cloud Run
- PostgreSQL auf Cloud SQL
- produktionsnahem Web-Deploy-Pfad ueber `firebase-web`

## Struktur

- `apps/web`: urspruenglicher Frontend-Quellstand
- `apps/api`: NestJS-Backend
- `firebase-web`: eigenstaendiger Firebase-App-Hosting-Deploy-Ordner
- `packages/types`: gemeinsame Typdefinitionen
- `packages/ui`: gemeinsame UI-Bausteine
- `packages/config`: gemeinsame Konfigurationen
- `infra/docker`: Infrastrukturgrundlagen
- `docs`: technische Projektdokumentation

## Aktueller Gesamtstand

Stand dieses Repositories: `2026-05-16`, Commit `167b711`

Es gibt aktuell zwei relevante Ebenen:

1. `Live-Betrieb`
- Frontend live ueber Firebase App Hosting
- Backend live ueber Cloud Run
- persistente Incident-Datenhaltung in PostgreSQL
- sichtbare Startseite mit API-Status und Incident-Arbeitsansicht

2. `lokal verifizierter erweiterter Code-Stand`
- persistente Auth mit Rollen und Sessions
- Incident-Historie
- neues `messages`-Modul im Backend
- eigene Frontend-Route `/messages` fuer die Nachrichtenzentrale

Wichtig: Der zweite Stand ist im Code umgesetzt und lokal verifiziert, aber
noch nicht als neuer Live-Betriebsstand ausgerollt.

## Live-Adressen

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Incidents: `https://stabs-api-1059988621010.europe-west4.run.app/api/incidents`

## Fachliche Modulrouten im Code-Stand

- `/`: Ueberblick, Betriebsstatus, Incident-Kernzugang
- `/messages`: eigenstaendige Nachrichtenzentrale fuer Listen-, Detail- und Bearbeitungsarbeit

## Zugriffe

- Demo-Benutzer: `admin`
- Demo-Passwort: `demo`
- Firebase-Projekt: `tommys-stabssoftware`
- Cloud-Run-Service API: `stabs-api`
- App-Hosting-Backend: `stabsbackend`

## Lokale Verifikation

### API

Arbeitsverzeichnis: `stabs-app/apps/api`

- `npm run prisma:generate`
- `npm run build`
- `npm test`

### Frontend

Arbeitsverzeichnis: `stabs-app/firebase-web`

- `npm test`
- `npm run typecheck`
- `npm run build`

## Offene Betriebs-Schritte

Bevor der neue Nachrichtenpfad als echter Online-Stand gilt, muessen noch erfolgen:

1. Prisma-Migrationen nach Cloud SQL deployen
2. Backend als neue Cloud-Run-Revision deployen
3. Frontend mit `/messages` neu deployen
4. Live-Nachverifikation fuer:
   - Login
   - Incident-Historie
   - Nachrichtenliste
   - Nachrichtenerfassung
   - Status-/Zuweisungsaenderung
   - Nachrichtenverlauf

## Technische Hinweise

- Zielruntime ist `Node.js 24 LTS`
- das produktionsnahe Frontend deployt aus `firebase-web`, nicht aus `apps/web`
- `Next.js 15.2.9`, `output: "standalone"` und `styled-jsx` sind fuer den aktuellen Deploy-Pfad beizubehalten

## Weiterfuehrende Doku

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [DEPLOYMENT-STATUS.md](./docs/DEPLOYMENT-STATUS.md)
- [Umsetzungsplan-Stabsunterstuetzungssoftware](../Umsetzungsplan-Stabsunterstuetzungssoftware.md)
