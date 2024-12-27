import { NextFunction, Request, Response } from "express";
import { getFilePath } from "../utils/commonUtils";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const uploadHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const name = Object.keys(req.files)[0];

    if (!files) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded");
    } else {
      const pathname = getFilePath(files, name);

      res.status(StatusCodes.OK).json({
        data: {
          path: pathname,
          name: name,
        },
        message: "Upload successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};
