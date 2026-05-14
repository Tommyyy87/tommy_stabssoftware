# Architektur

Stand: `2026-05-14`

## 1. Aktuelle Zielarchitektur im Betrieb

Das System ist aktuell in drei klar getrennte technische Bereiche aufgeteilt:

- `apps/web`
  - urspruenglicher Frontend-Quellstand
- `firebase-web`
  - stabiler Frontend-Deploy-Ordner fuer Firebase App Hosting
- `apps/api`
  - NestJS-Backend fuer Cloud Run

## 2. Laufender Online-Betrieb

- Frontend:
  - Firebase App Hosting
- Backend:
  - Google Cloud Run
- Verbindung:
  - Frontend ruft das Backend ueber `NEXT_PUBLIC_API_BASE_URL` auf

## 3. Warum `firebase-web` zusaetzlich existiert

Im ersten echten App-Hosting-Rollout hat sich gezeigt:

- Das Monorepo-Layout mit `apps/web` allein war fuer Firebase App Hosting in diesem Projekt nicht stabil genug.
- Deshalb wurde ein entkoppelter Frontend-Deploy-Ordner eingefuehrt.

Das heisst fachlich:

- entwickelt wird weiter im eigentlichen Projektkontext
- deployt wird ueber einen bewusst stabilisierten Web-Ordner

## 4. MVP-0.1-Fundament

Aktuell technisch umgesetzt:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/incidents`
- `POST /api/incidents`
- Frontend-Statusanzeige fuer API-Health
- Frontend-Anzeige der ersten Lage aus dem Backend

## 5. Aktuelle Datenhaltung

Hinweis:

- Auth und Lageverwaltung laufen aktuell bewusst als In-Memory-Startpunkt.
- Es gibt noch keine produktive Datenbankanbindung.
- Ein Neustart des Backends setzt den aktuellen Demo-Datenstand zurueck.

## 6. Nächste Architektur-Stufe

Die naechste sinnvolle Weiterentwicklung ist:

1. Session-/Login-Fluss im Frontend
2. Persistente Datenhaltung mit PostgreSQL und Prisma
3. Danach schrittweise Ausbau der Fachansichten statt nur Status-/Demo-Anzeige
