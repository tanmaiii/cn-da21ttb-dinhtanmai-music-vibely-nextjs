import { NextFunction, Request, Response } from "express";
import GenreService from "../services/Genre.service";
import SongService from "../services/Song.service";
import SongPlayService from "../services/SongPlay.service";

export const getAllPlaying = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plays = await SongPlayService.getRecentPlays(7);

    res
      .status(200)
      .json({ data: plays, message: "Get successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllCreateSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plays = await SongService.getRecentCreate(7);

    res
      .status(200)
      .json({ data: plays, message: "Get successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllGenre = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const genres = await GenreService.getGenreWithNumberSongs();
    
        res
        .status(200)
        .json({ data: genres, message: "Get successfully" });
    } catch (error) {
        next(error);
    }
    }

