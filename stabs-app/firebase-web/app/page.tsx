import Link from "next/link";
import { loadApiSnapshot } from "../lib/api";
import { OperationsConsole } from "./operations-console";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const apiSnapshot = await loadApiSnapshot();
  const incidentCount = apiSnapshot.incidents.length;

  return (
    <main className="shell page-stack">
      <section className="hero page-hero">
        <p className="eyebrow">Arbeitsraum</p>
        <h1>Lageuebersicht</h1>
        <p className="lead">
          Zentrale Startseite fuer Lagekontext, Betriebsstatus und den Einstieg
          in die aktive Arbeit. Nachrichten und Journal laufen in den
          Fachmodulen, diese Route bleibt bewusst Ueberblick.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" href="/messages">
            Nachrichten oeffnen
          </Link>
        </div>
      </section>

      <section className="panel overview-grid">
        <article className="status-card">
          <p className="eyebrow">Betriebsstatus</p>
          <h2>Backend und Lagebestand</h2>
          <div className="stack compact-stack">
            <p>
              Verbindung:{" "}
              <span
                className={
                  apiSnapshot.backendReachable
                    ? "status-badge online"
                    : "status-badge offline"
                }
              >
                {apiSnapshot.backendReachable ? "verbunden" : "nicht verbunden"}
              </span>
            </p>
            <p>API-Ziel: `{apiSnapshot.baseUrl || "nicht gesetzt"}`</p>
            <p>Erkannte Lagen: {incidentCount}</p>
            {apiSnapshot.health ? (
              <p>
                API-Stand: `{apiSnapshot.health.service}` / `{apiSnapshot.health.stage}`
              </p>
            ) : null}
            {apiSnapshot.error ? (
              <p className="error-text">{apiSnapshot.error}</p>
            ) : null}
          </div>
        </article>

        <article className="status-card">
          <p className="eyebrow">Einstieg</p>
          <h2>Erster Arbeitsablauf</h2>
          <ol className="onboarding-steps">
            <li>Mit `admin / demo` anmelden.</li>
            <li>Eine Lage auswaehlen oder neu anlegen.</li>
            <li>Das Modul `Nachrichten` oeffnen.</li>
            <li>Eine Meldung erfassen, bewerten und weiterleiten.</li>
            <li>Rueckmeldungen spaeter im Journal anschliessen.</li>
          </ol>
        </article>
      </section>

      <section className="panel overview-grid">
        <article className="status-card">
          <p className="eyebrow">Lagen im Zugriff</p>
          <h2>Aktuelle Auswahlbasis</h2>
          {incidentCount > 0 ? (
            <ul className="milestones compact">
              {apiSnapshot.incidents.slice(0, 5).map((incident) => (
                <li key={incident.id}>
                  {incident.referenceNumber} - {incident.title} ({incident.status})
                </li>
              ))}
            </ul>
          ) : (
            <p>Aktuell wurden noch keine Lagen aus dem Backend geliefert.</p>
          )}
        </article>

        <article className="status-card">
          <p className="eyebrow">Arbeitsmodule</p>
          <h2>Naechste Wege</h2>
          <div className="stack compact-stack">
            <p>
              `Nachrichten` ist das aktive Arbeitsmodul fuer Sichtung,
              Bewertung, Weiterleitung und Nachweis.
            </p>
            <p>
              `Journal` ist jetzt als integrierter Nebenpfad fuer Uebernahme und
              Nachweis sichtbar eingebunden.
            </p>
            <div className="hero-actions">
              <Link className="ghost-button" href="/messages">
                Zum Nachrichtenworkflow
              </Link>
              <Link className="ghost-button" href="/journal">
                Zum Journal
              </Link>
            </div>
          </div>
        </article>
      </section>

      <OperationsConsole initialSnapshot={apiSnapshot} />
    </main>
  );
}
