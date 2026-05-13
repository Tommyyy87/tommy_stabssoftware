# Architektur

Dieses Verzeichnis ist fuer technische Projektdokumentation innerhalb des Repos vorgesehen.

## Startstand

- Monorepo mit `apps/web` und `apps/api`
- gemeinsame Pakete fuer Typen, UI und Konfiguration
- Docker-Grundlage fuer PostgreSQL
- vorbereitet fuer `MVP 0.1`

## MVP-0.1-Fundament

Aktuell technisch umgesetzt:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/incidents`
- `POST /api/incidents`

Hinweis:

- Auth und Lageverwaltung laufen aktuell bewusst als In-Memory-Startpunkt.
- Prisma und PostgreSQL sind als naechster Schritt vorgesehen.
