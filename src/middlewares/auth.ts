import env from "@config/env";
import repository from "@repository/index";
import ApiError from "@utils/ApiError.util";
import catchAsync from "@utils/catchAsync.util";
import { ERROR_MESSAGES } from "@utils/errorMessages.util";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";

export const authMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req?.header("Authorization"))
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        ERROR_MESSAGES.MIDDLEWARE_API_KEY_UNAUTHENTICATED,
      );

    const token = req?.headers.authorization?.split(" ")[1] ?? "";
    const isCustomAuth = token.length < 500;

    if (!token || !isCustomAuth)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        ERROR_MESSAGES.MIDDLEWARE_API_KEY_UNAUTHENTICATED,
      );

    let decodedData: JwtPayload | string;

    jwt.verify(token, String(env.auth.accessToken), (err, decoded) => {
      if (err) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          ERROR_MESSAGES.MIDDLEWARE_AUTHORIZATION_UNAUTHENTICATED,
        );
      }
      decodedData = decoded as JwtPayload;
    });

    const decodedTokenEmail = decodedData!?.sub as string;

    if (!decodedTokenEmail)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        ERROR_MESSAGES.MIDDLEWARE_AUTHORIZATION_UNAUTHENTICATED,
      );

    const user = await repository.user.findUnique({
      where: { email: decodedTokenEmail },
      options: {
        select: {
          id: true,
          role: true,
          deletedAt: true,
          Token: {
            where: {
              token,
            },
          },
        },
      },
    });
    if (!user)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        ERROR_MESSAGES.AUTH_REFRESH_UNAUTHORIZED,
      );

    Object.assign(req, { uid: user.id, userRole: user.role });

    return next();
  },
);

export const roleMiddleware = (allowedRoles: Role[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userRole as Role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden: You do not have permission to access this resource.",
      );
    }
    return next();
  });
