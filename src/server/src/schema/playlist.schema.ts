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
const slug = {
  params: object({
    slug: string({
      required_error: "Slug is required",
    }).min(1),
  }),
};

// ------------------SCHEMA-----------------------
export const getAllPlaylistSchema = object({ ...querySchema });
export const getPlaylistSchema = object({ ...params });
export const getPlaylistSlugSchema = object({ ...slug });
export const createPlaylistSchema = object({ ...payload });
export const updatePlaylistSchema = object({ ...payload, ...params });

export const getAllPlaylistLikeSchema = object({ ...querySchema });
export const likePlaylistSchema = object({ ...params });
export const unLikePlaylistSchema = object({ ...params });

export const addSongToPlaylistSchema = object({ ...params, ...bodySongId }); // Thêm bài hát vào playlist
export const removeSongToPlaylistSchema = object({ ...params, ...bodySongId });// Xóa bài hát vào playlist
export const getAllSongSchema = object({ ...params });

//------------------TYPE-----------------------

export type GetAllPlaylistInput = TypeOf<typeof getAllPlaylistSchema>;
export type GetPlaylistInput = TypeOf<typeof getPlaylistSchema>;
export type GetPlaylistSlugInput = TypeOf<typeof getPlaylistSlugSchema>;
export type UpdatePlaylistInput = TypeOf<typeof updatePlaylistSchema>;
export type CreatePlaylistInput = TypeOf<typeof createPlaylistSchema>;

export type GetAllPlaylistLikeInput = TypeOf<typeof getAllPlaylistLikeSchema>;
export type likePlaylistInput = TypeOf<typeof likePlaylistSchema>;
export type unLikePlaylistInput = TypeOf<typeof unLikePlaylistSchema>;

export type AddSongToPlaylistInput = TypeOf<typeof addSongToPlaylistSchema>;
export type RemoveSongToPlaylistInput = TypeOf<typeof removeSongToPlaylistSchema>;
export type GetAllSongInput = TypeOf<typeof getAllSongSchema>;