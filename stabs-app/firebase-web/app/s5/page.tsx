import { StaffAreaPage } from "../_components/staff-area-page";

export default function S5Page() {
  return (
    <StaffAreaPage
      code="S5"
      title="Presse / Oeffentlichkeit"
      description="Fachbereich fuer Oeffentlichkeitsarbeit, Medienlage, Freigaben und die abgestimmte Kommunikation nach aussen."
      currentFocus={[
        "Freigabefaehige Kernaussagen vorbereiten",
        "Anfragen und Medienkontakte strukturiert sammeln",
        "Abstimmung mit Lage und Fuehrung sichtbar machen"
      ]}
      upcomingTopics={[
        "Mediendashboard und Anfrageeingang",
        "Statement- und Freigabeprozess",
        "Lageangepasste Oeffentlichkeitsinformationen",
        "Schnittstelle zu S2 und S6"
      ]}
    />
  );
}
