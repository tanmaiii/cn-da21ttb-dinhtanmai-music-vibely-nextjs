import { object, string, TypeOf } from "zod";
import { querySchema } from "./common.schema";
import { SIZE } from "../utils/contants";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(SIZE.TITLE),
    description: string().max(SIZE.DESCRIPTION).optional(),
  }),
};

const payloadUpdate = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(SIZE.TITLE)
      .optional(),
    description: string().max(SIZE.DESCRIPTION).optional(),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id is required",
    })
      .min(1)
      .max(SIZE.UUID, `Id must be less than ${SIZE.UUID} characters`),
  }),
};

export const getAllMoodSchema = object({ ...querySchema });
export const getMoodSchema = object({ ...params });
export const createMoodSchema = object({ ...payload });
export const updateMoodSchema = object({ ...payloadUpdate, ...params });
export const deleteMoodSchema = object({ ...params });

export type GetAllMoodInput = TypeOf<typeof getAllMoodSchema>;
export type GetMoodInput = TypeOf<typeof getMoodSchema>;
export type CreateMoodInput = TypeOf<typeof createMoodSchema>;
export type UpdateMoodInput = TypeOf<typeof updateMoodSchema>;
export type DeleteMoodInput = TypeOf<typeof deleteMoodSchema>;
