# Konzept Stabsunterstuetzungssoftware

Version: 1.0  
Stand: 2026-05-13  
Status: Arbeitsgrundlage / Living Document

## 1. Zweck des Dokuments

Dieses Dokument beschreibt das fachliche, technische und organisatorische Gesamtkonzept fuer eine browserbasierte, mehrbenutzerfaehige Stabsunterstuetzungssoftware. Es ist so aufgebaut, dass es als verbindliche Arbeitsgrundlage fuer Planung, Entwicklung, Test, Einfuehrung und spaetere Weiterentwicklung genutzt werden kann.

Das Ziel ist nicht die Digitalisierung einzelner Formulare, sondern der Aufbau eines einsatztauglichen Fuehrungs- und Unterstuetzungssystems fuer Stabsarbeit in Grossschadenslagen, Krisen und Katastrophen. Die Software soll moderne Zusammenarbeit, fachlich korrekte Prozesse, nachvollziehbare Dokumentation und lagebezogenes Arbeiten in einem gemeinsamen System abbilden.

Dieses Dokument ist bewusst als `Living Document` angelegt. Es soll waehrend der Entwicklung fortlaufend gepflegt, kommentiert und erweitert werden.

## 2. Ausgangslage und Zielbild

Die vorhandenen Unterlagen im Arbeitsordner zeigen, dass Stabsarbeit nicht nur aus Einzelaufgaben in S1 bis S6 besteht, sondern aus einem abgestimmten Zusammenspiel von:

- Lagefeststellung
- Lagedarstellung
- Nachrichtenbearbeitung
- Einsatztagebuch
- Auftrags- und Maßnahmensteuerung
- Ressourcen- und Kraeftefuehrung
- Versorgung und Logistik
- Kommunikation und Informationsweitergabe
- Besprechungs- und Entscheidungszyklen
- Dokumentation und Nachweisfuehrung

Die Software muss deshalb als gemeinsames System mit gemeinsamem Einsatzkern aufgebaut werden. Fachmodule fuer S1 bis S6 und KGS duerfen nicht isoliert entwickelt werden, sondern muessen auf denselben Stammdaten, denselben Zeitachsen und denselben Lageobjekten arbeiten.

### Zielbild

Die Zielanwendung ist:

- browserbasiert
- fuer mehrere Nutzer gleichzeitig nutzbar
- auf verschiedenen Geraeten einsetzbar
- rollen- und rechtegesteuert
- je Lage/Fall getrennt speicherbar
- revisionsfaehig dokumentierend
- fachlich an Stabsarbeit ausgerichtet
- modern, klar und serioes in der Bedienung

## 3. Fachliche Grundlagen aus den vorliegenden Unterlagen

Dieses Konzept orientiert sich inhaltlich an den im Ordner vorhandenen Unterlagen, insbesondere:

- [Fuehren mit Stab](./Fuehren%20mit%20Stab.pdf)
- [Aufgaben-und-Funktionen-der-KgS](./Aufgaben-und-Funktionen-der-KgS.pdf)
- [Hilfsmittel_S1-S6_Tischvorlage-Sachgebiete](./Hilfsmittel_S1-S6_Tischvorlage-Sachgebiete.pdf)
- [Krisenmanagement-durch-Krisenstaebe-in-Nordrhein-Westfalen_killthelayout](./Krisenmanagement-durch-Krisenstaebe-in-Nordrhein-Westfalen_killthelayout.pdf)
- [Stabsbesprechung - Leitfaden und Checkliste](./Stabsbesprechung%20-%20Leitfaden%20und%20Checkliste.pdf)
- [4-fach Aufbau & Anwendung](./4-fach%20Nachrichtenvordruck/4-fach%20Aufbau%20&%20Anwendung.pdf)
- [Einsatztagebuch (Leermaske)](./Einsatztagebuch/Einsatztagebuch%20%28Leermaske%29.docx)
- [Einsatztagebuch (Beamer)](./Einsatztagebuch/Einsatztagebuch%20%28Beamer%29.xlsx)
- [Versorgung von Einheiten](./Versorgung%20von%20Einheiten.pdf)
- [Zusammenfassung der Katastrophenschutzkonzepte NRW](./Zusammenfassung%20der%20Katastrophenschutzkonzepte%20NRW.pdf)

### Fachlich abgeleitete Leitlinien

- Stabsarbeit erfolgt taktisch, organisatorisch und dokumentationsbezogen in festen Zyklen.
- Nachrichten, Auftraege, Lageaenderungen und Tagebucheintraege muessen miteinander verknuepfbar sein.
- Lagedarstellung und Dokumentation sind keine Nebenfunktion, sondern Kernfunktion.
- Zeitstempel, Nutzerstempel und Nachvollziehbarkeit sind zwingend.
- Die Software muss sowohl operative Stabsarbeit als auch administrativ-organisatorische Unterstuetzung unterstuetzen.
- Die Gliederung nach S1 bis S6 ist sinnvoll, aber nur auf Grundlage eines gemeinsamen Systems.

## 4. Projektziel

Es soll eine webbasierte Stabsunterstuetzungssoftware entstehen, die:

- fuer mehrere parallele Lagen genutzt werden kann
- innerhalb einer Lage mehrere Arbeitsplaetze und Rollen bedient
- Aufgaben von KGS und S1 bis S6 abbildet
- Nachrichten, Lage, Auftraege, Ressourcen, Versorgung, Kommunikation und Dokumentation in einem System zusammenfuehrt
- rechtssicher und nachvollziehbar dokumentiert
- fuer reale Einsatz- und Uebungslagen nutzbar ist

## 5. Nicht-Ziele

Folgende Punkte sind in der ersten Ausbaustufe nicht primaeres Ziel:

- vollstaendige Anbindung externer Leitstellensysteme
- Funkbedienung aus der Anwendung heraus
- beliebige Individualisierung aller Prozesse ohne Standardisierung
- KI-gestuetzte Lagebewertung als Kernfunktion
- Ersatz aller bestehenden Fachverfahren in einer ersten Version

Diese Punkte koennen spaeter als Erweiterungen betrachtet werden.

## 6. Nutzergruppen und Rollen

### Primäre Nutzergruppen

- Einsatzleiter
- Leiter Stab
- KGS
- S1 Personal / Innerer Dienst
- S2 Lage
- S3 Einsatz
- S4 Versorgung
- S5 Presse / Medien / Bevoelkerungsinformation
- S6 Informations- und Kommunikationswesen
- Verbindungspersonen
- Fachberater
- Dokumentationspersonal
- Administratoren

### Rollenmodell

Mindestens folgende Systemrollen werden benoetigt:

- `System-Admin`
  - Benutzerverwaltung
  - Rechteverwaltung
  - Systemkonfiguration

- `Organisations-Admin`
  - Vorlagen, Standorte, Stammdaten, taktische Zeichenbibliothek

- `Lageleiter`
  - Lage anlegen, Rollen zuweisen, Lage freigeben, archivieren

- `Stabsleitung`
  - Lagebild sehen
  - Auftraege freigeben
  - Besprechungen steuern
  - priorisierte Probleme und Entscheidungen freigeben

- `Modulbearbeiter`
  - Bearbeitung innerhalb zugewiesener Fachmodule

- `Leser`
  - rein lesender Zugriff

- `Auditor / Nachbereitung`
  - Export, Auswertung, Nachweispruefung

### Rollenprinzipien

- Jeder Eintrag erhaelt einen Nutzerstempel.
- Jeder Eintrag erhaelt einen Zeitstempel.
- Kritische Objekte erhalten einen Freigabestatus.
- Rechte werden lagebezogen vergeben.
- Lesen und Schreiben koennen je Modul getrennt gesteuert werden.

## 7. Betriebs- und Nutzungsszenario

Die Software wird in einem Browser aufgerufen und erlaubt mehreren Nutzern die gleichzeitige Arbeit innerhalb derselben Lage. Aenderungen muessen nahezu in Echtzeit fuer andere Nutzer sichtbar werden. Jede Lage stellt einen eigenen, logisch getrennten Arbeitsraum dar. Nutzer koennen mehreren Lagen zugeordnet sein, ihre Rechte gelten aber immer lagebezogen.

Typische Endgeraete:

- PC-Arbeitsplatz im Stabsraum
- Notebook
- Tablet

Primärziel ist die Nutzung auf Desktop und Notebook. Tablets muessen fuer ausgewählte Funktionen sauber unterstuetzt werden, insbesondere Lageansicht, Tagebuch, Nachrichten, Aufgaben und Karte.

## 8. Kernprinzip der Softwarearchitektur

Die Software wird nach dem Prinzip `gemeinsamer Einsatzkern plus Fachmodule` aufgebaut.

### Gemeinsamer Einsatzkern

Der Einsatzkern enthaelt:

- Lageverwaltung
- Benutzer und Rollen
- Zeitachse
- Dokumentation
- Nachrichtenobjekte
- Aufgaben-/Auftragsobjekte
- Ressourcenobjekte
- Kartenobjekte
- Audit-Historie
- Dateianhaenge

### Fachmodule

Auf Basis des Einsatzkerns arbeiten:

- KGS-Modul
- S1-Modul
- S2-Modul
- S3-Modul
- S4-Modul
- S5-Modul
- S6-Modul
- Querschnittsmodule wie Dashboard, Suche, Berichte, Archiv

Vorteil dieses Ansatzes:

- keine Mehrfacherfassung
- konsistente Lage
- gemeinsame Zeitbasis
- gemeinsame Protokollierung
- modulare Erweiterbarkeit

## 9. Fachmodule im Detail

### 9.1 KGS / Innerer Dienst

Funktion:

- Stabsorganisation und innerer Dienst
- Nachrichtenzentrale
- Nachweisfuehrung
- Besprechungsunterstuetzung
- Problemlisten und Auftragsverfolgung

Kernfunktionen:

- Besetzungsuebersicht
- Anwesenheitskontrolle
- Rollen- und Funktionsbesetzung
- Raum- und Zugangsorganisation
- Nachrichten-Eingang / Ausgang / Sichtung / Nachweisung
- Besprechungskalender
- Problemliste mit Priorisierung
- Beschluss- und Auftragsliste

### 9.2 S1 Personal / Innerer Dienst

Funktion:

- Bereitstellung und Verwaltung von Personal, Reserven und innerem Dienst

Kernfunktionen:

- Kraefteuebersicht
- Personallisten
- Qualifikationen
- Schichten und Ablösungen
- Bereitstellungsraeume
- Lotsenstellen
- Reservemanagement
- Statusansicht eingesetzter und verfuegbarer Ressourcen
- Fahrzeug- und Personaluebersicht mit taktischen Zeichen

Besonderheit:

Die Abbildung taktischer Zeichen fuer Einheiten, Fahrzeuge und Organisationszugehoerigkeit ist ein fachlicher Mehrwert und soll von Beginn an vorgesehen werden.

### 9.3 S2 Lage

Funktion:

- Lagefeststellung, Lagebewertung, Lagedarstellung und Dokumentation

Kernfunktionen:

- Lagemeldungen erfassen
- Meldungen bewerten
- Gefahren- und Schadenlage dokumentieren
- Lagekarte fuehren
- Einsatzuebersichten fuehren
- Einsatztagebuch fuehren
- Lagebesprechungen vorbereiten
- Lagevortrag strukturieren
- Abschlussbericht vorbereiten

S2 ist das zentrale Integrationsmodul. Von hier aus muessen Nachrichten, Kartenobjekte, Ereignisse, Auftraege und Tagebucheintraege miteinander verknuepfbar sein.

### 9.4 S3 Einsatz

Funktion:

- Entschlussfassung, Einsatzdurchfuehrung, Abschnittssteuerung

Kernfunktionen:

- Einsatzabschnitte anlegen
- Fuehrungskraefte und Verantwortlichkeiten zuweisen
- Auftraege formulieren
- Massnahmen planen und verfolgen
- Rueckmeldungen aufnehmen
- Schwerpunkte festlegen
- Sofortmassnahmen Bevoelkerungsschutz dokumentieren
- Folgeplanung und Reservenbedarf ableiten

### 9.5 S4 Versorgung

Funktion:

- Versorgung, Logistik, Unterbringung, Betriebsstoffe, Instandhaltung, Eigenschutz

Kernfunktionen:

- Bedarfsanforderungen erfassen
- Verpflegung planen
- Betriebsstoff- und Materialversorgung dokumentieren
- Unterbringung planen
- Instandhaltungsbedarfe verfolgen
- Eigenschutzmassnahmen abbilden
- Status von Logistikmitteln und Versorgungsleistungen darstellen

### 9.6 S5 Presse / Medien / Information der Bevoelkerung

Funktion:

- abgestimmte Oeffentlichkeitsarbeit und Warnkommunikation

Kernfunktionen:

- Meldungen und Texte vorbereiten
- Freigabeprozesse fuer externe Kommunikation
- Chronik veroeffentlichter Informationen
- Medienanfragen dokumentieren
- FAQs und Hinweise an die Bevoelkerung
- Lagebezogene Kommunikationsbausteine

### 9.7 S6 Informations- und Kommunikationswesen

Funktion:

- Kommunikationsplanung, Fernmeldeorganisation, Redundanz und Nachweisung

Kernfunktionen:

- Kommunikationskonzept
- Kanäle / Rufgruppen / Verbindungswege
- Geraete- und Verbindungslage
- Ausfall- und Stoerungsmanagement
- Dokumentation der Kommunikationsorganisation
- Unterstuetzung der Nachrichtenzentrale

## 10. Querschnittsfunktionen

Diese Funktionen muessen bereichsuebergreifend im Gesamtsystem vorhanden sein:

- Dashboard je Lage
- globale Suche
- Filter nach Zeit, Modul, Status, Priorität, Abschnitt
- Dateianhaenge
- Kartenansicht
- Aufgabenansicht
- Benachrichtigungen
- Export
- Archiv
- Vollstaendige Aenderungshistorie

## 11. Zentrale Kernobjekte des Datenmodells

Das System benoetigt ein konsistentes Datenmodell. Wichtige Kernobjekte:

- `Lage`
- `Benutzer`
- `Rolle`
- `Organisation`
- `Einheit`
- `Fahrzeug`
- `Person`
- `Nachricht`
- `Lagemeldung`
- `Tagebucheintrag`
- `Auftrag`
- `Massnahme`
- `Problem`
- `Entscheidung`
- `Einsatzabschnitt`
- `Bereitstellungsraum`
- `Versorgungsbedarf`
- `Kommunikationsmittel`
- `Kartenobjekt`
- `Anhang`
- `Audit-Ereignis`

### Verknuepfungsprinzip

Beispiel:

- Eine eingehende Nachricht kann eine Lagemeldung ausloesen.
- Eine Lagemeldung kann ein Problem erzeugen.
- Ein Problem kann zu einer Entscheidung fuehren.
- Eine Entscheidung kann in einen Auftrag muenden.
- Ein Auftrag kann Massnahmen und Rueckmeldungen erzeugen.
- Alle diese Objekte koennen im Tagebuch referenziert werden.
- Relevante Objekte koennen auf der Karte dargestellt werden.

Genau diese Verknuepfbarkeit macht die Anwendung einsatztauglich.

## 12. Workflows

### 12.1 Nachrichtenworkflow

Angelehnt an den 4-fach Nachrichtenvordruck:

1. Nachricht geht ein oder wird erstellt
2. Erfassung von Absender, Empfaenger, Zeit, Uebermittlungsart, Betreff, Inhalt
3. Sichtung und Bewertung
4. Nachweisung Eingang/Ausgang
5. Zuordnung an Fachmodul oder Person
6. optionale Uebernahme in Lage, Tagebuch, Auftrag oder Karte
7. Statusverfolgung

### 12.2 Tagebuchworkflow

Angelehnt an die vorhandenen Einsatztagebuchvorlagen:

1. Eintrag anlegen
2. Zeitstempel setzen
3. Nutzer automatisch zuordnen
4. Kategorie und Bezug waehlen
5. Inhalt strukturiert erfassen
6. Anhaenge oder Verweise hinzufuegen
7. Freigabe oder Korrekturhistorie protokollieren

### 12.3 Lagebesprechungsworkflow

Auf Basis der Checkliste fuer Stabsbesprechungen:

1. Besprechung anlegen
2. Teilnehmer erfassen
3. Lagevortrag vorbereiten
4. Probleme visualisieren
5. Priorisieren
6. Loesungsoptionen dokumentieren
7. Entscheidungen festhalten
8. Auftraege erzeugen
9. Nachverfolgung starten

### 12.4 Ressourcenworkflow

1. Einheit oder Fahrzeug erfassen
2. Status zuweisen
3. Standort / Einsatzabschnitt zuordnen
4. Verfuegbarkeit pruefen
5. Bedarf und Einsatz dokumentieren
6. Aenderungen historisieren

## 13. Anforderungen an die Benutzeroberflaeche

Die Oberflaeche muss modern, ruhig, professionell und lagegerecht sein. Sie darf nicht verspielt sein. Sie muss schnellen Zugriff, gute Lesbarkeit und geringe Fehlbedienung priorisieren.

### Grundprinzipien

- klare Informationshierarchie
- grosse, gut erfassbare Tabellen und Listen
- starke Filter- und Suchfunktionen
- deutliche Statuskennzeichnung
- Dunkel-/Hellkontrast ausreichend fuer laengere Nutzung
- Fokus auf Arbeitsfaehigkeit unter Zeitdruck

### Wichtige Ansichten

- Lage-Dashboard
- Nachrichtenliste
- Tagebuch
- Karte
- Kraefte- und Fahrzeuglage
- Auftragsboard
- Versorgungsstatus
- Kommunikationslage
- Besprechungsansicht
- Verlauf / Historie

## 14. Karten- und Lagedarstellung

Die Lagedarstellung ist eine Kernfunktion und muss von Anfang an technisch mitgedacht werden.

### Kartenanforderungen

- Grundkarte
- Lageobjekte setzen
- Einsatzabschnitte darstellen
- Gefahrenbereiche darstellen
- Sammelstellen, Bereitstellungsraeume, Sperren, Evakuierungsbereiche darstellen
- Kraefte und Fahrzeuge darstellen
- Statusfarben nutzen
- taktische Zeichen nutzen
- Layer ein- und ausblendbar machen
- Zeitbezug fuer Kartenobjekte hinterlegen

### Taktische Zeichen

Fuer S1 und S2 soll eine Bibliothek taktischer Zeichen vorgesehen werden:

- Fahrzeuge
- Einheiten
- Fuehrungsebenen
- Versorgungs- und Logistikkomponenten
- medizinische Komponenten
- sonstige lagebezogene Symbole

Technisch sinnvoll ist eine vektorbasierte Umsetzung, zum Beispiel per SVG, damit die Darstellung sauber skalierbar bleibt.

## 15. Dokumentation, Nachvollziehbarkeit und Revisionsfaehigkeit

Diese Software muss lueckenlos nachvollziehbar sein. Das betrifft nicht nur Tagebuch und Nachrichten, sondern jede fachlich relevante Aenderung.

### Pflichtfelder fuer kritische Objekte

- Ersteller
- Erstellzeitpunkt
- letzter Bearbeiter
- letzter Bearbeitungszeitpunkt
- Status
- Freigabestatus
- Bezugsobjekte

### Audit-Anforderungen

- keine stille Ueberschreibung ohne Historie
- Aenderungen nachvollziehbar speichern
- optionale Versionierung kritischer Inhalte
- Exportmoeglichkeit fuer Nachbereitung, Revision und Nachweis

## 16. Mandanten- und Lagefaehigkeit

Das System muss mehrere Lagen getrennt verwalten koennen.

### Anforderungen

- jede Lage ist eigener Arbeitsraum
- Benutzer koennen mehreren Lagen zugeordnet sein
- Daten sind pro Lage logisch getrennt
- abgeschlossene Lagen werden archiviert
- archivierte Lagen bleiben lesbar und exportierbar

Optional spaeter:

- mehrere Organisationseinheiten oder Gebietskoerperschaften als Mandanten

## 17. Sicherheitsanforderungen

Da sensible lagebezogene und personenbezogene Daten verarbeitet werden, ist Sicherheit ein Kernpunkt.

### Mindestanforderungen

- Login mit Benutzerkonto
- sichere Passwortregeln
- verschluesselte Verbindungen
- Rollen- und Rechtepruefung
- Sitzungsmanagement
- Protokollierung sicherheitsrelevanter Ereignisse
- Backup-Konzept
- Berechtigungstrennung fuer Lese- und Schreibzugriffe

### Empfohlene Erweiterungen

- Zwei-Faktor-Authentisierung
- IP- oder Netzbereichsbeschraenkung fuer bestimmte Betriebsmodi
- Notfall-Benutzerkonzept
- Offline-Export fuer Ausfallszenarien

## 18. Technische Zielarchitektur

### Frontend

Browserbasierte Anwendung fuer moderne Desktop-Browser mit guter Tablet-Unterstuetzung.

### Backend

Zentrales API-Backend fuer:

- Geschaeftslogik
- Validierung
- Rechtepruefung
- Historisierung
- Benachrichtigungen
- Integrationen

### Datenbank

Relationale Datenbank fuer strukturierte Fachdaten, mit sauberem Schema fuer Lageobjekte, Nutzer, Rollen, Historie und Beziehungen.

### Echtzeit-Kommunikation

Echtzeit-Mechanismus fuer gleichzeitige Zusammenarbeit, damit:

- neue Nachrichten sofort sichtbar werden
- Tagebuch und Lage live aktualisiert werden
- Auftragsstatus synchron bleiben

### Dateiablage

Sichere Ablage fuer:

- Dokumente
- PDFs
- Bilder
- Exporte
- Kartenanhaenge

## 19. Technologierichtung

Die konkrete Technologie ist offen, aber das Zielbild spricht fuer einen klassischen Web-Stack mit:

- Web-Frontend
- API-Backend
- relationaler Datenbank
- Echtzeitkanal

Wichtiger als die exakte Technologie ist die Einhaltung dieser Eigenschaften:

- wartbar
- klar strukturiert
- deploymentfaehig
- ausbaubar
- testbar
- revisionsgeeignet

## 20. Integrationen und Schnittstellen

Spaetere Anbindung denkbar an:

- Leitstellenumgebungen
- Karten-/GIS-Dienste
- Benutzerverzeichnisse
- Export in PDF / Office-Formate
- Import bestehender Lage-/Ressourcendaten

In einer ersten Phase sollten Schnittstellen bewusst begrenzt bleiben. Zunaechst ist ein stabiles Kernsystem wichtiger als fruehe Systemkopplung.

## 21. Umsetzungsstrategie

Die Entwicklung soll in klaren Stufen erfolgen.

### Phase 0: Fachliche Konkretisierung

Ziel:

- Rollenbild finalisieren
- Begriffe vereinheitlichen
- Pflichtdaten je Kernobjekt definieren
- Priorisierung der ersten Funktionen

Ergebnisse:

- abgestimmtes Fachvokabular
- priorisierte Anforderungsliste
- Prozessuebersichten

### Phase 1: Plattformkern

Ziel:

- Login
- Benutzer und Rollen
- Lage anlegen, oeffnen, archivieren
- Audit-Basis
- Dateigrundlage

Ergebnisse:

- lauffaehiger Systemkern

### Phase 2: Nachrichten und Tagebuch

Ziel:

- digitale Nachrichtenerfassung
- Nachweisung Eingang/Ausgang
- Einsatztagebuch
- Basishistorie

Ergebnisse:

- erster echter Einsatznutzen

### Phase 3: S2 Lagekern

Ziel:

- Lagemeldungen
- Lageuebersicht
- Lagebesprechungen
- Problemliste
- erste Kartenfunktion

Ergebnisse:

- gemeinsames Lagebild

### Phase 4: S1 und S3

Ziel:

- Kraefte-/Fahrzeuglage
- taktische Zeichen
- Einsatzabschnitte
- Auftraege und Rueckmeldungen

Ergebnisse:

- operative Fuehrungsfaehigkeit steigt deutlich

### Phase 5: S4, S5, S6

Ziel:

- Versorgung
- Oeffentlichkeitsarbeit
- Kommunikationsplanung

Ergebnisse:

- umfassende Stabsunterstuetzung

### Phase 6: Berichte, Exporte, Nachbereitung

Ziel:

- Abschlussbericht
- Exportfunktionen
- Archiv
- Auswertungen

### Phase 7: Integrationen und Härtung

Ziel:

- Schnittstellen
- Sicherheitshärtung
- Performance
- Verfügbarkeit

## 22. MVP-Empfehlung

Der erste wirklich sinnvolle MVP sollte nicht bei S4 oder S5 beginnen, sondern bei den systemischen Kernfunktionen.

### MVP-Inhalt

- Login und Rollen
- Lageverwaltung
- Nachrichtenerfassung und Nachweisung
- Einsatztagebuch
- Lagemeldungen
- Problemliste
- Besprechungsprotokoll
- einfache Kraefte- und Fahrzeugliste
- einfache Kartenansicht

Damit entsteht bereits ein belastbarer erster Einsatzkern.

## 23. Test- und Qualitaetssicherung

### Fachliche Tests

- korrekte Abbildung der Arbeitsablaeufe
- Vollstaendigkeit der Pflichtfelder
- korrekte Rollen- und Rechtepruefung
- richtige Historisierung

### Technische Tests

- Unit-Tests
- Integrationstests
- Rechte- und Sicherheitspruefungen
- Lasttests fuer Mehrbenutzerbetrieb

### Praxistests

- tabletop-Uebungen
- Uebungslagen mit mehreren Nutzern
- Review durch fachkundige Stabsangehoerige

## 24. Einfuehrung und Betrieb

Fuer die Einfuehrung braucht es mehr als nur eine fertige Software.

### Noetig sind

- Betriebsverantwortung
- Administratorenkonzept
- Schulungskonzept
- Vorlagen- und Stammdatenpflege
- Handbuch / Kurzanleitungen
- Backup und Wiederanlauf

## 25. Risiken

### Fachliche Risiken

- zu fruehe technische Festlegung ohne geklaerte Prozesse
- zu viel Individualisierung
- Vermischung von formaler Dokumentation und informeller Notiz ohne Regelung

### Technische Risiken

- fehlende Historisierung
- unzureichende Echtzeit-Synchronisation
- schwaches Rechtekonzept
- zu komplexe Oberflaeche

### Organisatorische Risiken

- keine klaren fachlichen Produktverantwortlichen
- fehlende Testlagen mit realen Anwendern
- fehlende Pflege von Stammdaten und Vorlagen

## 26. Leitentscheidungen

Diese Entscheidungen gelten mit diesem Konzept als empfohlen:

1. Die Software wird browserbasiert entwickelt.
2. Die Software wird mehrbenutzerfaehig ausgelegt.
3. Die Software wird lagebezogen und speicherbar aufgebaut.
4. Die Software wird modular entwickelt, aber auf einem gemeinsamen Einsatzkern.
5. Zeitstempel, Nutzerstempel und Historisierung sind Pflicht.
6. S2, Nachrichten und Tagebuch bilden den fruehen Kern der Fachfunktion.
7. Taktische Zeichen und Kartenfunktion werden frueh mitgedacht.
8. Rechte- und Freigabelogik werden von Anfang an eingeplant.
9. Der technische Zielstack wird verbindlich mit Next.js, NestJS, PostgreSQL, Prisma, MapLibre GL JS, Tailwind CSS v4, Vitest, Playwright und Node.js 24 LTS festgelegt.

## 27. Empfehlung fuer das weitere Vorgehen

Als naechster Arbeitsschritt sollte aus diesem Konzept ein umsetzungsnahes Fach- und Entwicklungsmodell abgeleitet werden:

- Priorisierte Anforderungsliste
- Bildschirm- und Menuestruktur
- Datenmodell Version 1
- Prozessmodell fuer Nachrichten, Tagebuch, Lage, Auftraege
- MVP-Backlog

## 28. Regelung zur fortlaufenden Fortschreibung

Dieses Dokument ist ausdruecklich zur laufenden Weiterentwicklung vorgesehen.

### Fortschreibungsregeln

- Jede inhaltliche Aenderung erhaelt Versionsstand und Datum.
- Neue Entscheidungen werden im Entscheidungsprotokoll ergaenzt.
- Kommentare aus der Entwicklung werden nicht lose gesammelt, sondern geordnet eingearbeitet.
- Offene Punkte bleiben sichtbar, bis sie entschieden sind.

### Kommentararten fuer kuenftige Updates

- `Fachkommentar`
- `Technikkommentar`
- `UX-Kommentar`
- `Betriebskommentar`
- `Entscheidung`
- `Offener Punkt`

## 29. Entscheidungsprotokoll

### Entscheidung 2026-05-13-01

Die Zielanwendung wird als browserbasierte Mehrbenutzeranwendung konzipiert.

Begruendung:

- mehrere Nutzer
- verschiedene Geraete
- zentrale Datenhaltung
- einheitlicher Lagearbeitsraum

### Entscheidung 2026-05-13-02

Die Fachstruktur wird modular nach KGS und S1 bis S6 aufgebaut, jedoch auf einem gemeinsamen Einsatzkern.

Begruendung:

- fachlich getrennte Verantwortungsbereiche
- gemeinsame Lage und gemeinsame Dokumentation
- bessere Erweiterbarkeit

### Entscheidung 2026-05-13-03

Nachrichten, Tagebuch und Lage werden als frueher MVP-Kern priorisiert.

Begruendung:

- hoher fachlicher Nutzen
- zentrale Integrationsfunktion
- gute Grundlage fuer spaetere Module

### Entscheidung 2026-05-13-04

Der technische Zielstack wird verbindlich wie folgt festgelegt:

- Frontend: Next.js mit App Router, React, TypeScript
- UI: Tailwind CSS v4
- Backend: NestJS mit TypeScript
- API: REST plus WebSocket
- Datenbank: PostgreSQL
- ORM: Prisma
- Karte: MapLibre GL JS
- Tests: Vitest und Playwright
- Runtime: Node.js 24 LTS

Begruendung:

- guter Fit fuer browserbasierte Mehrbenutzeranwendung
- klare Trennung von UI und Fachlogik
- starke Basis fuer Rollen, Audit, Echtzeit und Kartenfunktion
- wartbar und realistisch ausbaubar

## 30. Offene Punkte

- Soll das System nur fuer eine Organisation oder spaeter mandantenfaehig fuer mehrere Traeger ausgelegt werden?
- Welche taktischen Zeichensysteme sollen verbindlich verwendet werden?
- Welche Exportformate sind zwingend erforderlich?
- Soll spaeter Offline-Betrieb in Teilfunktionen unterstuetzt werden?
- Welche externen Systeme muessen real angebunden werden?

## 31. Entwicklungs-Kommentarprotokoll

Dieser Abschnitt ist fuer fortlaufende Pflege vorgesehen. Hier koennen waehrend der Entwicklung strukturierte Kommentare eingetragen werden.

### Eintragsformat

- Datum
- Typ
- Bezug
- Kommentar
- Konsequenz
- Status

### Beispiel

- Datum: 2026-05-13
- Typ: Technikkommentar
- Bezug: Echtzeit-Synchronisation
- Kommentar: Gleichzeitige Bearbeitung von Tagebuch und Nachrichten erfordert Konfliktstrategie.
- Konsequenz: Architektur muss Optimistic Locking oder vergleichbare Mechanismen vorsehen.
- Status: offen

### Eintrag 2026-05-13-01

- Datum: 2026-05-13
- Typ: Technikkommentar
- Bezug: MVP 0.1 Fundament
- Kommentar: Monorepo-Grundgeruest mit Next.js-Frontend, NestJS-API, Demo-Login, Rollenbasis und erster Lageverwaltung angelegt.
- Konsequenz: Die naechste technische Ausbaustufe kann direkt mit persistentem Auth-/Lagekern auf Basis von PostgreSQL und Prisma beginnen.
- Status: umgesetzt

## 32. Schlussbewertung

Die angedachte Software ist fachlich sinnvoll und hat hohes praktisches Potenzial. Der Ansatz ist tragfaehig, wenn die Entwicklung konsequent an echten Stabsablaeufen orientiert bleibt und nicht in einer reinen Formularsammlung endet.

Die wichtigste Leitidee lautet:

`Nicht einzelne Sachgebiete digitalisieren, sondern einen gemeinsamen, nachvollziehbaren und lagebezogenen Arbeitsraum fuer Stabsarbeit schaffen.`

Damit ist die Grundlage gelegt, auf der die weitere Fach- und Systementwicklung belastbar aufbauen kann.
