import { object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(SIZE.TITLE),
    description: string().max(SIZE.DESCRIPTION).optional(),
    color: string().optional(),
  }),
};

const payloadUpdate = {
  body: object({
    title: string().max(SIZE.TITLE).optional(),
    description: string().max(SIZE.DESCRIPTION).optional(),
    color: string().optional(),
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

export const getGenreSchema = object({ ...params });
export const createGenreSchema = object({ ...payload });
export const updateGenreSchema = object({ ...payloadUpdate, ...params });
export const deleteGenreSchema = object({ ...params });

export type GetGenreInput = TypeOf<typeof getGenreSchema>;
export type CreateGenreInput = TypeOf<typeof createGenreSchema>;
export type UpdateGenreInput = TypeOf<typeof updateGenreSchema>;
export type DeleteGenreInput = TypeOf<typeof deleteGenreSchema>;
