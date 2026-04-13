import type { Conclusion } from "../types/enums";
import { api } from "./axiosInstanse";
import type { Doctor } from "./doctor";
import type { Patient } from "./patient";
import type {
  Consultation,
  ConsultationShort,
  Diagnosis,
  DiagnosisShort,
} from "./utils";

export interface PatientInspectionResponse {
  id: string;
  createTime: string;
  previousId: string;
  date: string;
  conclusion: Conclusion;
  doctorId: string;
  doctor: string;
  patientId: string;
  patient: string;
  diagnosis: Diagnosis;
  hasChain: boolean;
  hasNested: boolean;
}
export interface InspectionResponse {
  id: string;
  createTime: string;
  date: string;
  anamnesis: string;
  complaints: string;
  treatment: string;
  conclusion: Conclusion;
  nextVisitDate: string;
  deathDate: string;
  baseInspectionId: string;
  previousInspectionId: string;
  patient: Patient;
  doctor: Doctor;
  diagnoses: Diagnosis[];
  consultations: Consultation[];
}
export interface InspectionRequest {
  date: string;
  anamnesis: string;
  complaints: string;
  treatment: string;
  conclusion: Conclusion;
  nextVisitDate: string;
  deathDate: string;
  previousInspectionId: string;
  diagnoses: DiagnosisShort[];
  consultations: ConsultationShort;
}
export interface InspectionSearchResponse {
  id: string;
  createTime: string;
  date: string;
  diagnosis: Diagnosis;
}
export interface InspectionListResponse {
  inspections: PatientInspectionResponse[];
  pagination: {
    size: number;
    count: number;
    current: number;
  };
}
export interface InspectionsFilters {
  grouped?: boolean;
  icdRoots?: string[];
  page?: number;
  size?: number;
}

export interface InspectionEditRequest {
  anamnesis: string;
  complaints: string;
  treatment: string;
  conclusion: Conclusion;
  nextVisitDate?: string;
  deathDate?: string;
  diagnoses: DiagnosisShort[];
}

export const getInspectionChain = async (
  id: string,
): Promise<PatientInspectionResponse[]> => {
  const response = await api.get(`/inspection/${id}/chain`);
  return response.data;
};

export const getInspection = async (
  id: string,
): Promise<InspectionResponse> => {
  const response = await api.get(`/inspection/${id}`);
  return response.data;
};

export const editInspection = async (
  id: string,
  data: InspectionEditRequest,
) => {
  const response = await api.put(`/inspection/${id}`, data);
  return response.data;
};
