import repository from "@repository/index";
import ApiError from "@utils/ApiError.util";
import catchAsync from "@utils/catchAsync.util";
import { ERROR_MESSAGES } from "@utils/errorMessages.util";
import { MESSAGES } from "@utils/messages.utils";
import { Request, Response } from "express";
import httpStatus from "http-status";
import _ from "lodash";

const index = catchAsync(async (request: Request, response: Response) => {
  const { uid } = request;

  const user = await repository.user.findUnique({ where: { id: Number(uid) } });
  if (!user)
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
    );

  return response.status(httpStatus.OK).json({
    message: MESSAGES.DISPLAY_DATA_SUCCESS,
    data: _.omit(user, ["password"]),
  });
});

export default {
  index,
};
