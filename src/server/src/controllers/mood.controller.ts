import { NextFunction, Request, Response } from "express";
import MoodService from "../services/Mood.service";
import { StatusCodes } from "http-status-codes";
import {
  CreateMoodInput,
  DeleteMoodInput,
  UpdateMoodInput,
} from "../schema/mood.schema";

export const getAllHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const moods = await MoodService.getMoods();

    res
      .status(StatusCodes.OK)
      .json({ data: moods, message: "Get moods successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

export const createHandler = async (
  req: Request<{}, {}, CreateMoodInput["body"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mood = await MoodService.createMood(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ data: mood, message: "Create mood successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (
  req: Request<UpdateMoodInput["params"], {}, UpdateMoodInput["body"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mood = await MoodService.getMoodById(req.params.id);

    if (!mood) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Mood not found" });
      return;
    }

    await MoodService.updateMood(req.params.id, req.body);

    const newMood = await MoodService.getMoodById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: newMood, message: "Update mood successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteHandler = async (
  req: Request<DeleteMoodInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mood = await MoodService.getMoodById(req.params.id);

    if (!mood) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Mood not found" });
      return;
    }
    await MoodService.deleteMood(req.params.id);

    res.status(StatusCodes.OK).json({ message: "Delete mood successfully" });

    return;
  } catch (error) {
    next(error);
  }
};
