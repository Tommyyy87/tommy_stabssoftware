# Pflichtenheft Stabsunterstuetzungssoftware

Version: 1.0  
Stand: 2026-05-13  
Status: Technische Arbeitsgrundlage  
Bezug:

- [Stabsunterstuetzungssoftware-Konzept](./Stabsunterstuetzungssoftware-Konzept.md)
- [Lastenheft-Stabsunterstuetzungssoftware](./Lastenheft-Stabsunterstuetzungssoftware.md)

## 1. Zweck des Pflichtenhefts

Dieses Pflichtenheft beschreibt, wie die im Lastenheft formulierten Anforderungen technisch umgesetzt werden sollen. Es definiert die Zielarchitektur, die technische Struktur der Anwendung, die Datenhaltung, die Modulgrenzen, die Sicherheitsmechanismen sowie die Entwicklungs- und Betriebsgrundsaetze.

Das Pflichtenheft beantwortet damit das `wie` der spaeteren Umsetzung.

## 2. Technische Zielsetzung

Die Stabsunterstuetzungssoftware wird als browserbasierte Mehrbenutzeranwendung mit zentralem Serverbetrieb konzipiert. Das System soll eine gemeinsame lagebezogene Datenbasis fuer mehrere gleichzeitige Nutzer bereitstellen, Aenderungen nachvollziehbar protokollieren und fachliche Module auf einem gemeinsamen Einsatzkern aufbauen.

Die technische Loesung muss folgende Kerneigenschaften sicherstellen:

- zentrale Datenhaltung
- lagebezogene Trennung
- rollen- und rechtegesteuerte Nutzung
- Echtzeit-Zusammenarbeit
- revisionsgeeignete Historisierung
- spaetere Erweiterbarkeit

## 3. Zielarchitektur

Die Zielarchitektur besteht aus fuenf Hauptbausteinen:

1. `Frontend`
2. `Backend/API`
3. `Echtzeit-Kommunikationsschicht`
4. `Datenbank`
5. `Datei- und Anhangspeicher`

### 3.1 Frontend

Das Frontend ist eine Webanwendung fuer moderne Browser und dient der Darstellung und Bearbeitung aller lagebezogenen Informationen.

Aufgaben:

- Authentifizierung und Sitzungsnutzung
- Darstellung von Listen, Formularen, Dashboards und Karte
- Interaktive Bearbeitung fachlicher Objekte
- Empfang von Echtzeit-Aktualisierungen
- Rollenabhaengige Navigation und Sichtbarkeit

### 3.2 Backend/API

Das Backend ist die zentrale fachliche und technische Instanz.

Aufgaben:

- Authentifizierung und Autorisierung
- Validierung
- Geschaeftslogik
- Historisierung
- Datenzugriff
- Exportlogik
- Integrationsfaehigkeit
- Steuerung von Benachrichtigungen und Echtzeitereignissen

### 3.3 Echtzeit-Kommunikationsschicht

Die Echtzeit-Schicht dient dazu, Aenderungen ohne manuelles Neuladen an andere Nutzer zu verteilen.

Typische Ereignisse:

- neue Nachricht
- neuer Tagebucheintrag
- Statusaenderung eines Auftrags
- Aktualisierung eines Kartenobjekts
- neue Lagemeldung
- neue Besprechung oder Entscheidung

### 3.4 Datenbank

Die strukturierte Datenhaltung erfolgt in einer relationalen Datenbank. Diese ist fuer die komplexen fachlichen Beziehungen, Integritaet und Historisierung geeignet.

### 3.5 Datei- und Anhangspeicher

Dateien und Medien werden getrennt von den relationalen Fachdaten gespeichert. In der Datenbank werden dazu Metadaten, Referenzen, Zugehoerigkeit und Berechtigungen gehalten.

## 4. Architekturelle Grundentscheidungen

### 4.1 Monolithischer Start mit modularer Struktur

Fuer die erste Phase wird ein modular strukturierter Applikationsmonolith empfohlen, kein verteiltes Microservice-System.

Begruendung:

- geringere Komplexitaet
- schnellerer Projektstart
- einfachere Transaktionen
- klare Wartbarkeit in fruehen Phasen
- spaetere Extraktion einzelner Dienste weiterhin moeglich

### 4.2 API-zentrierte Architektur

Alle fachlichen Funktionen werden ueber eine klar definierte API abgewickelt. Das Frontend darf keine fachkritische Logik exklusiv lokal halten.

### 4.3 Ereignisorientierte Synchronisation

Nach fachlich relevanten Schreibvorgaengen erzeugt das Backend definierte Ereignisse fuer die Echtzeit-Synchronisation. So bleibt die gemeinsame Lage zwischen den Nutzern synchron.

## 5. Technische Modulstruktur

Die Software wird in technische Module gegliedert. Diese orientieren sich fachlich am Konzept, sind aber technisch sauber getrennt.

### 5.1 Kernmodule

- `auth`
- `users`
- `roles`
- `incidents`
- `audit`
- `attachments`
- `search`
- `notifications`

### 5.2 Fachmodule

- `kgs`
- `messages`
- `journal`
- `s1_resources`
- `s2_situation`
- `s3_operations`
- `s4_logistics`
- `s5_public_info`
- `s6_communications`
- `meetings`
- `map`

### 5.3 Querschnittsmodule

- `export`
- `reporting`
- `templates`
- `settings`

## 6. Lagefaehigkeit und Mandantentrennung

### 6.1 Lage als Primärobjekt

Jede fachliche Information muss genau einer Lage zugeordnet sein, sofern sie nicht globales Stammdatum ist.

Beispiele:

- Nachricht
- Tagebucheintrag
- Lagemeldung
- Auftrag
- Kartenobjekt
- Anhang
- Besprechung
- Problem

### 6.2 Datenisolation

Technische Regel:

- Jede lagebezogene Tabelle enthaelt eine `incident_id`.
- Jede API-Anfrage auf lagebezogene Daten wird gegen diese Zuordnung geprueft.
- Rechtepruefung erfolgt immer in Bezug auf `Benutzer + Rolle + Lage`.

### 6.3 Vorbereitete Mandantenfaehigkeit

In Version 1 wird keine zwingende Mehrmandantenarchitektur vorausgesetzt. Das Schema soll aber so gestaltet werden, dass spaeter eine zusaetzliche Organisationsebene ergaenzbar bleibt.

## 7. Rollen- und Rechtemodell

### 7.1 Technisches Modell

Es wird ein rollenbasiertes Berechtigungssystem mit lagebezogener Zuordnung umgesetzt.

Bausteine:

- `user`
- `role`
- `permission`
- `incident_membership`
- `incident_role_assignment`

### 7.2 Rechteebenen

Mindestens diese Rechteklassen:

- `read`
- `create`
- `update`
- `delete`
- `approve`
- `export`
- `admin`

### 7.3 Modulrechte

Rechte werden pro Modul oder Objektgruppe vergeben, z. B.:

- `messages.read`
- `messages.create`
- `journal.update`
- `s2_situation.approve`
- `map.update`

### 7.4 Serverseitige Durchsetzung

Alle Rechtepruefungen erfolgen serverseitig. Sichtbarkeiten im Frontend sind nur Komfortfunktionen, keine Sicherheitsbarriere.

## 8. Authentifizierung und Sitzung

### 8.1 Grundansatz

Version 1 soll eine klassische Anwendungsanmeldung mit Benutzername und Passwort unterstuetzen.

### 8.2 Sitzungsmodell

Empfohlen ist ein servergestuetztes oder tokenbasiertes Sitzungsmodell mit:

- Login
- Logout
- Session-Timeout
- Erneuerung der Sitzung
- Sperrung bei Bedarf

### 8.3 Erweiterbarkeit

Folgende Erweiterungen sollen spaeter moeglich bleiben:

- 2FA
- Single Sign-On
- Verzeichnisdienstanbindung

## 9. Datenmodell

## 9.1 Kernentitaeten

Die folgenden Kernentitaeten werden in Version 1 eingeplant:

- `users`
- `roles`
- `permissions`
- `user_role_assignments`
- `incidents`
- `incident_memberships`
- `organizations`
- `persons`
- `units`
- `vehicles`
- `messages`
- `message_logs`
- `journal_entries`
- `situation_reports`
- `problems`
- `decisions`
- `tasks`
- `task_updates`
- `meetings`
- `meeting_participants`
- `map_objects`
- `attachments`
- `audit_events`
- `resource_statuses`
- `communication_assets`
- `supply_requests`

## 9.2 Beispielhafte Primärfelder

### incidents

- `id`
- `title`
- `reference_number`
- `status`
- `type`
- `created_at`
- `created_by`
- `archived_at`
- `archived_by`

### messages

- `id`
- `incident_id`
- `direction`
- `channel`
- `sender_label`
- `recipient_label`
- `message_time`
- `received_time`
- `subject`
- `body`
- `status`
- `created_at`
- `created_by`

### journal_entries

- `id`
- `incident_id`
- `entry_number`
- `entry_time`
- `category`
- `content`
- `created_at`
- `created_by`
- `approved_at`
- `approved_by`

### situation_reports

- `id`
- `incident_id`
- `source`
- `priority`
- `status`
- `summary`
- `details`
- `reported_at`
- `created_at`
- `created_by`

### tasks

- `id`
- `incident_id`
- `module`
- `title`
- `description`
- `status`
- `priority`
- `due_at`
- `assigned_to_user_id`
- `assigned_to_role`
- `created_at`
- `created_by`

### map_objects

- `id`
- `incident_id`
- `type`
- `geometry`
- `symbol_key`
- `title`
- `description`
- `status`
- `valid_from`
- `valid_to`
- `created_at`
- `created_by`

## 9.3 Beziehungen

Wichtige Beziehungen:

- Eine Lage hat viele Nachrichten.
- Eine Lage hat viele Tagebucheintraege.
- Eine Lage hat viele Lagemeldungen.
- Eine Lage hat viele Aufgaben und Entscheidungen.
- Eine Lage hat viele Kartenobjekte.
- Nachrichten, Tagebuch, Aufgaben und Lageobjekte koennen ueber Referenztabellen miteinander verknuepft werden.

### 9.4 Referenz- und Linktabellen

Zur Verknuepfung fachlicher Objekte werden eigene Linktabellen empfohlen:

- `message_to_journal_entry`
- `message_to_task`
- `situation_report_to_map_object`
- `decision_to_task`
- `attachment_links`

Dadurch bleibt das Datenmodell flexibel und fachlich ausbaubar.

## 10. Historisierung und Audit

### 10.1 Ziel

Jede fachlich relevante Aenderung muss nachvollziehbar bleiben.

### 10.2 Technisches Modell

Es wird ein zentrales `audit_events`-Modell eingefuehrt.

Felder:

- `id`
- `incident_id`
- `actor_user_id`
- `event_type`
- `entity_type`
- `entity_id`
- `occurred_at`
- `before_snapshot`
- `after_snapshot`
- `context`

### 10.3 Regel

Schreibvorgaenge auf kritischen Entitaeten erzeugen Audit-Ereignisse.

Kritische Entitaeten:

- Nachrichten
- Tagebuch
- Lagemeldungen
- Probleme
- Entscheidungen
- Aufgaben
- Kartenobjekte
- Freigaben

## 11. Fachliche Freigabemechanismen

Nicht jeder Datensatz benoetigt denselben Freigabegrad. Daher wird ein technisches Freigabemodell vorgesehen.

### 11.1 Statusmodell

Beispielstatus:

- `draft`
- `active`
- `submitted`
- `approved`
- `closed`
- `archived`

### 11.2 Freigabepflichtige Inhalte

Mindestens vorbereiten fuer:

- externe Meldungen
- offizielle Entscheidungen
- freizugebende Lageberichte
- Abschlussberichte

## 12. API-Konzept

Die Anwendung erhaelt eine interne oder externe HTTP-basierte API.

### 12.1 Prinzipien

- klare Ressourcentrennung
- lagebezogene Endpunkte
- serverseitige Validierung
- standardisierte Fehlerantworten
- Pagination fuer Listen
- Filter und Sortierung

### 12.2 Beispielhafte Ressourcengruppen

- `/auth`
- `/users`
- `/incidents`
- `/incidents/{id}/messages`
- `/incidents/{id}/journal`
- `/incidents/{id}/situation-reports`
- `/incidents/{id}/tasks`
- `/incidents/{id}/meetings`
- `/incidents/{id}/map-objects`
- `/incidents/{id}/attachments`
- `/incidents/{id}/audit-events`

### 12.3 Schreibregeln

- Create- und Update-Anfragen werden validiert.
- Berechtigungen werden je Anfrage geprueft.
- Fachliche Seiteneffekte werden im Backend ausgefuehrt.
- Relevante Updates erzeugen Audit-Eintraege.
- Relevante Updates erzeugen Echtzeitereignisse.

## 13. Echtzeitkonzept

### 13.1 Ziel

Mehrere Nutzer sollen innerhalb derselben Lage mit moeglichst aktuellem Datenstand arbeiten.

### 13.2 Mechanismus

Empfohlen wird eine bidirektionale Echtzeitverbindung zwischen Client und Server.

### 13.3 Ereigniskategorien

- `message.created`
- `message.updated`
- `journal_entry.created`
- `task.updated`
- `map_object.updated`
- `meeting.updated`
- `incident.presence_changed`

### 13.4 Konfliktverhalten

Bei gleichzeitiger Bearbeitung eines Datensatzes wird eine Versionierungsstrategie benoetigt.

Empfehlung:

- Optimistic Locking per Versionsfeld oder Update-Zeitpunkt
- bei Konflikt technische Rueckmeldung an den Client
- manuelle Entscheidung bei konkurrierenden Aenderungen

## 14. Dateianhaenge

### 14.1 Speicherlogik

Dateien werden ausserhalb der relationalen Haupttabellen gespeichert.

Metadaten:

- Dateiname
- MIME-Typ
- Groesse
- Zugehoerigkeit
- Ersteller
- Erstellzeitpunkt
- Hash oder Pruefsumme

### 14.2 Sicherheitsregeln

- Zugriffspruefung wie beim Bezugsobjekt
- keine unkontrollierte anonyme Auslieferung
- Dateityp- und Groessenpruefung

## 15. Karten- und Geodatenmodell

### 15.1 Grundansatz

Die Karte wird als separates Frontend-Modul mit Speicherung geografischer Objekte umgesetzt.

### 15.2 Kartenobjekt-Typen

- Punkt
- Linie
- Flaeche
- Symbolobjekt
- Bereich / Einsatzabschnitt

### 15.3 Kartenobjekt-Felder

- Geometrie
- Symbolschluessel
- Farbe
- Status
- Beschreibung
- zeitliche Gueltigkeit
- Lagebezug

### 15.4 Taktische Zeichen

Die taktischen Zeichen werden ueber eine konfigurierbare Symbolbibliothek verwaltet.

Technische Anforderungen:

- vektorbasierte Darstellung
- eindeutiger Symbolschluessel
- kombinierbare Zusatzkennzeichnungen
- statusabhaengige Farbgebung

## 16. Frontend-Struktur

### 16.1 Hauptnavigation

Empfohlene Hauptbereiche:

- Dashboard
- Lage
- Nachrichten
- Tagebuch
- Auftraege
- Karte
- Ressourcen
- Versorgung
- Kommunikation
- Besprechungen
- Berichte
- Administration

### 16.2 UI-Prinzipien

- responsive Layouts
- klare Tabellen und Detailansichten
- wenige Klicks fuer haeufige Arbeitsablaeufe
- sichtbare Statusinformationen
- konsequente Filter und Suchleisten

### 16.3 Zustandshaltung

Der Client benoetigt einen klaren Anwendungszustand fuer:

- aktuelle Lage
- Benutzerrechte
- Filter
- offene Bearbeitungen
- Echtzeitstatus

## 17. Such- und Filterkonzept

### 17.1 Suchbereiche

- Nachrichten
- Tagebuch
- Lagemeldungen
- Aufgaben
- Besprechungen
- Kartenobjekte
- Anhaenge

### 17.2 Filterkriterien

- Zeit
- Status
- Prioritaet
- Fachmodul
- Verantwortlicher
- Einsatzabschnitt
- Schlagwort

## 18. Export- und Berichtskonzept

### 18.1 Ziel

Fachdaten muessen fuer Nachbereitung, Nachweis und ggf. Ausdruck exportierbar sein.

### 18.2 Exporte in Version 1

- Einsatztagebuch
- Nachrichtenliste
- Aufgabenliste
- Lagechronik

### 18.3 Technische Anforderungen

- reproduzierbare Ausgabe
- Zeit- und Nutzerbezug sichtbar
- Kennzeichnung des Exportzeitpunkts

## 19. Fehlerbehandlung und Validierung

### 19.1 Backend-Validierung

Pflichtfelder, Statuswechsel und fachliche Konsistenz werden serverseitig geprueft.

### 19.2 Frontend-Validierung

Das Frontend unterstuetzt den Nutzer mit fruehem Feedback, ersetzt aber keine serverseitige Pruefung.

### 19.3 Fehlerklassen

- Validierungsfehler
- Berechtigungsfehler
- Konfliktfehler
- Systemfehler
- Integrationsfehler

## 20. Sicherheitskonzept

### 20.1 Sicherheitsziele

- Vertraulichkeit
- Integritaet
- Verfuegbarkeit
- Nachvollziehbarkeit

### 20.2 Massnahmen

- geschuetzte Verbindungen
- serverseitige Autorisierung
- passwortbasierte Authentifizierung
- Logging sicherheitsrelevanter Ereignisse
- Backup und Wiederanlauf
- Trennung von Fach- und Administrationsrechten

### 20.3 Erweiterungen

- 2FA
- Härtung der Sitzungsverwaltung
- Sicherheitsheader
- regelmaessige Sicherheitspruefungen

## 21. Protokollierung und Monitoring

### 21.1 Technische Logs

Das System soll technische Logs getrennt von fachlichen Audit-Logs fuehren.

### 21.2 Monitoring

Empfohlen:

- Verfuegbarkeit
- Fehlerquoten
- Antwortzeiten
- Echtzeitverbindungen
- Speicherauslastung

## 22. Deployment und Betriebsmodell

### 22.1 Zielbild

Zentral betriebene Webanwendung mit gesichertem Serverbetrieb.

### 22.1a Zielbetrieb Firebase / Cloud Run

Zum Stand `2026-05-14` wird folgender Zielbetrieb festgelegt:

- Web-Frontend auf Firebase App Hosting
- Backend-API als separater Cloud-Run-Service
- optionaler Domain-Zuschnitt ueber Firebase Hosting / Custom Domain

Technische Leitidee:

- Das Web wird als moderne Next.js-Anwendung ueber Firebase App Hosting gebaut und betrieben.
- Die API bleibt ein eigenstaendiger NestJS-Dienst auf Cloud Run.
- Die API wird vom Web entweder ueber eine direkte API-URL oder spaeter ueber kontrollierte Routingregeln angesprochen.

### 22.2 Umgebungen

Mindestens:

- Entwicklung
- Test
- Produktion

### 22.3 Deployment-Grundsaetze

- reproduzierbare Builds
- versionierte Releases
- dokumentierte Konfiguration
- Rollback-Strategie
- klare Trennung von Web- und API-Deployment

## 23. Entwicklungsstrategie

### 23.1 Iteratives Vorgehen

Das System wird iterativ entwickelt.

Empfohlene technische Reihenfolge:

1. Auth, Rollen, Lageverwaltung
2. Nachrichten und Tagebuch
3. S2 und Besprechungen
4. Aufgaben und S3
5. Ressourcen/S1 und Karte
6. S4, S5, S6
7. Exporte, Archiv, Härtung

### 23.2 Definition of Done

Ein Modul gilt erst dann als technisch fertig, wenn:

- fachliche Anforderungen umgesetzt sind
- Rechtepruefung vorhanden ist
- Audit-Logik vorhanden ist
- Tests vorhanden sind
- Fehlerfaelle behandelt sind
- Dokumentation aktualisiert wurde

## 24. Testkonzept

### 24.1 Testebenen

- Unit-Tests
- Integrationstests
- API-Tests
- Rechte- und Sicherheitspruefungen
- End-to-End-Tests fuer Kernablaeufe

### 24.2 Kritische End-to-End-Faelle

- Login und Lagezugriff
- Nachricht erfassen und weiterleiten
- Tagebucheintrag erstellen
- Lagemeldung erfassen
- Problem zu Entscheidung zu Auftrag
- Kartenobjekt erstellen und anzeigen
- Rechteverletzung abweisen

## 25. Abhaengigkeiten und technische Risiken

### 25.1 Risiken

- zu komplexes Datenmodell in frueher Phase
- unklare Konfliktstrategie bei Gleichzeitigkeit
- unzureichende Rechtepruefung
- zu spaete Beruecksichtigung von Export und Audit
- zu hohe Kartenkomplexitaet zu frueh

### 25.2 Gegenmassnahmen

- MVP-orientierter Ausbau
- fruehe Architekturpruefung
- konsequente Rechte- und Audit-Basis im Kern
- Kartenfunktion stufenweise erweitern

## 26. Technische Abnahmekriterien

Die technische Umsetzung gilt in der ersten Stufe als gelungen, wenn:

- Lagebezogene Daten sauber getrennt sind.
- Rechte serverseitig wirksam geprueft werden.
- Audit-Ereignisse fuer kritische Objekte entstehen.
- mehrere Nutzer im selben Lagekontext arbeiten koennen.
- Kernobjekte ueber API und Frontend konsistent bearbeitbar sind.
- Export der Kernobjekte moeglich ist.

## 27. Offene technische Entscheidungen

- konkrete Exportbibliothek
- konkretes Hosting-/Betriebsmodell

## 27a. Festgelegte technische Entscheidungen

Zum Stand `2026-05-13` werden folgende technischen Entscheidungen verbindlich festgelegt:

- Frontend: Next.js mit App Router, React, TypeScript
- UI: Tailwind CSS v4
- Backend: NestJS mit TypeScript
- API: REST plus WebSocket
- Datenbank: PostgreSQL
- ORM: Prisma
- Karte: MapLibre GL JS
- Tests: Vitest und Playwright
- Runtime: Node.js 24 LTS

Bezug:

- [Technologievorschlag-Stabsunterstuetzungssoftware](./Technologievorschlag-Stabsunterstuetzungssoftware.md)

## 28. Fortschreibung und Kommentierung

Dieses Pflichtenheft ist fortschreibbar und soll waehrend der Entwicklung aktualisiert werden.

### Kommentararten

- `Architekturkommentar`
- `Implementierungskommentar`
- `Testkommentar`
- `Sicherheitskommentar`
- `Betriebskommentar`
- `Offene Entscheidung`

### Regel

Technische Richtungsentscheidungen werden nicht nur im Code, sondern auch hier dokumentiert.

## 29. Aenderungsprotokoll

### Version 1.0 - 2026-05-13

- Erstfassung des Pflichtenhefts als technische Ableitung aus Konzept und Lastenheft erstellt.
- Technologiestack verbindlich festgelegt und referenziert.

### Version 1.1 - 2026-05-14

- Zielbetrieb auf Firebase App Hosting und Cloud Run ergaenzt.
