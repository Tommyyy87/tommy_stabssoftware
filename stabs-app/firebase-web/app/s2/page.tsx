import { StaffAreaPage } from "../_components/staff-area-page";

export default function S2Page() {
  return (
    <StaffAreaPage
      code="S2"
      title="Lage"
      description="Fachbereich fuer Lagebild, Verdichtung eingehender Informationen und die fortlaufende Bewertung der Gesamtsituation."
      currentFocus={[
        "Lagebild konsistent mit aktiver Lage fuehren",
        "Relevante Meldungen verdichten und priorisieren",
        "Ueberblick fuer Stabsleitung und Fachbereiche schaffen"
      ]}
      upcomingTopics={[
        "Lagekarte und Lageentwicklung",
        "Schluesselereignisse und Zeitlinie",
        "Bewertete Kernaussagen fuer die Fuehrung",
        "Anschluss an Nachrichten und Tagebuch"
      ]}
    />
  );
}
