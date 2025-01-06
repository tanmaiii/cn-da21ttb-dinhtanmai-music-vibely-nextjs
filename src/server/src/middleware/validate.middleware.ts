import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: JSON.parse(JSON.stringify(req.body)),
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors
          .map((issue) => `${issue.message}`)
          .join(", ");
        const customErr = new ApiError(StatusCodes.NOT_FOUND, message);
        next(customErr);
      } else {
        throw new Error("Internal Server Error");
      }
    }
  };
}
