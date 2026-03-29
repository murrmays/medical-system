import { useNavigate } from "react-router-dom";
import type { Patient } from "../api/patient";
import "./PatientCard.css";

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="patient-card" onClick={handleCardClick} role="button">
      <h3 className="patient-name">{patient.name}</h3>
      <div className="detail-item">
        <span>
          <b>Пол:</b> {patient.gender === "Male" ? "Мужской" : "Женский"}
        </span>
      </div>

      <div className="detail-item">
        <span>
          <b>Дата рождения:</b>{" "}
          {new Date(patient.birthday).toLocaleDateString("ru-RU")}
        </span>
      </div>
    </div>
  );
};
