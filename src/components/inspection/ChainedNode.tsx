import { useState } from "react";
import { InspectionCard } from "../inspection/InspectionCard";
import type { PatientInspectionResponse } from "../../api/inspection";

export const ChainedNode = ({
  inspection,
  inspectionMap,
  childrenMap,
  level,
  isDead,
  isGrouped,
}: {
  inspection: PatientInspectionResponse;
  inspectionMap: Map<string, PatientInspectionResponse>;
  childrenMap: Map<string, string[]>;
  level: number;
  isDead?: boolean;
  isGrouped?: boolean;
}) => {
  const childrenIds = childrenMap.get(inspection.id) || [];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`chain-node ${level > 0 && level < 3 ? "is-child" : ""}`}>
      <InspectionCard
        inspection={inspection}
        isDead={isDead}
        isGrouped={isGrouped}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div>
          {childrenIds.map((childId) => {
            const childInspection = inspectionMap.get(childId);
            if (!childInspection) {
              return;
            }
            return (
              <ChainedNode
                key={childId}
                inspection={childInspection}
                inspectionMap={inspectionMap}
                childrenMap={childrenMap}
                level={level + 1}
                isDead={isDead}
                isGrouped={isGrouped}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
