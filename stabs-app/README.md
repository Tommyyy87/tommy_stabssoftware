# Stabs-App

Monorepo-Grundgeruest fuer die browserbasierte Stabsunterstuetzungssoftware.

## Struktur

- `apps/web`: Next.js-Frontend
- `apps/api`: NestJS-Backend
- `packages/types`: gemeinsame Typdefinitionen
- `packages/ui`: gemeinsame UI-Bausteine
- `packages/config`: gemeinsame Konfigurationen
- `infra/docker`: Infrastrukturgrundlagen
- `docs`: technische Projektdokumentation

## Zielstand dieser Initialfassung

Diese Fassung schafft das Fundament fuer `MVP 0.1`:

- Monorepo-Struktur
- getrennte Web- und API-App
- gemeinsame TypeScript-Basis
- vorbereitete Infrastrukturordner

## Lokaler Hinweis

Die Projektmetadaten zielen auf `Node.js 24 LTS`. Auf der aktuellen Maschine war beim Anlegen des Geruests `Node.js 20.17.0` vorhanden. Vor der ersten echten Installation und Laufzeitpruefung sollte deshalb auf `Node.js 24 LTS` gewechselt werden.

## Naechste Schritte

1. Abhaengigkeiten installieren
2. Web- und API-Basis lauffaehig machen
3. Auth-, Rollen- und Lagekern implementieren
4. Datenbank und Prisma anbinden

## MVP-0.1-Stand

Aktuell enthalten:

- Next.js-Frontend als Projektoberflaeche
- NestJS-API mit `health`, `auth` und `incidents`
- Demo-Login mit Seed-Nutzern
- erste Rollen-/Berechtigungsgrundlage
- erste Lageverwaltung als In-Memory-Startpunkt

### Demo-Zugang

- Benutzer: `admin`
- Passwort: `demo`

## Verifikation

Reproduzierbarer Foundation-Check:

- `npm run verify:foundation`

Geprueft werden:

- Demo-Login
- Sitzungs- und Rechteauflösung
- erste Lageendpunkte
