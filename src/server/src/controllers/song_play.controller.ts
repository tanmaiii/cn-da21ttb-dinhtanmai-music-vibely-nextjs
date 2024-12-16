import { NextFunction, Request, Response } from "express";
import SongService from "../services/Song.service";
import { get } from "lodash";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import SongPlayService from "../services/SongPlay.service";

export const getSongPlays = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const existSong = await SongService.getSongById(req.params.id, userId);

    if (!existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    const plays = await SongPlayService.getPlays(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: plays, message: "Get plays successfully" });
  } catch (error) {
    next(error);
  }
};
