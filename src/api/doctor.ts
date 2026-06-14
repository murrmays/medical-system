import { api } from "./axiosInstanse";

export interface Doctor {
  id: string;
  createTime: string;
  name: string;
  birthday: string;
  gender: "Male" | "Female";
  email: string;
  phone: string;
}
export interface RegisterRequest {
  name: string;
  password: string;
  email: string;
  birthday: string;
  gender: "Male" | "Female";
  phone: string;
  speciality: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EditRequest {
  email: string;
  name: string;
  birthday: string;
  gender: "Male" | "Female";
  phone: string;
}

export const registerDoctor = async (data: RegisterRequest) => {
  const response = await api.post("/doctor/register", data);
  return response.data;
};
export const loginDoctor = async (data: LoginRequest) => {
  const response = await api.post("/doctor/login", data);
  return response.data;
};
export const getProfile = async () => {
  const response = await api.get("/doctor/profile");
  return response.data;
};
export const logoutDoctor = async () => {
  const response = await api.get("/doctor/logout");
  return response.data;
};
export const editDoctor = async (data: EditRequest) => {
  const response = await api.put("/doctor/profile", data);
  return response.data;
};
