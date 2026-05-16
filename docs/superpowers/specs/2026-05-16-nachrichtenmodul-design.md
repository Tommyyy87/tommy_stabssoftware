# Nachrichtenmodul Design

Datum: `2026-05-16`
Status: freigegeben fuer Umsetzung

## Ziel

Als erste sichtbare Fachoberflaeche wird eine eingangsorientierte
Nachrichtenzentrale umgesetzt. Sie soll fuer Desktop und Tablet nutzbar sein,
modern und serioes wirken und die spaetere Backend- und Audit-Integration
vorbereiten.

## Fachliche Leitentscheidung

Die erste Ausbaustufe optimiert primaer die Bearbeitung eingehender
Nachrichten, fuehrt aber eingehende und ausgehende Nachrichten im selben
Modell. Das entspricht dem realen Druck in der Stabsarbeit: Aufnahme,
Sichtung, Priorisierung, Zuweisung, Weiterleitung und Nachverfolgung.

## Kernanforderungen

- klare Nachrichtenliste mit schneller Scanbarkeit
- nachvollziehbare Bearbeitung pro Nachricht
- Statusfuehrung, Prioritaet, Kanal und Richtung sichtbar
- vorbereitete Verknuepfung zu Tagebuch, Lage und spaeter Auftrag
- touch-taugliche Bedienung fuer Tablet
- geringer visuell-kognitiver Ballast trotz hoher Informationsdichte

## Oberflaechenmodell

Die Nachrichtenzentrale besteht aus drei Bereichen:

1. Kopfbereich mit aktiver Lage, Schnellfiltern, Suche und Hauptaktion
   `Neue Nachricht`
2. Listenbereich mit Nachrichtenuebersicht
3. Detailbereich mit Vollansicht, Bearbeitungsspur und naechsten Schritten

Desktop nutzt ein List-Detail-Layout mit zwei Spalten. Tablet kippt in eine
einspaltige Folge von Liste und Detail, damit Inhalte nicht gequetscht werden.

## Daten- und Statusmodell der ersten Ausbaustufe

Eine Nachricht enthaelt mindestens:

- `id`
- `incidentLabel`
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
- `timeline`
- `links`

Statusmodell:

- `neu`
- `gesichtet`
- `in Bearbeitung`
- `weitergeleitet`
- `erledigt`

Prioritaet:

- `niedrig`
- `normal`
- `hoch`
- `sofort`

## Interaktive Erstumsetzung

Die erste sichtbare Frontend-Stufe wird bewusst ohne neue Backend-Endpunkte
geliefert. Stattdessen wird eine realistische, fachlich orientierte Mock-
Arbeitsflaeche bereitgestellt:

- Beispielnachrichten fuer mehrere typische Lagen
- Suche und Statusfilter
- Auswahl einer Nachricht
- Umschalten von Status und Zuweisung im lokalen Zustand
- Anlegen einer neuen Nachricht im Frontend-Zustand

So wird der Arbeitsfluss sichtbar und pruefbar, bevor das Backend-Modul
`messages` aufgebaut wird.

## UX-Prinzipien

- priorisierte Informationen zuerst: Prioritaet, Status, Zeit, Betreff
- wenig Text in der Liste, volle Tiefe im Detail
- grosse Tapp-Ziele fuer Aktionen und Filter
- deutliche Statusmarken statt farblicher Ueberladung
- Bearbeitungsspur in fachlicher Sprache statt technischer Rohdaten

## Dokumentationsfolge

Mit dieser Stufe gilt das Nachrichtenmodul nicht als fachlich abgeschlossen,
aber als sichtbar begonnen. Architektur-, Deployment- und Roadmap-Dokumente
muessen den Stand als `Frontend-Arbeitsflaeche fuer das Nachrichtenmodul`
abbilden.
