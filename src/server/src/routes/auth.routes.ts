// src/routes/user.ts
import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  validate,
} from "../controllers/auth.controller";
import { authorize, validateData } from "../middleware";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schema/auth.schema";
const router = Router();

/**
 * @openapi
 * '/auth/login':
 *  post:
 *    tags:
 *    - Auth
 *    summary: login
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *             $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: Login
 *        content:
 *          application/json:
 *             schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      403:
 *        description: Forbidden
 */

router.post("/validate", authorize(), validate);

router.post("/register", validateData(registerSchema), register);

router.post("/login", validateData(loginSchema), login);

router.post("/refresh-token", validateData(refreshTokenSchema), refreshToken);

router.post("/logout", authorize(), validateData(logoutSchema), logout);

export default router;
