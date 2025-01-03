import { object, string, TypeOf } from "zod";
import { querySchema } from "./common.schema";

const params = {
  params: object({
    id: string({
      required_error: "Id is required",
    }).length(36, "Id must be 36 characters"),
  }),
};

const payload = {
  body: object({
    name: string().nullable().optional(),
    email: string().email("Not a valid email").nullable().optional(),
    password: string().min(6, "Password too short").nullable().optional(),
    imagePath: string().nullable().optional(),
    role: string().nullable().optional(),
  }),
};

export const getAllUserSchema = object({ ...querySchema });
export const getUserSchema = object({ ...params });
export const createUserSchema = object({ ...payload });
export const updateUserSchema = object({ ...params, ...payload });
export const deleteUserSchema = object({ ...params });
export const updateRoleUserSchema = object({
  ...params,
  body: object({
    roleId: string({
      required_error: "Id role is required",
    }).nullable(),
  }),
});

// Bỏ qua trường password_confirmation khi trả về
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.password_confirmation"
>;
export type GetAllUserInput = TypeOf<typeof getAllUserSchema>;
export type GetUserInput = TypeOf<typeof getUserSchema>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type UpdateRoleUserInput = TypeOf<typeof updateRoleUserSchema>;
