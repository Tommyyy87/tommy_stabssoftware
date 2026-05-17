# Architektur

Stand: `2026-05-17`

## 1. Systemaufteilung

Das System ist in drei klar getrennte technische Bereiche aufgeteilt:

- `apps/web`
  - urspruenglicher Frontend-Quellstand
- `firebase-web`
  - stabiler Frontend-Deploy-Ordner fuer Firebase App Hosting
- `apps/api`
  - NestJS-Backend fuer Cloud Run

## 2. Laufender Betrieb

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

Das Monorepo-Layout mit `apps/web` allein war fuer Firebase App Hosting in
diesem Projekt nicht stabil genug. Deshalb wurde ein entkoppelter
Frontend-Deploy-Ordner eingefuehrt.

Das heisst fachlich:

- entwickelt wird weiter im Projektkontext
- deployt wird ueber den bewusst stabilisierten Web-Ordner `firebase-web`

## 4. Backend-Kern

Im Backend sind aktuell als tragender Kern vorhanden:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/incidents`
- `POST /api/incidents`
- `PATCH /api/incidents/:incidentId`
- `GET /api/incidents/:incidentId/history`
- Incident-gebundene Message-Endpunkte fuer Liste, Anlage, Bearbeitung und Verlauf

## 5. Frontend-Zielbild Sprint 1

Der Frontend-Stand in `firebase-web` ist jetzt fachlich so getrennt:

1. `/`
   - Lageuebersicht
   - Backend-Status
   - Einstieg und Onboarding
   - Lagepflege
2. `/messages`
   - sichtbarer Workflow fuer Sichtung, Bewertung, Weiterleitung und Nachweis
   - zerlegte Komponenten fuer Header, Filter, Liste, Detail, Aktionen und Composer
3. `/journal`
   - schlanker Journalpfad
   - Anschluss fuer spaetere Uebernahme und Nachweisverdichtung

## 6. Gemeinsamer Frontend-Rahmen

Sprint 1 fuehrt einen gemeinsamen Arbeitsrahmen ein:

- linke Hauptnavigation
- gemeinsamer Kopf- und Inhaltsrahmen
- Workspace-Grundgeruest fuer Session- und Lagekontext
- konsistente Modulrouten statt einzelner voneinander isolierter Seiten

## 7. Aktuelle technische Leitplanken

- Firebase App Hosting deployt aus `firebase-web`
- das Frontend bleibt auf `Next.js 15.2.9`
- `output: "standalone"` bleibt erhalten
- `styled-jsx` bleibt in den Frontend-Dependencies
- Cloud Run bezieht `DATABASE_URL` aus Secret Manager

## 8. Naechste Ausbauschritte

Die naechsten fachlich sinnvollen Schritte sind:

1. globalen Workspace-Kontext wirklich in `/` und `/messages` verdrahten
2. `journal` von der Einstiegsroute auf echte Datenuebernahme ausbauen
3. lagebezogene Mitgliedschaften und feinere Rollen-/Rechtepruefung anschliessen
4. weitere Fachmodule auf denselben persistenten Kern setzen
