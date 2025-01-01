import { NextFunction, Request, Response } from "express";
import { getFilePath } from "../utils/commonUtils";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";

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

export const getAudioFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filename = req.params.filename;

    if (!filename) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "path name not found");
    }

    if (!fs.existsSync(path.join(__dirname, "../../uploads/audio", filename))) {
      throw new ApiError(StatusCodes.NOT_FOUND, "File not found");
    }

    const filePath = path.join(__dirname, "../../uploads/audio", filename); // path to audio file

    if (!filePath) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "File not found");
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "File not found");
      }
    });
  } catch (error) {
    next(error);
  }
};
