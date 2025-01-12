import { array, boolean, number, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from "./common.schema";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(SIZE.TITLE, "Title is too long"),
    description: string({})
      .max(SIZE.DESCRIPTION, "Description is too long")
      .nullable(),
    public: boolean().optional(),
    imagePath: string().optional().nullable(),
    duration: number().optional().nullable(),
    genreId: string().max(SIZE.UUID),
    moodIds: array(string().max(SIZE.UUID, "Id is too long"))
      .optional()
      .nullable(),
    songIds: array(string().max(SIZE.UUID, "Id is too long"))
      .optional()
      .nullable(),
  }),
};

const payloadUpdate = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(SIZE.TITLE, "Title is too long")
      .optional(),
    description: string({})
      .max(SIZE.DESCRIPTION, "Description is too long")
      .nullable()
      .optional(),
    public: boolean().optional(),
    imagePath: string().optional().nullable(),
    duration: number().optional().nullable(),
    genreId: string().max(SIZE.UUID).optional(),
    moodIds: array(string().max(SIZE.UUID, "Id is too long"))
      .optional()
      .nullable(),
    songIds: array(string().max(SIZE.UUID, "Id is too long"))
      .optional()
      .nullable(),
  }),
};

const bodySongId = {
  body: object({
    songIds: array(string({}).max(SIZE.UUID, "Id is too long")).optional(),
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

const querySchemaAllLike = {
  query: object({
    limit: string().default("10").optional(),
    page: string().default("1").optional(),
    keyword: string().optional(),
    my: string().optional(),
  }),
};

// ------------------SCHEMA-----------------------
export const getAllPlaylistSchema = object({ ...querySchema });
export const getPlaylistSchema = object({ ...params });
export const getPlaylistSlugSchema = object({ ...slug });
export const createPlaylistSchema = object({ ...payload });
export const updatePlaylistSchema = object({ ...payloadUpdate, ...params });

export const getAllPlaylistLikeSchema = object({ ...querySchemaAllLike });
export const likePlaylistSchema = object({ ...params });
export const unLikePlaylistSchema = object({ ...params });

export const checkSongToPlaylistSchema = object({
  ...params,
  body: object({
    songId: string({
      required_error: "Id role is required",
    }).nullable(),
  }),
}); // Thêm bài hát vào playlist
export const addSongToPlaylistSchema = object({ ...params, ...bodySongId }); // Thêm bài hát vào playlist
export const removeSongToPlaylistSchema = object({ ...params, ...bodySongId }); // Xóa bài hát vào playlist
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

export type CheckSongToPlaylistInput = TypeOf<typeof checkSongToPlaylistSchema>;
export type AddSongToPlaylistInput = TypeOf<typeof addSongToPlaylistSchema>;
export type RemoveSongToPlaylistInput = TypeOf<
  typeof removeSongToPlaylistSchema
>;
export type GetAllSongInput = TypeOf<typeof getAllSongSchema>;
