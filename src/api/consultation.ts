import { api } from "./axiosInstanse";
import type { Speciality } from "./dictionary";
import type {
  InspectionsFilters,
  PatientInspectionResponse,
} from "./inspection";
import type { PaginationResponse } from "./utils";

export interface ConsultationResponse {
  id: string;
  createTime: string;
  inspectionId: string;
  speciality: Speciality;
  comments: CommentResponse[];
}
export interface CommentResponse {
  id: string;
  createTime: string;
  modifiedDate: string;
  content: string;
  authorId: string;
  author: string;
  parentId: string;
}

export interface InspectionsList {
  inspections: PatientInspectionResponse[];
  pagination: PaginationResponse;
}

export const getConsultation = async (
  id: string,
): Promise<ConsultationResponse> => {
  const response = await api.get(`consultation/${id}`);
  return response.data;
};

export const getConsultationInspections = async (
  params: InspectionsFilters,
): Promise<InspectionsList> => {
  const response = await api.get("consultation", {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};

export const addComment = async (
  consultationId: string,
  content: string,
  parentId?: string,
) => {
  const response = await api.post(`/consultation/${consultationId}/comment`, {
    content,
    parentId,
  });
  return response.data;
};

export const editComment = async (commentId: string, content: string) => {
  const response = await api.put(`/consultation/comment/${commentId}`, {
    content,
  });
  return response.data;
};
