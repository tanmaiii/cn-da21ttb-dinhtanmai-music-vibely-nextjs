import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateGenreInput, UpdateGenreInput } from "../schema/genre.schema";
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
}