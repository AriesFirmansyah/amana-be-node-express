import mongoose from "mongoose";

import { NextFunction, Response, Request } from "express";
import ApiError from "@utils/ApiError.util";
import env from "@config/env";
import logger from "@config/logger";
import httpStatus from "http-status";

const errorConverter = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const anyErr = error as any;
    const statusCode =
      anyErr.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || String(httpStatus[statusCode]);
    error = new ApiError(statusCode, message, false, err.stack);
  }

  return next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next?: NextFunction,
) => {
  let { message } = err;
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (err instanceof ApiError) {
    const apiError = err as ApiError;
    statusCode = apiError.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

    if (env.appEnv === "production" && !err.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus["500_MESSAGE"];
    }
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.appEnv === "development" && { stack: err.stack }),
  };
  if (env.appEnv === "development") {
    logger.error(err.stack);
  }
  res.status(statusCode).send(response);
};

export const errorMiddleware = { errorConverter, errorHandler };
