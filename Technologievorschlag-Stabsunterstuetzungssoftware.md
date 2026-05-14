# Technologievorschlag Stabsunterstuetzungssoftware

Version: 1.4  
Stand: 2026-05-14  
Status: Festgelegt  
Bezug:

- [Stabsunterstuetzungssoftware-Konzept](./Stabsunterstuetzungssoftware-Konzept.md)
- [Lastenheft-Stabsunterstuetzungssoftware](./Lastenheft-Stabsunterstuetzungssoftware.md)
- [Pflichtenheft-Stabsunterstuetzungssoftware](./Pflichtenheft-Stabsunterstuetzungssoftware.md)
- [Umsetzungsplan-Stabsunterstuetzungssoftware](./Umsetzungsplan-Stabsunterstuetzungssoftware.md)

## 1. Zweck

Dieses Dokument legt eine konkrete technologische Richtung fuer die Entwicklung der Stabsunterstuetzungssoftware fest. Es soll eine belastbare Grundlage fuer Projektstart, Repo-Aufbau und MVP-Umsetzung schaffen.

Die Empfehlung ist bewusst nicht maximal "trendy", sondern auf diese Ziele optimiert:

- Mehrbenutzerfaehigkeit
- Browserbetrieb
- klare Rechte- und Rollenlogik
- Revisions- und Auditfaehigkeit
- gute Kartenintegration
- spaetere Erweiterbarkeit
- realistisch betreibbare Architektur

## 2. Kurzempfehlung

Empfohlener Zielstack:

- `Frontend`: Next.js mit App Router, React, TypeScript
- `UI`: Tailwind CSS v4, eigene anwendungsnahe Komponenten
- `Backend`: NestJS mit TypeScript
- `API`: REST fuer Kernlogik, WebSocket fuer Echtzeit
- `Datenbank`: PostgreSQL
- `ORM`: Prisma ORM
- `Authentifizierung`: anwendungseigene Login-Loesung im Backend, spaeter optional OIDC/SSO
- `Echtzeit`: Socket.IO oder vergleichbare WebSocket-Schicht
- `Karte`: MapLibre GL JS
- `Tests`: Vitest fuer Unit/Integration, Playwright fuer End-to-End
- `Deployment`: Docker-basiert, getrennte Umgebungen fuer Dev/Test/Prod

## 3. Konkrete Empfehlung

## 3.1 Frontend

### Empfehlung

- `Next.js` mit `App Router`
- `React`
- `TypeScript`

### Begruendung

- browserbasierte Anwendung mit sehr guter Basis fuer moderne Oberflaechen
- sehr gute TypeScript-Unterstuetzung
- gute Trennung zwischen Seitenstruktur, Komponenten und Datenzugriff
- geeignet fuer interne Webanwendungen mit komplexen Formularen, Tabellen und Detailansichten

### Architekturentscheidung

Ich empfehle `Next.js` fuer das Frontend, aber **nicht** als alleinigen Full-Stack-Kern der gesamten Fachlogik.

Begruendung:

- Die Anwendung braucht klare Fachgrenzen, Audit, Rollen, Echtzeit und spaeter moegliche Integrationen.
- Das laesst sich robuster mit einem getrennten Backend umsetzen.
- Next.js bleibt damit UI- und Frontend-Orchestrierung, nicht der zentrale fachliche Serverkern.

### Entscheidung

- `Ja` zu Next.js
- `Ja` zu App Router
- `Nein` zu "alles nur in Next API Routes" als Gesamtarchitektur

## 3.2 UI-Ansatz

### Empfehlung

- `Tailwind CSS v4`
- eigene fachbezogene Komponentenbibliothek im Projekt

### Begruendung

- schneller Aufbau konsistenter Arbeitsoberflaechen
- gute Kontrolle ueber Tabellen, Formulare, Statusfarben und Layout
- keine starre Bindung an eine schwere Enterprise-Komponentenbibliothek

### Wichtig

Die Anwendung sollte nicht aus einer generischen Admin-Template-Oberflaeche zusammengebaut werden. Die Kernansichten wie Tagebuch, Nachrichten, Lage, Auftragsboard und Karte muessen fachlich designt sein, nicht nur visuell "schick".

## 3.3 Backend

### Empfehlung

- `NestJS`
- `TypeScript`

### Begruendung

Fuer dieses Projekt ist ein separates Backend die bessere Entscheidung als ein rein frontendnaher Full-Stack-Ansatz.

NestJS ist hier sinnvoll, weil:

- klare modulare Architektur
- gute Struktur fuer Rollen, Guards, Validierung und Fachmodule
- gute Eignung fuer langfristig wartbare Teamprojekte
- saubere Trennung von HTTP, WebSocket, Services und Datenzugriff

### Rolle des Backends

Das Backend soll der zentrale Ort sein fuer:

- Authentifizierung
- Autorisierung
- Geschaeftslogik
- Audit-Logik
- Exportlogik
- Echtzeitereignisse
- Datenvalidierung

## 3.4 API-Stil

### Empfehlung

- `REST API` fuer die Kernfunktionen
- `WebSocket` fuer Live-Aktualisierung

### Begruendung

REST ist fuer dieses Vorhaben die pragmatischste und robusteste Wahl:

- leicht testbar
- klar strukturierbar
- fuer interne Fachsysteme gut beherrschbar
- gut kombinierbar mit rollen- und objektbezogener Rechtepruefung

GraphQL ist hier aus meiner Sicht anfangs nicht die beste Wahl. Es bringt Flexibilitaet, aber auch zusaetzliche Komplexitaet, die fuer `MVP 0.1` bis `1.0` keinen entscheidenden Vorteil bringt.

## 3.5 Datenbank

### Empfehlung

- `PostgreSQL`

### Begruendung

PostgreSQL ist fuer dieses Projekt die richtige Basis:

- robust
- relational stark
- sehr gut fuer komplexe Beziehungen
- geeignet fuer Audit, Historie, Rechte, Aufgaben, Lageobjekte und spaetere Geodaten

### Versionsentscheidung

Als Produktivziel empfehle ich:

- `PostgreSQL 17.x` als konservative Anfangsbasis

Technische Einordnung:

- Zum Stand `2026-05-13` ist laut offizieller PostgreSQL-Dokumentation `PostgreSQL 18` die aktuelle Hauptversion; auf der Dokumentationsseite ist `18.3` als aktuelle Dokumentation ausgewiesen.
- Meine Empfehlung fuer `17.x` ist eine bewusst konservative Projektentscheidung, nicht eine Aussage, dass `18.x` ungeeignet waere.

Wenn das Projekt ohne externe Zwange neu aufgesetzt wird und ihr bewusst auf die aktuelle Hauptversion gehen wollt, ist `18.x` ebenfalls vertretbar.

## 3.6 ORM

### Empfehlung

- `Prisma ORM`

### Begruendung

Prisma ist fuer dieses Vorhaben stark, weil:

- TypeScript-orientiert
- klare Schemapflege
- gute Entwicklerproduktivitaet
- geeignet fuer relationale Fachmodelle

### Einschraenkung

Bei sehr komplexer Reporting- oder Spezial-SQL-Logik sollte Prisma nicht ideologisch eingesetzt werden. Der Stack sollte zusaetzliche direkte SQL-Zugriffe dort erlauben, wo sie fachlich oder performancebezogen sinnvoll sind.

## 3.7 Authentifizierung

### Empfehlung

Fuer den Start:

- `anwendungseigene Benutzerkonten`
- Login ueber das Backend
- Passwort-Hashing
- serverseitige Rollen- und Rechtepruefung

Spaeter optional:

- `OIDC/SSO`
- Anbindung an Verzeichnisdienste

### Begruendung

Fuer `MVP 0.1` bis `0.3` ist eine eigene, kontrollierte Auth-Loesung meist der kuerzeste und sauberste Weg.

Ein externer Identity-Provider ist spaeter sinnvoll, aber fuer den fruehen Projektstart oft eher Bremsfaktor als Nutzen.

## 3.8 Echtzeit

### Empfehlung

- `WebSocket`-basierte Live-Schicht
- technisch z. B. `Socket.IO`

### Begruendung

Die Anwendung braucht Live-Synchronisierung fuer:

- Nachrichten
- Tagebuch
- Auftraege
- Lagemeldungen
- Kartenobjekte
- Anwesenheit / Bearbeitungsstatus

Polling allein ist dafuer fachlich zu traege und technisch auf Dauer unsauber.

## 3.9 Karte und Lagedarstellung

### Empfehlung

- `MapLibre GL JS`

### Begruendung

MapLibre passt sehr gut, weil:

- Webkarten im Browser
- gute Performance
- offene Technologie
- geeignet fuer eigene Lageobjekte und taktische Zeichen
- spaeter erweiterbar fuer Layer, Symbole und Geoobjekte

### Fachlicher Hinweis

Die Karte ist nicht nur "Visualisierung", sondern Bestandteil der fachlichen Lagearbeit. Deshalb sollte das Kartenmodul frueh technisch sauber vorbereitet werden, auch wenn die volle Tiefe erst spaeter kommt.

## 3.10 Tests

### Empfehlung

- `Vitest` fuer Unit- und Integrationslogik
- `Playwright` fuer End-to-End-Tests

### Begruendung

Die Kombination ist fuer einen TypeScript-Webstack sehr schluessig:

- schnelle Fach- und Service-Tests
- echte Browser-Tests fuer Kernablaeufe
- gute Eignung fuer Mehrbenutzer-, Login- und UI-Flows

## 3.11 Deployment und Betrieb

### Empfehlung

- `Docker` / `Docker Compose` fuer Entwicklung und Test
- getrennte Umgebungen fuer `dev`, `test`, `prod`
- Reverse Proxy vor Frontend und Backend
- Datenbank als eigener Dienst
- Dateispeicher getrennt von Applikationscontainern

### Begruendung

Das ermoeglicht:

- reproduzierbare Umgebungen
- klaren Betrieb
- spaetere Migration in professionellere Hosting-Umgebungen

## 4. Empfohlene Projektstruktur

## 4.1 Gesamtstruktur

Empfohlenes Grundmodell:

- `apps/web`
- `apps/api`
- `packages/ui`
- `packages/types`
- `packages/config`
- `infra/`
- `docs/`

### Begruendung

Das ist ein guter Mittelweg:

- Frontend und Backend sauber getrennt
- gemeinsame Typen und UI-Bausteine moeglich
- keine uebertriebene Microservice-Zerlegung

## 4.2 Monorepo-Empfehlung

### Empfehlung

- `Monorepo`

### Begruendung

Fuer dieses Projekt ist ein Monorepo sinnvoll, weil:

- Frontend und Backend eng gekoppelt sind
- gemeinsame Typen und Validierungsmodelle nuetzlich sind
- Dokumentation, Tests und Infrastruktur zentral gepflegt werden koennen

## 5. Empfohlene technische Leitentscheidungen

## 5.1 Node.js-Version

Zum Stand `2026-05-13` ist laut offizieller Node.js-Downloadseite `v24.15.0` die aktuelle LTS-Version; dort ist `v22.22.2` ebenfalls noch als LTS aufgefuehrt.

### Empfehlung

- `Node.js 24 LTS` als Zielversion fuer neue Entwicklung

### Begruendung

- aktuelle LTS-Linie
- passt zur Richtung eines neu gestarteten Projekts
- Next.js und Prisma sind damit grundsaetzlich kompatibel

## 5.2 TypeScript

### Empfehlung

- `TypeScript` durchgehend in Frontend und Backend

### Begruendung

- konsistente Typisierung
- weniger Schnittstellenfehler
- bessere Wartbarkeit bei wachsendem Fachmodell

## 5.3 Validierung

### Empfehlung

- zentrale Request-Validierung im Backend
- moeglichst gemeinsame Schemata zwischen Frontend und Backend

### Begruendung

Die Anwendung wird viele strukturierte Eingaben haben. Frueh saubere Validierung einzubauen spart spaeter viel Nacharbeit.

## 6. Empfohlener Zielstack in kompakter Form

### Kernstack

- `Node.js 24 LTS`
- `Next.js App Router`
- `React`
- `TypeScript`
- `NestJS`
- `PostgreSQL`
- `Prisma ORM`
- `WebSocket / Socket.IO`
- `MapLibre GL JS`
- `Tailwind CSS v4`
- `Vitest`
- `Playwright`

## 7. Was ich bewusst nicht empfehlen wuerde

### 7.1 Kein reines "Frontend plus BaaS" als Hauptarchitektur

Fuer ein Stabssystem mit:

- Rechten
- Audit
- Freigaben
- Live-Zusammenarbeit
- Exporten
- Lageobjektbeziehungen

ist ein voll kontrolliertes Backend die robustere Wahl.

### 7.2 Keine Microservice-Architektur zum Start

Das waere zu frueh zu komplex.

### 7.3 Kein ausschliesslich clientseitiges State-/Offline-Modell

Die Anwendung ist lage- und teambezogen. Die Wahrheit muss serverseitig liegen.

### 7.4 Kein UI-Template als fachlicher Ersatz

Die Fachlogik darf nicht von einer generischen Admin-Oberflaeche diktiert werden.

## 8. Alternativen und Einordnung

## 8.1 Alternative Backend-Stacks

Vertretbar, aber von mir nicht bevorzugt:

- `Fastify` direkt ohne NestJS
- `ASP.NET Core`
- `Django`

Warum ich trotzdem bei NestJS bleibe:

- gleicher Sprachraum wie Frontend
- gute Teamzugänglichkeit
- starke Modulstruktur
- guter Fit fuer WebSocket, Guards und API-Module

## 8.2 Alternative Frontend-Stacks

Vertretbar, aber nicht meine Erstempfehlung:

- reines React mit Vite
- Vue/Nuxt

Warum ich bei Next.js bleibe:

- sehr gutes Gesamtpaket fuer moderne React-Webanwendungen
- gute Routing- und Strukturierungsbasis
- fuer interne Fachanwendungen mit vielen Ansichten gut geeignet

## 9. Konkrete Entscheidungsempfehlung fuer Projektstart

Wenn heute gestartet wird, wuerde ich verbindlich festlegen:

1. `Monorepo`
2. `Next.js` fuer `apps/web`
3. `NestJS` fuer `apps/api`
4. `PostgreSQL` als Datenbank
5. `Prisma` als ORM
6. `MapLibre` als Kartenbasis
7. `Playwright` und `Vitest` von Anfang an
8. `Node.js 24 LTS`

## 9a. Freigabevermerk

Zum Stand `2026-05-13` wird dieser Stack als verbindliche technische Richtung fuer das Projekt festgelegt.

## 10. Naechster technischer Schritt

Nach Freigabe dieses Dokuments ist der naechste sinnvolle Schritt:

- Repo-Struktur anlegen
- Grundgeruest fuer `apps/web` und `apps/api` aufsetzen
- gemeinsame Typen und Konfigurationspakete vorbereiten
- Auth-, Rollen- und Lagekern als `MVP 0.1` beginnen

## 10a. Zielbetrieb auf Firebase und Cloud Run

Zum Stand `2026-05-14` wird folgende Betriebsrichtung empfohlen:

- `Next.js-Frontend`: Firebase App Hosting
- `NestJS-Backend`: Google Cloud Run
- `Datenbank`: PostgreSQL, vorzugsweise als Google-Cloud-kompatibler Managed-Dienst
- `Verbindung nach aussen`: Firebase-Domain bzw. spaeter Custom Domain

### Begruendung

- Firebase App Hosting ist fuer moderne dynamische Web-Apps mit Next.js ausgelegt und wird laut offizieller Firebase-Dokumentation ueber Google Cloud Build, Cloud Run und Cloud CDN betrieben.
- Das bestehende Repo ist bewusst in `apps/web` und `apps/api` getrennt. Diese Trennung passt besser zu `App Hosting fuer das Web` plus `Cloud Run fuer die API` als zu einem erzwungenen Einheitsdeploy.
- Firebase Hosting kann Requests an Cloud Run weiterleiten. Dadurch kann die API spaeter sauber hinter derselben oeffentlichen Domain oder unter einer API-Subdomain betrieben werden.

### Konkrete Betriebsentscheidung

1. Das Frontend wird auf Firebase App Hosting ausgerollt.
2. Das Backend wird als eigener Cloud-Run-Service betrieben.
3. Die Verbindung erfolgt entweder:
   - direkt ueber eine eigene API-URL, oder
   - ueber Firebase Hosting Rewrites zu Cloud Run.
4. Fuer den ersten produktiven Ansatz wird eine getrennte API-URL empfohlen, da sie Betrieb, Debugging und Rechte klarer trennt.

### Fachliche Einordnung

Fuer die eigentliche Anwendung ist die Variante `Frontend auf App Hosting, API auf Cloud Run` die sauberste Zielarchitektur. Rewrites ueber Firebase Hosting sind moeglich, aber eher eine Routing- und Domainentscheidung als die Kernarchitektur selbst.

### Reale Erkenntnisse aus dem ersten App-Hosting-Rollout

Aus dem praktischen Rollout am `2026-05-14` ergeben sich fuer dieses Projekt zusaetzlich diese verbindlichen Hinweise:

- Firebase App Hosting verarbeitet das Frontend in diesem Monorepo nicht rein isoliert, sondern betrachtet zusaetzlich den Monorepo-Root.
- Deshalb muessen `stabs-app/package-lock.json` und `stabs-app/apps/web/package-lock.json` mit dem Frontend-Package konsistent gehalten werden.
- Fuer Firebase App Hosting wurde `Next.js 15.2.9` als kompatibler Frontend-Stand festgezogen.
- Das Frontend muss `output: "standalone"` aktivieren, damit der von Firebase gesetzte Startbefehl `node .next/standalone/server.js` zur Laufzeit existiert.
- Die Frontend-Runtime musste um `styled-jsx` ergaenzt werden, weil der Standalone-Container ohne diese explizite Abhaengigkeit nicht sauber startete.

### Abweichung zur urspruenglichen Stack-Richtung

Das Projektziel bleibt `Node.js 24 LTS` fuer die allgemeine Weiterentwicklung. Fuer Firebase App Hosting ist aber zu beachten:

- Der Firebase-Build lief in der beobachteten Umgebung mit `Node.js 22.22.2`.
- Die Root-`engines` wurden deshalb auf einen kompatiblen Mindeststand abgesenkt, damit der Plattformbuild nicht unnoetig blockiert.

Dies ist eine betriebsbezogene Anpassung, keine grundlegende fachliche Architekturabweichung.

## 11. Quellen und Verifikationsstand

Stand der Recherche: `2026-05-13`

Verifizierte offizielle Quellen:

- Next.js App Router Dokumentation: https://nextjs.org/docs/app
- Next.js Installation/System Requirements: https://nextjs.org/docs/app/getting-started/installation
- React Server Components Referenz: https://react.dev/reference/rsc/server-components
- NestJS Dokumentation: https://docs.nestjs.com/introduction
- Prisma System Requirements: https://docs.prisma.io/docs/orm/reference/system-requirements
- Prisma Supported Databases: https://docs.prisma.io/docs/orm/core-concepts/supported-databases
- PostgreSQL Dokumentation: https://www.postgresql.org/docs/
- Node.js Download/Releases: https://nodejs.org/en/download/
- MapLibre GL JS Dokumentation: https://maplibre.org/maplibre-gl-js/docs
- Tailwind CSS Installation: https://tailwindcss.com/docs/installation/tailwind-cli
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4
- Playwright Dokumentation: https://playwright.dev/docs/intro
- Vitest Dokumentation: https://vitest.dev/

## 12. Fortschreibung

Dieses Dokument ist fortschreibbar.

### Kommentararten

- `Stack-Entscheidung`
- `Architekturkommentar`
- `Technikrisiko`
- `Abweichung`
- `Migrationsentscheidung`

### Regel

Wenn spaeter bewusst vom hier empfohlenen Stack abgewichen wird, sollte die Abweichung mit Begruendung hier dokumentiert werden.

## 13. Aenderungsprotokoll

### Version 1.1 - 2026-05-13

- Stackentscheidung als verbindlich festgelegt markiert.

### Version 1.2 - 2026-05-14

- Zielbetrieb auf Firebase App Hosting fuer das Frontend und Cloud Run fuer das Backend festgelegt.

### Version 1.3 - 2026-05-14

- Reale Firebase-App-Hosting-Erkenntnisse zu Lockfiles, Next.js-Version, Standalone-Output und Runtime-Abhaengigkeiten nachgetragen.

### Version 1.4 - 2026-05-14

- Produktiven Online-Betrieb auf Firebase App Hosting plus Cloud Run erreicht und als aktueller Referenzstand bestaetigt.
