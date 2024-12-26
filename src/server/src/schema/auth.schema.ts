import { number, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    LoginResponse:
 *      type: object
 *      properties:
 *        email:
 *         type: string
 *        password:
 *          type: string
 */

export const loginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password too short"),
  }),
});

export const registerSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(5, "Password too short"),
    password_confirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  }),
});

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const logoutSchema = object({
  body: object({
    refreshToken: string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const changePasswordSchema = object({
  body: object({
    password: string(),
    new_password: string({
      required_error: "New password is required",
    }).min(5, "Password too short"),
    password_confirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.new_password === data.password_confirmation, {
    message: "Passwords do not match",
  }),
});

export type LoginInput = TypeOf<typeof loginSchema>;
export type RegisterInput = TypeOf<typeof registerSchema>;
export type RefreshTokenInput = TypeOf<typeof refreshTokenSchema>;
export type logoutInput = TypeOf<typeof logoutSchema>;
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>;
