import { loadApiSnapshot } from "../lib/api";
import { OperationsConsole } from "./operations-console";

export const dynamic = "force-dynamic";

const milestones = [
  "Login und Rollen",
  "Lageverwaltung",
  "Audit-Basis",
  "Nachrichtenmodul",
  "Tagebuchmodul"
];

const foundationModules = [
  "Getrennte Web-Deploy-App fuer Firebase App Hosting",
  "Health-Endpunkt im Backend",
  "Demo-Login fuer MVP 0.1",
  "Rollen- und Berechtigungsgrundlage",
  "Erste Lage-API mit In-Memory-Startdaten"
];

export default async function HomePage() {
  const apiSnapshot = await loadApiSnapshot();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">MVP 0.1</p>
        <h1>Stabsunterstuetzungssoftware</h1>
        <p className="lead">
          Fundament fuer eine browserbasierte, mehrbenutzerfaehige
          Stabsunterstuetzungssoftware mit gemeinsamem Einsatzkern.
        </p>
      </section>

      <section className="panel">
        <h2>Aktueller Projektstand</h2>
        <ul className="milestones">
          {milestones.map((milestone) => (
            <li key={milestone}>{milestone}</li>
          ))}
        </ul>
      </section>

      <section className="panel grid-panel">
        <div>
          <h2>Technisches Fundament</h2>
          <ul className="milestones compact">
            {foundationModules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="callout">
          <h3>Demo-Zugriff API</h3>
          <p>`POST /api/auth/login` mit `admin / demo`</p>
          <p>`GET /api/incidents` fuer die erste Lageuebersicht</p>
          <p>API-Ziel: `{apiSnapshot.baseUrl || "nicht gesetzt"}`</p>
        </div>
      </section>

      <section className="panel">
        <div className="status-header">
          <div>
            <p className="eyebrow">Live-Verbindung</p>
            <h2>Backend-Status</h2>
          </div>
          <span
            className={
              apiSnapshot.backendReachable ? "status-badge online" : "status-badge offline"
            }
          >
            {apiSnapshot.backendReachable ? "verbunden" : "nicht verbunden"}
          </span>
        </div>

        {apiSnapshot.backendReachable && apiSnapshot.health ? (
          <div className="status-grid">
            <div className="status-card">
              <h3>API-Gesundheit</h3>
              <p>Status: `{apiSnapshot.health.status}`</p>
              <p>Dienst: `{apiSnapshot.health.service}`</p>
              <p>Stand: `{apiSnapshot.health.stage}`</p>
            </div>

            <div className="status-card">
              <h3>Live-Lagebestand aus dem Backend</h3>
              {apiSnapshot.incidents.length > 0 ? (
                <ul className="milestones compact">
                  {apiSnapshot.incidents.map((incident) => (
                    <li key={incident.id}>
                      {incident.title} ({incident.referenceNumber}) - {incident.status} -{" "}
                      {incident.createdBy}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aktuell wurden noch keine Lagen zur Anzeige geliefert.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="status-card error-card">
            <h3>Backend aktuell nicht lesbar</h3>
            <p>{apiSnapshot.error ?? "Kein Fehlertext verfuegbar."}</p>
            <p>Pruefziel: `{apiSnapshot.baseUrl || "nicht konfiguriert"}`</p>
          </div>
        )}
      </section>

      <OperationsConsole initialSnapshot={apiSnapshot} />
    </main>
  );
}
