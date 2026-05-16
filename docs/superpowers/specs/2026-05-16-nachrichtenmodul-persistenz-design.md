# Nachrichtenmodul Persistenz Design

Datum: `2026-05-16`
Status: freigegeben fuer Umsetzung

## Ziel

Die bisherige sichtbare Nachrichtenzentrale wird aus dem Mock-Zustand in einen
echten Modulpfad ueberfuehrt. Nachrichten werden persistent pro Lage gespeichert,
ueber API-Endpunkte bearbeitet und im Frontend ueber eine eigene Route
`/messages` bereitgestellt.

## Neue Leitentscheidung zur Seitenstruktur

Die Anwendung wird fuer den weiteren Fachausbau nicht als lange Single-Page
fortgesetzt. Die Startseite bleibt ein kompakter Ueberblick und Einstieg.
Fachmodule mit hoher Informationsdichte erhalten eigene Seiten.

Fuer das Nachrichtenmodul bedeutet das:

- eigene Route `messages`
- eigenstaendige Arbeitsflaeche fuer Listen- und Detailbearbeitung
- Startseite nur noch mit Einstieg und Verweis auf das Modul

## Backend-Zielbild

Das Backend erhaelt ein neues Modul `messages` mit:

- Prisma-Datenmodell fuer Nachrichten
- Store-Abstraktion analog zum Incident-Kern
- Endpunkten pro Lage
- serverseitiger Validierung
- Rechtepruefung ueber den bestehenden Auth-Kern
- Verlaufsausgabe ueber message-bezogene Audit-Ereignisse

## Persistentes Datenmodell

Die erste produktive Ausbaustufe bildet nur den benoetigten Kern ab:

- `id`
- `incidentId`
- `trackingNumber`
- `direction`
- `channel`
- `priority`
- `status`
- `messageTime`
- `recordedAt`
- `senderLabel`
- `recipientLabel`
- `subject`
- `body`
- `assignee`
- `distribution`
- `notes`
- `createdAt`
- `createdByUserId`
- `updatedAt`
- `updatedByUserId`

Zusaetzlich:

- `MessageAuditEntry` fuer Status-, Zuweisungs- und Feldveraenderungen

## API-Schnitt

Minimal erforderliche Endpunkte:

- `GET /api/incidents/:incidentId/messages`
- `POST /api/incidents/:incidentId/messages`
- `PATCH /api/incidents/:incidentId/messages/:messageId`
- `GET /api/incidents/:incidentId/messages/:messageId/history`

Die API liefert bewusst keinen Vollbaukasten, sondern nur das, was die aktuelle
Nachrichtenzentrale tatsaechlich braucht.

## Frontend-Zielbild

Das Frontend wird in drei Schichten getrennt:

1. `Startseite`
   - kompakter Projekt- und Modulueberblick
2. `Nachrichtenroute`
   - echte Arbeitsflaeche mit Listen- und Detailansicht
3. `API-Client`
   - echte Lade-, Create-, Update- und Verlaufspfade

## UX-Fokus

- kein weiteres Aufblasen der Startseite
- Nachrichtenzentrale bleibt list-detail-orientiert
- Tablet und Desktop erhalten dieselbe Logik, aber unterschiedliche Layoutbreiten
- Scannen unter Druck bleibt wichtiger als Formularvollstaendigkeit

## Umsetzungsreihenfolge

1. Backend-Modell und Tests
2. API-Endpunkte und Audit-Ausgabe
3. Frontend-API-Client
4. neue `/messages`-Route
5. Startseite verschlanken und auf Modulseiten verweisen
