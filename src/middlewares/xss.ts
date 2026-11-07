import type { NextFunction, Request, Response } from "express";
import { inHTMLData } from "xss-filters";

/**
 * Clean for xss.
 */
export const clean = <T>(data: T | string = ""): T => {
  let isObject = false;

  if (typeof data === "object") {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(data as string).trim();

  if (isObject) data = JSON.parse(data);

  return data as T;
};

export const xssMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
  };
};
