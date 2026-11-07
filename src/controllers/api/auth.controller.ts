import { NextFunction, Request, Response } from "express";

import { User } from "@prisma/client";
import catchAsync from "@utils/catchAsync.util";
import services from "@services/index";
import { MESSAGES } from "@utils/messages.utils";
import httpStatus from "http-status";
import schemas from "@schemas/index";
import { z } from "zod";

const register = catchAsync(
  async (request: Request, response: Response, _next: NextFunction) => {
    const { email, password, name } = request.body;
    const user = await services.user.create({
      data: { email, password, name },
    });
    const tokens = await services.token.generateAuthTokens({
      user: user as User,
    });

    return response.status(httpStatus.CREATED).json({
      message: MESSAGES.USER_CREATED,
      data: { user, tokens },
    });
  },
);

const login = catchAsync(async (request: Request, response: Response) => {
  const requestData: z.infer<typeof schemas.api.auth.login> = request;
  const { email, password }: z.infer<typeof schemas.api.auth.login>["body"] =
    requestData?.body;
  const user = await services.auth.loginUserWithEmailAndPassword({
    email,
    password,
  });
  const tokens = await services.token.generateAuthTokens({
    user,
  });

  return response.status(httpStatus.OK).json({
    message: MESSAGES.LOGIN_SUCCESS,
    data: { user, tokens },
  });
});

const logout = catchAsync(async (request: Request, response: Response) => {
  const { refreshToken } = request.body || {};
  const userId = request.uid ? Number(request.uid) : undefined;

  await services.auth.logout({ refreshToken, userId });

  return response.status(httpStatus.OK).json({
    message: "Logged out successfully.",
  });
});

export default {
  login,
  logout,
  register,
};
