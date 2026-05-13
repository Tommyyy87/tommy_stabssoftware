# Lastenheft Stabsunterstuetzungssoftware

Version: 1.0  
Stand: 2026-05-13  
Status: Arbeitsstand / Ausschreibungs- und Abstimmungsgrundlage  
Bezug: [Stabsunterstuetzungssoftware-Konzept](./Stabsunterstuetzungssoftware-Konzept.md)

## 1. Zweck des Lastenhefts

Dieses Lastenheft beschreibt die fachlichen, funktionalen, technischen und organisatorischen Anforderungen an eine browserbasierte Stabsunterstuetzungssoftware. Es dient als verbindliche Grundlage fuer:

- fachliche Abstimmung
- Priorisierung
- Ausschreibung oder Angebotsvergleich
- spaetere Erstellung eines Pflichtenhefts
- Entwicklung und Abnahme

Das Lastenheft beschreibt `was` das System leisten soll. Die konkrete technische Umsetzung des `wie` ist Gegenstand des spaeteren Pflichtenhefts.

## 2. Ausgangslage

Stabsarbeit in Grossschadenslagen, Krisen und Katastrophen erfordert:

- gleichzeitige Zusammenarbeit mehrerer Funktionen
- ein gemeinsames und aktuelles Lagebild
- nachvollziehbare Dokumentation
- strukturierte Nachrichtenbearbeitung
- Fuehrung von Kraeften, Fahrzeugen, Auftraegen und Versorgung
- Lagebesprechungen mit priorisierten Problemen und Entscheidungen

Vorhandene Arbeitsmittel wie Nachrichtenvordrucke, Einsatztagebuch, Lagekarten und Fachunterlagen sollen nicht nur digital abgebildet, sondern in einem gemeinsamen lagebezogenen System zusammengefuehrt werden.

## 3. Ziel des Vorhabens

Ziel ist die Einfuehrung einer modernen, serioesen, fachlich korrekten und einsatztauglichen Webanwendung, die:

- in einem Browser laeuft
- von mehreren Nutzern gleichzeitig genutzt werden kann
- auf mehreren Geraeten nutzbar ist
- je Lage einen getrennten Arbeitsraum bereitstellt
- KGS sowie S1 bis S6 fachlich unterstuetzt
- revisionsfaehige Dokumentation sicherstellt
- fuer reale Einsatzlagen und Uebungen nutzbar ist

## 4. Einsatzbereich

Die Software ist vorgesehen fuer:

- Fuehrungsstaebe nach FwDV 100
- KGS / Krisenstabsunterstuetzung
- Verwaltungsnahe und operativ-taktische Stabsarbeit
- Einsatzlagen, Grossschadenslagen, Krisen und Katastrophen
- Uebungsbetrieb

## 5. Zielgruppen

Primäre Zielgruppen:

- Einsatzleiter
- Leiter Stab
- KGS
- S1
- S2
- S3
- S4
- S5
- S6
- Verbindungspersonen
- Fachberater
- Dokumentationspersonal
- Administratoren

Sekundaere Zielgruppen:

- Auswerter / Nachbereitung
- Ausbildungs- und Uebungspersonal
- lesende Fuehrungskraefte

## 6. Allgemeine Produktanforderungen

### 6.1 Grundlegende Eigenschaften

Die Software muss:

- browserbasiert sein
- mehrbenutzerfaehig sein
- rollen- und rechtegesteuert sein
- mehrere Lagen getrennt verwalten koennen
- nachvollziehbar protokollieren
- speicherbar und archivierungsfaehig sein
- strukturiert exportierbare Daten bereitstellen

### 6.2 Qualitative Zielmerkmale

Die Software soll:

- modern und professionell wirken
- schnell bedienbar sein
- auch unter Zeitdruck sicher nutzbar sein
- moeglichst wenig Doppelerfassung verursachen
- klare und fachlich passende Begriffe nutzen

## 7. Muss-, Soll- und Kann-Anforderungen

### 7.1 Muss-Anforderungen

Diese Anforderungen sind fuer den Projekterfolg zwingend.

#### 7.1.1 Plattform und Betrieb

- Das System muss im Webbrowser nutzbar sein.
- Das System muss fuer mehrere Benutzer gleichzeitig nutzbar sein.
- Das System muss auf Desktop-Systemen vollstaendig nutzbar sein.
- Das System muss je Lage einen getrennten Arbeitsraum bereitstellen.
- Das System muss Daten persistent speichern.
- Das System muss archivierte Lagen lesbar halten.

#### 7.1.2 Benutzer und Rechte

- Das System muss Benutzerkonten unterstuetzen.
- Das System muss Login-Funktionalitaet bereitstellen.
- Das System muss Rollen und Rechte je Lage vergeben koennen.
- Das System muss Aktionen Nutzern zuordnen koennen.
- Das System muss Schreib- und Leserechte differenzieren koennen.

#### 7.1.3 Dokumentation und Nachvollziehbarkeit

- Das System muss fuer fachlich relevante Eintraege Zeitstempel speichern.
- Das System muss fuer fachlich relevante Eintraege Nutzerstempel speichern.
- Das System muss Aenderungen nachvollziehbar protokollieren.
- Das System muss ein Einsatztagebuch fuehren koennen.
- Das System muss Nachrichten dokumentieren und nachweisen koennen.

#### 7.1.4 Lage- und Einsatzbezug

- Das System muss lagebezogen arbeiten.
- Das System muss Lagemeldungen erfassen und speichern koennen.
- Das System muss ein gemeinsames Lagebild unterstuetzen.
- Das System muss Besprechungen, Probleme, Entscheidungen und Auftraege dokumentieren koennen.

#### 7.1.5 Fachmodule

- Das System muss KGS-Funktionen unterstuetzen.
- Das System muss Funktionen fuer S1 bis S6 vorsehen.
- Das System muss mindestens die fruehen Kernfunktionen fuer Nachrichtenerfassung, Lage und Tagebuch bereitstellen.

#### 7.1.6 Karten- und Lageunterstuetzung

- Das System muss eine Karten- oder Lagedarstellung unterstuetzen.
- Das System muss lagebezogene Kartenobjekte speichern koennen.
- Das System muss taktische Zeichen technisch vorsehen.

#### 7.1.7 Export und Sicherung

- Das System muss Daten exportierbar machen.
- Das System muss ein Backup- und Wiederherstellungskonzept unterstuetzen.

### 7.2 Soll-Anforderungen

Diese Anforderungen sind fachlich sehr sinnvoll und sollten in der Zielausbaustufe vorhanden sein.

- Das System soll auch auf Tablets sinnvoll nutzbar sein.
- Das System soll Aenderungen in nahezu Echtzeit fuer andere Nutzer sichtbar machen.
- Das System soll Auftragsverfolgung mit Status und Rueckmeldung ermoeglichen.
- Das System soll Kartenlayer und Filter anbieten.
- Das System soll taktische Zeichen in einer Bibliothek bereitstellen.
- Das System soll Vorlagen fuer Lagebesprechungen und Lagevortraege enthalten.
- Das System soll strukturierte Dashboards je Rolle oder Lage bereitstellen.
- Das System soll Such- und Filterfunktionen ueber alle relevanten Daten bieten.
- Das System soll Dateianhaenge und Medien verwalten koennen.
- Das System soll Abschlussberichte und Nachbereitungsunterlagen unterstuetzen.

### 7.3 Kann-Anforderungen

Diese Anforderungen sind optionale Erweiterungen.

- Das System kann spaeter externe Schnittstellen anbinden.
- Das System kann spaeter Offline-Teilfunktionen unterstuetzen.
- Das System kann spaeter Zwei-Faktor-Authentisierung ergaenzen.
- Das System kann spaeter GIS- oder Leitstellenintegrationen erhalten.
- Das System kann spaeter mandantenfaehig fuer mehrere Traeger ausgebaut werden.

## 8. Funktionale Anforderungen im Detail

## 8.1 Lageverwaltung

### Ziel

Verwaltung und Trennung mehrerer Einsatz- oder Krisenlagen.

### Muss

- Lage anlegen
- Lage bearbeiten
- Lage schliessen
- Lage archivieren
- Benutzer einer Lage zuordnen
- Rollen je Lage vergeben

### Soll

- Lagevorlagen
- Favoriten oder Schnellzugriff auf aktive Lagen

## 8.2 Benutzer- und Rechteverwaltung

### Muss

- Benutzer anlegen
- Benutzer sperren oder deaktivieren
- Rollen definieren
- Rollen je Lage zuweisen
- Rechte pruefen
- Benutzeraktionen protokollieren

### Soll

- Gruppen oder Organisationsrollen
- Passwort-Zuruecksetzen durch berechtigte Administratoren

## 8.3 Nachrichtenerfassung und Nachweisung

### Ziel

Digitale Abbildung der ein- und ausgehenden Nachrichten in Anlehnung an den 4-fach Nachrichtenvordruck.

### Muss

- Nachricht anlegen
- Eingang und Ausgang unterscheiden
- Absender und Empfaenger erfassen
- Zeit erfassen
- Uebermittlungsart erfassen
- Nachrichtentext erfassen
- Nachweisnummer fuehren
- Bearbeitungsstatus fuehren
- Weiterleitung oder Zuweisung unterstuetzen

### Soll

- strukturierte Vorlagen fuer Meldearten
- Verknuepfung zu Tagebuch, Lage oder Auftrag

## 8.4 Einsatztagebuch

### Ziel

Fortlaufende, nachvollziehbare Einsatzdokumentation.

### Muss

- Eintrag anlegen
- laufende Nummer fuehren
- Zeit und Datum erfassen
- Ersteller dokumentieren
- Inhalt dokumentieren
- Bezug zu Nachricht, Auftrag, Lage oder Anhang herstellen koennen

### Soll

- verschiedene Kategorien
- Export als dokumentationsfaehige Ausgabe
- Freigabe- oder Gegenzeichnungsfunktion

## 8.5 Lagemeldungen und Lagebild

### Muss

- Lagemeldung erfassen
- Prioritaet oder Relevanz abbilden
- Status abbilden
- Quelle der Meldung dokumentieren
- Verknuepfung zu Kartenobjekten erlauben

### Soll

- aggregierte Lageuebersicht
- visuelle Hervorhebung kritischer Entwicklungen

## 8.6 Lagebesprechungen, Probleme, Entscheidungen

### Muss

- Besprechungen anlegen
- Teilnehmer erfassen
- Probleme erfassen
- Priorisierung dokumentieren
- Entscheidungen dokumentieren
- Entscheidungen in Auftraege ueberfuehren koennen

### Soll

- Besprechungsvorlagen
- Wiedervorlagen
- offene Punkte verfolgen

## 8.7 Aufgaben- und Auftragsmanagement

### Muss

- Auftrag anlegen
- Verantwortliche Stelle zuweisen
- Status fuehren
- Frist oder Termin hinterlegen koennen
- Rueckmeldungen dokumentieren

### Soll

- Priorisierung
- Abhaengigkeiten zwischen Auftraegen
- automatische Wiedervorlage

## 8.8 S1 Personal und innerer Dienst

### Muss

- Kraefte erfassen
- personelle Zuordnung dokumentieren
- Verfuegbarkeit abbilden
- Bereitstellungsraeume dokumentieren koennen

### Soll

- Schicht- und Ablöseplanung
- Qualifikationen
- Reservemanagement
- Fahrzeug- und Personalansicht mit taktischen Zeichen

## 8.9 S2 Lage

### Muss

- Lageinformationen sammeln
- Lagebild pflegen
- Tagebuch fuehren oder mitfuehren
- Lagebesprechung unterstuetzen

### Soll

- strukturierter Lagevortrag
- Abschlussberichtsbasis
- Verknuepfung mit Karten- und Ressourcenlage

## 8.10 S3 Einsatz

### Muss

- Einsatzabschnitte dokumentieren koennen
- Fuehrungsverantwortung abbilden koennen
- Auftrags- und Massnahmenlage abbilden koennen

### Soll

- Massnahmenplanung
- Schwerpunktdarstellung
- Rueckmeldelogik aus Einsatzabschnitten

## 8.11 S4 Versorgung

### Muss

- Versorgungsbedarfe erfassen koennen
- Versorgungslagen dokumentieren koennen

### Soll

- Verpflegung
- Unterbringung
- Betriebsstoffe
- Materialnachforderung
- Eigenschutzdarstellung

## 8.12 S5 Presse / Medien / Information

### Muss

- externe Informationsbausteine dokumentieren koennen
- Freigabestatus abbilden koennen

### Soll

- Freigabeworkflow
- Historie veroeffentlichter Mitteilungen
- Sammlung abgestimmter Textbausteine

## 8.13 S6 Informations- und Kommunikationswesen

### Muss

- Kommunikationsorganisation dokumentieren koennen
- Kommunikationsmittel oder Verbindungswege darstellen koennen

### Soll

- Rufgruppen- und Kanalverwaltung
- Stoerungsdokumentation
- Redundanzdarstellung

## 8.14 Karte und taktische Zeichen

### Muss

- Lageobjekte auf Karte oder Lageflaeche speichern koennen
- Kartenobjekte einer Lage zuordnen
- Kartenobjekte zeitlich und fachlich beschreiben koennen

### Soll

- Layer
- Filter
- Statusfarben
- taktische Zeichenbibliothek
- Abschnittsdarstellung

## 8.15 Suche und Filter

### Muss

- Daten innerhalb einer Lage auffindbar machen

### Soll

- Volltextsuche
- Suche nach Modul, Zeit, Status, Verantwortlichkeit, Abschnitt

## 8.16 Anhaenge und Dateien

### Muss

- Dateien hochladen und einem fachlichen Objekt zuordnen koennen

### Soll

- Vorschau
- Dokumentkategorien
- Versionierung fuer relevante Dokumente

## 8.17 Export und Berichtswesen

### Muss

- Daten exportieren koennen
- Tagebuch und wesentliche Dokumentation ausgeben koennen

### Soll

- PDF-Export
- strukturierte Einsatzchronik
- Abschlussberichtsexport

## 9. Nicht-funktionale Anforderungen

## 9.1 Benutzbarkeit

### Muss

- Die Oberflaeche muss klar strukturiert sein.
- Die Oberflaeche muss fuer laengere Arbeitsphasen geeignet sein.
- Wichtige Informationen muessen schnell erfassbar sein.

### Soll

- Das System soll auf gaengigen Bildschirmgroessen gut nutzbar sein.
- Das System soll Rollen oder Aufgaben durch angepasste Ansichten unterstuetzen.

## 9.2 Performance

### Muss

- Die Anwendung muss bei ueblichen Arbeitsablaeufen fluessig nutzbar sein.

### Soll

- Listen- und Filtervorgaenge sollen spuerbar schnell reagieren.
- Gleichzeitige Bearbeitung durch mehrere Nutzer soll praxistauglich bleiben.

## 9.3 Verfuegbarkeit

### Muss

- Das System muss fuer den vorgesehenen Einsatzbetrieb stabil betrieben werden koennen.
- Es muss ein Sicherungs- und Wiederherstellungskonzept geben.

## 9.4 Sicherheit

### Muss

- Benutzer muessen sich authentifizieren.
- Rechte muessen serverseitig geprueft werden.
- Verbindungen muessen geschuetzt sein.
- sicherheitsrelevante Ereignisse muessen protokollierbar sein.

### Soll

- 2FA
- zentrale Benutzerverwaltung
- Passwort- und Sitzungsrichtlinien

## 9.5 Wartbarkeit

### Muss

- Das System muss erweiterbar und wartbar aufgebaut sein.

### Soll

- modulare Architektur
- nachvollziehbare Konfiguration
- testbare Komponenten

## 10. Datenanforderungen

### Muss

- Das System muss strukturierte Fachdaten speichern.
- Das System muss Beziehungen zwischen Nachrichten, Lage, Tagebuch, Auftraegen und Kartenobjekten abbilden.
- Das System muss Daten lagebezogen trennen.

### Soll

- Stammdatenverwaltung fuer Organisationen, Einheiten, Fahrzeuge und Vorlagen

## 11. Schnittstellenanforderungen

### Muss

- Exporte muessen moeglich sein.

### Soll

- API-Faehigkeit
- spaetere Import- und Exportschnittstellen
- GIS-Anbindung
- Verzeichnisdienstanbindung

## 12. Betriebsanforderungen

### Muss

- Es muss ein Rollenmodell fuer Administration und Fachbetrieb geben.
- Es muss ein Backup-Konzept geben.
- Es muss ein Verfahren fuer Benutzerpflege geben.

### Soll

- Schulungskonzept
- Betriebshandbuch
- Administratorenleitfaden

## 13. Abgrenzungen

Nicht Gegenstand dieses Lastenhefts in Version 1.0:

- vollstaendige Leitstellenersetzung
- direkte Funkbetriebsfuehrung
- automatisierte Lagebewertung per KI als Kernfunktion
- unbegrenzte Individualkonfiguration ohne Standardmodell

## 14. Priorisierung fuer die Umsetzung

### Prioritaet A

- Login und Rechte
- Lageverwaltung
- Nachrichtenerfassung und Nachweisung
- Einsatztagebuch
- Lagemeldungen
- Besprechungen / Probleme / Entscheidungen

### Prioritaet B

- einfache Karte
- Kraefte- und Fahrzeuglage
- Auftragsmanagement
- S1/S3-Funktionstiefe

### Prioritaet C

- S4/S5/S6-Ausbau
- umfangreiche Dashboards
- erweiterte Exporte
- Schnittstellen

## 15. Abnahmekriterien auf hoher Ebene

Die Anwendung gilt fachlich nur dann als abnahmefaehig, wenn mindestens nachgewiesen ist:

- Benutzer koennen sich anmelden.
- Benutzer koennen einer Lage mit Rollen zugeordnet werden.
- Eine Lage kann angelegt, bearbeitet und archiviert werden.
- Nachrichten koennen dokumentiert und nachgewiesen werden.
- Tagebucheintraege koennen nachvollziehbar erstellt werden.
- Lagemeldungen, Probleme und Entscheidungen koennen erfasst werden.
- Daten sind mit Zeit- und Nutzerbezug nachvollziehbar.
- Mehrere Nutzer koennen im selben Lagearbeitsraum arbeiten.

## 16. Offene Fachfragen

- Welche Rollen sind organisatorisch verbindlich?
- Welche Begriffe und Kategorien sollen normiert werden?
- Welche Exporte muessen zwingend formal verwertbar sein?
- Welche Mindestanforderungen gelten fuer mobile Nutzung?
- Welche taktischen Zeichen sollen verbindlich bereitgestellt werden?

## 17. Fortschreibung

Dieses Lastenheft ist fortschreibbar. Aenderungen muessen versioniert werden.

### Aenderungsregeln

- jede Aenderung mit Datum und Version
- Anforderungen nicht still aendern, sondern nachvollziehbar fortschreiben
- neue Anforderungen mit Priorisierung aufnehmen
- entfallene Anforderungen kennzeichnen

## 18. Aenderungsprotokoll

### Version 1.0 - 2026-05-13

- Erstfassung des Lastenhefts auf Grundlage des Gesamtkonzepts und der vorhandenen Fachunterlagen erstellt.
