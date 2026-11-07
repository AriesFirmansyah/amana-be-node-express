import {
  IncidentReport,
  Prisma,
  ReportCategory,
  ReportStatus,
  Role,
} from "@prisma/client";

export interface CreateReportProps {
  reporterId: number;
  data: {
    title: string;
    category: ReportCategory;
    description: string;
    incidentDate: string | Date;
    status?: ReportStatus;
  };
}

export interface QueryReportsProps {
  userId: number;
  userRole: Role;
  params: {
    keywords?: string;
    category?: string;
    status?: string;
    page?: number;
    size?: number;
  };
}

export interface GetReportByIdProps {
  reportId: number;
  userId: number;
  userRole: Role;
}

export interface UpdateReportProps {
  reportId: number;
  userId: number;
  userRole: Role;
  updateBody: {
    title?: string;
    category?: ReportCategory;
    description?: string;
    incidentDate?: string | Date;
    status?: ReportStatus;
    adminNotes?: string;
  };
}

export interface DeleteReportProps {
  reportId: number;
  userId: number;
  userRole: Role;
}

export interface ReportSummary {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  resolved: number;
}

export interface QueryReportsResponse {
  reports: IncidentReport[];
  meta: {
    page: number;
    size: number;
    total_data: number;
    total_page: number;
  };
  summary: ReportSummary;
}
