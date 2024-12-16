"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshTokenSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
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
exports.loginSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(5, "Password too short"),
    }),
});
exports.registerSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(5, "Password too short"),
        password_confirmation: (0, zod_1.string)({
            required_error: "Password confirmation is required",
        }),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    }),
});
exports.refreshTokenSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        refreshToken: (0, zod_1.string)({
            required_error: "Refresh token is required",
        }),
    }),
});
exports.logoutSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        refreshToken: (0, zod_1.string)({
            required_error: "Refresh token is required",
        }),
    }),
});
//# sourceMappingURL=auth.schema.js.map