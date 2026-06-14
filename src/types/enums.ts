export const Conclusion = {
  Disease: "Disease",
  Recovery: "Recovery",
  Death: "Death",
} as const;

export const Sorting = {
  NameAsc: "NameAsc",
  NameDesc: "NameDesc",
  CreateAsc: "CreateAsc",
  CreateDesc: "CreateDesc",
  InspectionAsc: "InspectionAsc",
  InspectionDesc: "InspectionDesc",
} as const;

export const DiagnosisType = {
  Main: "Main",
  Concomitant: "Concomitant",
  Complication: "Complication",
};

export type Conclusion = (typeof Conclusion)[keyof typeof Conclusion];
export type Sorting = (typeof Sorting)[keyof typeof Sorting];
export type DiagnosisType = (typeof DiagnosisType)[keyof typeof DiagnosisType];
