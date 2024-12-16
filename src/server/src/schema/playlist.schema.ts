import { array, boolean, number, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from "./common.schema";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(SIZE.TITLE, "Title is too long")
      .optional(),
    description: string({})
      .max(SIZE.DESCRIPTION, "Description is too long")
      .optional(),
    public: boolean().optional(),
    duration: number().optional(),
    genreId: string().max(SIZE.UUID).optional(),
    moodId: array(string()).optional(),
  }),
};

const bodySongId = {
  body: object({
    songId: string({
      required_error: "SongId is required",
    }).max(SIZE.UUID, "SongId is too long"),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id playlist is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

export const getAllPlaylistSchema = object({ ...querySchema });
export const getPlaylistSchema = object({ ...params });
export const createPlaylistSchema = object({ ...payload });
export const updatePlaylistSchema = object({ ...payload, ...params });
export const addSongToPlaylistSchema = object({ ...params, ...bodySongId });
export const getSongInPlaylistSchema = object({ ...params });
export const likePlaylistSchema = object({ ...params });
export const unLikePlaylistSchema = object({ ...params });

export type GetAllPlaylistInput = TypeOf<typeof getAllPlaylistSchema>;
export type GetPlaylistInput = TypeOf<typeof getPlaylistSchema>;
export type UpdatePlaylistInput = TypeOf<typeof updatePlaylistSchema>;
export type CreatePlaylistInput = TypeOf<typeof createPlaylistSchema>;
export type addSongToPlaylistInput = TypeOf<typeof addSongToPlaylistSchema>;
export type getSongInPlaylistInput = TypeOf<typeof getSongInPlaylistSchema>;
export type likePlaylistInput = TypeOf<typeof likePlaylistSchema>;
export type unLikePlaylistInput = TypeOf<typeof unLikePlaylistSchema>;
