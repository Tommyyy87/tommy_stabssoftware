# Stabs-App

Monorepo fuer die browserbasierte Stabsunterstuetzungssoftware mit:

- Frontend auf Firebase App Hosting
- API auf Cloud Run
- PostgreSQL auf Cloud SQL
- produktionsnahem Web-Deploy-Pfad ueber `firebase-web`

## Struktur

- `apps/web`: urspruenglicher Frontend-Quellstand
- `apps/api`: NestJS-Backend
- `firebase-web`: stabilisierter Frontend-Deploy-Ordner
- `packages/*`: gemeinsame Typen, UI und Konfiguration
- `docs`: Architektur- und Betriebsdoku

## Aktueller Stand

Stand: `2026-05-17`

Der aktuelle Sprint-1-Frontendstand umfasst:

1. gemeinsame App-Shell mit linker Navigation
2. Lageuebersicht auf `/`
3. gefuehrten Nachrichtenworkflow auf `/messages`
4. integrierten Journal-Einstieg auf `/journal`
5. Onboarding-Pfad fuer neue Nutzer auf der Startseite

## Live-Adressen

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Incidents: `https://stabs-api-1059988621010.europe-west4.run.app/api/incidents`

## Modulrouten

- `/`: Lageuebersicht, Backend-Status, Einstieg, Lagepflege
- `/messages`: Sichtung, Filterung, Detailansicht, Bearbeitung, Composer
- `/journal`: schlanker Journalpfad im selben Arbeitsrahmen

## Zugriffe

- Demo-Benutzer: `admin`
- Demo-Passwort: `demo`
- Firebase-Projekt: `tommys-stabssoftware`
- App-Hosting-Backend: `stabsbackend`
- Cloud-Run-Service API: `stabs-api`

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

## Technische Hinweise

- Zielruntime ist `Node.js 24 LTS`
- das produktionsnahe Frontend deployt aus `firebase-web`, nicht aus `apps/web`
- `Next.js 15.2.9`, `output: "standalone"` und `styled-jsx` bleiben Teil des Deploy-Pfads

## Weiterfuehrende Doku

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [DEPLOYMENT-STATUS.md](./docs/DEPLOYMENT-STATUS.md)
- [NEXT-CHAT-HANDOFF.md](./docs/NEXT-CHAT-HANDOFF.md)
