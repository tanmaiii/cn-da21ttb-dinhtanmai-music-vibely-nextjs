import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateGenreInput,
  GetGenreInput,
  UpdateGenreInput,
} from "../schema/genre.schema";
import GenreService from "../services/Genre.service";
import ApiError from "../utils/ApiError";
import { getFilePath } from "../utils/commonUtils";

export const getGenresHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const genres = await GenreService.getAll();
    const { page, limit, keyword } = req.query;
    const genres = await GenreService.getGenresWithPagination(
      Number(page),
      Number(limit),
      keyword as string
    );

    res
      .status(StatusCodes.OK)
      .json({ data: genres, message: "Get genres successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const getGenreHandler = async (
  req: Request<GetGenreInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const genre = await GenreService.getById(req.params.id);

    if (!genre) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ data: genre, message: "Get genre successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const createGenreHandler = async (
  req: Request<{}, {}, CreateGenreInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const data = {
      ...req.body,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    const genre = await GenreService.create(data);

    res
      .status(StatusCodes.CREATED)
      .json({ data: genre, message: "Create genre successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateGenreHandler = async (
  req: Request<UpdateGenreInput["params"], {}, UpdateGenreInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const genre = await GenreService.getById(req.params.id);

    if (!genre) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const data = {
      ...req.body,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    await GenreService.update(req.params.id, data);

    const newGenre = await GenreService.getById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: newGenre, message: "Update genre successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteGenreHandler = async (
  req: Request<UpdateGenreInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const genre = await GenreService.getById(req.params.id);

    if (!genre) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");
    }

    await GenreService.delete(req.params.id);

    res.status(StatusCodes.OK).json({ message: "Delete genre successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// export const getAllSongGenresHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { limit = 10, page = 1, keyword, sort } = req.query;

//     const userInfo = get(req, "identity") as IIdentity;

//     const whereClause = req.query.genreId ? { genreId: req.query.genreId } : {};
//     const songs = await SongService.getSongsWithPagination({
//       page: parseInt(page as string, 10),
//       limit: parseInt(limit as string, 10),
//       sort: sort as SortOptions,
//       userId: userInfo.id || undefined,
//       keyword: keyword as string,
//       where: whereClause,
//     });

//     res.json({ data: songs, message: "Get songs successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
