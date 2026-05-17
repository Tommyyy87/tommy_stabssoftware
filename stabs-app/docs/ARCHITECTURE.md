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
- incident-gebundene Message-Endpunkte fuer Liste, Anlage, Bearbeitung und Verlauf

## 5. Aktuelles Frontend-Zielbild

Der Frontend-Stand in `firebase-web` ist jetzt nicht mehr nur um einzelne
Routen herum gebaut, sondern um einen gemeinsamen Fuehrungsrahmen:

1. `/`
   - `Fuehrungsueberblick`
   - gemeinsamer Lage- und Bedienkontext
   - Einstieg in Fachbereiche und Querschnittsmodule
   - Lagepflege und Login/Logout im Workspace
2. `/s1` bis `/s6`
   - sichtbar angelegte Fachbereiche fuer:
     - `S1 Personal / Inneres`
     - `S2 Lage`
     - `S3 Einsatz`
     - `S4 Versorgung`
     - `S5 Presse / Oeffentlichkeit`
     - `S6 Information / Kommunikation`
   - aktuell als fachlich korrekt benannte Platzhalterseiten fuer den weiteren Ausbau
3. `/messages`
   - aktives Querschnittsmodul fuer Sichtung, Bewertung, Weiterleitung und Nachverfolgung
4. `/journal`
   - im UI bewusst als `Tagebuch` bezeichnet
   - aktuell strukturierter Nachweis- und Uebernahmepfad

## 6. Gemeinsamer Frontend-Rahmen

Der gemeinsame Arbeitsrahmen besteht jetzt aus:

- festem Lagekopf am oberen Rand statt linker Dauernavigation
- horizontaler Modulnavigation fuer Fuehrungsueberblick, `S1` bis `S6`,
  `Nachrichten` und `Tagebuch`
- gemeinsamem Workspace-Kontext fuer:
  - Session
  - Current User
  - Incident-Liste
  - aktive Lage
  - Backend-Status und API-Basis
- sachlich-taktischem Layoutsystem in `firebase-web/app/globals.css`

Wichtige Dateien:

- `firebase-web/app/_components/app-shell.tsx`
- `firebase-web/app/_components/app-header.tsx`
- `firebase-web/app/_components/app-nav.tsx`
- `firebase-web/app/_providers/workspace-provider.tsx`
- `firebase-web/app/_hooks/use-workspace.ts`
- `firebase-web/lib/workspace-storage.ts`

## 7. Fachliche Strukturierung

Das Frontend folgt jetzt einem `Fuehrungsrahmen + Fachbereiche +
Querschnittsmodule`-Ansatz:

- `Fuehrungsueberblick` bleibt gemeinsame Start- und Verteilerflaeche
- die `S`-Funktionen bilden die langfristige fachliche Hauptstruktur
- `Nachrichten` und `Tagebuch` sind querschnittliche Werkzeuge fuer mehrere
  Bereiche

Damit ist die App-Struktur bereits auf den spaeteren Vollausbau ausgerichtet,
ohne jetzt schon jede Fachlogik implementiert zu haben.

## 8. Aktuelle technische Leitplanken

- Firebase App Hosting deployt aus `firebase-web`
- das Frontend bleibt auf `Next.js 15.2.9`
- `styled-jsx` bleibt in den Frontend-Dependencies
- Cloud Run bezieht `DATABASE_URL` aus Secret Manager
- der Workspace-Kontext wird im Root-Layout geladen und im Client weitergefuehrt

## 9. Naechste Ausbauschritte

Die naechsten fachlich sinnvollen Schritte sind jetzt:

1. `S2 Lage` von der Platzhalterseite zur ersten echten Facharbeitsflaeche ausbauen
2. den Uebernahmepfad von `Nachrichten` in das `Tagebuch` als echte Datenuebernahme vorbereiten
3. danach weitere `S`-Bereiche schrittweise mit eigener Fachlogik fuellen
4. spaeter lagebezogene Mitgliedschaften und feinere Rollen-/Rechtepruefung anschliessen
