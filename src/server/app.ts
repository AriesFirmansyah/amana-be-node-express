import cors from "cors";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import ExpressMongoSanitize from "express-mongo-sanitize";

import httpStatus from "http-status";
import routes from "@routes/v1/index";

import ApiError from "@utils/ApiError.util";
import env from "@config/env";
import morgan from "@config/morgan";
import middlewares from "@middlewares/index";

const app = express();

if (env.appEnv !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// HTTP HEADERS
app.use(helmet());

// PARSE REQUEST BODY
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS
app.use(cors());
app.options("*", cors());

// SANITIZE REQUEST DATA
app.use(middlewares.xss());
app.use(ExpressMongoSanitize());

// GZIP COMPRESSION
app.use(compression());

// ROUTES
app.use(routes);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, httpStatus[404]));
});

app.use(middlewares.error.errorConverter);
app.use(middlewares.error.errorHandler);

export default app;
