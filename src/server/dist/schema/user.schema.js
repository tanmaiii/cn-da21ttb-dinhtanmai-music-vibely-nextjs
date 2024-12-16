"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
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
const paramsSchema = {
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id is required",
        }).length(36, "Id must be 36 characters"),
    }),
};
const payload = {
    body: (0, zod_1.object)({
        name: (0, zod_1.string)().nullable().optional(),
        email: (0, zod_1.string)().email("Not a valid email").nullable().optional(),
        // role: ZodEnum.create([...Object.values(ROLES)] as [string, ...string[]]).nullable().optional(),
        password: (0, zod_1.string)().min(6, "Password too short").nullable().optional(),
        imagePath: (0, zod_1.string)().nullable().optional(),
    }),
};
exports.createUserSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updateUserSchema = (0, zod_1.object)(Object.assign(Object.assign({}, paramsSchema), payload));
exports.getUserSchema = (0, zod_1.object)(Object.assign({}, paramsSchema));
//# sourceMappingURL=user.schema.js.map