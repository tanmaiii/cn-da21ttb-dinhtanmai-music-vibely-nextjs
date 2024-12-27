import { NextFunction, Response } from "express";
import ApiError from "../utils/ApiError";

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method !== "POST" && req.method !== "PUT") {
      throw new ApiError(405, "Method not allowed");
    }
  } catch (error) {
    next(error);
  }
};
