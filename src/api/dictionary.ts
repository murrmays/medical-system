import { api } from "./axiosInstanse";
import type { PaginationResponse } from "./utils";

export interface Speciality {
  id: string;
  name: string;
  createTime?: string;
}

export interface IcdRoot {
  id: string;
  createTime?: string;
  code: string;
  name: string;
}

export interface IcdRootSearch {
  code: string;
  name: string;
  id: string;
  createTime: string;
}

export interface IcdRootSearchResponse {
  records: IcdRootSearch[];
  pagination: PaginationResponse;
}

export interface IcdSearchParams {
  request?: string;
  page?: number;
  size?: number;
}

export const getSpecialities = async (): Promise<Speciality[]> => {
  const response = await api.get("/dictionary/speciality", {
    params: {
      size: 500,
      count: 1,
      current: 1,
    },
  });
  return response.data.specialties || [];
};

export const getIcdRoots = async (): Promise<IcdRoot[]> => {
  const response = await api.get("/dictionary/icd10/roots");
  return response.data;
};

export const searchIcdRoots = async (
  params: IcdSearchParams,
): Promise<IcdRootSearchResponse> => {
  const response = await api.get("/dictionary/icd10", { params });
  return response.data;
};
