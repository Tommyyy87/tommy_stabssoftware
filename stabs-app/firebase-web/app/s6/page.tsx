import { StaffAreaPage } from "../_components/staff-area-page";

export default function S6Page() {
  return (
    <StaffAreaPage
      code="S6"
      title="Information / Kommunikation"
      description="Fachbereich fuer Informationswege, Kommunikationsmittel, Systemlage und die Sicherstellung belastbarer Verbindungen."
      currentFocus={[
        "Kommunikationslage als eigene Fuehrungsgrundlage markieren",
        "Stoerungen und Ausfaelle frueh sichtbar machen",
        "Informationswege fuer alle Bereiche absichern"
      ]}
      upcomingTopics={[
        "Kommunikationsstatus und Stoerungsbild",
        "Mittel, Kanaele und Redundanzen",
        "Verbindungswege zu Fuehrung und Einsatz",
        "Technische Ereignisse im Tagebuch nachfuehren"
      ]}
    />
  );
}
