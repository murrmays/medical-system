import { useNavigate } from "react-router-dom";
import type { InspectionResponse } from "../api/patient";
import "./InspectionCard.css";
import { Conclusion } from "../types/enums";
import { Plus, Search } from "lucide-react";

interface InspectionCardProps {
  inspection: InspectionResponse;
  isDead?: boolean;
}

export const InspectionCard = ({ inspection, isDead }: InspectionCardProps) => {
  const conclusionLabels = {
    [Conclusion.Disease]: "Болезнь",
    [Conclusion.Recovery]: "Выздоровление",
    [Conclusion.Death]: "Смерть",
  };
  const isDeath = inspection.conclusion === Conclusion.Death;
  const isPatientDead = isDead;
  const patientId = inspection.patientId;
  const hasNested = inspection.hasNested;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/patient/${inspection.id}`);
  };

  return (
    <div
      className={`inspection-card ${isDeath ? "inspection-card-death" : ""}`}
    >
      <div className="top-row">
        <span className="createDate">
          {new Date(inspection.createTime).toLocaleDateString("ru-RU")}
        </span>
        <button className="inspection-details-btn" onClick={handleClick}>
          <Search className="icon" />
          <span className="btn-text">Детали осмотра</span>
        </button>
      </div>
      <div className="bottom-row">
        <h3 className="card-title">Амбулаторный осмотр</h3>
        <button
          className={
            isPatientDead || hasNested
              ? "add-inspection-btn-hidden"
              : "add-inspection-btn"
          }
          onClick={() =>
            navigate("/inspection/create", {
              state: { patientId: patientId, parentId: inspection.id },
            })
          }
        >
          <Plus className="icon" />
          <span className="btn-text">Добавить осмотр</span>
        </button>
      </div>
      <div className="detail-item">
        <p>
          <b>Заключение:</b> {conclusionLabels[inspection.conclusion]}
        </p>
        <p className="diagnosis">
          <b>Основной диагноз:</b> {inspection.diagnosis.name}
        </p>
        <p>
          <b>Медицинский работник:</b> {inspection.doctor}
        </p>
      </div>
    </div>
  );
};
