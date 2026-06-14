import { Group, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { getInspection } from "../../api/inspection";
import { getPatient } from "../../api/patient";
import "./InspectionDetails.css";
import { useDisclosure } from "@mantine/hooks";
import { EditInspectionModal } from "../../components/inspection/EditInspectionModal";
import { getProfile } from "../../api/doctor";
import { ConsultationBlock } from "../../components/consultations/ConsultationBlock";

export const InspectionDetailsPage = () => {
  const location = useLocation();
  const patientId = location.state?.patientId;
  const { id } = useParams<{ id: string }>();
  const [opened, { open, close }] = useDisclosure(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { data: patient } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatient(patientId!),
  });
  const { data: inspection } = useQuery({
    queryKey: ["inspection", id],
    queryFn: () => getInspection(id as string),
  });

  if (!inspection) return <p>Загрузка...</p>;
  return (
    <div className="inspection-details-page-root">
      <div className="inspection-details-page-wrapper">
        <section className="details-header-card">
          <Stack gap="xs">
            <Group justify="space-between">
              <span className="section-card-title">
                Амбулаторный осмотр от{" "}
                {new Date(inspection.date).toLocaleDateString("ru-RU")}
              </span>
              <button
                onClick={open}
                className={
                  inspection.doctor.id === profile.id
                    ? "edit-btn"
                    : "edit-btn-display-none"
                }
              >
                Редактировать осмотр
              </button>
            </Group>
            <p>
              <b>Пациент:</b> {patient?.name}
            </p>
            <p>Пол: {patient?.gender === "Male" ? "Мужской" : "Женский"}</p>
            <p>
              Дата рождения:{" "}
              {patient?.birthday &&
                new Date(patient.birthday).toLocaleDateString()}
            </p>
            <p>Медицинский работник: {inspection?.doctor.name}</p>
          </Stack>
        </section>

        <section className="medical-info">
          <Stack gap="xs">
            <span className="section-card-title">Жалобы</span>
            <p>{inspection?.complaints}</p>
            <span className="section-card-title">Анамнез заболевания</span>
            <p>{inspection?.anamnesis}</p>
          </Stack>
        </section>
        {inspection.consultations.map((c) => (
          <ConsultationBlock
            key={c.id}
            consultation={c}
            inspectionAuthorId={inspection.doctor.id}
          />
        ))}

        <section className="diagnoses">
          <Stack gap="xs">
            <span className="section-card-title">Диагнозы</span>
            {inspection?.diagnoses.map((d) => (
              <Stack gap="xs" key={d.id}>
                <p>
                  <b>({d.code}) </b>
                  {d.name.charAt(0) + d.name.toLowerCase().slice(1)}
                </p>
                {d.type == "Main" && <p>Тип в осмотре: основной</p>}
                {d.type == "Concomitant" && <p>Тип в осмотре: cопутствующий</p>}
                {d.type == "Complication" && <p>Тип в осмотре: осложнение</p>}
                <p>Расшифровка: {d.description}</p>
                <div className="diagnoses-divider"></div>
              </Stack>
            ))}
          </Stack>
        </section>

        <section className="treatment">
          <Stack gap="xs">
            <span className="section-card-title">Рекомендации по лечению</span>
            <p>{inspection?.treatment}</p>
          </Stack>
        </section>

        <section className="conclusion">
          <Stack gap="xs">
            <span className="section-card-title">Заключение</span>
            {inspection?.conclusion == "Disease" && (
              <Stack gap="xs">
                <p>Болезнь</p>
                <p>
                  Дата следующего визита:{" "}
                  {new Date(inspection.nextVisitDate).toLocaleDateString(
                    "ru-RU",
                  )}
                </p>
              </Stack>
            )}
            {inspection?.conclusion == "Death" && (
              <Stack gap="xs">
                <p>Смерть</p>
                <p>
                  Дата смерти:{" "}
                  {new Date(inspection.deathDate).toLocaleDateString("ru-RU")}
                </p>
              </Stack>
            )}
            {inspection?.conclusion == "Recovery" && <p>Выздоровление</p>}
          </Stack>
        </section>
      </div>
      <EditInspectionModal
        opened={opened}
        onClose={close}
        inspection={inspection}
      />
    </div>
  );
};
