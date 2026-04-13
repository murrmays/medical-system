import { api } from "./axiosInstanse";

type IcdRootsMap = Record<string, number>;

export interface ReportFilters {
  start: string;
  end: string;
  icdRoots?: string[];
}

export interface ReportRecords {
  patientName: string;
  patientBirthdate: string;
  gender: "Male" | "Female";
  visitsByRoot: IcdRootsMap;
}

export interface ReportResponse {
  filters: ReportFilters;
  records: ReportRecords[];
  summaryByRoot: IcdRootsMap;
}

export const generateReport = async (
  params: ReportFilters,
): Promise<ReportResponse> => {
  const response = await api.get("report/icdrootsreport", {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};
