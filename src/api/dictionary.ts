import { api } from "./axiosInstanse";

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
