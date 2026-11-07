import logger from "@config/logger";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateMiddleware =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          params: req.params,
          query: req.query,
          body: req.body,
        });

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          logger.error(error.errors[0]);
          return res.status(422).json({
            status: "Error validation",
            message: error.errors[0].message,
          });
        }
        next(error);
      }
    };
