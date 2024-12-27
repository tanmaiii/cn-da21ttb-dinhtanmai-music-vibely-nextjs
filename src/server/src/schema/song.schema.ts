import { array, boolean, number, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from './common.schema';

/**
 * @openapi
 * components:
 *   schema:
 *     Song:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *           default: "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *         description:
 *           type: string
 *           default: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *         price:
 *           type: number
 *           default: 879.99
 *         image:
 *           type: string
 *           default: "https://i.imgur.com/QlRphfQ.jpg"
 *
 */

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
    moodId: array(string()).optional(),
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
    moodId: array(string()).optional(),
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

export const getAllLikeSongSchema = object({...querySchema})
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

export type GetAllLikeSongInput = TypeOf<typeof getAllLikeSongSchema>;
export type LikeSongInput = TypeOf<typeof likeSongSchema>;
export type UnLikeSongInput = TypeOf<typeof unLikeSongSchema>;
export type PlaySongInput = TypeOf<typeof playSongSchema>;
