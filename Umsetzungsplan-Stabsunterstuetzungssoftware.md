# Umsetzungsplan Stabsunterstuetzungssoftware

Version: 1.2  
Stand: 2026-05-16  
Status: Projekt- und Entwicklungsroadmap  
Bezug:

- [Stabsunterstuetzungssoftware-Konzept](./Stabsunterstuetzungssoftware-Konzept.md)
- [Lastenheft-Stabsunterstuetzungssoftware](./Lastenheft-Stabsunterstuetzungssoftware.md)
- [Pflichtenheft-Stabsunterstuetzungssoftware](./Pflichtenheft-Stabsunterstuetzungssoftware.md)

## 1. Zweck des Umsetzungsplans

Dieses Dokument beschreibt die konkrete Reihenfolge der Umsetzung, die Projektphasen, die technischen und fachlichen Meilensteine sowie die empfohlene Roadmap vom Projektstart bis zur Version `1.0`.

Es beantwortet die Frage, `in welcher Reihenfolge` die bereits beschriebenen Anforderungen entwickelt, getestet und eingefuehrt werden sollen.

## 2. Grundsatz der Umsetzung

Die Software wird nicht nach dem Prinzip "erst alle Module halb anfangen" entwickelt, sondern nach dem Prinzip:

- zuerst gemeinsamer Plattformkern
- dann einsatzkritischer Fachkern
- dann lagebild- und fuehrungsrelevante Module
- danach Ausbau der Spezialfunktionen
- zum Schluss Härtung, Berichte, Archiv und Integrationen

Dieses Vorgehen minimiert Projektrisiken und erzeugt frueh einen tatsaechlich nutzbaren Kern.

## 3. Zielbild der Roadmap

Die Roadmap ist auf folgende Zielstufen ausgelegt:

- `Vorstufe`: belastbare Fach- und Technikgrundlagen
- `MVP 0.1`: lauffaehiger Plattformkern
- `MVP 0.2`: Nachrichten und Tagebuch
- `MVP 0.3`: Lage, Besprechungen, Probleme, Entscheidungen
- `Beta 0.4`: Auftraege, S3, erste Karte
- `Beta 0.5`: S1 Ressourcen und taktische Zeichen
- `RC 0.8`: S4, S5, S6 in praxistauglicher Tiefe
- `1.0`: stabiler produktionsreifer Grundstand

## 4. Projektphasen

## 4.1 Phase A: Projektvorbereitung

### Ziel

Sicherstellen, dass die Entwicklung auf klaren fachlichen und organisatorischen Grundlagen startet.

### Inhalte

- Konzept freigeben
- Lastenheft abstimmen
- Pflichtenheft pruefen und konkretisieren
- Produktverantwortung festlegen
- Fachansprechpartner fuer KGS und S1-S6 festlegen
- Test- und Uebungsszenarien definieren
- Prioritaeten final abstimmen

### Ergebnis

- freigegebene Dokumentbasis
- klares Rollenmodell fuer das Projekt
- abgestimmte MVP-Grenze

## 4.2 Phase B: Architektur und Projektgrundgeruest

### Ziel

Technische Grundstruktur schaffen, bevor Fachmodule aufgebaut werden.

### Inhalte

- Repository- und Projektstruktur festlegen
- Monorepo mit `apps/web`, `apps/api` und gemeinsamen Paketen anlegen
- Basisarchitektur aufsetzen
- Entwicklungs-, Test- und Produktionsumgebung definieren
- Datenbankschema-Grundlage anlegen
- Authentifizierung und Autorisierungsbasis vorbereiten
- Audit- und Logging-Grundlage vorbereiten
- Deployment-Grundlagen schaffen

### Ergebnis

- lauffaehiges technisches Grundgeruest
- festgelegter Zielstack fuer den Projektstart

## 4.3 Phase C: Plattformkern

### Ziel

Den minimal notwendigen gemeinsamen Einsatzkern bereitstellen.

### Inhalte

- Benutzerverwaltung
- Rollen und Rechte
- Lageverwaltung
- lagebezogene Mitgliedschaften
- Sitzungsverwaltung
- Grundnavigation
- Basislayout
- Audit-Basis

### Ergebnis

- `MVP 0.1`

### Verifizierter Ist-Stand am 2026-05-16

Fuer den aktuellen Live-Stand ist aus Phase C bereits praktisch erreicht:

- Demo-Login im Frontend
- Benutzerstatus im Frontend
- Lagen koennen ueber das Frontend angelegt werden
- Incident-Daten werden persistent in PostgreSQL gehalten
- Grundrechte fuer Incident-Lesen/-Anlegen/-Bearbeiten greifen im Backend
- Audit-/Historienlogik und persistente Auth sind im Code umgesetzt und lokal verifiziert

Noch offen innerhalb des Plattformkerns:

- neue Migration fuer persistente Benutzer-/Rollen-/Auditdaten in die Live-Datenbank ausrollen
- neue Backend- und Frontend-Revision live ausrollen und fachlich nachverifizieren
- lagebezogene Mitgliedschaften technisch ausbauen

Frontend-Start fuer die naechste Fachstufe:

- eingangsorientierte Nachrichtenzentrale als erste sichtbare Facharbeitsflaeche im Frontend begonnen
- interaktive Frontend-Vorstufe fuer Sichtung, Status, Zuweisung und Bearbeitungsspur umgesetzt
- bewusst noch ohne neue Message-Persistenz, damit Arbeitslogik und UI erst sichtbar und pruefbar werden

### Abnahme fuer Phase C

- Benutzer koennen sich anmelden.
- Lagen koennen angelegt werden.
- Benutzer koennen Lagen zugeordnet werden.
- Rechte werden grundlegend durchgesetzt.

Einordnung zum aktuellen Stand:

- Die ersten zwei Punkte sind im Live-System bereits sichtbar erfuellt.
- Die Rechtebasis ist fuer Incident-Endpunkte grundlegend umgesetzt.
- Die Auditbasis ist im Code jetzt geschlossen, muss aber noch als Live-Betriebsstand nachgezogen werden.
- Benutzer-Lage-Zuordnung bleibt danach die naechste logische Luecke innerhalb von Phase C.

## 4.4 Phase D: Nachrichten und Tagebuch

### Ziel

Die ersten fachlich produktiven Kernprozesse umsetzen.

### Inhalte

- Nachrichtenerfassung
- Ein- und Ausgangsnachweisung
- Statusfuehrung fuer Nachrichten
- Zuweisung und Weiterleitung
- Einsatztagebuch
- Bezug zwischen Nachricht und Tagebuch
- erste Exporte fuer Dokumentation

### Ergebnis

- `MVP 0.2`

### Abnahme fuer Phase D

- Nachrichten koennen erfasst, gespeichert und nachgewiesen werden.
- Tagebucheintraege koennen erstellt und nachvollzogen werden.
- Nutzer- und Zeitstempel funktionieren.

## 4.5 Phase E: Lagekern und Besprechungslogik

### Ziel

Das gemeinsame Lagebild technisch abbilden.

### Inhalte

- Lagemeldungen
- einfache Lageuebersicht
- Problemliste
- Entscheidungen
- Besprechungen
- Teilnehmer und Besprechungsprotokoll
- Ueberfuehrung Entscheidung zu Auftrag
- einfache Dashboard-Ansicht

### Ergebnis

- `MVP 0.3`

### Abnahme fuer Phase E

- Lagemeldungen koennen dokumentiert werden.
- Probleme und Entscheidungen koennen erfasst werden.
- Besprechungen koennen protokolliert werden.
- der Uebergang von Lageinformation zu Arbeitsauftrag ist nachvollziehbar.

## 4.6 Phase F: Auftraege und S3

### Ziel

Fuehrungs- und Steuerungsfunktionen fuer den Einsatz aufbauen.

### Inhalte

- Aufgaben- und Auftragsmanagement
- Priorisierung
- Rueckmeldungen
- Statuswechsel
- Einsatzabschnitte
- Verantwortlichkeiten
- erste Massnahmenlogik

### Ergebnis

- `Beta 0.4`

### Abnahme fuer Phase F

- Auftraege koennen aus Entscheidungen entstehen.
- Auftraege koennen verantwortlichen Nutzern oder Rollen zugewiesen werden.
- Rueckmeldungen und Status sind nachvollziehbar.

## 4.7 Phase G: S1 Ressourcenlage und erste Karte

### Ziel

Ressourcen und Lage im Raum sichtbar machen.

### Inhalte

- Kraefteverwaltung
- Fahrzeuge
- Status der Ressourcen
- Bereitstellungsraeume
- einfache Kartenansicht
- erste Kartenobjekte
- erste taktische Zeichen
- Verknuepfung von Ressource und Karte

### Ergebnis

- `Beta 0.5`

### Abnahme fuer Phase G

- Kraefte und Fahrzeuge koennen lagebezogen verwaltet werden.
- Kartenobjekte koennen gesetzt und gespeichert werden.
- taktische Zeichen koennen dargestellt werden.

## 4.8 Phase H: S4, S5, S6

### Ziel

Die restlichen Fachmodule auf praxistaugliches Niveau bringen.

### Inhalte S4

- Versorgungsbedarfe
- Material- und Betriebsstofflage
- Verpflegung
- Unterbringung
- Eigenschutz

### Inhalte S5

- externe Informationsbausteine
- Freigabestatus
- Mitteilungshistorie
- Vorlagen

### Inhalte S6

- Kommunikationsmittel
- Rufgruppen/Kanaele
- Stoerungsdokumentation
- Kommunikationskonzept

### Ergebnis

- `RC 0.8`

### Abnahme fuer Phase H

- S4, S5 und S6 sind in der geforderten Basistiefe nutzbar.
- Die Module arbeiten auf derselben Lage- und Rollenlogik.

## 4.9 Phase I: Berichte, Archiv, Export, Härtung

### Ziel

Den Kern zur produktionsreifen Grundversion fuehren.

### Inhalte

- strukturierte Exporte
- Lagechronik
- Abschlussberichtsbasis
- Archivfunktion
- Such- und Filterverfeinerung
- Sicherheitspruefungen
- Performancepruefungen
- Stabilitaetsverbesserungen
- Fehlerbehandlung verfeinern

### Ergebnis

- `Version 1.0`

### Abnahme fuer Phase I

- Kernfunktionen sind stabil.
- Daten koennen exportiert und archiviert werden.
- Mehrbenutzerbetrieb ist belastbar.
- Rechte, Audit und Dokumentation funktionieren konsistent.

## 5. Priorisierte Funktionsreihenfolge

### Prioritaet 1

- Authentifizierung
- Rollen und Rechte
- Lageverwaltung
- Audit-Basis
- Nachrichtenerfassung
- Einsatztagebuch

### Prioritaet 2

- Lagemeldungen
- Problemliste
- Besprechungen
- Entscheidungen
- Auftraege

### Prioritaet 3

- Einsatzabschnitte
- Ressourcen / S1
- Karte
- taktische Zeichen

### Prioritaet 4

- S4
- S5
- S6
- erweiterte Exporte

## 6. MVP-Definition

Der MVP darf nicht nur ein Login mit leerem Dashboard sein. Er muss fachlich erkennbar nutzbar sein.

### MVP-Minimum

- Login
- Rollen
- Lage anlegen und oeffnen
- Nachricht erfassen
- Tagebuch fuehren
- Lagemeldung erfassen
- Problemliste fuehren
- Entscheidung dokumentieren
- einfachen Auftrag erzeugen

### Nicht Bestandteil des fruehen MVP

- ausgefeilte GIS-Funktion
- umfassende S4/S5/S6-Tiefe
- externe Integrationen
- umfangreiche Druckstrecken

## 7. Meilensteine

### Meilenstein M1

Dokumentbasis abgeschlossen

Kriterien:

- Konzept vorhanden
- Lastenheft vorhanden
- Pflichtenheft vorhanden
- Umsetzungsplan vorhanden

### Meilenstein M2

Technischer Kern steht

Kriterien:

- Login
- Lageverwaltung
- Rollen
- Audit-Grundlage

### Meilenstein M3

Erster fachlicher Nutzen erreicht

Kriterien:

- Nachrichten
- Tagebuch
- nutzbare Nachvollziehbarkeit

### Meilenstein M4

Gemeinsames Lagebild erreicht

Kriterien:

- Lagemeldungen
- Besprechungen
- Probleme
- Entscheidungen

### Meilenstein M5

Fuehrungsunterstuetzung erreicht

Kriterien:

- Auftraege
- Rueckmeldungen
- Einsatzabschnitte

### Meilenstein M6

Lage- und Ressourcenraum sichtbar

Kriterien:

- Karte
- Kraefte
- Fahrzeuge
- taktische Zeichen

### Meilenstein M7

Produktionsreifer Grundstand

Kriterien:

- Basismodule vollstaendig
- Exporte
- Archiv
- Härtung

## 8. Arbeitspakete

Die Umsetzung sollte in kleine, klar pruefbare Arbeitspakete geschnitten werden.

### Beispielhafte Arbeitspakete fuer den Kern

- AP-01 Projektgrundgeruest
- AP-02 Benutzer und Rollen
- AP-03 Lageverwaltung
- AP-04 Audit und Logging
- AP-05 Nachrichtenmodul
- AP-06 Tagebuchmodul
- AP-07 Lagemeldungsmodul
- AP-08 Besprechungsmodul
- AP-09 Auftragsmodul
- AP-10 Ressourcenmodul
- AP-11 Kartenmodul
- AP-12 Exportmodul

## 9. Abhaengigkeiten

### Fachliche Abhaengigkeiten

- Auftraege brauchen Entscheidungen oder direkte Erfassung.
- Entscheidungen brauchen Besprechung oder Lagebearbeitung.
- Lagemeldungen brauchen Lagekontext.
- Ressourcen brauchen Lage und Rollen.
- Karte braucht Lage und Kartenobjektmodell.

### Technische Abhaengigkeiten

- Echtzeit setzt saubere API- und Ereignislogik voraus.
- Rechtepruefung muss vor Fachmodulen stabil stehen.
- Audit muss vor produktiver Fachbearbeitung stehen.
- Exporte brauchen stabile Datenmodelle.

## 10. Teststrategie entlang der Roadmap

### Fruehe Phase

- Unit-Tests fuer Kernlogik
- Rechtepruefung
- Validierung

### Mittlere Phase

- Integrationstests fuer Nachrichten, Tagebuch, Lage und Auftraege
- Echtzeit-Tests mit mehreren Sitzungen

### Spaete Phase

- End-to-End-Tests
- Lasttests
- Sicherheitstests
- Fachtests mit Uebungslagen

## 11. Fachliche Reviewpunkte

Nach folgenden Phasen sollte jeweils ein fachlicher Review mit realen Anwendern stattfinden:

- nach `MVP 0.2`
- nach `MVP 0.3`
- nach `Beta 0.5`
- vor `1.0`

Ziel:

- Fehlentwicklungen frueh erkennen
- Begriffe und Masken fachlich pruefen
- Arbeitsgeschwindigkeit und Bedienbarkeit bewerten

## 12. Rollen im Projekt

Empfohlene Projektrollen:

- Produktverantwortung fachlich
- technische Projektleitung
- Architekturverantwortung
- Fachvertreter KGS
- Fachvertreter S1
- Fachvertreter S2
- Fachvertreter S3
- Fachvertreter S4
- Fachvertreter S5
- Fachvertreter S6
- Testkoordination

## 13. Entscheidungsbedarf vor Entwicklungsstart

Vor dem eigentlichen Start sollten noch verbindlich entschieden werden:

- Hosting-/Betriebsmodell
- Priorisierung des ersten MVP
- Detailtiefe taktischer Zeichen
- Exportpflichten
- Sicherheitsniveau fuer Produktion

### Beschlussstand 2026-05-14

Das Hosting-/Betriebsmodell wird wie folgt festgelegt:

- Frontend: Firebase App Hosting
- Backend: Cloud Run
- Anwendungsrouting: zunaechst getrennte API-URL, spaeter optional Zusammenfuehrung ueber Firebase Hosting / Custom Domain

## 14. Risiken in der Umsetzung

### Risiko 1

Zu frueh zu viele Module parallel beginnen.

Gegenmassnahme:

- strikte Phasenlogik
- MVP-Grenze verteidigen

### Risiko 2

Zu spaet echte Anwender einbeziehen.

Gegenmassnahme:

- fachliche Reviews je Meilenstein

### Risiko 3

Zu technische Entwicklung ohne Prozessklarheit.

Gegenmassnahme:

- Lastenheft und Pflichtenheft laufend fortschreiben

### Risiko 4

Karte und taktische Zeichen frueh zu komplex gestalten.

Gegenmassnahme:

- erst einfache Kartenobjekte
- Symbolbibliothek stufenweise ausbauen

## 15. Empfehlung fuer die erste reale Entwicklungsiteration

Wenn sofort mit der Umsetzung begonnen wird, sollte die erste Iteration nur diese Punkte enthalten:

- Projektgrundgeruest
- Login
- Rollen
- Lageverwaltung
- Audit-Basis
- leeres Nachrichtenmodul mit Grundstruktur
- leeres Tagebuchmodul mit Grundstruktur

Ziel:

- stabiles Fundament statt schneller Scheinfortschritt

## 16. Definition Version 1.0

Die Version `1.0` ist erreicht, wenn:

- die Kernmodule stabil funktionieren
- Mehrbenutzerbetrieb praxistauglich ist
- Nachrichten, Tagebuch, Lage, Besprechungen und Auftraege belastbar laufen
- erste Karten- und Ressourcenfunktionen vorhanden sind
- S4, S5 und S6 in Basistiefe nutzbar sind
- Exporte und Archiv vorhanden sind
- fachliche Tests erfolgreich durchlaufen wurden

## 17. Fortschreibung und Statuspflege

Dieser Umsetzungsplan ist als laufend aktualisierte Projektroadmap gedacht.

### Bei jeder Weiterentwicklung sollten hier nachgetragen werden:

- erreichte Meilensteine
- verschobene Arbeitspakete
- neue Risiken
- geaenderte Prioritaeten
- technische Richtungsentscheidungen

### Kommentararten

- `Roadmap-Kommentar`
- `Sprint-Kommentar`
- `Meilenstein-Kommentar`
- `Risiko-Kommentar`
- `Entscheidung`

## 18. Aenderungsprotokoll

### Version 1.0 - 2026-05-13

- Erstfassung des Umsetzungsplans mit Roadmap bis Version 1.0 erstellt.
- Zielstack fuer den Projektstart verbindlich festgelegt.

### Entwicklungsstand 2026-05-13

- Monorepo-Struktur fuer `apps/web`, `apps/api`, `packages/*`, `infra/` und `docs/` angelegt.
- `MVP 0.1`-Fundament fuer Demo-Login, Rollenbasis und erste Lage-API umgesetzt.
- reproduzierbare Foundation-Verifikation fuer Login, Rechte und Lageendpunkte angelegt.

### Version 1.1 - 2026-05-14

- Zielbetrieb auf Firebase App Hosting fuer das Frontend und Cloud Run fuer das Backend festgelegt.

### Entwicklungsstand 2026-05-14

- Firebase App Hosting bis zum erfolgreichen Framework-Build vorangebracht.
- Frontend fuer App Hosting technisch nachgeschaerft: eigener Frontend-Lockfile, Synchronisierung mit Root-Lockfile, Umstellung auf `Next.js 15.2.9`, `output: "standalone"` und explizite Runtime-Dependency `styled-jsx`.
- Der isolierte Standalone-Start des Frontends wurde lokal erfolgreich mit `PORT=8080` verifiziert.

### Entwicklungsstand 2026-05-14-02

- Eigenstaendiger Frontend-Deploy-Ordner `firebase-web` eingefuehrt, damit Firebase App Hosting stabil deployen kann.
- API als eigener Cloud-Run-Service `stabs-api` live geschaltet.
- Frontend auf die echte API-URL verdrahtet.
- Startseite erweitert, damit Health-Status und erste Lage live aus dem Backend sichtbar sind.

### Aktueller Projektstand nach Live-Schaltung

Erreicht:

- Frontend live
- Backend live
- Frontend-Backend-Verbindung sichtbar verifiziert

Noch offen bis zum naechsten funktionalen Meilenstein:

- echtes Login im Frontend
- Benutzer-/Sitzungsanzeige
- Anlegen neuer Lagen aus der Oberflaeche
- Persistenz mit Datenbank

### Entwicklungsstand 2026-05-15-03

- Audit-/Historienlogik fuer Lagen im Backend und Frontend umgesetzt.
- persistente Benutzer-, Rollen- und Session-Modelle in Prisma und PostgreSQL-Struktur aufgenommen.
- Seed-basierter Login-Pfad auf persistente Store-Abstraktion umgestellt.
- Test- und Build-Verifikation fuer API und Frontend mit dem neuen Kern erfolgreich ausgefuehrt.

### Entwicklungsstand 2026-05-16

- Doku auf den Unterschied zwischen `lokal verifiziertem erweitertem Code-Stand` und `bereits ausgerolltem Live-Stand` nachgeschaerft.
- naechste Pflichtschritte vor dem Fachausbau festgelegt:
  - Prisma-Migration deployen
  - Backend deployen
  - Frontend deployen
  - Live-Nachverifikation des neuen Auth-/Audit-Pfads
- danach bleibt fachlich als naechster Ausbau:
  - lagebezogene Mitgliedschaften
  - feinere Rechtepruefung
  - Nachrichten und Tagebuch

### Entwicklungsstand 2026-05-16-02

- erste sichtbare Fachoberflaeche fuer das `Nachrichtenmodul` im Frontend begonnen.
- neue `Nachrichtenzentrale` als eingangsorientierte Arbeitsflaeche fuer Sichtung, Priorisierung, Zuweisung und Bearbeitungsspur umgesetzt.
- Tablet-/Desktop-geeignetes List-Detail-Layout mit interaktiver lokaler Vorschau fuer neue Nachrichten eingebaut.
- Doku und Spezifikation fuer den Frontend-Start des Nachrichtenmoduls nachgezogen.
