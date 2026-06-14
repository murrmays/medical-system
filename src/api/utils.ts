import type { DiagnosisType } from "../types/enums";
import type { Speciality } from "./dictionary";

export interface Diagnosis {
  id: string;
  createTime: string;
  code: string;
  name: string;
  description: string;
  type: DiagnosisType;
}
export interface DiagnosisShort {
  icdDiagnosisId: string;
  description: string;
  type: DiagnosisType;
}
export interface Consultation {
  id: string;
  createTime: string;
  inspectionId: string;
  speciality: Speciality;
  rootComment: Comment;
  commentsNumber: number;
}
export interface Comment {
  id: string;
  createTime: string;
  parentId: string;
  content: string;
  author: Author;
  modifyTime: string;
}
export interface Author {
  id: string;
  createTime: string;
  name: string;
  birthday: string;
  gender: "Male" | "Female";
  email: string;
  phone: string;
}
export interface ConsultationShort {
  specialityId: string;
  comment: CommentContent;
}
export interface CommentContent {
  content: string;
}

export interface PaginationResponse {
  size: number;
  count: number;
  current: number;
}
