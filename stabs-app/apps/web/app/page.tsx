const milestones = [
  "Login und Rollen",
  "Lageverwaltung",
  "Audit-Basis",
  "Nachrichtenmodul",
  "Tagebuchmodul"
];

const foundationModules = [
  "Monorepo mit Web-, API- und Shared-Paketen",
  "Health-Endpunkt im Backend",
  "Demo-Login fuer MVP 0.1",
  "Rollen- und Berechtigungsgrundlage",
  "Erste Lage-API mit In-Memory-Startdaten"
];

export default function HomePage() {
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
          <p>API-Zielport: `3001`</p>
        </div>
      </section>
    </main>
  );
}
