import type { InspectionResponse } from "../api/patient";
import { InspectionCard } from "./InspectionCard";
import "./InspectionCard.css";

interface ChainedInspectionProps {
  inspectionId: string;
  inspectionsMap: Map<string, InspectionResponse>;
  nextIdMap: Map<string, string>;
  level?: number;
  isDead?: boolean;
}

export const ChainedInspectionCard = ({
  inspectionId,
  inspectionsMap,
  nextIdMap,
  level = 0,
  isDead,
}: ChainedInspectionProps) => {
  const current = inspectionsMap.get(inspectionId);
  const nextId = nextIdMap.get(inspectionId);

  console.log(
    `[Level ${level}] Рендер карточки ${inspectionId}. Есть ребенок? ${!!nextId}. Ребенок в карте? ${inspectionsMap.has(nextId || "")}`,
  );
  if (!current) return null;

  const marginLeft = level > 0 ? "2rem" : "0";
  const isChild = level > 0;

  return (
    <div
      className={isChild ? "chain-node child" : "chain-node root"}
      style={{ marginLeft }}
    >
      <InspectionCard inspection={current} isDead={isDead} />

      {nextId && inspectionsMap.has(nextId) && (
        <ChainedInspectionCard
          inspectionId={nextId}
          inspectionsMap={inspectionsMap}
          nextIdMap={nextIdMap}
          level={level + 1}
          isDead={isDead}
        />
      )}
    </div>
  );
};
