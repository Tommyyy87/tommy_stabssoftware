import Link from "next/link";

import { loadApiSnapshot } from "../../lib/api";
import { MessagesWorkspace } from "./messages-workspace";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const apiSnapshot = await loadApiSnapshot();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Modulroute</p>
        <h1>Nachrichten</h1>
        <p className="lead">
          Eigenstaendige Arbeitsflaeche fuer Nachrichteneingang, Sichtung,
          Weiterleitung und Nachweis. Die Startseite bleibt damit Ueberblick,
          waehrend die Facharbeit hier konzentriert stattfindet.
        </p>

        <div className="hero-actions">
          <Link className="ghost-button" href="/">
            Zur Startseite
          </Link>
        </div>
      </section>

      <MessagesWorkspace
        baseUrl={apiSnapshot.baseUrl}
        backendReachable={apiSnapshot.backendReachable}
        initialIncidents={apiSnapshot.incidents}
      />
    </main>
  );
}
