import { object, string, TypeOf } from "zod";
import { querySchema } from "./common.schema";
import { SIZE } from "../utils/contants";

const params = {
  params: object({
    id: string({
      required_error: "Id is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

const slug = {
  params: object({
    slug: string({
      required_error: "Slug is required",
    }).min(0, "Slug is too short"),
  }),
}

export const getAllArtistSchema = object({ ...querySchema });
export const getArtistBySlugSchema = object({ ...slug });
export const getArtistSongSchema = object({ ...params, ...querySchema });
export const getArtistPlaylistSchema = object({ ...params, ...querySchema });
export const followArtistSchema = object({ ...params });
export const getArtistFollowSchema = object({ ...querySchema });

export type GetAllArtistInput = TypeOf<typeof getAllArtistSchema>;
export type GetArtistBySlugInput = TypeOf<typeof getArtistBySlugSchema>;
export type GetArtistSongInput = TypeOf<typeof getArtistSongSchema>;
export type GetArtistPlaylistInput = TypeOf<typeof getArtistPlaylistSchema>;
export type followArtistInput = TypeOf<typeof followArtistSchema>;
export type getArtistFollowInput = TypeOf<typeof getArtistFollowSchema>;
