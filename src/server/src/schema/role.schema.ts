import { array, object, string, TypeOf } from "zod";
import { SIZE } from "../utils/contants";

const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    })
      .max(SIZE.NAME, "Name is too long")
      .optional(),
    permissions: array(string()).optional(),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Id role is required",
    }).max(SIZE.UUID, "Id is too long"),
  }),
};

export const getAllRoleSchema = object({});
export const getRoleSchema = object({ ...params });
export const createRoleSchema = object({ ...payload });
export const updateRoleSchema = object({ ...payload, ...params });
export const deleteRoleSchema = object({ ...params });

export type GetAllRoleInput = {};
export type GetRoleInput = TypeOf<typeof getRoleSchema>;
export type CreateRoleInput = TypeOf<typeof createRoleSchema>;
export type UpdateRoleInput = TypeOf<typeof updateRoleSchema>;
export type DeleteRoleInput = TypeOf<typeof deleteRoleSchema>;
