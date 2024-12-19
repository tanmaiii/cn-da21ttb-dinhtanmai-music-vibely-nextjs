import { object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";

const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }).max(SIZE.NAME),
    description: string().max(SIZE.DESCRIPTION).optional(),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id playlist is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

export const createPermissionsSchema = object({ ...payload });
export const updatePermissionsSchema = object({ ...payload, ...params });
export const deletePermissionsSchema = object({ ...params });

export type CreatePermissionsInput = TypeOf<typeof createPermissionsSchema>;
export type UpdatePermissionsInput = TypeOf<typeof updatePermissionsSchema>;
export type DeletePermissionsInput = TypeOf<typeof deletePermissionsSchema>;