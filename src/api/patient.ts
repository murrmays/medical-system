import type { Sorting } from "../types/enums";
import { api } from "./axiosInstanse";
import type {
  InspectionListResponse,
  InspectionRequest,
  InspectionSearchResponse,
  InspectionsFilters,
} from "./inspection";

export interface Patient {
  id: string;
  createTime: string;
  name: string;
  birthday: string;
  gender: "Male" | "Female";
}
export interface PatientListResponse {
  patients: Patient[];
  pagination: {
    size: number;
    count: number;
    current: number;
  };
}
export interface PatientFilters {
  name?: string;
  conclusions?: string[];
  sorting?: Sorting;
  scheduledVisits?: boolean;
  onlyMine?: boolean;
  page?: number;
  size?: number;
}
export interface RegisterPatientRequest {
  name: string;
  birthday: string;
  gender: "Male" | "Female";
}

export const getAllPatients = async (
  params: PatientFilters,
): Promise<PatientListResponse> => {
  const response = await api.get("/patient", { params });
  return response.data;
};
export const registerNewPatient = async (data: RegisterPatientRequest) => {
  const response = await api.post("/patient", data);
  return response.data;
};
export const getPatient = async (id: string) => {
  const response = await api.get(`patient/${id}`);
  return response.data;
};
export const getPatientsInspections = async (
  id: string,
  params: InspectionsFilters,
): Promise<InspectionListResponse> => {
  const response = await api.get(`patient/${id}/inspections`, {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};
export const createPatientInspection = async (
  id: string,
  params: InspectionRequest,
) => {
  const response = await api.post(`patient/${id}/inspections`, params);
  return response.data;
};
export const searchPatientInspections = async (
  id: string,
  requestText?: string,
): Promise<InspectionSearchResponse[]> => {
  const response = await api.get(`patient/${id}/inspections/search`, {
    params: { request: requestText },
  });
  return response.data;
};
