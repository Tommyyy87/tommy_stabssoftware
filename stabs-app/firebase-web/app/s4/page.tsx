import { StaffAreaPage } from "../_components/staff-area-page";

export default function S4Page() {
  return (
    <StaffAreaPage
      code="S4"
      title="Versorgung"
      description="Fachbereich fuer Versorgung, Ressourcenlage, Material, Unterbringung und die Durchhaltefaehigkeit der eingesetzten Kraefte."
      currentFocus={[
        "Versorgungslage frueh sichtbar machen",
        "Kritische Ressourcen im Fuehrungsbild vormerken",
        "Unterstuetzungsbedarfe sauber nachhalten"
      ]}
      upcomingTopics={[
        "Material- und Ressourcenstatus",
        "Versorgungsanfragen und Nachforderungen",
        "Unterbringung, Verpflegung, Ablosung",
        "Abhaengigkeiten zu S1 und S3"
      ]}
    />
  );
}
