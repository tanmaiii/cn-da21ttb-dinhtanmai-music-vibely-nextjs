import { date, object, string, TypeOf, number, ZodEnum } from "zod";
import { ROLES } from "../utils/contants";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string

 */

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
  }),
};

export const createUserSchema = object({ ...payload });
export const updateUserSchema = object({ ...params, ...payload });
export const getUserSchema = object({ ...params });
export const DeleteUserSchema = object({ ...params });
export const UpdateRoleUserSchema = object({
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
export type GetUserInput = TypeOf<typeof getUserSchema>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type CreateUserResponse = TypeOf<typeof createUserSchema>;
export type DeleteUserInput = TypeOf<typeof DeleteUserSchema>;
export type UpdateRoleUserInput = TypeOf<typeof UpdateRoleUserSchema>;
