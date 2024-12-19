import { array, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";
import { querySchema } from "./common.schema";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }).max(SIZE.TITLE, "Name is too long"),
    destination: string({
      required_error: "Destination is required",
    }).max(SIZE.DESCRIPTION, "Destination is too long"),
    songId: array(string().max(SIZE.UUID, "Id is too long")).optional(),
  }),
};

const payloadUpdate = {
  body: object({
    title: string({
      required_error: "Title is required",
    })
      .max(SIZE.TITLE, "Name is too long")
      .optional(),
    destination: string({
      required_error: "Destination is required",
    })
      .max(SIZE.DESCRIPTION, "Destination is too long")
      .optional(),
    songId: array(string().max(SIZE.UUID, "Id is too long")).optional(),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id role is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

const payloadAddSong = {
  body: object({
    songId: array(string().max(SIZE.UUID, "Id is too long")).optional(),
  }),
};

const payloadAddMember = {
  body: object({
    userId: string().max(SIZE.UUID, "Id is too long"),
  }),
};

export const getAllRoomSchema = object({ ...querySchema });
export const getRoomSchema = object({ ...params });
export const createRoomSchema = object({ ...payload });
export const updateRoomSchema = object({ ...payloadUpdate, ...params });
export const deleteRoomSchema = object({ ...params });
//
export const addSongToRoomSchema = object({ ...params, ...payloadAddSong });
export const removeSongToRoomSchema = object({ ...params, ...payloadAddSong });
export const addMemberToRoomSchema = object({ ...params, ...payloadAddMember });
export const removeMemberToRoomSchema = object({
  ...params,
  ...payloadAddMember,
});

export type GetAllRoomInput = TypeOf<typeof getAllRoomSchema>;
export type GetRoomSchema = TypeOf<typeof getRoomSchema>;
export type CreateRoomInput = TypeOf<typeof createRoomSchema>;
export type UpdateRoomInput = TypeOf<typeof updateRoomSchema>;
export type DeleteRoomInput = TypeOf<typeof deleteRoomSchema>;
export type AddSongToRoomInput = TypeOf<typeof addSongToRoomSchema>;
export type RemoveSongToRoomInput = TypeOf<typeof removeSongToRoomSchema>;
export type AddMemberToRoomInput = TypeOf<typeof addMemberToRoomSchema>;
export type RemoveMemberToRoomInput = TypeOf<typeof removeMemberToRoomSchema>;
