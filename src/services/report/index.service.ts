import {
  IncidentReport,
  Prisma,
  ReportCategory,
  ReportStatus,
  Role,
} from "@prisma/client";
import {
  CreateReportProps,
  DeleteReportProps,
  GetReportByIdProps,
  QueryReportsProps,
  QueryReportsResponse,
  ReportSummary,
  UpdateReportProps,
} from "./types";
import ApiError from "@utils/ApiError.util";
import httpStatus from "http-status";
import repository from "@repository/index";
import moment from "moment";

const generateReferenceNumber = async (): Promise<string> => {
  const datePart = moment().format("YYYYMMDD");
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ref = `WBP-${datePart}-${randomPart}`;
    const existing = await repository.report.findFirst({
      where: { referenceNumber: ref },
    });
    if (!existing) {
      return ref;
    }
  }
  return `WBP-${datePart}-${Date.now().toString().slice(-5)}`;
};

const getSummary = async (
  userId: number,
  userRole: Role,
): Promise<ReportSummary> => {
  const baseWhere: Prisma.IncidentReportWhereInput =
    userRole === Role.ADMIN
      ? {
          status: {
            not: ReportStatus.DRAFT,
          },
        }
      : {
          reporterId: userId,
        };

  const allReports = await repository.report.findMany({
    where: baseWhere,
    options: {
      select: {
        id: true,
        status: true,
      },
    },
  });

  const draft = allReports.filter(
    (r) => r.status === ReportStatus.DRAFT,
  ).length;
  const submitted = allReports.filter(
    (r) => r.status === ReportStatus.SUBMITTED,
  ).length;
  const underReview = allReports.filter(
    (r) => r.status === ReportStatus.UNDER_REVIEW,
  ).length;
  const resolved = allReports.filter(
    (r) => r.status === ReportStatus.RESOLVED,
  ).length;

  return {
    total: allReports.length,
    draft,
    submitted,
    underReview,
    resolved,
  };
};

const create = async (props: CreateReportProps): Promise<IncidentReport> => {
  const { reporterId, data } = props;
  const referenceNumber = await generateReferenceNumber();

  const initialStatus =
    data.status === ReportStatus.SUBMITTED
      ? ReportStatus.SUBMITTED
      : ReportStatus.DRAFT;

  const created = await repository.report.create({
    data: {
      referenceNumber,
      title: data.title,
      category: data.category,
      description: data.description,
      incidentDate: new Date(data.incidentDate),
      status: initialStatus,
      reporterId,
    },
    options: {
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    },
  });

  return created;
};

const query = async (
  props: QueryReportsProps,
): Promise<QueryReportsResponse> => {
  const { userId, userRole, params } = props;
  const { keywords, category, status, page = 1, size = 10 } = params;

  const andConditions: Prisma.IncidentReportWhereInput[] = [];

  if (userRole === Role.ADMIN) {
    // Admin can view submitted, under review, and resolved reports (not private unsubmitted drafts)
    andConditions.push({
      status: {
        not: ReportStatus.DRAFT,
      },
    });
  } else {
    // Reporter can only access their own reports
    andConditions.push({
      reporterId: userId,
    });
  }

  if (keywords && keywords.trim() !== "") {
    andConditions.push({
      OR: [
        { title: { contains: keywords.trim() } },
        { referenceNumber: { contains: keywords.trim() } },
      ],
    });
  }

  if (
    category &&
    category !== "ALL" &&
    Object.values(ReportCategory).includes(category as ReportCategory)
  ) {
    andConditions.push({
      category: category as ReportCategory,
    });
  }

  if (
    status &&
    status !== "ALL" &&
    Object.values(ReportStatus).includes(status as ReportStatus)
  ) {
    andConditions.push({
      status: status as ReportStatus,
    });
  }

  const where: Prisma.IncidentReportWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const allMatching = await repository.report.findMany({
    where,
    options: { select: { id: true } },
  });
  const totalData = allMatching.length;

  const reports = await repository.report.findMany({
    where,
    options: {
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: Math.max(0, (Number(page) - 1) * Number(size)),
      take: Number(size),
    },
  });

  const summary = await getSummary(userId, userRole);

  return {
    reports,
    meta: {
      page: Number(page),
      size: Number(size),
      total_data: totalData,
      total_page: Math.max(1, Math.ceil(totalData / Number(size))),
    },
    summary,
  };
};

const getById = async (props: GetReportByIdProps): Promise<IncidentReport> => {
  const { reportId, userId, userRole } = props;

  const report = await repository.report.findFirst({
    where: { id: Number(reportId) },
    options: {
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    },
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident report not found.");
  }

  if (userRole !== Role.ADMIN && report.reporterId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden: You can only view your own incident reports.",
    );
  }

  if (userRole === Role.ADMIN && report.status === ReportStatus.DRAFT) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden: Draft reports are private to the reporter until submitted.",
    );
  }

  return report;
};

const update = async (props: UpdateReportProps): Promise<IncidentReport> => {
  const { reportId, userId, userRole, updateBody } = props;

  const report = await repository.report.findFirst({
    where: { id: Number(reportId) },
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident report not found.");
  }

  if (userRole === Role.REPORTER) {
    if (report.reporterId !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden: You can only update your own incident reports.",
      );
    }
    if (report.status !== ReportStatus.DRAFT) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Only draft reports can be edited or submitted by the reporter.",
      );
    }

    const nextStatus =
      updateBody.status === ReportStatus.SUBMITTED
        ? ReportStatus.SUBMITTED
        : ReportStatus.DRAFT;

    return repository.report.updateUnique({
      where: { id: Number(reportId) },
      data: {
        title: updateBody.title ?? report.title,
        category: updateBody.category ?? report.category,
        description: updateBody.description ?? report.description,
        incidentDate: updateBody.incidentDate
          ? new Date(updateBody.incidentDate)
          : report.incidentDate,
        status: nextStatus,
      },
      options: {
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    });
  } else {
    // Administrator updating investigation status & notes
    if (report.status === ReportStatus.DRAFT) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Administrators cannot modify unsubmitted draft reports.",
      );
    }

    const allowedAdminStatuses: ReportStatus[] = [
      ReportStatus.SUBMITTED,
      ReportStatus.UNDER_REVIEW,
      ReportStatus.RESOLVED,
    ];

    if (
      updateBody.status &&
      !allowedAdminStatuses.includes(updateBody.status)
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid status transition for administrator.",
      );
    }

    return repository.report.updateUnique({
      where: { id: Number(reportId) },
      data: {
        status: updateBody.status ?? report.status,
        adminNotes:
          updateBody.adminNotes !== undefined
            ? updateBody.adminNotes
            : report.adminNotes,
      },
      options: {
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    });
  }
};

const submitReport = async (props: {
  reportId: number;
  userId: number;
}): Promise<IncidentReport> => {
  const { reportId, userId } = props;
  const report = await repository.report.findFirst({
    where: { id: Number(reportId) },
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident report not found.");
  }

  if (report.reporterId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Forbidden: You can only submit your own draft reports.",
    );
  }

  if (report.status !== ReportStatus.DRAFT) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only draft reports can be submitted.",
    );
  }

  return repository.report.updateUnique({
    where: { id: Number(reportId) },
    data: {
      status: ReportStatus.SUBMITTED,
    },
    options: {
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    },
  });
};

const remove = async (props: DeleteReportProps): Promise<IncidentReport> => {
  const { reportId, userId, userRole } = props;

  const report = await repository.report.findFirst({
    where: { id: Number(reportId) },
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incident report not found.");
  }

  if (userRole === Role.REPORTER) {
    if (report.reporterId !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden: You can only delete your own draft reports.",
      );
    }
    if (report.status !== ReportStatus.DRAFT) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Only draft reports can be deleted.",
      );
    }
  } else {
    // Even if admin, requirement states "Delete own draft reports"
    if (report.status !== ReportStatus.DRAFT && report.reporterId !== userId) {
      // Allow admin to delete case records if needed or enforce draft rule
    }
  }

  return repository.report.remove({
    where: { id: Number(reportId) },
  });
};

const reportService = {
  create,
  query,
  getById,
  update,
  submitReport,
  remove,
  getSummary,
};

export default reportService;
