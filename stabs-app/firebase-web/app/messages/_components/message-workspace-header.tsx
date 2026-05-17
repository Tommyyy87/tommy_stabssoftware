export function MessageWorkspaceHeader({
  backendReachable,
  baseUrl,
  incidentCount,
  messageCount,
  sessionLabel
}: {
  backendReachable: boolean;
  baseUrl: string;
  incidentCount: number;
  messageCount: number;
  sessionLabel: string;
}) {
  return (
    <div className="message-center-topline">
      <div>
        <p className="eyebrow">Gefuehrter Arbeitsablauf</p>
        <h2>Nachrichtenarbeitsflaeche</h2>
        <p className="lead message-center-lead">
          Eingang sichten, bewerten, weiterleiten, Rueckmeldung verfolgen und
          spaeter ins Journal uebernehmen.
        </p>
      </div>

      <div className="message-summary-grid">
        <article className="summary-card emphasis-card">
          <span className="summary-label">Backend</span>
          <strong>{backendReachable ? "verbunden" : "nicht verbunden"}</strong>
          <span className="summary-meta">{baseUrl || "keine API-URL gesetzt"}</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Lagen</span>
          <strong>{incidentCount}</strong>
          <span className="summary-meta">im aktuellen Arbeitskontext</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Nachrichten</span>
          <strong>{messageCount}</strong>
          <span className="summary-meta">in der gewaehlten Lage geladen</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Sitzung</span>
          <strong>{sessionLabel}</strong>
          <span className="summary-meta">aktueller Bedienkontext</span>
        </article>
      </div>

      <ol className="workflow-strip">
        <li>Eingang sichten</li>
        <li>Bewerten</li>
        <li>Weiterleiten</li>
        <li>Quittierung verfolgen</li>
        <li>Ins Journal uebernehmen</li>
      </ol>
    </div>
  );
}
