# Architektur

Stand: `2026-05-16`

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

## 4. MVP-0.1-Fundament im Live-Betrieb

Aktuell technisch umgesetzt:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/incidents`
- `POST /api/incidents`
- `PATCH /api/incidents/:incidentId`
- Frontend-Statusanzeige fuer API-Health
- Frontend-Arbeitsansicht mit Login, Incident-Liste und Incident-Anlage

## 5. Aktuelle Datenhaltung im Live-Stand

Aktueller Stand:

- Incident-Daten werden nun persistent in `PostgreSQL` auf `Cloud SQL` gehalten.
- Prisma ist als Datenzugriffsschicht im Backend eingebaut.
- Cloud Run bindet die Cloud-SQL-Instanz direkt an und injiziert die Verbindungszeichenkette aus Secret Manager.
- Der derzeit live verifizierte Pfad fuer Login und Rechte basiert noch auf dem bisherigen Demo-Stand.

## 6. Erweiterter Code-Stand noch vor Live-Ausrollung

Zum Stand `2026-05-16` ist im Repository bereits umgesetzt, aber noch als naechster Deployment-Schritt von der Live-Datenbank und Cloud-Run-Revision zu uebernehmen:

1. Incident-Audit-Historie mit eigener PostgreSQL-Tabelle
2. persistente Benutzer-, Rollen- und Session-Daten in PostgreSQL
3. Historienansicht im Frontend fuer einzelne Lagen

## 7. Kernbausteine des erweiterten Code-Stands

- `POST /api/auth/login`
  - authentifiziert gegen persistente Benutzer in PostgreSQL
- `GET /api/auth/me`
  - loest persistente Sessions und Rollenrechte auf
- `GET /api/incidents`
  - liefert die persistente Lageuebersicht
- `POST /api/incidents`
  - legt Lagen an und schreibt automatisch Audit-Eintraege
- `PATCH /api/incidents/:incidentId`
  - aktualisiert Lagen und schreibt feldbezogene Audit-Eintraege
- `GET /api/incidents/:incidentId/history`
  - liefert den Verlauf einer Lage inklusive Actor, Zeitpunkt und Feldaenderungen

## 8. Unmittelbar erforderliche naechste Schritte

Bevor weitere Fachmodule aufgesetzt werden, sind jetzt diese Schritte erforderlich:

1. neue Prisma-Migration fuer `User`, `Role`, `UserRole`, `AuthSession` und `IncidentAuditEntry` gegen Cloud SQL ausrollen
2. Backend als neue Cloud-Run-Revision mit dem erweiterten Prisma-Schema deployen
3. Frontend-Deploy nachziehen, damit die Historienansicht im Live-System sichtbar wird
4. Login, Session-Aufloesung, Incident-Anlage, Incident-Bearbeitung und `GET /api/incidents/:incidentId/history` gegen den Live-Stand fachlich nachverifizieren

## 9. Fachlich naechste Ausbaustufe nach dem Rollout

Erst nach diesen Betriebs-Schritten ist die naechste sinnvolle Weiterentwicklung:

1. lagebezogene Mitgliedschaften und Zuordnungen auf denselben persistenten Benutzer-/Rollenkern setzen
2. weitere Fachmodule wie Nachrichten und Tagebuch direkt auf Audit-, Rollen- und Lagekern aufbauen
3. danach feinere Rechtepruefung je Lage und Fachmodul ausbauen

## 10. Sichtbarer Frontend-Start fuer das Nachrichtenmodul

Parallel zur noch ausstehenden Live-Nachverifikation des erweiterten Incident-/Auth-Kerns
wird das Nachrichtenmodul jetzt bewusst in zwei Stufen begonnen:

1. `Frontend-Arbeitsflaeche`
   - interaktive Nachrichtenzentrale in `firebase-web`
   - eingangsorientiertes List-Detail-Modell
   - lokale Mock-Arbeitslogik fuer Sichtung, Status, Zuweisung und Verlauf
2. `Backend-Anschluss`
   - spaeter eigenes Modul `messages` in API, Datenmodell und Audit
   - danach echte Persistenz, Rechtepruefung und Echtzeitereignisse

Diese Trennung ist absichtlich so gewaehlt, damit die fachliche Oberflaeche frueh
sichtbar und iterierbar wird, ohne den noch ausstehenden Live-Rollout der
Auth-/Audit-Erweiterung abzuwarten.

## 11. Nachrichtenmodul jetzt als eigener echter Systempfad

Zum Stand `2026-05-16-03` ist der Nachrichtenpfad nicht mehr nur Mock-Frontend:

- Backend:
  - neues Modul `messages`
  - eigene Store-Abstraktion analog zum Incident-Kern
  - Nachrichtentabelle plus Nachrichten-Audit-Tabelle im Prisma-Schema
  - Incident-gebundene Endpunkte fuer Liste, Anlage, Bearbeitung und Verlauf
- Frontend:
  - neue Route `/messages`
  - Login, Lageauswahl und API-gebundene Nachrichtenliste in einer eigenen Arbeitsflaeche
  - Startseite bleibt bewusst Ueberblick und Einstieg

Damit ist die Architektur jetzt klarer getrennt:

- `/` fuer Ueberblick, Betriebsstatus und Kernzugang
- `/messages` fuer konzentrierte Nachrichtenarbeit
