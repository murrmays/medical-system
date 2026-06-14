import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ChainedNode } from "../inspection/ChainedNode";
import { Loader } from "@mantine/core";
import {
  getInspectionChain,
  type PatientInspectionResponse,
} from "../../api/inspection";

interface InspectionChainProps {
  rootInspection: PatientInspectionResponse;
  isDead?: boolean;
  isGrouped?: boolean;
}

export const InspectionChain = ({
  rootInspection,
  isDead,
  isGrouped,
}: InspectionChainProps) => {
  const { data: descendants, isLoading } = useQuery({
    queryKey: ["inspectionChain", rootInspection.id],
    queryFn: () => getInspectionChain(rootInspection.id),
  });

  const { inspectionMap, childrenMap } = useMemo(() => {
    if (!descendants)
      return {
        inspectionMap: new Map(),
        childrenMap: new Map(),
      };

    const allInspections = [rootInspection, ...descendants];
    const iMap = new Map<string, PatientInspectionResponse>();
    const cMap = new Map<string, string[]>();

    allInspections.forEach((inspection) => {
      if (!inspection.id) {
        return;
      }
      const id = inspection.id.toLowerCase();
      iMap.set(id, inspection);
      if (!cMap.has(id)) cMap.set(id, []);
    });

    allInspections.forEach((inspection) => {
      if (inspection.previousId && inspection.id) {
        if (cMap.has(inspection.previousId)) {
          cMap.get(inspection.previousId)!.push(inspection.id);
        }
      }
    });

    return {
      inspectionMap: iMap,
      childrenMap: cMap,
    };
  }, [rootInspection, descendants]);

  if (isLoading) {
    return <Loader size="xs" mt="sm" />;
  }

  return (
    <div className="chain-container">
      <ChainedNode
        inspection={rootInspection}
        inspectionMap={inspectionMap}
        childrenMap={childrenMap}
        level={0}
        isDead={isDead}
        isGrouped={isGrouped}
      />
    </div>
  );
};
