import { array, boolean, number, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from './common.schema';


const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(SIZE.TITLE, "Title is too long"),
    description: string({})
      .max(SIZE.DESCRIPTION, "Description is too long")
      .optional(),
    public: boolean().optional(),
    duration: number().optional(),
    genreId: string().max(SIZE.UUID).optional(),
    moodIds: array(string()).optional(),
    imagePath: string().optional().nullable(),
    songPath: string().optional().nullable(),
    lyricsPath: string().optional().nullable(),
  }),
};

const payloadUpdate = {
  body: object({
    title: string().max(SIZE.TITLE, "Title is too long").optional(),
    description: string()
      .max(SIZE.DESCRIPTION, "Description is too long")
      .optional(),
    public: boolean().optional(),
    duration: number().optional(),
    genreId: string().max(SIZE.UUID).optional(),
    moodIds: array(string()).optional(),
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

const slug = {
  params: object({
    slug: string({
      required_error: "Slug is required",
    }).min(1),
  }),
};

export const getAllSongSchema = object({ ...querySchema });
export const getSongSchema = object({ ...params });
export const getSongSlugSchema = object({ ...slug });
export const getLyricsSongSchema = object({ ...params });
export const createSongSchema = object({ ...payload });
export const updateSongSchema = object({ ...params, ...payloadUpdate });

export const deleteSongSchema = object({ ...params });
export const destroySongSchema = object({ ...params });

export const likeSongSchema = object({ ...params });
export const unLikeSongSchema = object({ ...params });
export const playSongSchema = object({ ...params });

//----------------------------------------------------------//

export type GetAllSongInput = TypeOf<typeof getAllSongSchema>;
export type GetSongInput = TypeOf<typeof getSongSchema>;
export type GetSongSlugInput = TypeOf<typeof getSongSlugSchema>;
export type GetLyricsSongInput = TypeOf<typeof getLyricsSongSchema>;
export type CreateSongInput = TypeOf<typeof createSongSchema>;
export type UpdateSongInput = TypeOf<typeof updateSongSchema>;
export type DeleteSongInput = TypeOf<typeof deleteSongSchema>;
export type DestroySongInput = TypeOf<typeof destroySongSchema>;

export type LikeSongInput = TypeOf<typeof likeSongSchema>;
export type UnLikeSongInput = TypeOf<typeof unLikeSongSchema>;
export type PlaySongInput = TypeOf<typeof playSongSchema>;
