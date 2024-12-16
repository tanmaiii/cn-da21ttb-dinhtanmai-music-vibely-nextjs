import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const responseError = {
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
    stack: err.stack || null, // Lưu ý : không trả về stack trace trong production
  };

  console.log("❌EROR❌", responseError);

  // Ghi log lỗi
  logger.error(err);

  // Trả về lỗi cho client
  res.status(statusCode).json(responseError);
};
