import { Request, Response } from "express";
import { Role } from "@prisma/client";
import catchAsync from "@utils/catchAsync.util";
import services from "@services/index";
import { MESSAGES } from "@utils/messages.utils";
import httpStatus from "http-status";

const summary = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const userRole = (request.userRole as Role) || Role.REPORTER;

  const summaryData = await services.report.getSummary(userId, userRole);

  return response.status(httpStatus.OK).json({
    message: MESSAGES.DISPLAY_DATA_SUCCESS,
    data: summaryData,
  });
});

const index = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const userRole = (request.userRole as Role) || Role.REPORTER;
  const { keywords, category, status, page = 1, size = 10 } = request.query;

  const result = await services.report.query({
    userId,
    userRole,
    params: {
      keywords: keywords as string | undefined,
      category: category as string | undefined,
      status: status as string | undefined,
      page: Number(page),
      size: Number(size),
    },
  });

  return response.status(httpStatus.OK).json({
    message: MESSAGES.DISPLAY_DATA_SUCCESS,
    data: result,
  });
});

const detail = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const userRole = (request.userRole as Role) || Role.REPORTER;
  const reportId = Number(request.params.id);

  const report = await services.report.getById({
    reportId,
    userId,
    userRole,
  });

  return response.status(httpStatus.OK).json({
    message: MESSAGES.DISPLAY_DATA_SUCCESS,
    data: report,
  });
});

const store = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const { title, category, description, incidentDate, status } = request.body;

  const created = await services.report.create({
    reporterId: userId,
    data: {
      title,
      category,
      description,
      incidentDate,
      status,
    },
  });

  return response.status(httpStatus.CREATED).json({
    message: "Incident report created successfully.",
    data: created,
  });
});

const update = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const userRole = (request.userRole as Role) || Role.REPORTER;
  const reportId = Number(request.params.id);

  const updated = await services.report.update({
    reportId,
    userId,
    userRole,
    updateBody: request.body,
  });

  return response.status(httpStatus.OK).json({
    message: "Incident report updated successfully.",
    data: updated,
  });
});

const submit = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const reportId = Number(request.params.id);

  const submitted = await services.report.submitReport({
    reportId,
    userId,
  });

  return response.status(httpStatus.OK).json({
    message: "Incident report submitted successfully.",
    data: submitted,
  });
});

const remove = catchAsync(async (request: Request, response: Response) => {
  const userId = Number(request.uid);
  const userRole = (request.userRole as Role) || Role.REPORTER;
  const reportId = Number(request.params.id);

  await services.report.remove({
    reportId,
    userId,
    userRole,
  });

  return response.status(httpStatus.OK).json({
    message: "Incident report deleted successfully.",
  });
});

export default {
  summary,
  index,
  detail,
  store,
  update,
  submit,
  remove,
};
