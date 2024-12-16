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

export const getAllArtistSchema = object({ ...querySchema });
export const getArtistSongSchema = object({ ...params, ...querySchema });
export const getArtistPlaylistSchema = object({ ...params, ...querySchema });
export const followArtistSchema = object({ ...params });

export type GetAllArtistInput = TypeOf<typeof getAllArtistSchema>;
export type GetArtistSongInput = TypeOf<typeof getArtistSongSchema>;
export type GetArtistPlaylistInput = TypeOf<typeof getArtistPlaylistSchema>;
export type followArtistInput = TypeOf<typeof followArtistSchema>;
