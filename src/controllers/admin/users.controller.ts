import { Response, Request } from "express";
import { Role } from "@prisma/client";
import catchAsync from "@utils/catchAsync.util";
import { z } from "zod";
import schemas from "@schemas/index";
import services from "@services/index";
import { MESSAGES } from "@utils/messages.utils";
import httpStatus from "http-status";

const index = catchAsync(async (request: Request, response: Response) => {
  const { uid } = request;
  const {
    keywords,
    size = 10,
    page = 1,
    start_date,
    end_date,
    role,
  }: z.infer<typeof schemas.admin.users.index>["query"] = request?.query;

  const { queryResults, count, dataModel } = await services.user.query({
    where: {
      AND: [
        { name: { contains: keywords } },
        {
          id: {
            not: Number(uid),
          },
        },
        {
          createdAt: {
            gte: start_date,
            lte: end_date,
          },
        },
        {
          role: {
            equals: role as Role,
          },
        },
      ],
    },
    options: {
      orderBy: {
        name: "asc",
      },
      limit: size as number,
      page,
    },
  });

  const statistic = [
    {
      total: count,
      role: "Users",
    },
    {
      total: dataModel.filter((v) => v.role === Role.REPORTER).length,
      role: Role.REPORTER,
    },
    {
      total: dataModel.filter((v) => v.role === Role.ADMIN).length,
      role: Role.ADMIN,
    },
  ];

  return response.status(httpStatus.OK).json({
    message: MESSAGES.DISPLAY_DATA_SUCCESS,
    data: {
      users: queryResults,
      meta: {
        page: Number(page),
        total_data: count,
        total_page: Math.ceil(count / (size as number)),
      },
      statistic,
    },
  });
});

export default {
  index,
};
