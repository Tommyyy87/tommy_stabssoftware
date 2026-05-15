# Architektur

Stand: `2026-05-15`

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
- Datenhaltung:
  - PostgreSQL auf Cloud SQL
- Verbindung:
  - Frontend ruft das Backend ueber `NEXT_PUBLIC_API_BASE_URL` auf
  - Backend liest `DATABASE_URL` aus Secret Manager

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
- `PATCH /api/incidents/:incidentId`
- Frontend-Statusanzeige fuer API-Health
- Frontend-Arbeitsansicht mit Login, Incident-Liste und Incident-Anlage

## 5. Aktuelle Datenhaltung

Aktueller Stand:

- Demo-Authentifizierung und Session-Aufloesung laufen weiterhin als bewusster Startpunkt im Arbeitsspeicher.
- Incident-Daten werden nun persistent in `PostgreSQL` auf `Cloud SQL` gehalten.
- Prisma ist als Datenzugriffsschicht im Backend eingebaut.
- Cloud Run bindet die Cloud-SQL-Instanz direkt an und injiziert die Verbindungszeichenkette aus Secret Manager.

## 6. Naechste Architektur-Stufe

Die naechste sinnvolle Weiterentwicklung ist:

1. Demo-Authentifizierung und Rollenmodell aus dem In-Memory-Zustand herausloesen
2. Audit-/Historienmodell fuer Incident-Aenderungen aufbauen
3. Danach weitere Fachansichten auf denselben persistenten Kern setzen
