# Stabs-App

Monorepo fuer die browserbasierte Stabsunterstuetzungssoftware mit laufendem Frontend auf Firebase App Hosting und laufender API auf Cloud Run.

## Struktur

- `apps/web`: Next.js-Frontend
- `apps/api`: NestJS-Backend
- `firebase-web`: eigenstaendiger Firebase-App-Hosting-Deploy-Ordner
- `packages/types`: gemeinsame Typdefinitionen
- `packages/ui`: gemeinsame UI-Bausteine
- `packages/config`: gemeinsame Konfigurationen
- `infra/docker`: Infrastrukturgrundlagen
- `docs`: technische Projektdokumentation

## Aktueller Betriebsstand

Der aktuelle Online-Stand fuer `MVP 0.1` ist:

- Frontend live ueber Firebase App Hosting
- Backend live ueber Cloud Run
- Frontend kennt die echte API-URL
- Health-Check und erste Incident-Liste koennen im Frontend sichtbar gemacht werden

### Live-Adressen

- Frontend: `https://stabsbackend--tommys-stabssoftware.europe-west4.hosted.app/`
- Backend Health: `https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Backend Basis: `https://stabs-api-1059988621010.europe-west4.run.app`

## Lokaler Hinweis

Die Projektmetadaten zielen auf `Node.js 24 LTS`. Auf der aktuellen Maschine war beim Anlegen des Geruests `Node.js 20.17.0` vorhanden. Vor der ersten echten Installation und Laufzeitpruefung sollte deshalb auf `Node.js 24 LTS` gewechselt werden.

## Zugriffe

- Demo-Benutzer: `admin`
- Demo-Passwort: `demo`
- Firebase-Projekt: `tommys-stabssoftware`
- Cloud-Run-Service API: `stabs-api`
- App-Hosting-Backend: `stabsbackend`

## Naechste Schritte

1. Frontend um echte Login- und Lageansichten erweitern
2. Auth-Status im Frontend speichern und nutzen
3. Schreibende Aktionen fuer Lagen aus der Oberflaeche anbinden
4. Datenbank statt In-Memory-Daten anbinden

## MVP-0.1-Stand

Aktuell enthalten:

- Next.js-Frontend als Projektoberflaeche
- NestJS-API mit `health`, `auth` und `incidents`
- Demo-Login mit Seed-Nutzern
- erste Rollen-/Berechtigungsgrundlage
- erste Lageverwaltung als In-Memory-Startpunkt

## Verifikation

Reproduzierbarer Foundation-Check:

- `npm run verify:foundation`
- `curl https://stabs-api-1059988621010.europe-west4.run.app/api/health`
- Frontend im Browser oeffnen und Live-Verbindungsbereich pruefen

Geprueft werden:

- Demo-Login
- Sitzungs- und Rechteauflösung
- erste Lageendpunkte
